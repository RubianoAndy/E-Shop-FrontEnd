import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { passwordValidator } from '../../../shared/validators/password.validator';

import { AuthService } from '../../services/auth/auth.service';
import { AlertService } from '../../../shared/services/alert/alert.service';

import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-sign-in',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    NgClass,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export default class SignInComponent implements OnInit {
  logo = environment.darkLogo;
  form!: FormGroup;

  isPasswordVisible: boolean = false;

  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,

    private authService: AuthService,
    private alertService: AlertService,
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(data: any = null) {
    this.form = this.formBuilder.group({
      email: [data?.email || '', [ Validators.required, Validators.minLength(6), Validators.maxLength(50), Validators.email ]],
      password: [data?.password || '', [ Validators.required, passwordValidator() ]],
    });
  }

  onSubmit() {
    var body = {
      email: this.form.value.email.toLowerCase(),
      password: this.form.value.password,
    };

    if (this.form.valid && body)
      this.signIn(body);
  }

  signIn(body: any): void {
    this.loading = true;
    var alertBody = null;

    this.authService.signIn(body).subscribe({
      next: () => {
        
      },
      error: (response) => {
        this.loading = false;
        alertBody = {
          type: 'error',
          title: 'Credenciales incorrectas',
          message: response.error.message,
        }

        this.alertService.showAlert(alertBody);
      }
    });
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
  
  /* private googleInitialize() {
    google.accounts.id.initialize({
      client_id: '408421446410-7incluce8okp0gcgg15g6v5l43pltt95.apps.googleusercontent.com',
      callback: (resp: any) => this.handleLogin(resp)
    });

    google.accounts.id.renderButton(
      document.getElementById("google-btn"), 
      {
        theme: 'filled_blue',
        size: 'large',
        shape: 'rectangle',
        width: 350
      }
    );
  } */

  /* handleLogin(response: any) {
    if(response){
      const payload = this.decodeToken(response.credential);

      // Petición para enviar el JWT Token al Backend
    }
  } */

  /* private decodeToken(token: string) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  } */
}
