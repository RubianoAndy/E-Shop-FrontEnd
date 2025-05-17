import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LoadingService } from '../../../shared/services/loading/loading.service';
import { finalize, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
  ) { }

  getRoles(page?: number, pageSize?: number, filters?: any[]): Observable<any> {
    this.loadingService.show();

    let params = new HttpParams();

    if (page !== undefined)
      params = params.set('page', page.toString());

    if (pageSize !== undefined)
      params = params.set('pageSize', pageSize.toString());

    if (filters && filters.length > 0)
      params = params.set('filters', JSON.stringify(filters));

    return this.http.get(`${this.apiUrl}/roles`, { params }).pipe(
      finalize(() => {
        this.loadingService.hide();
      })
    );
  }

  getRole(): Observable<any> {
    this.loadingService.show();

    return this.http.get(`${this.apiUrl}/role`).pipe(
      finalize(() => {
        this.loadingService.hide();
      })
    );
  }

  get(roleId: any): Observable<any> {
    this.loadingService.show();

    return this.http.get(`${this.apiUrl}/role/${roleId}`).pipe(
      finalize(() => {
        this.loadingService.hide(); // Ocultar loading después de la petición
      })
    );
  }

  add(name: string): Observable<any> {
    this.loadingService.show();

    return this.http.post(`${this.apiUrl}/role`, { name }).pipe(
      finalize(() => {
        this.loadingService.hide();
      })
    );
  }

  edit(roleId: any, name: string): Observable<any> {
    this.loadingService.show();

    return this.http.put(`${this.apiUrl}/role/${roleId}`, { name }).pipe(
      finalize(() => {
        this.loadingService.hide(); // Ocultar loading después de la petición
      })
    );
  }

  delete(roleId: any): Observable<any> {
    this.loadingService.show();

    return this.http.delete(`${this.apiUrl}/role/${roleId}`).pipe(
      finalize(() => {
        this.loadingService.hide();
      })
    );
  }

  export(): Observable<any> {
    this.loadingService.show();
    return this.http.get(`${this.apiUrl}/roles/excel`, { responseType: 'blob' }).pipe(
      finalize(() => {
        this.loadingService.hide();
      })
    );
  }

  getRolesSmall(): Observable<any> {
    this.loadingService.show();

    return this.http.get(`${this.apiUrl}/roles-small`).pipe(
      finalize(() => {
        this.loadingService.hide();
      })
    );
  }
}
