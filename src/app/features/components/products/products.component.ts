import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
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
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export default class ProductsComponent {
  favorites: number[] = [];
  showFilters: boolean = false;
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
      image: "/assets/images/products/placeholder.svg",
      rating: 4.5,
      reviews: 128,
      category: "Electronics",
      isSale: true,
    },
    {
      id: 2,
      name: "Premium Cotton T-Shirt",
      price: 29.99,
      image: "/assets/images/products/placeholder.svg",
      rating: 4.8,
      reviews: 89,
      category: "Clothing",
      isNew: true,
      isSale: true,
    },
    {
      id: 3,
      name: "Premium Cotton T-Shirt",
      price: 29.99,
      image: "/assets/images/products/placeholder.svg",
      rating: 4.8,
      reviews: 89,
      category: "Clothing",
      isNew: true,
    },
    {
      id: 4,
      name: "Premium Cotton T-Shirt",
      price: 29.99,
      image: "/assets/images/products/placeholder.svg",
      rating: 4.8,
      reviews: 89,
      category: "Clothing",
      isNew: true,
    },
    {
      id: 5,
      name: "Premium Cotton T-Shirt",
      price: 29.99,
      image: "/assets/images/products/placeholder.svg",
      rating: 4.8,
      reviews: 89,
      category: "Clothing",
      isNew: true,
    },
    {
      id: 6,
      name: "Premium Cotton T-Shirt",
      price: 29.99,
      image: "/assets/images/products/placeholder.svg",
      rating: 4.8,
      reviews: 89,
      category: "Clothing",
      isNew: true,
    },
  ];

  categories = ["Electronics", "Clothing", "Accessories", "Food & Beverage", "Home & Garden", "Sports & Fitness"];
  maxPrice = Math.max(...this.products.map(p => p.originalPrice || p.price));

  get filteredProducts(): Product[] {
    return this.products.filter(product => {
      // Filter by category
      if (this.filters.categories.length > 0 && !this.filters.categories.includes(product.category)) {
        return false;
      }

      // Filter by price range
      const price = product.price;
      if (price < this.filters.priceRange[0] || price > this.filters.priceRange[1]) {
        return false;
      }

      // Filter by rating
      if (product.rating < this.filters.minRating) {
        return false;
      }

      // Filter by new products
      if (this.filters.isNew && !product.isNew) {
        return false;
      }

      // Filter by sale products
      if (this.filters.isSale && !product.isSale) {
        return false;
      }

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

  handleCategoryChange(category: string, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.filters.categories.push(category);
    } else {
      const index = this.filters.categories.indexOf(category);
      if (index !== -1) {
        this.filters.categories.splice(index, 1);
      }
    }
  }

  handlePriceRangeChange(value: [number, number]): void {
    this.filters.priceRange = value;
  }
  handleRatingChange(rating: number, event: Event): void {
    const target = event.target as HTMLInputElement | null;
    if (!target) return;
    this.filters.minRating = target.checked ? rating : 0;
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
