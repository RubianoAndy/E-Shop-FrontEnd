import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { Injectable } from '@angular/core';
import { LoadingService } from '../../../shared/services/loading/loading.service';
import { finalize, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
  ) { }

  getCategories(page?: number, pageSize?: number, filters?: any[]): Observable<any> {
    this.loadingService.show();

    let params = new HttpParams();

    if (page !== undefined)
      params = params.set('page', page.toString());

    if (pageSize !== undefined)
      params = params.set('pageSize', pageSize.toString());

    if (filters && filters.length > 0)
      params = params.set('filters', JSON.stringify(filters));

    return this.http.get(`${this.apiUrl}/categories`, { params }).pipe(
      finalize(() => {
        this.loadingService.hide();
      })
    );
  }

  get(categoryId: any): Observable<any> {
    this.loadingService.show();

    return this.http.get(`${this.apiUrl}/category/${categoryId}`).pipe(
      finalize(() => {
        this.loadingService.hide(); // Ocultar loading después de la petición
      })
    );
  }

  add(body: any, image: any): Observable<any> {
    this.loadingService.show();

    return this.http.post(`${this.apiUrl}/category`, body).pipe(
      finalize(() => {
        this.loadingService.hide();
      })
    );
  }

  edit(categoryId: any, name: string): Observable<any> {
    this.loadingService.show();

    return this.http.put(`${this.apiUrl}/category/${categoryId}`, { name }).pipe(
      finalize(() => {
        this.loadingService.hide(); // Ocultar loading después de la petición
      })
    );
  }

  delete(categoryId: any): Observable<any> {
    this.loadingService.show();

    return this.http.delete(`${this.apiUrl}/category/${categoryId}`).pipe(
      finalize(() => {
        this.loadingService.hide();
      })
    );
  }

  export(): Observable<any> {
    this.loadingService.show();
    return this.http.get(`${this.apiUrl}/categories/excel`, { responseType: 'blob' }).pipe(
      finalize(() => {
        this.loadingService.hide();
      })
    );
  }

  getCategoriesSmall(): Observable<any> {
    this.loadingService.show();

    return this.http.get(`${this.apiUrl}/categories-small`).pipe(
      finalize(() => {
        this.loadingService.hide();
      })
    );
  }
}
