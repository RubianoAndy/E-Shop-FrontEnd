import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, FormsModule } from '@angular/forms';

interface CategoryImage {
  file: File;
  preview: string;
}

interface Category {
  id?: number;
  name: string;
  slug: string;
  description?: string;
  image?: CategoryImage;
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
  
  form: FormGroup;
  isSubmitting = false;
  imageError = '';

  private readonly accentMap: AccentMap = {
    'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ñ': 'n', 'ü': 'u'
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      slug: ['', [Validators.required, Validators.pattern('^[a-z0-9]+(?:-[a-z0-9]+)*$')]],
      description: [''],
      hasImage: [false, [Validators.requiredTrue]]
    });

    // Auto-generate slug from name
    this.form.get('name')?.valueChanges.subscribe(name => {
      if (name) {
        const slug = name.toLowerCase()
          .replace(/[áéíóúñü]/g, (char: string) => this.accentMap[char] || char)
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        this.form.patchValue({ slug }, { emitEvent: false });
      }
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.categoryId = +params['id'];
      if (this.categoryId !== 0) {
        this.loadCategory();
      }
    });
  }

  loadCategory(): void {
    // TODO: Implementar carga de categoría para edición
  }

  onImageSelected(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit
        this.imageError = 'La imagen no debe superar 1MB';
        return;
      }

      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        this.imageError = 'Formato no permitido. Use PNG, JPEG o WEBP';
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
    if (errors['pattern']) {
      if (controlName === 'slug') return 'Solo letras minúsculas, números y guiones';
      return 'Formato inválido';
    }
    if (errors['requiredTrue'] && controlName === 'hasImage') return 'La imagen es requerida';
    return 'Error de validación';
  }

  async onSubmit(): Promise<void> {
    if (!this.categoryImage) {
      this.imageError = 'Debe seleccionar una imagen';
      return;
    }

    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control?.invalid)
          control.markAsTouched();
        
      });
      return;
    }

    this.isSubmitting = true;
    try {
      const formData = this.form.value;
      const category: Category = {
        ...formData,
        image: this.categoryImage
      };

      if (this.categoryId === 0) {
        // TODO: Crear nueva categoría
      } else {
        // TODO: Actualizar categoría existente
      }

      await this.router.navigate(['/account/categories']);
    } catch (error) {
      console.error('Error al guardar la categoría:', error);
      // TODO: Mostrar mensaje de error
    } finally {
      this.isSubmitting = false;
    }
  }
}
