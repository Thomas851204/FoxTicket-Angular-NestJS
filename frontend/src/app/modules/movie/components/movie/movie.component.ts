import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { Actor, MovieDetails } from 'src/app/shared/models/movie.interface';
import { Router } from '@angular/router';
import { movieAPI } from 'src/app/shared/models/environment';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss'],
})
export class MovieComponent {
  movieId!: number;
  movie!: MovieDetails | undefined;
  baseImagePath: string = movieAPI.baseImagePath;
  imageCast: Actor[] = [];
  plainCast: Actor[] = [];
  imageProductions: string[][] = [];

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.movieId = params['id'];
      if (!this.movieId) {
        this.router.navigate(['/notFound']);
        return;
      }

      this.movieService.getMovie(this.movieId).subscribe(
        (movie) => {
          this.movie = movie;

          this.imageProductions = this.movie?.production.filter(
            (prod) => prod[0]
          );

          if (!this.movie) {
            this.router.navigate(['/notFound']);
          }
        },
        (error) => {
          this.router.navigate(['/notFound']);
        }
      );

      this.movieService.getCast(this.movieId).subscribe((cast) => {
        this.imageCast = cast.filter((actor) => actor.profile_path);
        this.plainCast = cast.filter((actor) => !actor.profile_path);
      });
    });
  }

  formatRuntime(runtime: number | undefined): string {
    if (!runtime) {
      return '00:00:00';
    }

    const hours = String(Math.floor(runtime / 60)).padStart(2, '0');
    const minutes = String(Math.floor(runtime % 60)).padStart(2, '0');
    const seconds = String(Math.floor((runtime % 1) * 60)).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  }
}
