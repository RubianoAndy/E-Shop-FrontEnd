import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { AlertService } from '../../../shared/services/alert/alert.service';
import { NgClass } from '@angular/common';
import { environment } from '../../../../environments/environment.development';
import { ContactService } from '../../services/contact/contact.service';

interface Contact {
  name: string,
  email: string,
  subject: string,
  message: string,
}

@Component({
    selector: 'app-contact',
    imports: [
      FormsModule,
      ReactiveFormsModule,
      NgClass,
    ],
    templateUrl: './contact.component.html',
    styleUrl: './contact.component.scss'
})
export default class ContactComponent implements OnInit {
  form!: FormGroup;
  email = environment.email;

  loading: boolean = false;

  constructor (
    private formBuilder: FormBuilder,
    private contactService: ContactService,
    private alertService: AlertService,
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(data: any = null) {
    this.form = this.formBuilder.group({
      name: [data?.name || '', [ Validators.required, Validators.minLength(6), Validators.maxLength(80) ]],
      email: [data?.email || '', [ Validators.required, Validators.minLength(6), Validators.maxLength(50), Validators.email ]],
      subject: [data?.subject || '', [ Validators.required, Validators.minLength(6), Validators.maxLength(50) ]],
      message: [data?.message || '', [ Validators.required, Validators.minLength(20), Validators.maxLength(1000) ]],
    });
  }

  onSubmit() {
    var body = {
      name: this.toCapitalizeCase(this.form.value.name),
      email: this.form.value.email.toLowerCase(),
      subject: this.form.value.subject,
      message: this.form.value.message,
    }

    if (this.form.valid && body)
      this.sendContactForm(body);

  }

  sendContactForm (body: Contact) {
    var body: Contact = {
      name: this.toCapitalizeCase(this.form.value.name),
      email: this.form.value.email.trim().toLowerCase(),
      subject: this.form.value.subject,
      message: this.form.value.message,
    }

    if (this.form.valid && body)
      this.sendContact(body);
  }

  sendContact(body: Contact) {
    this.loading = true;
    var alertBody = null;    this.contactService.sendContact(body).subscribe({
      next: (response: any) => {
        alertBody = {
          type: 'okay',
          title: '¡Excelente!',
          message: response.message,
        };

        this.alertService.showAlert(alertBody);
        this.form.reset();
      },
      error: (response: any) => {
        alertBody = {
          type: 'warning',
          title: '¡Algo pasó!',
          message: response.message,
        };

        this.alertService.showAlert(alertBody);
      },
      complete: () => {
        this.loading = false;
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
