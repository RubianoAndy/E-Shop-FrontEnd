import { Component } from '@angular/core';
import { CarouselComponent } from '../../../shared/components/carousel/carousel.component';

@Component({
  selector: 'app-home',
  imports: [
    CarouselComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export default class HomeComponent {

}
