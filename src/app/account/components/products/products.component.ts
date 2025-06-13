import { Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { SubjectFilter } from '../../interfaces/subject-filter/subject-filter';
import { AlertService } from '../../../shared/services/alert/alert.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products',
  imports: [
    RouterLink,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export default class ProductsComponent implements OnInit {
  tableFileds: string[] = [
    'Id', 
    'Producto', 
    'Fecha de creación', 
    'Fecha de actualización', 
    'Acciones'
  ];

  ProductsRecords: any[] = [];

  page: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  totalRecords: number = 0;
  
  filters: any[] = [];
  productNameSubject = new Subject<Event>();
  productIdSubject = new Subject<Event>();
  subjectsFilters: SubjectFilter[] = [];

  startRecord: number = 0;
  endRecord: number = 0;

  maxPageNumbers: number = 5;
  startPage: number = 0;
  endPage: number = 0;

  isDeleteModalOpen: boolean = false;
  isProductModalOpen: boolean = false;

  productId: number | null = null;

  productSelected = null;

  constructor (
    private alertService: AlertService,
  ) {
    this.subjectsFilters = [
      { subject: this.productNameSubject, field: 'name' },
      { subject: this.productIdSubject, field: 'id' },
    ];
  }

  ngOnInit(): void {
    // this.getProducts();
  
    this.debounceFilter();
  }

  debounceFilter() {
    this.subjectsFilters.forEach(({ subject, field }) => 
      subject.pipe(
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe((value: any) => this.updateFilters(field, value))
    );
  }

  updateFilters(fieldName: string, event: Event) {
    const target = event.target as HTMLInputElement; // Asegura que el target es un HTMLInputElement
    const value = target.value;

    if (!value)
      this.filters = this.filters.filter(filter => filter.field !== fieldName);
    else {
      const index = this.filters.findIndex(filter => filter.field === fieldName);
      
      if (index > -1)
        this.filters[index].value = value;
      else
        this.filters.push({ field: fieldName, value });
    }

    // this.getProducts();
  }

  getProducts () {
    /* this.productsService.getProducts(this.page, this.pageSize, this.filters).subscribe({
      next: (response) => {
        this.ProductsRecords = response.products;
        this.page = response.page;
        this.pageSize = response.pageSize;
        this.totalPages = response.totalPages;
        this.totalRecords = response.totalProducts;

        this.startRecord = (this.page - 1) * this.pageSize + 1;
        this.endRecord = Math.min(this.page * this.pageSize, this.totalRecords);

        this.calculatePageRange();
      },
      error: () => {
      }
    }); */
  }

  changePage(pageNumber: number) {
    if (pageNumber > 0 && pageNumber <= this.totalPages) {
      this.page = pageNumber;
      // this.getProducts();
    }
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
      // this.getProducts();
    }
  }
  
  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      // this.getProducts();
    }
  }

  calculatePageRange() {
    if (this.totalPages <= this.maxPageNumbers) {
      this.startPage = 1;
      this.endPage = this.totalPages;
    } else {
      let half = Math.floor(this.maxPageNumbers / 2);
      
      if (this.page <= half) {
        this.startPage = 1;
        this.endPage = this.maxPageNumbers;
      } else if (this.page + half >= this.totalPages) {
        this.startPage = this.totalPages - this.maxPageNumbers + 1;
        this.endPage = this.totalPages;
      } else {
        this.startPage = this.page - half;
        this.endPage = this.page + half;
      }
    }
  }

  openProductInformation(productId: string) {
    this.productId = Number(productId);
    this.isProductModalOpen = true;
  }

  closeProductInformation() {
    this.productId = null;
    this.isProductModalOpen = false;
    // this.getProducts();
  }

  onProduct() {
    this.closeProductInformation();
  }

  openDeleteProduct(productId: any) {
    this.productSelected = productId;
    this.isDeleteModalOpen = true;
  }

  closeDeleteProduct() {
    this.productSelected = null;
    this.isDeleteModalOpen = false;
  }

  deleteProduct() {
    var alertBody = null;

    /* this.productsService.delete(this.productSelected).subscribe({
      next: (response: any) => {
        alertBody = {
          type: 'okay',
          title: '¡Listo!',
          message: response.message,
        };

        this.closeDeleteProduct();
        // this.getProducts();

        this.alertService.showAlert(alertBody);
      },
      error: (response) => {
        alertBody = {
          type: 'error',
          title: '¡Error!',
          message: response.message,
        };

        this.alertService.showAlert(alertBody);
      }
    }); */

    // this.getProducts();
  }

  exportProducts() {
    var alertBody = null;

    /* this.productsService.export().subscribe({
      next: (response) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Informe de categorías.xlsx';
        a.click();
        window.URL.revokeObjectURL(url); // Libera memoria

        alertBody = {
          type: 'okay',
          title: '¡Felicidades!',
          message: 'Informe generado con éxito',
        };

        this.alertService.showAlert(alertBody);
      },
      error: (response) => {
        alertBody = {
          type: 'error',
          title: '¡Error!',
          message: response.message,
        };

        this.alertService.showAlert(alertBody);
      }
    }); */
  }
}
