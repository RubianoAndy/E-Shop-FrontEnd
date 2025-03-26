import { Component, OnDestroy, OnInit } from '@angular/core';

interface CarouselItem {
  image: string;
  label: string;
  description: string;
}

@Component({
  selector: 'app-carousel',
  imports: [],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent implements OnInit, OnDestroy {
  currentSlide: number = 0;
  slideTime: number = 5; // Segundos
  slideInterval: any; // Variable para almacenar el intervalo

  // Tamaño de cada slide debe ser ser de 1920 x 1080 px

  slides: CarouselItem[] = [
    {
      image: 'assets/images/carousel/Banner 1.png',
      label: 'First slide label',
      description: 'Some representative placeholder content for the first slide.'
    },
    {
      image: 'assets/images/carousel/Banner 2.png',
      label: 'Second slide label',
      description: 'Some representative placeholder content for the second slide.'
    },
    {
      image: 'assets/images/carousel/Banner 3.png',
      label: 'Third slide label',
      description: 'Some representative placeholder content for the third slide.'
    }
  ];

  ngOnInit(): void {
    this.startSlideShow(); // Inicia el carrusel al cargar el componente
  }

  ngOnDestroy(): void {
    this.stopSlideShow(); // Detiene el carrusel al destruir el componente
  }

  startSlideShow() {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, this.slideTime * 1000);
  }

  stopSlideShow() {
    clearInterval(this.slideInterval); // Limpia el intervalo
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }
}
