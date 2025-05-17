import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment.development';
import { RegisterService } from '../../services/register/register.service';
import { AlertService } from '../../../shared/services/alert/alert.service';

@Component({
  selector: 'app-activate-account',
  imports: [
    RouterLink,
  ],
  templateUrl: './activate-account.component.html',
  styleUrl: './activate-account.component.css'
})
export default class ActivateAccountComponent implements OnInit {
  logo = environment.darkLogo;
  isActivated = false;

  constructor (
    private activatedRoute: ActivatedRoute,
    private registerService: RegisterService,
    private alertService: AlertService,
  ) { }

  ngOnInit(): void {
    this.activateUser();
  }

  activateUser() {
    var alertBody = null;
    const token = this.activatedRoute.snapshot.queryParams['token'];

    this.registerService.activate(token).subscribe({
      next: () => {
        this.isActivated = true;
      },
      error: (response) => {
        alertBody = {
          type: 'error',
          title: 'No pudimos activar tu cuenta',
          message: response.error.message,
        }

        this.alertService.showAlert(alertBody);
      }
    })
  }

}
