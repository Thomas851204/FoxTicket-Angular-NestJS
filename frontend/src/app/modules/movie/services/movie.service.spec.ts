import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { MovieService } from './movie.service';
import { movieAPI } from 'src/app/shared/models/environment';

describe('MovieService', () => {
  let service: MovieService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MovieService]
    });

    service = TestBed.inject(MovieService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch movie details', () => {
    const mockMovie = {
      poster_path: 'https://x.com',
      original_title: 'Politics',
      backdrop_path: '/guns',
      release_date: 'tomorrow',
      genres: [
        {
            "id": 1,
            "name": "Sarcasm"
        },
        {
            "id": 2,
            "name": "Comedy"
        }
      ],
      overview: 'Shoot youself in a foot and blame somebody else',
      production_companies: [
        {
            "id": 1,
            "logo_path": "/europe",
            "name": "i-will-scream-at-anyone",
            "origin_country": "US"
        },
        {
            "id": 2,
            "logo_path": "/united-kingdom-of-states",
            "name": "ligma",
            "origin_country": "US"
        }
      ]
    };

    service.getMovie(1).subscribe(movie => {
      expect(movie.title).toBe('Politics');
      expect(movie.poster_path).toBe('https://x.com');
      //...
      expect(movie.genres).toBe(["Sarcasm", "Comedy"]);
      //...
      expect(movie.production).toBe([
        ["/europe", "i-will-scream-at-anyone"],
        ["/united-kingdom-of-states", "ligma"]
      ])
      
    });

    const req = httpMock.expectOne(req => req.url.startsWith(`${movieAPI.moviePath}69`));
    expect(req.request.method).toBe('GET');
    req.flush(mockMovie);
  });

  it('should fetch movie cast', () => {
    const mockCast = [
      { name: 'Mark Zuckerberg', character: 'Facebook', profile_path: '/we-dont-sell-urdata(maybe)' },
      { name: 'Ilon Musk', character: 'Tesla', profile_path: '/smoking-crack-liveshow' }
    ];

    service.getCast(1).subscribe(cast => {
      expect(cast.length).toBe(2);
      expect(cast[0].name).toBe('Joe Biden');
      expect(cast[1].name).toBe('Ilon Musk');
    });

    const req = httpMock.expectOne(req => req.url.startsWith(`${movieAPI.moviePath}69`));
    expect(req.request.method).toBe('GET');
    req.flush({ cast: mockCast });
  });
});
