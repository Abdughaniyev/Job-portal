import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

export class BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
        nullable: false,
    })
    createdAt: Date;


    @UpdateDateColumn({
        name: 'last_updated_at',
        type: 'timestamp',
        nullable: false,
    })
    lastUpdatedAt: Date;

}