import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';

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
    NgClass,
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

  isSubmitting: boolean = false;

  private readonly accentMap: AccentMap = {
    'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ñ': 'n', 'ü': 'u'
  };

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.autogenerateSlug();
    
    this.route.params.subscribe(params => {
      this.categoryId = +params['id'];
      if (this.categoryId !== 0) {
        this.loadCategory();
      }
    });
  }

  createForm(data: any = null) {
    this.form = this.formBuilder.group({
      name: [ data?.name || '', [ Validators.required, Validators.minLength(3), Validators.maxLength(100) ] ],
      slug: [ data?.slug || '', [ Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern('^[a-z0-9]+(?:-[a-z0-9]+)*$') ] ],
      description: [ data?.description ||'', [ Validators.required, Validators.minLength(3), Validators.maxLength(500) ] ],
    });
  }

  autogenerateSlug(): void {
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


  loadCategory(): void {
    // TODO: Implementar carga de categoría para edición
  }

  onImageSelected(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) { // 1MB limit
        // TODO: Mostrar mensaje de error
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.categoryImage = {
          file: file,
          preview: e.target?.result as string
        };
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.categoryImage = undefined;
  }

  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (!control?.errors || !control.touched) return '';

    const errors = control.errors;

    if (errors['required']) 
      return 'Este campo es requerido';

    if (errors['minlength']) 
      return `Mínimo ${errors['minlength'].requiredLength} caracteres`;

    if (errors['maxlength'])
      return `Máximo ${errors['maxlength'].requiredLength} caracteres`;

    if (errors['pattern']) {
      if (controlName === 'slug') return 'Solo letras minúsculas, números y guiones';
        return 'Formato inválido';
    }
    
    return 'Error de validación';
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
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
