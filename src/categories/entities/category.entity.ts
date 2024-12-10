import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Budget } from "src/budgets/entities/budget.entity";
import { AuditableEntity } from "src/common/entities/auditable.entity";
import { Transaction } from "src/transactions/entities/transaction.entity";


@Entity('categories')
export class Category extends AuditableEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    icon: string;

    @Column()
    baseAmount: number;

    @Column()
    currentAmount: number;

    @ManyToOne(() => Budget, budget => budget.categories, {onDelete: 'CASCADE'})
    budget: Budget;

    @OneToMany(() => Transaction, transaction => transaction.category)
    transactions: Transaction[]

}
