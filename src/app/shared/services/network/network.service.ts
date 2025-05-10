import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, map, merge } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  private onlineSubject = new BehaviorSubject<boolean>(navigator.onLine);
  isOnline$ = this.onlineSubject.asObservable();

  constructor() {
    const online$ = fromEvent(window, 'online').pipe(map(() => true));
    const offline$ = fromEvent(window, 'offline').pipe(map(() => false));

    merge(online$, offline$).subscribe(this.onlineSubject);
  }
}