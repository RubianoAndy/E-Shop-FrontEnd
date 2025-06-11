import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriesService } from '../../../account/services/categories/categories.service';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  category: number;
  isNew?: boolean;
  isSale?: boolean;
}

interface Filters {
  categories: string[];
  priceRange: [number, number];
  minRating: number;
  isNew: boolean;
  isSale: boolean;
}

@Component({
  selector: 'app-products',
  imports: [
    CommonModule, 
    FormsModule
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export default class ProductsComponent {
  categories: any[] = [];
  favorites: number[] = [];
  showFilters: boolean = false;
  hoverRating: number = 0;
  filters: Filters = {
    categories: [],
    priceRange: [0, 300],
    minRating: 0,
    isNew: false,
    isSale: false
  };

  products: Product[] = [
    {
      id: 1,
      name: "Wireless Bluetooth Headphones",
      price: 79.99,
      originalPrice: 99.99,
      image: "/assets/images/auth/Auth.png",
      rating: 4.5,
      reviews: 128,
      category: 1,
      isSale: true,
    },
    {
      id: 2,
      name: "Premium Cotton T-Shirt",
      price: 29.99,
      image: "/assets/images/auth/Auth.png",
      rating: 4.8,
      reviews: 89,
      category: 1,
      isNew: true,
      isSale: true,
    },
    {
      id: 3,
      name: "Premium Cotton T-Shirt",
      price: 29.99,
      image: "/assets/images/auth/Auth.png",
      rating: 4.8,
      reviews: 89,
      category: 2,
      isNew: true,
    },
    {
      id: 4,
      name: "Premium Cotton T-Shirt",
      price: 29.99,
      image: "/assets/images/auth/Auth.png",
      rating: 4.8,
      reviews: 89,
      category: 2,
      isNew: true,
    },
    {
      id: 5,
      name: "Premium Cotton T-Shirt",
      price: 29.99,
      image: "/assets/images/auth/Auth.png",
      rating: 4.8,
      reviews: 89,
      category: 3,
      isNew: true,
    },
    {
      id: 6,
      name: "Premium Cotton T-Shirt",
      price: 29.99,
      image: "/assets/images/auth/Auth.png",
      rating: 4.8,
      reviews: 89,
      category: 3,
      isNew: true,
    },
  ];

  maxPrice = Math.max(...this.products.map(p => p.originalPrice || p.price));

  constructor(
    private categoriesService: CategoriesService,
  ) {
    this.getCategories();
  }

  async getCategories() {
    await this.categoriesService.getCategoriesSmall().subscribe(
      (response) => {
        this.categories = response;
      }
    )
  }

  get filteredProducts(): Product[] {
    return this.products.filter(product => {
      if (this.filters.categories.length > 0 && !this.filters.categories.includes(product.category.toString()))
        return false;

      const price = product.price;
      if (price < this.filters.priceRange[0] || price > this.filters.priceRange[1])
        return false;

      if (product.rating < this.filters.minRating)
        return false;

      if (this.filters.isNew && !product.isNew)
        return false;

      if (this.filters.isSale && !product.isSale)
        return false;

      return true;
    });
  }

  get activeFiltersCount(): number {
    return this.filters.categories.length +
      (this.filters.minRating > 0 ? 1 : 0) +
      (this.filters.isNew ? 1 : 0) +
      (this.filters.isSale ? 1 : 0) +
      (this.filters.priceRange[0] > 0 || this.filters.priceRange[1] < this.maxPrice ? 1 : 0);
  }

  toggleFavorite(productId: number): void {
    const index = this.favorites.indexOf(productId);
    if (index === -1) {
      this.favorites.push(productId);
    } else {
      this.favorites.splice(index, 1);
    }
  }
  handleCategoryChange(category: any, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.filters.categories.push(category.id.toString());
    } else {
      const index = this.filters.categories.indexOf(category.id.toString());
      if (index !== -1) {
        this.filters.categories.splice(index, 1);
      }
    }
  }

  handlePriceRangeChange(value: [number, number]): void {
    this.filters.priceRange = value;
  }

  handleRatingChange(rating: number): void {
    this.filters.minRating = rating;
  }

  clearFilters(): void {
    this.filters = {
      categories: [],
      priceRange: [0, this.maxPrice],
      minRating: 0,
      isNew: false,
      isSale: false
    };
  }

  getStars(rating: number): number[] {
    return Array(5).fill(0).map((_, index) => {
      const value = index + 1;
      if (value <= Math.floor(rating)) return 2; // full star
      if (value - rating <= 0.5) return 1; // half star
      return 0; // empty star
    });
  }
}
