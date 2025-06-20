import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AlertService } from '../../../../shared/services/alert/alert.service';
import { CategoriesService } from '../../../services/categories/categories.service';

interface CategoryImage {
  file: File;
  preview: string;
}

interface Category {
  id?: number;
  name: string;
  url: string;
  description: string;
  observations?: string;
  image?: string;
  imageUrl?: string;
}

type AccentMap = {
  [key: string]: string;
};

@Component({
  selector: 'app-category',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export default class CategoryComponent implements OnInit {
  categoryId: number = 0;
  categoryImage?: CategoryImage;

  form!: FormGroup;
  edit: any;

  isSubmitting = false;
  imageError = '';

  isDragging = false;

  private readonly accentMap: AccentMap = {
    'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ñ': 'n', 'ü': 'u'
  };

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private categoriesService: CategoriesService,
  ) { }

  ngOnInit(): void {
    this.createForm();

    this.route.params.subscribe(params => {
      this.categoryId = +params['id'];
      if (this.categoryId > 0)
        this.getCategory(this.categoryId);
    });
  }

  createForm(data: any = null) {
    this.form = this.formBuilder.group({
      name: [data?.name || '', [ Validators.required, Validators.minLength(3), Validators.maxLength(50) ]],
      url: [data?.url || '', [ Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern('^[a-z0-9]+(?:-[a-z0-9]+)*$') ]],
      description: [data?.description || '', [ Validators.required, Validators.minLength(10), Validators.maxLength(500) ]],
      observations: [data?.observations || '', [ Validators.minLength(10), Validators.maxLength(500) ]],
      hasImage: [data?.hasImage || false, [ Validators.requiredTrue ]]
    });

    this.form.get('name')?.valueChanges.subscribe(name => {
      if (name) {
        const url = name.toLowerCase()
          .replace(/[áéíóúñü]/g, (char: string) => this.accentMap[char] || char)
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        this.form.patchValue({ url }, { emitEvent: false });
      }
    });
  }

  getCategory(categoryId: number): void {
    this.categoriesService.get(categoryId).subscribe({
      next: (response) => {
        const category = response.category;

        this.edit = {
          ...category,
          hasImage: !!category.image
        };
        
        this.createForm(this.edit);

        if (category.image) {
          this.categoriesService.getCategoryImage(categoryId).subscribe({
            next: (blob) => {
              const avatarUrl = URL.createObjectURL(blob);
              this.categoryImage = {
                file: new File([blob], category.image, { type: blob.type }),
                preview: avatarUrl
              };
            },
            error: () => {
              this.categoryImage = undefined;
            }
          });
        } else {
          this.categoryImage = undefined;
        }
      },
      error: (error) => {
        this.alertService.showAlert({
          type: 'error',
          title: '¡Error!',
          message: error.error.message || 'Error al cargar la categoría'
        });
      }
    });
  }

  /* onDragEnter(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.categoryImage)
      this.isDragging = true;
  } */

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
    if (!this.categoryImage) {
      event.dataTransfer!.dropEffect = 'copy';
    }
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    
    if (this.categoryImage) return;

    const files = event.dataTransfer?.files;
    if (files?.length) {
      this.processFile(files[0]);
    }
  }

  onImageSelected(event: any): void {
    const file = event.target.files?.[0];
    if (file)
      this.processFile(file);
  }

  private processFile(file: File): void {
    if (file.size > 2 * 1024 * 1024) { // 2 MB limit
      this.imageError = 'La imagen no debe superar 2 MB';
      return;
    }

    if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type)) {
      this.imageError = 'Formato no permitido. Use PNG, JPEG, JPG o WEBP';
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      this.categoryImage = {
        file: file,
        preview: e.target?.result as string
      };
      this.form.patchValue({ hasImage: true });
      this.imageError = '';
    };
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.categoryImage = undefined;
    this.form.patchValue({ hasImage: false });
  }

  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (!control?.errors || !control.touched) return '';

    const errors = control.errors;
    if (errors['required']) return 'Este campo es requerido';
    if (errors['minlength']) return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    if (errors['maxlength']) return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
    if (errors['pattern']) {
      if (controlName === 'url') return 'Solo letras minúsculas, números y guiones';
      return 'Formato inválido';
    }
    return 'Error de validación';
  }

  onSubmit() {
    var body = this.form.value;

    if (this.form.valid && body && this.categoryImage!.file) {
      if (this.categoryId > 0)
        this.editCategory(body);
      else
        this.createCategory(body);
    }
  }

  createCategory(body: Category): void {
    this.isSubmitting = true;
    var alertBody = null;
    
    this.categoriesService.add(body, this.categoryImage!.file).subscribe({
      next: (response) => {
        alertBody = {
          type: 'okay',
          title: '¡Felicidades!',
          message: response.message,
        };
        this.alertService.showAlert(alertBody);
        this.router.navigate(['/account/categories']);
      }, 
      error: (response) => {
        alertBody = {
          type: 'error',
          title: '¡Error!',
          message: response.error.message,
        };
        this.alertService.showAlert(alertBody);
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  editCategory(body: Category): void {
    this.isSubmitting = true;
    var alertBody = null;

    this.categoriesService.edit(this.categoryId, body, this.categoryImage?.file).subscribe({
      next: (response) => {
        alertBody = {
          type: 'okay',
          title: '¡Felicidades!',
          message: response.message,
        };
        this.alertService.showAlert(alertBody);
        this.router.navigate(['/account/categories']);
      },
      error: (response) => {
        alertBody = {
          type: 'error',
          title: '¡Error!',
          message: response.error.message,
        };
        this.alertService.showAlert(alertBody);
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}
