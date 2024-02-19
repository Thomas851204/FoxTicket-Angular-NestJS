import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { Role } from './role.entity';

@Entity()
export class Confirmation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Unique(['email'])
  @Column()
  email: string;

  @ManyToOne(() => Role)
  role = 1;

  @Column()
  confirmationCode: string;
}
