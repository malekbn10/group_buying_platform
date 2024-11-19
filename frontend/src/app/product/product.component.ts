import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../Services/products/products.service';
import { Product } from './../products/models/products';
import { AuthService } from '../Services/auth.service';
import { Category } from '../products/models/category';
import { CategoryService } from '../Services/category/category.service';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  filteredProducts: Product[] = [];
  isLoggedIn: boolean = false;
  addbutton:boolean = false;
  amount: number = 0;
  minPrice: number = 5;
  maxPrice: number = 1000;
  isLoading: boolean = false;


  constructor(
    private router: Router,
    private productService: ProductService,
    private authService: AuthService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
    this.applyPriceFilter();
    this.authService.loggedInUsername.subscribe(username => {
      this.isLoggedIn = !!username; // Convert username to boolean (true if username exists)
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(
      (data: Category[]) => {
        this.categories = data;
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }
  applyPriceFilter(): void {
    // Filter products based on price range
    this.productService.getAllProducts().subscribe(
      (data: Product[]) => {
        this.filteredProducts = data.filter(product => {
          return product.newPrice >= this.minPrice && product.newPrice <= this.maxPrice;
        });
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }
  loadProducts(): void {

    this.productService.getAllProducts().subscribe(
      (data: Product[]) => {
        this.products = data;
        this.filteredProducts = [...this.products];
      },
      (error) => {
        console.error('Error fetching products:', error);

      },
      () => {
      }
    );
  }

  filterByCategory(categoryId: string): void {
    console.log('categoryId:', categoryId);
    if (categoryId === 'all') {
      this.filteredProducts = [...this.products]; // Show all products
    } else {
      this.filteredProducts = this.products.filter(product => {
        console.log('product:', product);
        return product.category && product.category._id === categoryId;
      });
    }
  }


  onSearch(searchTerm: string): void {
    if (!searchTerm) {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }

  navigateTo(page: string): void {
    this.router.navigate([page]);
  }

  toggleQuantityInput(): void {
    if (this.isLoggedIn) {
      this.addbutton = true;
    }
  }

  add(productId: string): void {
    if (this.amount > 0) {
      const productToAdd = this.products.find((product) => product._id === productId);
      console.log(productToAdd);
      if (productToAdd) {
        const userEmail = sessionStorage.getItem("loggedInemail");
        if (userEmail !== null) {
          console.log('ProductToAdd:', productToAdd);
          this.addToCart(userEmail, { item: productToAdd, quantity: this.amount });
        } else {
          console.error('User email is null. Unable to add to cart.');
        }
      } else {
        console.error('Product not found.');
      }
      this.amount = 0;
    } else {
      console.error('Invalid quantity.');
    }
  }

  addToCart(userEmail: string, cartItem: any): void {
    const cartKey = `cart_${userEmail}`;
    let cartItems: any[] = [];

    try {
      const storedCart = sessionStorage.getItem(cartKey);
      if (storedCart) {
        cartItems = JSON.parse(storedCart);
      }

      const existingProduct = cartItems.find((item) => item._id === cartItem.item._id);
      if (existingProduct) {
        console.log('Product already exists in cart:', existingProduct);
      } else {
        cartItems.push(cartItem);
        sessionStorage.setItem(cartKey, JSON.stringify(cartItems));
        console.log('Product added to cart:', cartItem);
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  }
}
