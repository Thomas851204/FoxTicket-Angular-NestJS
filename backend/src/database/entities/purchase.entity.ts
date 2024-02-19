import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  ticketId: number;

  @Column()
  numOfTickets: number;
}
