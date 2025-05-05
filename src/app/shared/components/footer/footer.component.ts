import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';

import { environment } from '../../../../environments/environment.development';

import { DarkModeService } from '../../services/dark-mode/dark-mode.service';

@Component({
  selector: 'app-footer',
  imports: [
    RouterLink
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit, OnDestroy {
  logo = environment.darkLogo;
  page = environment.siteName;
  currentYear = environment.currentYear;
  email = environment.email;

  private unsubscribe$ = new Subject<void>();

  constructor (
    private darkModeService: DarkModeService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.darkModeService.darkMode$.subscribe(darkMode => {
      this.logo = darkMode ? environment.lightLogo : environment.darkLogo;
      this.changeDetectorRef.detectChanges();   // Forzar a la detención del cambio del logo en el ciclo de vida
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}