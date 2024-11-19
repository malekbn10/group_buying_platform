import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from 'src/app/products/models/category';
import { Product } from 'src/app/products/models/products';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor( private http: HttpClient) { }
  private baseUrl = 'http://localhost:3000/api/v1';
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`);
  }

  getProductsByCategory(categoryId: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products?categories=${categoryId}`);
  }
}
