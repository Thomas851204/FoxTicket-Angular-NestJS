import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl,
} from '@angular/forms';
import { TicketService } from '../../services/ticket.service';
import { AvailableMovie } from 'src/app/shared/models/availableMovie.interface';
import { Movie } from 'src/app/shared/models/movie.interface';

@Component({
  selector: 'app-bookingPage',
  templateUrl: './bookingPage.component.html',
  styleUrls: ['./bookingPage.component.scss'],
})
export class BookingPageComponent implements OnInit {
  title: string;
  movie: AvailableMovie;
  dates: Date[];
  bookingForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    let movieId: number = 0;
    this.route.queryParams.subscribe({
      next: (params) => {
        movieId = +params['id'];
        if (movieId) {
          this.getAvailableTickets(movieId);
        } else {
          this.title = 'Movie not found';
        }
      },
    });
  }

  private getAvailableTickets(movieId: number): void {
    this.ticketService.getAvailableTickets(movieId).subscribe({
      next: (response: AvailableMovie) => {
        this.bookingForm = this.formBuilder.group({
          numberOfTickets: new FormControl('', [
            Validators.required,
            Validators.min(1),
            Validators.max(response.numOfTickets),
          ]),
          selectedDate: new FormControl('', [Validators.required]),
          price: new FormControl({ value: '', disabled: true }),
        });
        this.movie = response;
        this.dates = JSON.parse(this.movie.screeningTimes).map(
          (dateString: Date) => new Date(dateString).toLocaleDateString('hu')
        );
        this.ticketService.getMovieById(movieId).subscribe({
          next: (response: Movie) => {
            this.title = response.title;
            this.movie.poster =
              'https://image.tmdb.org/t/p/w500/' + response.poster_path;
          },
        });
      },
      error: (err: any) => {
        this.title = 'Movie not found';
      },
    });
  }

  onNumberOfTicketsChange(): void {
    this.bookingForm
      .get('price')
      ?.setValue(
        this.bookingForm.get('numberOfTickets')?.value * this.movie.price
      );
  }

  onSubmit(): void {
    this.bookingForm.reset();
  }
}
