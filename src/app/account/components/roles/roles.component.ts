import { DatePipe, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

import { SubjectFilter } from '../../interfaces/subject-filter/subject-filter';

import { RolesService } from '../../services/roles/roles.service';
import { AlertService } from '../../../shared/services/alert/alert.service';

import { RoleComponent } from './role/role.component';

@Component({
  selector: 'app-roles',
  imports: [
    DatePipe,
    NgClass,
    RoleComponent,
  ],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export default class RolesComponent implements OnInit {
  tableFileds: string[] = ['Id', 'Rol', 'Fecha de creación', 'Fecha de actualización', 'Acciones'];
  rolesRecords: any[] = [];

  page: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  totalRecords: number = 0;
  
  filters: any[] = [];
  roleNameSubject = new Subject<Event>();
  roleIdSubject = new Subject<Event>();
  subjectsFilters: SubjectFilter[] = [];

  startRecord: number = 0;
  endRecord: number = 0;

  maxPageNumbers: number = 5;
  startPage: number = 0;
  endPage: number = 0;

  isDeleteModalOpen: boolean = false;
  isRoleModalOpen: boolean = false;

  roleId: number | null = null;

  roleSelected = null;

  constructor (
    private rolesService: RolesService,
    private alertService: AlertService,
  ) {
    this.subjectsFilters = [
      { subject: this.roleNameSubject, field: 'name' },
      { subject: this.roleIdSubject, field: 'id' },
    ];
  }

  ngOnInit(): void {
    this.getRoles();

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

    this.getRoles();
  }

  getRoles () {
    this.rolesService.getRoles(this.page, this.pageSize, this.filters).subscribe({
      next: (response) => {
        this.rolesRecords = response.roles;
        this.page = response.page;
        this.pageSize = response.pageSize;
        this.totalPages = response.totalPages;
        this.totalRecords = response.totalRoles;

        this.startRecord = (this.page - 1) * this.pageSize + 1;
        this.endRecord = Math.min(this.page * this.pageSize, this.totalRecords);

        this.calculatePageRange();
      },
      error: () => {
      }
    });
  }

  changePage(pageNumber: number) {
    if (pageNumber > 0 && pageNumber <= this.totalPages) {
      this.page = pageNumber;
      this.getRoles();
    }
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
      this.getRoles();
    }
  }
  
  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.getRoles();
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

  openRoleInformation(roleId: string) {
    this.roleId = Number(roleId);
    this.isRoleModalOpen = true;
  }

  closeRoleInformation() {
    this.roleId = null;
    this.isRoleModalOpen = false;
    this.getRoles();
  }

  onRole() {
    this.closeRoleInformation();
  }

  openDeleteRole(roleId: any) {
    this.roleSelected = roleId;
    this.isDeleteModalOpen = true;
  }

  closeDeleteRole() {
    this.roleSelected = null;
    this.isDeleteModalOpen = false;
  }

  deleteRole() {
    var alertBody = null;

    this.rolesService.delete(this.roleSelected).subscribe({
      next: (response: any) => {
        alertBody = {
          type: 'okay',
          title: '¡Listo!',
          message: response.message,
        };

        this.closeDeleteRole();
        this.getRoles();

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

    this.getRoles();
  }

  exportRoles() {
    var alertBody = null;

    this.rolesService.export().subscribe({
      next: (response) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Informe de roles.xlsx';
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