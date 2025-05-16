import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';
import { LoadingService } from '../../../shared/services/loading/loading.service';
import { finalize, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    // private router: Router,
    private loadingService: LoadingService,
  ) { }

  register(body: any): Observable<any> {
    this.loadingService.show();
    return this.http.post(`${this.apiUrl}/register`, body).pipe(
      finalize(() => {
        this.loadingService.hide();
      })
    );
  }

  activate(token: string): Observable<any> {
    this.loadingService.show();
    return this.http.post(`${this.apiUrl}/activate`, { token }).pipe(
      finalize(() => {
        this.loadingService.hide();
      })
    );
  }
}
