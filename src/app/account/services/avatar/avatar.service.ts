import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, finalize, Observable } from 'rxjs';
import { LoadingService } from '../../../shared/services/loading/loading.service';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  private avatarSubject = new BehaviorSubject<string>('');
  avatar$ = this.avatarSubject.asObservable();
  
  apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) { }

  uploadAvatar(body: any): Observable<any> {
    this.loadingService.show();
    const time = 1 * 1000;  // Simula 2 segundos de delay
    
    return this.http.post(`${this.apiUrl}/avatar`, body).pipe(
      delay(time),
      finalize(() => {
        this.getAvatar().subscribe(blob => {
          const url = URL.createObjectURL(blob);
          this.avatarSubject.next(url);
        })
        this.loadingService.hide(); // Ocultar loading después de la petición
      })
    );
  }

  getAvatar(): Observable<Blob> {
    this.loadingService.show();
    return this.http.get(`${this.apiUrl}/avatar`, { responseType: 'blob' }).pipe(
      finalize(() => {
        this.loadingService.hide(); // Ocultar loading después de la petición
      })
    );
  }

  getUserAvatar(userId: any): Observable<Blob> {
    this.loadingService.show();
    return this.http.get(`${this.apiUrl}/avatar/${userId}`, { responseType: 'blob' }).pipe(
      finalize(() => {
        this.loadingService.hide(); // Ocultar loading después de la petición
      })
    );
  }
}
