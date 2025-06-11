import { NgClass } from '@angular/common';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Subject, Subscription } from 'rxjs';

import { AuthService } from '../../../core/services/auth/auth.service';
import { AlertService } from '../../services/alert/alert.service';
import { DarkModeService } from '../../services/dark-mode/dark-mode.service';
import { AvatarService } from '../../../account/services/avatar/avatar.service';
import { ProfileService } from '../../../account/services/profile/profile.service';

import { environment } from '../../../../environments/environment.development';

import { DarkModeToggleComponent } from '../dark-mode-toggle/dark-mode-toggle.component';

@Component({
  selector: 'app-header',
  imports: [
    NgClass,
    RouterLink,
    RouterLinkActive,
    DarkModeToggleComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  logo = environment.darkLogo;
  avatar: string = 'assets/images/avatar/Avatar.png';
  email = environment.email;

  options = [
    { label: 'Inicio', url: '/' },
    { label: 'Faq', url: '/faq' },
    { label: 'Productos', url: '/products' },
    { label: 'Contacto', url: '/contact' },
  ];

  private avatarSubscription: Subscription | undefined;
  private unsubscribe$ = new Subject<void>();
  
  isAccountMenuOpen = false;
  profile: any = null;

  constructor (
    private authService: AuthService,
    private profileService: ProfileService,
    private alertService: AlertService,
    private darkModeService: DarkModeService,
    private avatarService: AvatarService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.getProfile();

        this.avatarSubscription = this.avatarService.avatar$.subscribe(url =>{
          if(url)
            this.avatar = url;
        });
        this.getAvatar();
      }
    });

    this.darkModeService.darkMode$.subscribe(darkMode => {
      this.logo = darkMode ? environment.lightLogo : environment.darkLogo;
      this.changeDetectorRef.detectChanges();
    });
  }

  ngOnDestroy(): void {
    if (this.avatarSubscription) {
      this.avatarSubscription.unsubscribe();
    }
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getProfile() {
    this.profileService.getProfile().subscribe(
      response => {
        this.profile = response;
      }
    );
  }

  signOut() {
    var alertBody = null;
    this.authService.signOut().subscribe({
      next: (response) => {
        alertBody = {
          type: 'okay',
          title: '¡Esperamos verte pronto!',
          message: response.message,
        }
        this.profile = null;
      },
      error: (response) => {
        alertBody = {
          type: 'error',
          title: 'Error',
          message: response.error.message,
        }
        this.alertService.showAlert(alertBody);
      }
    });
  }

  getAvatar() {
    this.avatarService.getAvatar().subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);
        this.avatar = url;
      },
      error: (response) => {
        console.error('Error al cargar el avatar: ', response);
      }
    });
  }

  toggleAccountMenu() {
    this.isAccountMenuOpen = !this.isAccountMenuOpen;
  }
}