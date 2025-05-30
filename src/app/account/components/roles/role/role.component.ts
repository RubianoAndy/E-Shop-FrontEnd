import { NgClass } from '@angular/common';
import { Component, EventEmitter, input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../../shared/services/alert/alert.service';
import { RolesService } from '../../../services/roles/roles.service';

interface Role {
  id: number,
  name: string,
}

@Component({
  selector: 'app-role',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass,
  ],
  templateUrl: './role.component.html',
  styleUrl: './role.component.css'
})
export class RoleComponent implements OnInit {
  @Output() roleEmitter = new EventEmitter<void>();
  roleId = input<any>();

  edit!: Role;

  form!: FormGroup;

  loading: boolean = false;

  constructor (
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private rolesService: RolesService,
  ) { }

  ngOnInit(): void {
    this.createForm();

    if (this.roleId() > 0)
      this.getRole(this.roleId());
  }

  createForm(data: any = null) {
    this.form = this.formBuilder.group({
      name: [data?.name || '', [ Validators.required, Validators.minLength(5), Validators.maxLength(1000), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$') ]],
    });
  }

  onSubmitForm() {
    var name = this.toCapitalizeCase(this.form.value.name);

    if (this.form.valid && name) {
      if (this.roleId() > 0)
        this.editRole(this.roleId(), name);
      else if (this.roleId() == 0)
        this.newRole(name);
    }
  }

  getRole(roleId: any) {
    this.rolesService.get(roleId).subscribe({
      next: (response: Role) => {
        this.form.patchValue(response);
      }
    });
  }

  newRole(name: any) {
    var alertBody = null;
    this.rolesService.add(name).subscribe({
      next: (response) => {
        this.form.reset();
        this.roleEmitter.emit();

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
    });
  }

  editRole(roleId: number, name: string) {
    var alertBody = null;

    this.rolesService.edit(roleId, name).subscribe({
      next: (response) => {
        this.roleEmitter.emit();
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
    });
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
}