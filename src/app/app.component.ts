import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from './shared/components/footer/footer.component';
import { filter } from 'rxjs';
import { environment } from '../environments/environment.development';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    // AlertComponent,
    // LoadingComponent,
    // HeaderComponent,
    // NavbarComponent,
    FooterComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  isHeaderVisible = true;
  isFooterVisible = true;

  headerExcludedRoutes = [
    '/sign-in',
    '/sign-up',
    '/recovery-password',
    '/activate',
    '/no-connection',
  ];

  footerExcludedRoutes = [
    ...this.headerExcludedRoutes,
    '/account'
  ];

  constructor (
    private router: Router,
    // private titleService: TitleService,
    // private networkService: NetworkService,
  ) { }

  ngOnInit(): void {
    this.setupTitle();
    this.setupTheme();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isHeaderVisible = !this.headerExcludedRoutes.some(route => event.url.includes(route));
        this.isFooterVisible = !this.footerExcludedRoutes.some(route => event.url.includes(route));
        window.scrollTo(0, 0);  // Esta parte permite que los links del footer redirijan mostrando la parte alta de la página
      });
      
    // this.setupNetwork();
  }

  setupTitle() {
    const siteName = environment.siteName;
    // this.titleService.setTitle(siteName);
  }

  setupTheme() {
    const theme = localStorage.getItem('theme');

    if (theme) {
      if (theme === 'dark')
        document.documentElement.classList.add('dark');
      else 
        document.documentElement.classList.remove('dark');
    } else {
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark');
    }
  }

  setupNetwork() {
    /* this.networkService.isOnline$.subscribe(isOnline => {
      if (!isOnline)
        this.router.navigate(['/no-connection']);
      else
        this.router.navigate(['/']);
    }); */
  }
}
