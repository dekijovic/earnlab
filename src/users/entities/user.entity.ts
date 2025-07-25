import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CreditTransaction } from '../../credits/entities/credit-transaction.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'int', default: 0 })
  credits: number;

  // One user can be sender in many transactions
  @OneToMany(() => CreditTransaction, (tx) => tx.fromUser)
  sentTransactions: CreditTransaction[];

  // One user can be recipient in many transactions
  @OneToMany(() => CreditTransaction, (tx) => tx.toUser)
  receivedTransactions: CreditTransaction[];
}
