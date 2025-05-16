import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoadingService } from '../../../shared/services/loading/loading.service';
import { finalize } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    private loadingService: LoadingService,
  ) { }

  generateCode(email: string) {
    this.loadingService.show();
    return this.http.post(`${this.apiUrl}/generate-code`, { email }).pipe(
      finalize(() => {
        this.loadingService.hide();
      })
    );
  }

  verifyCode(body: any) {
    this.loadingService.show();
    return this.http.post(`${this.apiUrl}/verify-code`, body).pipe(
      finalize(() => {
        this.loadingService.hide();
      })
    );
  }
}
