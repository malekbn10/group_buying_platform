import { Component, OnInit } from '@angular/core';
import { Product } from '../products/models/products';
import { ProductService } from '../Services/products/products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
 product:Product[]=[];

 ngOnInit(): void {
  this. getAllFeaturedProducts();
}
  constructor(private productService: ProductService,private router: Router) { }

  getAllFeaturedProducts(): void {
    this.productService.getAllFeaturedProducts().subscribe(
      (response: Product[]) => {
        this.product = response;
        console.log('Featured Products:', this.product);
      },
      (error) => {
        console.error('Error fetching featured products:', error);
      }
    );
  }

  navigateTo(page: string): void {
    this.router.navigate([page]);

  }
}
