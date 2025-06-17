import { DatePipe, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { SubjectFilter } from '../../interfaces/subject-filter/subject-filter';

import { CategoriesService } from '../../services/categories/categories.service';
import { AlertService } from '../../../shared/services/alert/alert.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-categories',
  imports: [
    RouterLink,
    DatePipe,
    NgClass,
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export default class CategoriesComponent implements OnInit {
  tableFileds: string[] = [
    'Id', 
    'Categoría', 
    'Fecha de creación', 
    'Fecha de actualización', 
    'Acciones'
  ];

  categoryImage: Map<number, string> = new Map();

  categoriesRecords: any[] = [];

  page: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  totalRecords: number = 0;
  
  filters: any[] = [];
  categoryNameSubject = new Subject<Event>();
  categoryIdSubject = new Subject<Event>();
  subjectsFilters: SubjectFilter[] = [];

  startRecord: number = 0;
  endRecord: number = 0;

  maxPageNumbers: number = 5;
  startPage: number = 0;
  endPage: number = 0;

  isDeleteModalOpen: boolean = false;

  categoryId: number | null = null;

  categorySelected = null;

  constructor (
    private categoriesService: CategoriesService,
    private alertService: AlertService,
  ) {
    this.subjectsFilters = [
      { subject: this.categoryNameSubject, field: 'name' },
      { subject: this.categoryIdSubject, field: 'id' },
    ];
  }

  ngOnInit(): void {
    this.getCategories();
  
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

    this.getCategories();
  }

  getCategories () {
    this.categoriesService.getCategories(this.page, this.pageSize, this.filters).subscribe({
      next: (response) => {
        this.categoriesRecords = response.categories;
        this.page = response.page;
        this.pageSize = response.pageSize;
        this.totalPages = response.totalPages;
        this.totalRecords = response.totalCategories;

        this.startRecord = (this.page - 1) * this.pageSize + 1;
        this.endRecord = Math.min(this.page * this.pageSize, this.totalRecords);

        this.calculatePageRange();
      },
      error: () => {
      }
    });
  }

  loadCategoryImage(categoryId: number): string {
    return this.categoryImage.get(categoryId) || 'assets/images/avatar/Avatar.png';
  }

  changePage(pageNumber: number) {
    if (pageNumber > 0 && pageNumber <= this.totalPages) {
      this.page = pageNumber;
      this.getCategories();
    }
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
      this.getCategories();
    }
  }
  
  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.getCategories();
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

  closeCategoryInformation() {
    this.categoryId = null;
    this.getCategories();
  }

  onCategory() {
    this.closeCategoryInformation();
  }

  openDeleteCategory(categoryId: any) {
    this.categorySelected = categoryId;
    this.isDeleteModalOpen = true;
  }

  closeDeleteCategory() {
    this.categorySelected = null;
    this.isDeleteModalOpen = false;
  }

  deleteCategory() {
    var alertBody = null;

    this.categoriesService.delete(this.categorySelected).subscribe({
      next: (response: any) => {
        alertBody = {
          type: 'okay',
          title: '¡Listo!',
          message: response.message,
        };

        this.closeDeleteCategory();
        this.getCategories();

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
    });

    this.getCategories();
  }

  exportCategories() {
    var alertBody = null;

    this.categoriesService.export().subscribe({
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
    });
  }
}