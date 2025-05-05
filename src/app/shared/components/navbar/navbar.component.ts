import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DarkModeToggleComponent } from '../dark-mode-toggle/dark-mode-toggle.component';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-navbar',
  imports: [
    NgClass,
    RouterLink,
    RouterLinkActive,
    DarkModeToggleComponent,
    // SidebarComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isMobile: boolean = false;

  categories: any[] = [];

  isMenuOpen = false;
  isSubMenuOpen = false;

  profile: any = null;

  navbarOptions = [
    { label: 'Inicio', url: '/', icon: 'home' },
    { label: 'Faq', url: '/faq', icon: 'psychology' },
    { label: 'Contacto', url: '/contact', icon: 'person' },
  ];

  constructor (
    // private categoriesService: CategoriesService,
    private breakpointObserver: BreakpointObserver,
  ) {
    // this.getCategories();
  }

  ngOnInit(): void {
    const customBreakpoints = [
      '(max-width: 1023px)',    // md o inferiores
    ];
    
    this.breakpointObserver.observe(customBreakpoints)
      .subscribe(result => {
        this.isMobile = result.matches;
    });
  }

  /* async getCategories() {
    await this.categoriesService.getCategoriesSmall().subscribe(
      (response) => {
        this.categories = response;
      }
    )
  } */

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleSubMenu() {
    this.isSubMenuOpen = !this.isSubMenuOpen;
  }
}
