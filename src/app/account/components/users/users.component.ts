import { DatePipe, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PersonalInformationComponent } from '../profile/personal-information/personal-information.component';
import { ShippingInformationComponent } from '../profile/shipping-information/shipping-information.component';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { SubjectFilter } from '../../interfaces/subject-filter/subject-filter';
import { UsersService } from '../../services/users/users.service';
import { AlertService } from '../../../shared/services/alert/alert.service';
import { RolesService } from '../../services/roles/roles.service';
import { AvatarService } from '../../services/avatar/avatar.service';

@Component({
  selector: 'app-users',
  imports: [
    FormsModule,
    DatePipe,
    NgClass,
    PersonalInformationComponent,
    ShippingInformationComponent,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export default class UsersComponent implements OnInit {
  avatars: Map<number, string> = new Map();

  roles: any[] = [];

  tableFileds: string[] = ['Nombre', 'Email', 'Rol', 'Estado', 'Fecha de creación', 'Acciones'];
  usersRecords: any[] = [];

  page: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  totalRecords: number = 0;
  
  filters: any[] = [];
  userDniSubject = new Subject<Event>();
  userNameSubject = new Subject<Event>();
  userEmailSubject = new Subject<Event>();
  userStatusSubject = new Subject<Event>();
  roleIdSubject = new Subject<Event>();
  subjectsFilters: SubjectFilter[] = [];

  startRecord: number = 0;
  endRecord: number = 0;

  maxPageNumbers: number = 5;
  startPage: number = 0;
  endPage: number = 0;

  isModalOpen: boolean = false;

  userId: number | null = null;

  activatedOptions = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ]

  constructor (
    private usersService: UsersService,
    private alertService: AlertService,
    private rolesService: RolesService,
    private avatarService: AvatarService,
  ) {
    this.subjectsFilters = [
      { subject: this.userDniSubject, field: 'dni' },
      { subject: this.userNameSubject, field: 'name' },
      { subject: this.userEmailSubject, field: 'email' },
      { subject: this.userStatusSubject, field: 'activated' },
      { subject: this.roleIdSubject, field: 'roleId' },
    ];

    this.getRoles();
  }

  ngOnInit(): void {
    this.debounceFilter();
    this.getUsers();
  }

  debounceFilter() {
    this.subjectsFilters.forEach(({ subject, field }) => 
      subject.pipe(
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe(value => this.updateFilters(field, value))
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

    this.getUsers();
  }

  getUsers() {
    this.usersService.getUsers(this.page, this.pageSize, this.filters).subscribe({
      next: (response) => {
        this.usersRecords = response.users;
        this.page = response.page;
        this.pageSize = response.pageSize;
        this.totalPages = response.totalPages;
        this.totalRecords = response.totalUsers;

        this.startRecord = (this.page - 1) * this.pageSize + 1;
        this.endRecord = Math.min(this.page * this.pageSize, this.totalRecords);

        this.calculatePageRange();
        this.loadAvatars();
      },
      error: () => {
      }
    });
  }

  loadAvatars() {
    this.usersRecords.forEach(user => {
      if (!this.avatars.has(user.id))
        this.getUserAvatar(user.id);
    });
  }

  getUserAvatar(userId: number) {
    this.avatarService.getUserAvatar(userId).subscribe({
      next: (blob) => {
        const avatarUrl = URL.createObjectURL(blob);
        this.avatars.set(userId, avatarUrl);
      },
      error: () => {
        this.avatars.set(userId, 'assets/images/avatar/Avatar.png');
      }
    });
  }

  loadUserAvatar(userId: number): string {
    return this.avatars.get(userId) || 'assets/images/avatar/Avatar.png';
  }

  changePage(pageNumber: number) {
    if (pageNumber > 0 && pageNumber <= this.totalPages) {
      this.page = pageNumber;
      this.getUsers();
    }
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
      this.getUsers();
    }
  }
  
  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.getUsers();
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

  editStatus(user: any) {
    var alertBody = null;

    var body = {
      userId: user.id,
      activated: user.activated,
    };

    this.usersService.editStatus(body).subscribe({
      next: (response) => {
        alertBody = {
          type: 'okay',
          title: '¡Felicidades!',
          message: response.message,
        };

        this.getUsers();

        this.alertService.showAlert(alertBody);
      },
      error: (response) => {
        alertBody = {
          type: 'error',
          title: '¡Error!',
          message: response.message,
        };

        this.getUsers();

        this.alertService.showAlert(alertBody);
      }
    });
  }

  async getRoles() {
    var alertBody = null;

    await this.rolesService.getRolesSmall().subscribe({
      next: (response) => {
        this.roles = response;
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

  openUserInformation(userId: string) {
    this.userId = Number(userId);
    this.isModalOpen = true;
  }

  closeUserInformation() {
    this.userId = null;
    this.isModalOpen = false;
    this.getUsers();
  }

  onUserCreated() {
    this.closeUserInformation();
  }

  exportUsers() {
    var alertBody = null;

    this.usersService.export().subscribe({
      next: (response) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Informe de usuarios.xlsx';
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