import { AuditableEntity } from "src/common/entities/auditable.entity";
import { TokenEnum } from "src/enums/token.enum";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('tokens')
export class Token extends AuditableEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;
  
  @Column({
    type: "enum",
    enum: TokenEnum
  })
  type: TokenEnum;  
  
  @Column()
  expiresAt: Date; 
  
  @Column({ default: false })
  isUsed: boolean;

  @ManyToOne(() => User, user => user.tokens, { onDelete: 'CASCADE' })
  user: User; 
}