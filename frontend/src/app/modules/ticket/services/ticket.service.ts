import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { movieAPI } from '../../../shared/models/environment';
import { environment } from 'src/environments/environment';
import { FormGroup } from '@angular/forms';
import { AvailableMovie } from 'src/app/shared/models/availableMovie.interface';
import { Movie } from 'src/app/shared/models/movie.interface';
import { updatedDbTicket } from 'src/app/shared/models/updatedDbTicket.interface';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  constructor(private http: HttpClient) {}

  getMovieList(): Observable<any> {
    return this.http.get<any>(movieAPI.nowPlaying + movieAPI.apiKey);
  }

  submitNewTickets(movieForms: FormGroup[]): Observable<any> {
    return this.http.post(
      environment.baseUrl + '/ticket',
      movieForms.map((element) => element.getRawValue())
    );
  }

  getAvailableTickets(id: number): Observable<AvailableMovie> {
    const headers = new HttpHeaders().set('movieId', id.toString());
    return this.http.get<AvailableMovie>(
      environment.baseUrl + '/ticket/getTicketByMovieId',
      { headers }
    );
  }

  getMovieById(id: number): Observable<Movie> {
    return this.http.get<Movie>(
      movieAPI.searchById + id + '?api_key=' + movieAPI.apiKey
    );
  }

  getTickets(): Observable<any> {
    return this.http.get<any>(environment.baseUrl + '/ticket/admin');
  }

  updateTicketById(ticket: updatedDbTicket): Observable<any> {
    return this.http.put(
      environment.baseUrl + `/ticket/${ticket.movieId}`,
      ticket
    );
  }

  deleteTicketById(movieId: number): Observable<any> {
    return this.http.delete(environment.baseUrl + `/ticket/${movieId}`);
  }
}
