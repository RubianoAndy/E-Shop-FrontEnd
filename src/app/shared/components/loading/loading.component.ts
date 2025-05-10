import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

import { LoadingService } from '../../services/loading/loading.service';

@Component({
  selector: 'app-loading',
  imports: [],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css'
})
export class LoadingComponent implements OnInit, OnDestroy {
  logo = environment.darkLogo;
  isLoading = false;

  private loadingSubscription: Subscription = new Subscription();

  constructor (
    private loadingService: LoadingService,
  ) { }

  ngOnInit(): void {
    this.loadingSubscription =  this.loadingService.loading$.subscribe((loading: boolean) => {
      this.isLoading = loading;
    });
  }

  ngOnDestroy(): void {
    if (this.loadingSubscription)
      this.loadingSubscription.unsubscribe();
  }
}
