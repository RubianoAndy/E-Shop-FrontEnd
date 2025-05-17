import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { LoadingService } from '../../../shared/services/loading/loading.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
  ) { }

  getProfile(): Observable<any> {
    this.loadingService.show();

    return this.http.get(`${this.apiUrl}/profile`).pipe(
      finalize(() => {
        this.loadingService.hide(); // Ocultar loading después de la petición
      })
    );
  }

  edit(body: any): Observable<any> {
    this.loadingService.show();

    return this.http.put(`${this.apiUrl}/profile`, body).pipe(
      finalize(() => {
        this.loadingService.hide(); // Ocultar loading después de la petición
      })
    );
  }
}