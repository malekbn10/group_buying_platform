import { ProductDetailComponent } from './components/products-details/products-details.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsComponent } from './components/product/products.component';
import { AllProductsComponent } from './components/all-products/all-products.component';


@NgModule({
    declarations: [
      ProductsComponent,
      AllProductsComponent,
      ProductDetailComponent
    ],
    imports: [
        CommonModule,
        FormsModule
    ],
    exports: [
      ProductsComponent,
      AllProductsComponent,
      ProductDetailComponent
    ]
})
export class ProductsModule { }
