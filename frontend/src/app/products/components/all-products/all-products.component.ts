import { ProductService } from 'src/app/Services/products/products.service';
import { Component, OnInit } from '@angular/core';

import { Product } from '../../models/products';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.scss']
})
export class AllProductsComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts(): void {
    this.productService.getAllProducts().subscribe((data: Product[]) => {
      this.products = data;
    });
  }
  addToCart(productId: string): void {
    // Implement add to cart functionality here
    console.log('Product added to cart:', productId);
  }
}
