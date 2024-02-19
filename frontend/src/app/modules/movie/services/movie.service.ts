import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { movieAPI } from 'src/app/shared/models/environment';
import { Actor, MovieDetails } from 'src/app/shared/models/movie.interface';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  params = {
    language: 'en-US',
    api_key: movieAPI.apiKey,
  };
  path: string = movieAPI.moviePath;

  constructor(private http: HttpClient) {}

  getMovie(movieId: number): Observable<MovieDetails> {
    return this.http.get(`${this.path + movieId}`, { params: this.params }).pipe(
      map((response: any) => {
        return {
          poster_path: response.poster_path,
          title: response.original_title,
          backdrop_path: response.backdrop_path,
          release_date: response.release_date,
          genres: response.genres.map((genre: { name: string }) => genre.name),
          overview: response.overview,
          production: response.production_companies.map(
            (prod: { logo_path: string, name: string }) => 
            [prod.logo_path, prod.name]),
          runtime: response.runtime
        };
      })
    );
  }

  getCast(movieId: number): Observable<Actor[]> {
    return this.http.get(`${this.path + movieId}/credits`, { params: this.params }).pipe(
      map((response: any) => {
        return response.cast
          .filter((actor: Actor) => actor.character)
          .map((actor: Actor) => ({
            name: actor.name,
            profile_path: actor.profile_path,
            character: actor.character
          }));
      })
    );
  }
}
