import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export type CreditTransactionType = 'deposit' | 'transfer';

@Entity('credit_transactions')
export class CreditTransaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'enum', enum: ['deposit', 'transfer'] })
    type: CreditTransactionType;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column({ nullable: true })
    fromUserId: string | null;

    @Column()
    toUserId: string;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'fromUserId' })
    fromUser?: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'toUserId' })
    toUser: User;

    @CreateDateColumn()
    createdAt: Date;
}
