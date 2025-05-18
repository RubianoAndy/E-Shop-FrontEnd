import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordValidator } from '../../../../shared/validators/password/password.validator';
import { ChangePasswordService } from '../../../services/change-password/change-password.service';
import { AlertService } from '../../../../shared/services/alert/alert.service';

@Component({
  selector: 'app-change-password',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent implements OnInit {
  form!: FormGroup;

  loading: boolean = false;

  isCurrentPasswordVisible: boolean = false;
  isNewPasswordVisible: boolean = false;
  isCurrentPasswordFocused: boolean = false;
  isNewPasswordFocused: boolean = false;

  currentPasswordCriteria = {
    hasUpperCase: false,
    hasLowerCase: false,
    hasSpecialChar: false,
    hasNumber: false,
    isValidLength: false
  };

  newPasswordCriteria = {
    hasUpperCase: false,
    hasLowerCase: false,
    hasSpecialChar: false,
    hasNumber: false,
    isValidLength: false
  };

  constructor (
    private formBuilder: FormBuilder,
    private changePasswordService: ChangePasswordService,
    private alertService: AlertService,
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(data: any = null) {
    this.form = this.formBuilder.group({
      currentPassword: [data?.currentPassword || '', [ Validators.required, passwordValidator() ]],
      newPassword: [data?.newPassword || '', [ Validators.required, passwordValidator() ]],
    });
  }

  onSubmitForm() {
    let body = this.form.value;

    if (this.form.valid && body)
      this.changePassword(body);
  }

  changePassword(body: any) {
    var alertBody = null;

    this.changePasswordService.changePassword(body).subscribe({
      next: response =>{
        alertBody = {
          type: 'okay',
          title: '¡Felicidades!',
          message: response.message,
        };

        this.form.reset();

        this.alertService.showAlert(alertBody);
      },
      error: response => {
        alertBody = {
          type: 'error',
          title: '¡Error!',
          message: response.message,
        };

        this.alertService.showAlert(alertBody);
      }
    })
  }

  togglePasswordVisibility(formName: string): void {
    const visibilityMap: any = {
      currentPassword: () => { this.isCurrentPasswordVisible = !this.isCurrentPasswordVisible; },
      newPassword: () => { this.isNewPasswordVisible = !this.isNewPasswordVisible; }
    };

    if (visibilityMap[formName])
      visibilityMap[formName]();
    // else
    //   console.warn(`No se puede mostrar contraseña para ${formName}`);
  }

  onPasswordFocus(formName: string): void {
    if (formName === 'currentPassword')
      this.isCurrentPasswordFocused = true;
    else if (formName === 'newPassword')
      this.isNewPasswordFocused = true;
  }

  onPasswordBlur(formName: string): void {
    if (formName === 'currentPassword')
      this.isCurrentPasswordFocused = false;
    else if (formName === 'newPassword')
      this.isNewPasswordFocused = false;
  }

  checkPasswordCriteria(password: string, formName: string): void {
    const criteria = {
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      hasNumber: /\d/.test(password),
      isValidLength: password.length >= 8 && password.length <= 20,
    };

    if (formName === 'currentPassword')
      this.currentPasswordCriteria = criteria;
    else if (formName === 'newPassword')
      this.newPasswordCriteria = criteria;
  }

  onCurrentPasswordChange(event: Event): void {
    const password = (event.target as HTMLInputElement).value;
    this.checkPasswordCriteria(password, 'currentPassword');
  }

  onNewPasswordChange(event: Event): void {
    const password = (event.target as HTMLInputElement).value;
    this.checkPasswordCriteria(password, 'newPassword');
  }
}
