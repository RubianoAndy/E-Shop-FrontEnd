import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { environment } from '../../../../environments/environment.development';
import { DarkModeService } from '../../services/dark-mode/dark-mode.service';
import { RolesService } from '../../../account/services/roles/roles.service';
import { Subject } from 'rxjs';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() showLogo: boolean = false;
  @Output() sidebarEmitter = new EventEmitter<void>();
  
  logo = environment.darkLogo;
  roleId: number | null = null;
  token: string | null = null;

  adminMenuOptions = [
    { label: 'Categorías', url: '/account/categories', icon: 'apps' },
  ];

  superAdminMenuOptions = [
    { label: 'Roles', url: '/account/roles', icon: 'person' },
    { label: 'Usuarios', url: '/account/users', icon: 'person' },
  ];

  private unsubscribe$ = new Subject<void>();

  constructor (
    private darkModeService: DarkModeService,
    private changeDetectorRef: ChangeDetectorRef,
    private rolesService: RolesService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.token = this.authService.getAccessToken();
    if (this.token)
      this.getRole();

    this.darkModeService.darkMode$.subscribe(darkMode => {
      this.logo = darkMode ? environment.lightLogo : environment.darkLogo;
      this.changeDetectorRef.detectChanges();   // Forzar a la detención del cambio del logo en el ciclo de vida
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  emitEvent(): void {
    this.sidebarEmitter.emit();
  }

  getRole() {
    this.rolesService.getRole().subscribe({
      next: (response) => {
        this.roleId = response.roleId;
      },
      error: (response) => {
        console.error(response);
      }
    })
  }
}
