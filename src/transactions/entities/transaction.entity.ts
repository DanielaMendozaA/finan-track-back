import { Budget } from "src/budgets/entities/budget.entity";
import { Category } from "src/categories/entities/category.entity";
import { AuditableEntity } from "src/common/entities/auditable.entity";
import { TransactionTypeEnum } from "src/enums/transaction-type.enum";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('transactions')
export class Transaction extends AuditableEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @Column()
    date: Date;

    @Column({
        type: "enum",
        enum: TransactionTypeEnum,
    })
    type: TransactionTypeEnum

    @Column()
    amount: number

    @ManyToOne(() => Category, { nullable: true,  onDelete: 'CASCADE' }, )
    category: Category;

    @ManyToOne(() => Budget, { nullable: true,  onDelete: 'CASCADE'  })
    budget: Budget;


}
