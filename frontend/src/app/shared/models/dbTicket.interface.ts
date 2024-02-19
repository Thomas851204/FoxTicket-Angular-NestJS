export interface dbTicket {
  select: boolean;
  movieID: number;
  title: string;
  price: number;
  numOfTickets: number;
  screeningTimes: string[];
}
