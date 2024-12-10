import { Category } from "src/categories/entities/category.entity";
import { AuditableEntity } from "src/common/entities/auditable.entity";
import { BudgetTypeEnum } from "src/enums/budget-type.enum";
import { FrequencyEnum } from "src/enums/frequency.enum";
import { Transaction } from "src/transactions/entities/transaction.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('budgets')
export class Budget extends AuditableEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column('decimal')
    baseAmount: number;

    @Column('decimal')
    currentAmount: number;

    @Column({
        type: "enum",
        enum: BudgetTypeEnum
    })
    type: BudgetTypeEnum

    @Column({
        type: "enum",
        enum: FrequencyEnum,
        nullable: true
    })
    frequency: FrequencyEnum

    @Column({
        nullable: true
    })
    startDate: Date

    @Column({
        nullable: true
    })
    endDate: Date

    @ManyToOne(() => User, user => user.budgets)
    user: User;
    
    @OneToMany(() => Category, category => category.budget, {cascade: true})
    categories: Category[];

    @OneToMany(() => Transaction, transaction => transaction.budget)
    transactions: Transaction[]


}
