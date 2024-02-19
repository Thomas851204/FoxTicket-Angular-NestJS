import { Component, OnInit } from '@angular/core';
import { CarouselService } from '../services/carousel.service';
import { Movie } from 'src/app/shared/models/movie.interface';
import { movieAPI } from 'src/app/shared/models/environment';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnInit {
  nowPlaying: Movie[] = [];
  upcomingMovies: Movie[] = [];
  baseImagePath: string = movieAPI.baseImagePath;

  constructor(private carouselService: CarouselService) {}

  ngOnInit(): void {
    this.carouselService.getNowPlaying().subscribe((movies) => {
      this.nowPlaying = movies;
    });

    this.carouselService.getUpcomingMovies().subscribe((movies) => {
      this.upcomingMovies = movies;
    });
  }
}
