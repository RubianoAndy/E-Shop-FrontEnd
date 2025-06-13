import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface ProductImage {
  file: File;
  preview: string;
  isMain: boolean;
}

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export default class ProductComponent implements OnInit {
  productId: number = 0;
  productImages: ProductImage[] = [];
  categories: any[] = [];

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    // Implementar la carga de categorías
  }

  onImagesSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file: any) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.productImages.push({
            file: file,
            preview: e.target?.result as string,
            isMain: this.productImages.length === 0 // Primera imagen será la principal
          });
        };
        reader.readAsDataURL(file);
      });
    }
  }

  getMainImage(): string {
    const mainImage = this.productImages.find(img => img.isMain);
    return mainImage ? mainImage.preview : '';
  }

  hasMainImage(): boolean {
    return this.productImages.some(img => img.isMain);
  }

  setMainImage(index: number): void {
    this.productImages = this.productImages.map((img, i) => ({
      ...img,
      isMain: i === index
    }));
  }

  removeImage(index: number): void {
    this.productImages.splice(index, 1);
    // Si eliminamos la imagen principal, establecemos la primera como principal
    if (this.productImages.length > 0 && !this.productImages.some(img => img.isMain)) {
      this.productImages[0].isMain = true;
    }
  }
}
