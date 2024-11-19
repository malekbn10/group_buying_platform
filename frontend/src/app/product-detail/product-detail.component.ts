import { Component, OnInit } from '@angular/core';
import { Product } from '../products/models/products';
import { ProductService } from '../Services/products/products.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product:any = {};
  addbutton:boolean =false;
  amount:number = 0;
  products: Product[] = [];
  isLoggedIn: boolean = false;
  constructor(private route: ActivatedRoute, private productService: ProductService,private authService: AuthService) { }

  ngOnInit(): void {
    // Retrieve product ID from route parameters
    this.route.params.subscribe(params => {
      const productId = params['id'];
      if (productId) {
        this.getProductById(productId);
        console.log(productId);
      }
    });
    this.authService.loggedInUsername.subscribe(username => {
      this.isLoggedIn = !!username; // Convert username to boolean (true if username exists)
    });

    console.log('Products Array:', this.products);
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
      // Implement proper error handling based on your application's requirements
    }
  }
  getProductById(productId: string): void {
    this.productService.getProduct(productId).subscribe(
      (data: Product) => {
        this.product = data;
        this.products.push(data);
        console.log('Product:', this.product);
      },
      (error) => {
        console.error('Error fetching product:', error);
      }
    );
  }
}
