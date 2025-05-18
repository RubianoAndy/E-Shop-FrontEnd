import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ForgotPasswordService } from '../../services/forgot-password/forgot-password.service';
import { AlertService } from '../../../shared/services/alert/alert.service';
import { passwordValidator } from '../../../shared/validators/password/password.validator';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-recovery-password',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    NgClass,
  ],
  templateUrl: './recovery-password.component.html',
  styleUrl: './recovery-password.component.css'
})
export default class RecoveryPasswordComponent {
  logo = environment.darkLogo;

  formSelected: string = 'form_1';
  form_1!: FormGroup;
  form_2!: FormGroup;

  userId: number = 0;

  isPasswordVisible: boolean = false;
  isPasswordFocused: boolean = false;

  loading: boolean = false;

  passwordCriteria = {
    hasUpperCase: false,
    hasLowerCase: false,
    hasSpecialChar: false,
    hasNumber: false,
    isValidLength: false
  };

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,

    private forgotPasswordService: ForgotPasswordService,
    private alertService: AlertService,
  ) { }

  ngOnInit(): void {
    this.createForm1();
    this.createForm2();

    this.form_2.get('password')?.valueChanges.subscribe(value => {
      this.checkPasswordCriteria(value);
    });
  }

  createForm1(data: any = null) {
    this.form_1 = this.formBuilder.group({
      email: [data?.email || '', [ Validators.required, Validators.minLength(6), Validators.maxLength(50), Validators.email ]],
    });
  }

  createForm2(data: any = null) {
    this.form_2 = this.formBuilder.group({
      code_1: [data?.code_1 || '', [ Validators.required ]],
      code_2: [data?.code_2 || '', [ Validators.required ]],
      code_3: [data?.code_3 || '', [ Validators.required ]],
      code_4: [data?.code_4 || '', [ Validators.required ]],
      code_5: [data?.code_5 || '', [ Validators.required ]],
      code_6: [data?.code_6 || '', [ Validators.required ]],
      code_7: [data?.code_7 || '', [ Validators.required ]],

      password: [data?.password || '', [ Validators.required, passwordValidator() ]],
    });
  }

  onSubmitForm1() {
    var email = this.form_1.value.email;
    
    if (this.form_1.valid && email)
      this.generateCode(email);
  }

  onSubmitForm2() {
    var total_codes = 7;    // Cantidad de dígitos a llenar en el formulario
    var code = '';

    for (var i = 0; i < total_codes; i++){
      var name = 'code_' + (i + 1);
      code += this.form_2.value[name];
    }

    var body = {
      userId: this.userId,  // (this.userId != 0) ? this.userId : null
      code: code,
      password: this.form_2.value.password,
    };

    if (this.form_2.valid && body)
      this.verifyCode(body);
  }

  generateCode(email: string): void {
    this.loading = true;
    var alertBody = null;

    this.forgotPasswordService.generateCode(email).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.userId = response.userId;

        alertBody = {
          type: 'warning',
          title: '¡Revisa tu email!',
          message: response.message,
        }

        this.alertService.showAlert(alertBody);
        this.formSelected = 'form_2';
      },
      error: (response) => {
        this.loading = false;
        alertBody = {
          type: 'error',
          title: 'Error!',
          message: response.error.message,
        }

        this.alertService.showAlert(alertBody);
        this.form_1.reset();
      }
    });
  }

  verifyCode(body: any): void {
    this.loading = true;
    var alertBody = null;

    this.forgotPasswordService.verifyCode(body).subscribe({
      next: (response:any) => {
        this.loading = false;
        alertBody = {
          type: 'okay',
          title: '¡Felicitaciones!',
          message: response.message,
        }

        this.alertService.showAlert(alertBody);
        this.router.navigate(['sign-in']);
      },
      error: (response) => {
        this.loading = false;
        alertBody = {
          type: 'error',
          title: '¡Error!',
          message: response.error.message,
        }

        this.alertService.showAlert(alertBody);
        this.form_2.reset();
        this.formSelected = 'form_1';
      }
    });
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  focusNextInput(event: Event, nextInputId: string | null): void {
    const input = event.target as HTMLInputElement;
    if (input.value.length === input.maxLength && nextInputId) {
      const nextInput = document.getElementById(nextInputId);
      nextInput?.focus();
    }
  }

  handlePaste(event: ClipboardEvent): void {
    const pasteData = event.clipboardData?.getData('text') || '';
    if (pasteData.length === 7) {
      for (var i = 0; i < pasteData.length; i++){
        var name = 'code_' + (i + 1);
        this.form_2.controls[name].setValue(pasteData.charAt(i));
      }
      (document.getElementById('code_7') as HTMLInputElement)?.focus();
      
      event.preventDefault();
    }
  }

  handleKeyDown(event: KeyboardEvent, prevInputId: string | null): void {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && input.value.length === 0 && prevInputId) {
      const prevInput = document.getElementById(prevInputId) as HTMLInputElement;
      prevInput.focus();
      prevInput.value = '';  // Borrar el valor anterior
      event.preventDefault();
    }
  }

  // Método para mostrar el popover
  onPasswordFocus(): void {
    this.isPasswordFocused = true;
  }

  // Método para ocultar el popover
  onPasswordBlur(): void {
    this.isPasswordFocused = false;
  }

  checkPasswordCriteria(password: string): void {
    this.passwordCriteria.hasUpperCase = /[A-Z]/.test(password);
    this.passwordCriteria.hasLowerCase = /[a-z]/.test(password);
    this.passwordCriteria.hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    this.passwordCriteria.hasNumber = /\d/.test(password);
    this.passwordCriteria.isValidLength = password.length >= 8 && password.length <= 20;
  }
}
