import { Column, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from "typeorm";

export abstract class AuditableEntity {
    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamptz',
        default: () => `CURRENT_TIMESTAMP AT TIME ZONE 'GMT-5'`,
        select: false,
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamptz',
        default: () => `CURRENT_TIMESTAMP AT TIME ZONE 'GMT-5'`,
        onUpdate: `CURRENT_TIMESTAMP AT TIME ZONE 'GMT-5'`,
        select: false,
    })
    updatedAt: Date;

    
    @DeleteDateColumn({
        name: 'deleted_at',
        type: 'timestamptz',
        select: false,
    })
    deletedAt: Date;

    @Column({name: 'created_by', nullable: true, select: false})
    createdBy: string;

    @Column({name: 'updated_by', nullable: true, select: false})
    updatedBy: string;

    @Column({name: 'deleted_by', nullable: true, select: false})
    deletedBy: string;
}