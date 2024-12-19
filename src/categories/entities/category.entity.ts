import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Budget } from "src/budgets/entities/budget.entity";
import { AuditableEntity } from "src/common/entities/auditable.entity";
import { Transaction } from "src/transactions/entities/transaction.entity";
import { CategoryType } from "src/enums/category-type.enum";


@Entity('categories')
export class Category extends AuditableEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('decimal')
    baseAmount: number;

    @Column('decimal')
    currentAmount: number;

    @Column({
        type: "enum",
        enum: CategoryType
    })
    type: CategoryType


    @ManyToOne(() => Budget, budget => budget.categories, { onDelete: 'CASCADE' })
    budget: Budget;

    @OneToMany(() => Transaction, transaction => transaction.category, { cascade: true })
    transactions: Transaction[]

}
