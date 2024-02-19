import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { LoadingService } from '../services/loading/loading.service';

@Injectable()
export class HttpProgressInterceptor implements HttpInterceptor {
  public counter: number = 0;
  constructor(public spinerService: LoadingService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.counter++;

    setTimeout(() => {
      this.spinerService.isLoading.next(true);
    }, 0);

    return next.handle(request).pipe(
      finalize(() => {
        if (this.counter > 0) this.counter--;
        if (this.counter === 0) {
          this.spinerService.isLoading.next(false);
        }
      })
    );
  }
}
