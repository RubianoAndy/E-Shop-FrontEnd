import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, finalize, map, Observable, of, tap } from 'rxjs';

import { environment } from '../../../../environments/environment.development';
import { LoadingService } from '../../../shared/services/loading/loading.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    private loadingService: LoadingService,
  ) { }

  signIn(body: any): Observable<any> {
    this.loadingService.show();
    return this.http.post(`${this.apiUrl}/sign-in`, body).pipe(
      tap((response: any) => {
        this.saveTokens(response.accessToken, response.refreshToken);
        this.router.navigate(['/']);
      }),
      finalize(() => {
        this.loadingService.hide(); // Ocultar loading después de la petición
      })
    );
  }

  signOut(): Observable<any> {
    this.loadingService.show();

    const refreshToken = this.getRefreshToken();
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${refreshToken}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.apiUrl}/sign-out`, {}, { headers }).pipe(
      tap(() => {
        this.deleteTokens();
        this.router.navigate(['/']);
      }),
      finalize(() => {
        this.loadingService.hide(); // Ocultar loading después de la petición
      })
    );
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();

    return this.http.post(`${this.apiUrl}/refresh-token`, { refreshToken });
  }

  saveTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  deleteTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  setAccessToken(accessToken: string,) {
    localStorage.setItem('accessToken', accessToken);
  }

  getAccessToken() {
    return localStorage.getItem('accessToken') || '';
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken') || '';
  }

  isAuthenticated(): Observable<boolean> {
    const accessToken = this.getAccessToken();
  
    if (!accessToken) {
      return of(false);
    }
  
    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    const expired = payload.exp * 1000;
  
    if (Date.now() < expired) {
      return of(true);
    } else {
      return this.refreshToken().pipe(
        map((response) => {
          this.setAccessToken(response.accessToken);
          return true;
        }),
        catchError(() => {
          this.signOut();
          return of(false);
        })
      );
    }
  }
}
