import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DarkModeService } from '../../services/dark-mode/dark-mode.service';

@Component({
  selector: 'app-dark-mode-toggle',
  imports: [
    NgClass
  ],
  templateUrl: './dark-mode-toggle.component.html',
  styleUrl: './dark-mode-toggle.component.css'
})
export class DarkModeToggleComponent implements OnInit {
  darkMode: boolean | undefined;

  constructor (
    private darkModeService: DarkModeService,
  ) { }

  ngOnInit(): void {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark' ) {
      document.documentElement.classList.add('dark');
      this.darkMode = true;
    } else {
      document.documentElement.classList.remove('dark');
      this.darkMode = false;
    }

    this.darkModeService.setDarkMode(this.darkMode);
  }

  toggleDarkMode() {
    const htmlElement = document.documentElement;

    if (htmlElement.classList.contains('dark')) {
      htmlElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      this.darkMode = false;
    } else {
      htmlElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      this.darkMode = true;
    }
    
    this.darkModeService.setDarkMode(this.darkMode);
  }
}