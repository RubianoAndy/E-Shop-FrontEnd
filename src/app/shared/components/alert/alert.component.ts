import { NgClass } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService } from '../../services/alert/alert.service';

interface Alert {
  type: 'okay' | 'warning' | 'error';
  title: string;
  message: string;
}

@Component({
  selector: 'app-alert',
  imports: [
    NgClass,
  ],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent implements OnInit, OnDestroy {
  alerts: Alert[] = [];
  private alertSubscription: Subscription = new Subscription();
  alertTime: number = 4;    // Tiempo en segundos

  constructor (
    private alertService: AlertService,
  ) { }


  ngOnInit(): void {
    this.alert();
  }

  ngOnDestroy(): void {
    if (this.alertSubscription)
      this.alertSubscription.unsubscribe();
  }

  alert() {
    this.alertSubscription = this.alertService.alertMessage$.subscribe(msg => {
      const newAlert: Alert = {
        type: msg.type,
        title: msg.title,
        message: msg.message
      };

      this.alerts.push(newAlert);

      setTimeout(() => {
        this.removeAlert(newAlert);
      }, this.alertTime * 1000);
    });
  }

  removeAlert(alert: Alert): void {
    this.alerts = this.alerts.filter(a => a !== alert);
  }

  closeAlert(alert: Alert): void {
    this.removeAlert(alert);
  }
}