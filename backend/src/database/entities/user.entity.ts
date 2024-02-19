import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { Role } from './role.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Unique(['email'])
  @Column()
  email: string;

  @Column()
  role: number = 1;

  @Column({ default: '' })
  profilePicture: string;
}
