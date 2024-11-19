import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { Product } from '../../models/products';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit{
  @Input() product: any={};
  @Output() item=new EventEmitter();
addbutton:boolean =false;
amount:number = 0;
activeLink: string = '';

  constructor(private router: Router,private el: ElementRef, private renderer: Renderer2) { }
  ngOnInit() {
    console.log('Product image:', this.product.image);
    // Set background image dynamically
    if (this.product && this.product.image) {
      // Add class to indicate that there's an image
      this.renderer.addClass(this.el.nativeElement, 'has-image');
    }
  }
  add(){
    this.item.emit({item :this.product , quantity:this.amount})
   }
  addToCart(productId: string): void {
    // Implement add to cart functionality here
    console.log('Product added to cart:', productId);
  }

  navigateTo(page: string): void {
    this.router.navigate([page]);

  }


}
