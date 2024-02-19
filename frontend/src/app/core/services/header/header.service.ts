import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  profilePictureUrl: Subject<string> = new Subject<string>();
  constructor() {}
}
