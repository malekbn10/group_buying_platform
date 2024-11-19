import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/Services/products/products.service';
import { Product } from '../../models/products';

@Component({
  selector: 'app-product-detail',
  templateUrl: './products-details.component.html',
  styleUrls: ['./products-details.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product!: Product;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.getProductDetails();
  }

  getProductDetails(): void {
    const id = this.route.snapshot.paramMap.get('_id');
    this.productService.getProduct(id).subscribe((data: Product) => {
      this.product = data;
    });
  }
}
