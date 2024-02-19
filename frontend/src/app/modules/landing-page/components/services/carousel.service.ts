import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Movie } from 'src/app/shared/models/movie.interface';
import { movieAPI } from 'src/app/shared/models/environment';
import { LoginResponse } from 'src/app/shared/models/loginResponse.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CarouselService {
  params = {
    language: 'en-US',
    api_key: movieAPI.apiKey,
  };
  path: string = movieAPI.moviePath;

  constructor(private http: HttpClient) {}

  getNowPlaying(): Observable<Movie[]> {
    return this.http
      .get(`${this.path}now_playing`, { params: this.params })
      .pipe(map(this.parseMovies));
  }

  getUpcomingMovies(): Observable<Movie[]> {
    return this.http
      .get(`${this.path}upcoming`, { params: this.params })
      .pipe(map(this.parseMovies));
  }

  private parseMovies(response: any): Movie[] {
    const results = response.results;
    const nonAdultMovies = results.filter(
      (movie: { adult: boolean }) => !movie.adult
    );
    const moviePack = nonAdultMovies.slice(0, 25).map((movie: Movie) => ({
      id: movie.id,
      poster_path: movie.poster_path,
      title: movie.title,
      vote_average: movie.vote_average,
    }));
    return moviePack;
  }
  sendConfirmation(confirmCode: string): Observable<boolean | LoginResponse> {
    return this.http.get<boolean | LoginResponse>(
      environment.baseUrl + `/user/confirmation/${confirmCode}`
    );
  }
}
