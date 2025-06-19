import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CategoriesService } from '../../../services/categories/categories.service';

interface ProductImage {
  file: File;
  preview: string;
}

interface Product {
  id?: number;
  name: string;
  sku: string;
  categoryId: number;
  stock: number;
  price: number;
  description: string;
  observations?: string;
  images?: string[];
}

@Component({
  selector: 'app-product',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export default class ProductComponent implements OnInit {
  productId: number = 0;
  productImages: ProductImage[] = [];
  form!: FormGroup;
  isSubmitting = false;
  imageError = '';
  isDragging = false;
  categories: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private categoriesService: CategoriesService,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.route.params.subscribe(params => {
      this.productId = +params['id'];
      if (this.productId > 0) {
        this.getProduct(this.productId);
      }
    });
    this.loadCategories();
  }

  createForm(data: any = null) {
    this.form = this.formBuilder.group({
      name: [data?.name || '', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      sku: [data?.sku || '', [Validators.required, Validators.maxLength(30)]],
      categoryId: [data?.categoryId || '', [Validators.required]],
      stock: [data?.stock || 0, [Validators.required, Validators.min(0)]],
      price: [data?.price || 0, [Validators.required, Validators.min(0)]],
      discountPrice: [data?.discountPrice || 0, [Validators.min(0)]],
      description: [data?.description || '', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      observations: [data?.observations || '', [Validators.maxLength(500)]],
      hasImage: [data?.hasImage || false, [Validators.requiredTrue]]
    });
  }

  getProduct(productId: number): void {
    // Implementa la lógica para obtener el producto y setear el formulario y las imágenes
  }

  loadCategories(): void {
    this.categoriesService.getCategoriesSmall().subscribe({
      next: (categories) => {
        this.categories = categories;
        if (this.productId > 0) {
          const productCategory = this.categories.find(c => c.id === this.form.get('categoryId')?.value);
          if (productCategory)
            this.form.patchValue({ categoryId: productCategory.id });
        }
      },
      error: (error) => {
        console.error('Error al cargar las categorías', error);
      }
    });
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
    if (!this.productImages.length) {
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
    const files = event.dataTransfer?.files;
    if (files?.length) {
      this.processFiles(files);
    }
  }

  onImagesSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      this.processFiles(files);
    }
  }

  private processFiles(files: FileList): void {
    Array.from(files).forEach((file: File) => {
      if (file.size > 2 * 1024 * 1024) {
        this.imageError = 'La imagen no debe superar 2 MB';
        return;
      }
      if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type)) {
        this.imageError = 'Formato no permitido. Use PNG, JPEG, JPG o WEBP';
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        this.productImages.push({
          file: file,
          preview: e.target?.result as string
        });
        this.imageError = '';
      };
      reader.readAsDataURL(file);
    });
  }

  removeImage(index: number): void {
    this.productImages.splice(index, 1);
  }

  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (!control?.errors || !control.touched) return '';
    const errors = control.errors;
    if (errors['required']) return 'Este campo es requerido';
    if (errors['minlength']) return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    if (errors['maxlength']) return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
    if (errors['pattern']) return 'Formato inválido';
    if (errors['min']) return `El valor debe ser mayor o igual a ${errors['min'].min}`;
    return 'Error de validación';
  }

  onSubmit() {
    // Implementa la lógica para guardar el producto
  }
}
