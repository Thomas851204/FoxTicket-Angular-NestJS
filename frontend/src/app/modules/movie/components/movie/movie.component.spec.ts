/// <reference types="jest" />
import { MovieComponent } from './movie.component';
import { MovieService } from '../../services/movie.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { of, throwError } from 'rxjs';

describe('MovieComponent', () => {
  let component: MovieComponent;
  let mockActivatedRoute: { queryParams: any },
    mockMovieService: { getMovie: any; getCast?: jest.Mock<any, any, any> },
    mockRouter: { navigate: any };

  beforeEach(async () => {
    mockActivatedRoute = {
      queryParams: of({ id: 69 }),
    };
    mockMovieService = {
      getMovie: jest.fn(),
      getCast: jest.fn(),
    };
    mockRouter = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [MovieComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: MovieService, useValue: mockMovieService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    component = TestBed.createComponent(MovieComponent).componentInstance;
    /*https://www.devcurry.com/2020/09/testing-angular-component-using-jest.html*/
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set movieId from query params', () => {
    component.ngOnInit();
    expect(component.movieId).toBe(69);
  });

  it('should call getMovie with movieId', () => {
    mockMovieService.getMovie.mockReturnValue(of({}));
    component.ngOnInit();
    expect(mockMovieService.getMovie).toHaveBeenCalledWith(69);
  });

  it('should navigate to notFound if movieId is not present', () => {
    mockActivatedRoute.queryParams = of({});
    component.ngOnInit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/notFound']);
  });

  it('should navigate to notFound on getMovie error', () => {
    mockMovieService.getMovie.mockReturnValue(throwError('error'));
    component.ngOnInit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/notFound']);
  });

  it('should format runtime correctly', () => {
    const formatted = component.formatRuntime(125);
    expect(formatted).toBe('02:05:00');
  });
});
