import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, FormArray } from '@angular/forms';
import { CategoriesService } from '../../../services/categories/categories.service';
import { productPriceDiscountValidator } from '../../../validators/product-price-discount/product-price-discount.validator';

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
  currentImageIndex: number = 0;

  sizeOptions = [
    { id: 1, name: 'Pequeño' },
    { id: 2, name: 'Mediano' },
    { id: 3, name: 'Grande' },
    { id: 4, name: 'XL' },
    { id: 5, name: 'XXL' }
  ];

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
      if (this.productId > 0)
        this.getProduct(this.productId);
    });
    
    this.loadCategories();
  }

  get sizes(): FormArray {
    return this.form.get('sizes') as FormArray;
  }

  createForm(data: any = null) {
    this.form = this.formBuilder.group({
      name: [data?.name || '', [ Validators.required, Validators.minLength(3), Validators.maxLength(100) ]],
      categoryId: [data?.categoryId || '', [ Validators.required, Validators.minLength(1) ]],
      sizes: this.formBuilder.array([]),
      description: [data?.description || '', [ Validators.required, Validators.minLength(10), Validators.maxLength(500) ]],
      observations: [data?.observations || '', [ Validators.maxLength(500) ]],
      hasImage: [data?.hasImage || false, [ Validators.requiredTrue ]]
    });
    
    if (data?.sizes?.length)
      data.sizes.forEach((size: any) => this.addSize(size));
    else
      this.addSize();
  }

  addSize(size: any = null) {
    this.sizes.push(this.formBuilder.group({
      sizeId: [size?.sizeId || '', [Validators.required]],
      sku: [size?.sku || '', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]],
      stock: [size?.stock ?? '', [Validators.required, Validators.min(1)]],
      price: [size?.price ?? '', [Validators.required, Validators.min(1)]],
      discountPrice: [size?.discountPrice ?? '', [Validators.min(0)]],
      activated: [size?.activated ?? true]
    }, { validators: productPriceDiscountValidator() }));
  }

  removeSize(index: number) {
    this.sizes.removeAt(index);
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
    if (!this.productImages.length)
      event.dataTransfer!.dropEffect = 'copy';
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
    if (files?.length)
      this.processFiles(files);
  }

  onImagesSelected(event: any): void {
    const files = event.target.files;
    if (files)
      this.processFiles(files);
  }

  private updateHasImageControl(): void {
    this.form.get('hasImage')?.setValue(this.productImages.length > 0);
    this.form.get('hasImage')?.markAsTouched();
  }

  private processFiles(files: FileList): void {
    if (this.productImages.length + files.length > 10) {
      this.imageError = 'Solo puedes subir hasta 10 imágenes.';
      this.updateHasImageControl();
      return;
    }

    Array.from(files).forEach((file: File) => {
      if (this.productImages.length >= 10) return;

      if (file.size > 2 * 1024 * 1024) {
        this.imageError = 'La imagen no debe superar 2 MB';
        this.updateHasImageControl();
        return;
      }

      if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type)) {
        this.imageError = 'Formato no permitido. Use PNG, JPEG, JPG o WEBP';
        this.updateHasImageControl();
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        this.productImages.push({
          file: file,
          preview: e.target?.result as string
        });
        this.imageError = '';
        this.updateHasImageControl();
      };

      reader.readAsDataURL(file);
    });

    setTimeout(() => this.updateHasImageControl(), 0);
  }

  setCurrentImage(index: number): void {
    this.currentImageIndex = index;
  }

  nextImage(): void {
    if (this.productImages.length > 0)
      this.currentImageIndex = (this.currentImageIndex + 1) % this.productImages.length;
  }

  prevImage(): void {
    if (this.productImages.length > 0)
      this.currentImageIndex = (this.currentImageIndex - 1 + this.productImages.length) % this.productImages.length;
  }

  removeImage(index: number): void {
    this.productImages.splice(index, 1);

    if (this.currentImageIndex >= this.productImages.length)
      this.currentImageIndex = Math.max(0, this.productImages.length - 1);
    
    this.updateHasImageControl();
  }

  goToImage(index: number): void {
    if (index >= 0 && index < this.productImages.length)
      this.currentImageIndex = index;
  }

  getErrorMessage(controlName: string, group?: FormGroup): string {
    const control = group ? group.get(controlName) : this.form.get(controlName);
    if (!control?.errors || !control.touched) return '';
    const errors = control.errors;
    if (errors['required']) return 'Este campo es requerido';
    if (errors['minlength']) return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    if (errors['maxlength']) return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
    if (errors['pattern']) return 'Formato inválido';
    if (errors['min']) return `El valor debe ser mayor o igual a ${errors['min'].min}`;
    if (group && group.errors?.['discountGreaterOrEqual']) return 'El precio debe ser mayor al precio con descuento';
    return 'Error de validación';
  }

  onSubmit() {
    // Implementa la lógica para guardar el producto
  }
}
