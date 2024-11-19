import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category } from '../products/models/category';
import { CategoryService } from '../Services/category/category.service';
import { ProductService } from '../Services/products/products.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent implements OnInit {
  currentStep = 1;
  image: File | null = null;
  images: File[] = [];
  productForm!: FormGroup;
  categories: Category[] = [];
  user_id = sessionStorage.getItem('user_id');
  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private categoryService:CategoryService
  ) {}

  ngOnInit(): void {

    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      brand: ['', Validators.required],
      image: [null, Validators.required],
      images: [null, Validators.required],
      oldPrice: ['', Validators.required],
      newPrice: ['', Validators.required],
      timing: ['', Validators.required],
      category: ['', Validators.required],
      tot_quantity: ['', Validators.required],

    });
    this.categoryService.getAllCategories().subscribe(
      (categories: Category[]) => {
        this.categories = categories;
      },
      error => {
        console.error('Error fetching categories:', error);
      }
    );
  }
  nextStep() {
    console.log("next clicked")
    if (this.currentStep < 3) {
      this.currentStep++;
    } else {
      this.addNewProduct();
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  handleImageInput(event: any) {
    this.image = event.target.files[0];
  }

  handleImagesInput(event: any) {
    this.images = Array.from(event.target.files);
  }

  submitForm() {
    console.log('Form submitted');
  }

  addNewProduct() {
    const admintoken: string | null = sessionStorage.getItem('auth_token');

    if (this.productForm.valid && admintoken) {
      const formData = new FormData();
      formData.append('name', this.productForm.get('name')?.value);
      formData.append('description', this.productForm.get('description')?.value);
      formData.append('brand', this.productForm.get('brand')?.value);
      formData.append('image', this.image as File);
      formData.append('images', this.images[0] as File);
      formData.append('oldPrice', this.productForm.get('oldPrice')?.value);
      formData.append('newPrice', this.productForm.get('newPrice')?.value);
      formData.append('timing', this.productForm.get('timing')?.value);
      formData.append('category', this.productForm.get('category')?.value);
      formData.append('tot_quantity', this.productForm.get('tot_quantity')?.value);
      formData.append('user', this.user_id as string);
      this.productService.addProduct(formData, admintoken).subscribe(
        response => {
          console.log('Product added successfully:', response);
          this.router.navigate(['/home']);
        },
        error => {
          console.error('Adding error:', error);
          // Handle error appropriately
        }
      );
    } else {
      console.log('Form is invalid or authentication token is missing');
    }
  }

}
