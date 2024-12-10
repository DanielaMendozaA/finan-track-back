import { Budget } from "src/budgets/entities/budget.entity";
import { AuditableEntity } from "src/common/entities/auditable.entity";
import { Token } from "src/tokens/entities/token.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User extends AuditableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', { name: 'user_name' })
    name: string;

    @Column('text', { unique: true })
    email: string;

    @Column('text', { select: false })
    password: string;

    @Column('bool', {
        default: false,
    })
    isVerified: boolean;

    @OneToMany(() => Token, token => token.user)
    tokens: Token[];

    @OneToMany(() => Budget, budget => budget.user)
    budgets: Budget[];

}
