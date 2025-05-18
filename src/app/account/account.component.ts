import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BreadcrumbComponent } from '../shared/components/breadcrumb/breadcrumb.component';
import { SidebarComponent } from '../shared/components/sidebar/sidebar.component';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-account',
  imports: [
    RouterOutlet,
    BreadcrumbComponent,
    SidebarComponent,
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export default class AccountComponent implements OnInit {
  isNotMobile: boolean = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
  ) {}

  ngOnInit(): void {
    const customBreakpoints = [
      '(min-width: 1024px)',    // lg o superiores
    ];

    this.breakpointObserver.observe(customBreakpoints)
      .subscribe(result => {
        this.isNotMobile = result.matches;
    });
  }
}
