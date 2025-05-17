import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { LoadingService } from '../../../shared/services/loading/loading.service';
import { finalize, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CorrespondenceService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
  ) { }

  getCorrespondence(): Observable<any> {
    this.loadingService.show();

    return this.http.get(`${this.apiUrl}/correspondence`).pipe(
      finalize(() => {
        this.loadingService.hide(); // Ocultar loading después de la petición
      })
    );
  }

  editOrCreate(body: any): Observable<any> {
    this.loadingService.show();

    return this.http.post(`${this.apiUrl}/correspondence`, body).pipe(
      finalize(() => {
        this.loadingService.hide(); // Ocultar loading después de la petición
      })
    );
  }

  getCorrespondenceFromSuperAdmin(userId: any): Observable<any> {
    this.loadingService.show();

    return this.http.get(`${this.apiUrl}/correspondence/${userId}`).pipe(
      finalize(() => {
        this.loadingService.hide(); // Ocultar loading después de la petición
      })
    );
  }

  editOrCreateFromSuperAdmin(userId: any, body: any): Observable<any> {
    this.loadingService.show();

    return this.http.post(`${this.apiUrl}/correspondence/${userId}`, body).pipe(
      finalize(() => {
        this.loadingService.hide(); // Ocultar loading después de la petición
      })
    );
  }
}
