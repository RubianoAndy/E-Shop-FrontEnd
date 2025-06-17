import { NgClass } from '@angular/common';
import { Component, EventEmitter, input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordValidator } from '../../../../shared/validators/password/password.validator';
import { AlertService } from '../../../../shared/services/alert/alert.service';
import { ProfileService } from '../../../services/profile/profile.service';
import { CountriesService } from '../../../../shared/services/countries/countries.service';
import { RolesService } from '../../../services/roles/roles.service';
import { UsersService } from '../../../services/users/users.service';

interface Profile {
  id: number,
  name_1: string,
  name_2: string,
  lastname_1: string,
  lastname_2: string,
  dniType: string,
  dni: string,
  prefix: string,
  mobile: string,
  email: string,
  // roleId: number,
}

@Component({
  selector: 'app-personal-information',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass,
  ],
  templateUrl: './personal-information.component.html',
  styleUrl: './personal-information.component.css'
})
export class PersonalInformationComponent implements OnInit {
  @Output() userCreated = new EventEmitter<void>();

  userId = input<any>();

  edit!: Profile;
  
  form!: FormGroup;

  isPasswordVisible: boolean = false;
  isPasswordFocused: boolean = false;

  passwordCriteria = {
    hasUpperCase: false,
    hasLowerCase: false,
    hasSpecialChar: false,
    hasNumber: false,
    isValidLength: false
  };

  loading: boolean = false;

  dniOptions = [
    { label: 'Cédula de ciudadanía (DNI)', value: 'Cédula de ciudadanía (DNI)' },
    { label: 'Cédula de extranjería', value: 'Cédula de extranjería' },
    { label: 'Tarjeta de identidad', value: 'Tarjeta de identidad' },
    { label: 'Tarjeta profesional', value: 'Tarjeta profesional' },
    { label: 'Permiso de Protección Temporal', value: 'Permiso de Protección Temporal' },
    { label: 'Identificación diplomática', value: 'Identificación diplomática' },
    { label: 'Pasaporte', value: 'Pasaporte' },
    { label: 'Otro', value: 'Otro' },
  ];

  disabledFields = [
    'name_1',
    'name_2',
    'lastname_1',
    'lastname_2',
    'dniType',
    'dni',
    'email',
  ];

  prefixOptions: any[] = [];
  rolesOptions: any[] = [];

  constructor (
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private profileService: ProfileService,
    private countriesService: CountriesService,
    private rolesService: RolesService,
    private usersService: UsersService,
  ) {
    this.getCountries();
  }

  ngOnInit(): void {
    this.createForm();

    if (this.userId() == null)
      this.getProfile();
    else if (this.userId() > 0){
      this.getRoles();
      this.getProfileFromSuperAdmin();
    } else if (this.userId() == 0) {
      this.form.get('roleId')?.setValidators([ Validators.required, Validators.minLength(1) ]);
      this.form.get('password')?.setValidators([ Validators.required, passwordValidator() ]);
      this.getRoles();
    }
  }

  createForm(data: any = null) {
    this.form = this.formBuilder.group({
      name_1: [data?.name_1 || '', [ Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$') ]],
      name_2: [data?.name_2 || '', [ Validators.minLength(2), Validators.maxLength(20), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$') ]],
      lastname_1: [data?.lastname_1 || '', [ Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$') ]],
      lastname_2: [data?.lastname_2 || '', [ Validators.minLength(2), Validators.maxLength(20), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$') ]],
      dniType: [data?.dniType || '', [ Validators.required, Validators.minLength(2) ]],
      dni: [data?.dni || '', [ Validators.required, Validators.minLength(5), Validators.maxLength(30) ]],
      email: [data?.email || '', [ Validators.required, Validators.minLength(6), Validators.maxLength(100), Validators.email ]],

      prefix: [data?.prefix || '', [ Validators.required, Validators.minLength(1) ]],
      mobile: [data?.mobile || '', [ Validators.required, Validators.minLength(7), Validators.maxLength(15), Validators.pattern('^[0-9]*$') ]],

      password: [data?.password || ''],
      roleId: [data?.roleId || ''],
    });
  }

  onSubmitForm() {
    var body: any = {
      name_1: this.toCapitalizeCase(this.form.value.name_1),
      name_2: (this.form.value.name_2 == '' || this.form.value.name_2 == null) ? null : this.toCapitalizeCase(this.form.value.name_2),
      lastname_1: this.toCapitalizeCase(this.form.value.lastname_1),
      lastname_2: (this.form.value.lastname_2 == '' || this.form.value.lastname_2 == null) ? null : this.toCapitalizeCase(this.form.value.lastname_2),
      dniType: (this.form.value.dniType == '' || this.form.value.dniType == null) ? null : this.form.value.dniType,
      dni: (this.form.value.dni == '' || this.form.value.dni == null) ? null : this.form.value.dni.trim(),
      email: (this.form.value.email == '' || this.form.value.email == null) ? null : this.form.value.email.trim().toLowerCase(),

      prefix: this.form.value.prefix,
      mobile: this.form.value.mobile,
    };

    if (this.form.valid && body) {
      if (this.userId() == null)
        this.editProfile(body);
      else if (this.userId() > 0)
        this.editProfileFromSuperAdmin(body);
      else if (this.userId() == 0)
        this.newUserFromSuperAdmin(body);
    }
  }

  getProfile() {
    this.profileService.getProfile().subscribe({
      next: (response: Profile) => {
        this.edit = {
          ...response,
          dniType: response.dniType === null ? '' : response.dniType,
          prefix: response.prefix === null ? '' : response.prefix,
        };
        this.form.patchValue(this.edit);

        this.disabledFields.forEach(field => {
          const formField = this.form.get(field);
          if (formField && formField.value)
            formField.disable();
        });

        // Para evitar que queden habilitados los campos para el usuario
        this.form.get('password')?.disable();
        this.form.get('roleId')?.disable();
      }
    });
  }

  editProfile(body: Profile) {
    this.loading = true;
    var alertBody = null;

    this.profileService.edit(body).subscribe({
      next: (response) => {
        this.edit = {
          ...response,
          dniType: response.dniType === null ? '' : response.dniType,
          prefix: response.prefix === null ? '' : response.prefix,
        };
        this.form.patchValue(this.edit);

        this.disabledFields.forEach(field => {
          const formField = this.form.get(field);
          if (formField && formField.value)
            formField.disable();
        });

        // Para evitar que queden habilitados los campos para el usuario
        this.form.get('password')?.disable();
        this.form.get('roleId')?.disable();

        alertBody = {
          type: 'okay',
          title: '¡Felicidades!',
          message: response.message,
        };

        this.alertService.showAlert(alertBody);
      },
      error: response => {
        alertBody = {
          type: 'error',
          title: '¡Error!',
          message: response.message,
        };

        this.alertService.showAlert(alertBody);
      },
      complete: () => {
        this.loading = false;
      }
    })
  }

  getProfileFromSuperAdmin() {
    this.usersService.get(this.userId()).subscribe({
      next: (response: Profile) => {
        this.edit = {
          ...response,
          dniType: response.dniType === null ? '' : response.dniType,
          prefix: response.prefix === null ? '' : response.prefix,
        };
        this.form.patchValue(this.edit);

        this.form.get('roleId')?.setValidators([ Validators.required, Validators.minLength(1) ]);
        this.form.get('password')?.setValidators([ passwordValidator() ]);
      }
    });
  }

  newUserFromSuperAdmin(body: any) {
    var alertBody = null;

    body.password = this.form.value.password;
    body.roleId = this.form.value.roleId;

    this.usersService.add(body).subscribe({
      next: (response) => {
        this.form.reset();
        this.userCreated.emit();

        alertBody = {
          type: 'okay',
          title: '¡Felicidades!',
          message: response.message,
        };

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

  editProfileFromSuperAdmin(body: any) {
    this.loading = true;
    var alertBody = null;

    body.password = (body.password == '') ? null : body.password;   // Si no se llena la contraseña, que vaya un null
    body.roleId = this.form.value.roleId;

    this.usersService.edit(this.userId(), body).subscribe({
      next: (response) => {
        this.edit = {
          ...response,
          dniType: response.dniType === null ? '' : response.dniType,
          prefix: response.prefix === null ? '' : response.prefix,
        };
        this.form.patchValue(this.edit);

        this.form.get('roleId')?.setValidators([ Validators.required, Validators.minLength(1) ]);
        this.form.get('password')?.setValidators([ passwordValidator() ]);

        alertBody = {
          type: 'okay',
          title: '¡Felicidades!',
          message: response.message,
        };

        this.alertService.showAlert(alertBody);
      },
      error: response => {
        alertBody = {
          type: 'error',
          title: '¡Error!',
          message: response.message,
        };

        this.alertService.showAlert(alertBody);
      },
      complete: () => {
        this.loading = false;
      }
    })
  }

  getCountries() {
    this.countriesService.getCountries().subscribe(
      response => {
        this.prefixOptions = response;
      }
    );
  }

  getRoles() {
    this.rolesService.getRolesSmall().subscribe(
      response => {
        this.rolesOptions = response;
      }
    );
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onPasswordFocus(): void {
    this.isPasswordFocused = true;
  }

  onPasswordBlur(): void {
    this.isPasswordFocused = false;
  }

  checkPasswordCriteria(password: string): void {
    const criteria = {
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      hasNumber: /\d/.test(password),
      isValidLength: password.length >= 8 && password.length <= 20,
    };

    this.passwordCriteria = criteria;
  }

  onPasswordChange(event: Event): void {
    const password = (event.target as HTMLInputElement).value;
    this.checkPasswordCriteria(password);
  }

  private toCapitalizeCase (text:string): string {
    if (!text)
      return text;

    return text
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (!control?.errors || !control.touched) return '';

    const errors = control.errors;
    if (errors['required']) return 'Este campo es requerido';
    if (errors['minlength']) return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    if (errors['maxlength']) return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
    if (errors['pattern']) {
      if (controlName === 'url') return 'Solo letras minúsculas, números y guiones';
      return 'Formato inválido';
    }
    return 'Error de validación';
  }
}
