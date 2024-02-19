import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  movieId: number;

  @Column()
  title: string;

  @Column()
  price: number;

  @Column()
  numOfTickets: number;

  @Column()
  screeningTimes: string;
}
