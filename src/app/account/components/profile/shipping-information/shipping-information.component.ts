import { NgClass } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CorrespondenceService } from '../../../services/correspondence/correspondence.service';
import { CountriesService } from '../../../../shared/services/countries/countries.service';
import { DepartmentsService } from '../../../../shared/services/departments/departments.service';
import { AlertService } from '../../../../shared/services/alert/alert.service';

interface Correspondence {
  id: number,
  countryId: string,
  departmentId: string,
  city: string,
  zipCode: string,
  address: string,
  observations: string,
}

@Component({
  selector: 'app-shipping-information',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass,
  ],
  templateUrl: './shipping-information.component.html',
  styleUrl: './shipping-information.component.css'
})
export class ShippingInformationComponent implements OnInit {
  userId = input<any>();

  edit!: Correspondence;

  form!: FormGroup;

  loading: boolean = false;

  countriesOptions: any[] = [];
  departmentsOptions: any[] = [];

  constructor (
    private formBuilder: FormBuilder,
    private correspondenceService: CorrespondenceService,
    private countriesService: CountriesService,
    private departmentsService: DepartmentsService,
    private alertService: AlertService,
  ) {
    this.getCountries();
  }

  ngOnInit(): void {
    this.createForm();

    if (this.userId() == null)
      this.getCorrespondence();
    else if (this.userId() > 0)
      this.getCorrespondenceFromSuperAdmin();
  }

  createForm(data: any = null) {
    this.form = this.formBuilder.group({
      countryId: [data?.countryId || '', [ Validators.required, Validators.minLength(1) ]],
      departmentId: [data?.departmentId || '', [ Validators.required, Validators.minLength(1) ]],
      city: [data?.city || '', [ Validators.required, Validators.minLength(2), Validators.maxLength(50) ]],
      zipCode: [data?.zipCode || '', [ Validators.required, Validators.minLength(5), Validators.maxLength(8), Validators.pattern('^[0-9]*$') ]],
      address: [data?.address || '', [ Validators.required, Validators.minLength(5), Validators.maxLength(80) ]],
      observations: [data?.observations || '', [ Validators.minLength(5), Validators.maxLength(500) ]],
    });
  }

  onSubmitForm() {
    var body = this.form.value;
    body.city = this.toCapitalizeCase(body.city);

    if (this.form.valid && body) {
      if (this.userId() == null)
        this.editOrCreateCorrespondence(body);
      else if (this.userId() > 0)
        this.editOrCreateCorrespondenceFromSuperAdmin(body);
    }
  }

  getCorrespondence() {
    this.correspondenceService.getCorrespondence().subscribe({
      next: (response: Correspondence) => {
        this.getDepartments(response.countryId);
        this.edit = {
          ...response,
          countryId: response.countryId === null ? '' : response.countryId,
          departmentId: response.departmentId === null ? '' : response.departmentId,
        };
        this.form.patchValue(this.edit);
      }
    });
  }
  
  editOrCreateCorrespondence(body: Correspondence) {
    this.loading = true;
    var alertBody = null;

    this.correspondenceService.editOrCreate(body).subscribe({
      next: (response) => {
        this.loading = false;
        // this.getDepartments(response.countryId);
        this.edit = {
          ...response,
          countryId: response.countryId === null ? '' : response.countryId,
          departmentId: response.departmentId === null ? '' : response.departmentId,
        };
        this.form.patchValue(this.edit);

        alertBody = {
          type: 'okay',
          title: '¡Felicidades!',
          message: response.message,
        };

        this.alertService.showAlert(alertBody);
      },
      error: response => {
        this.loading = false;
        alertBody = {
          type: 'error',
          title: '¡Error!',
          message: response.message,
        };

        this.alertService.showAlert(alertBody);
      }
    });
  }

  getCorrespondenceFromSuperAdmin() {
    this.correspondenceService.getCorrespondenceFromSuperAdmin(this.userId()).subscribe({
      next: (response: Correspondence) => {
        this.getDepartments(response.countryId);
        this.edit = {
          ...response,
          countryId: response.countryId === null ? '' : response.countryId,
          departmentId: response.departmentId === null ? '' : response.departmentId,
        };
        this.form.patchValue(this.edit);
      }
    })
  }

  editOrCreateCorrespondenceFromSuperAdmin(body: Correspondence) {
    this.loading = true;
    var alertBody = null;

    this.correspondenceService.editOrCreateFromSuperAdmin(this.userId(), body).subscribe({
      next: (response) => {
        this.loading = false;
        // this.getDepartments(response.countryId);
        this.edit = {
          ...response,
          countryId: response.countryId === null ? '' : response.countryId,
          departmentId: response.departmentId === null ? '' : response.departmentId,
        };
        this.form.patchValue(this.edit);

        alertBody = {
          type: 'okay',
          title: '¡Felicidades!',
          message: response.message,
        };

        this.alertService.showAlert(alertBody);
      },
      error: response => {
        this.loading = false;
        alertBody = {
          type: 'error',
          title: '¡Error!',
          message: response.message,
        };

        this.alertService.showAlert(alertBody);
      }
    });
  }

  getCountries() {
    this.countriesService.getCountries().subscribe(
      response => {
        this.countriesOptions = response;
      }
    );
  }

  getDepartments(countryId:string) {
    this.departmentsService.getDepartments(countryId).subscribe(response => this.departmentsOptions = response);
  }

  changeCountry() {
    const countryIdSelected = this.form.get('countryId')?.value;
    this.getDepartments(countryIdSelected);
    this.form.get('departmentId')?.setValue('');
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
