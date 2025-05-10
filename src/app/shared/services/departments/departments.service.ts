import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) { }

  getDepartments(countryId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/departments/${countryId}`);
  }
}