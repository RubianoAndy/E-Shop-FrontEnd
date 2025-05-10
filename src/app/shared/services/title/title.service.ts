import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  private originalTitle: string;

  constructor (
    private titleService: Title,
  ) {
    this.originalTitle = this.titleService.getTitle();
    this.visibilityChange();
  }

  private visibilityChange() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden)
        this.titleService.setTitle('😢 ¡No te vayas, necesitamos dinero!');
      else
        this.titleService.setTitle(this.originalTitle);
    });
  }

  setTitle(newTitle: string) {
    this.originalTitle = newTitle;
    this.titleService.setTitle(newTitle);
  }
}