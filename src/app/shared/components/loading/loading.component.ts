import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

import { LoadingService } from '../../services/loading/loading.service';
import { DarkModeService } from '../../services/dark-mode/dark-mode.service';

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
    private darkModeService: DarkModeService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.loadingSubscription =  this.loadingService.loading$.subscribe((loading: boolean) => {
      this.isLoading = loading;
    });

    this.darkModeService.darkMode$.subscribe(darkMode => {
      this.logo = darkMode ? environment.lightLogo : environment.darkLogo;
      this.changeDetectorRef.detectChanges();
    });
  }

  ngOnDestroy(): void {
    if (this.loadingSubscription)
      this.loadingSubscription.unsubscribe();
  }
}
