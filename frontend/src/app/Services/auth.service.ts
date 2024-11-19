import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/v1'; // Replace this with your backend API URL

  private loggedinemail="";
  private tokenKey = 'auth_token';
  private loggedInUsernameSubject = new BehaviorSubject<string | null>(null);
  loggedInUsername = this.loggedInUsernameSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loggedInUsernameSubject = new BehaviorSubject<string | null>(null);
    this.loggedInUsername = this.loggedInUsernameSubject.asObservable();

    // Check for existing token and username on initialization
    const storedToken = sessionStorage.getItem(this.tokenKey);
    const storedUsername = sessionStorage.getItem('loggedInUsername');
    if (storedToken) {
      this.loggedInUsernameSubject.next(storedUsername);
    }
  }
  sendResetPasswordEmail(email: string): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/v1/users/forgot-password', { email });
  }
  resetPassword(token: string, newPassword: string): Observable<any> {
    const resetUrl = `${this.apiUrl}/users/reset-password?token=`+ token;
    const requestBody = { newPassword };

    return this.http.post(resetUrl, requestBody);
  }
  login(email: any, password: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/login`, { email, password })
      .pipe(
        tap(response => {
          console.log('Login response:', response);
          this.loggedInUsernameSubject.next(response.userName);
          sessionStorage.setItem(this.tokenKey, response.token);
          sessionStorage.setItem('loggedInUsername', response.userName);
          sessionStorage.setItem('user_id', response.user_id);
          sessionStorage.setItem('role', response.role);
          sessionStorage.setItem('loggedInemail', email);
          this.loggedinemail=response.email;
          // Add this line
          this.clearCart(email);
        }),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(error);
        })
      );
  }

  getLoggedInUsernameFromStorage(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  register(name: any,lastName:any,email:any,phone:any,dateofbirth:any,role:any,userName:any,password:any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/register`, {name,lastName,userName,email,password,phone,dateofbirth,role}).pipe(
      tap(response => console.log('Register response:', response)),
      catchError(error => {
        console.error('Register error:', error);
        return throwError(error);
      })
    );
  }

  getToken(): string | null {

    return sessionStorage.getItem(this.tokenKey);
  }

  logout(): void {
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem('loggedInUsername');
    sessionStorage.removeItem('loggedInemail');
    sessionStorage.removeItem('id_user');
    this.loggedInUsernameSubject.next(null);
  }


  addToCart(userEmail: string, product: any): void {
    const cartKey = `cart_${userEmail}`;
    let cartItems: any[] = [];
    const storedCart = sessionStorage.getItem(cartKey);

    if (storedCart) {
      cartItems = JSON.parse(storedCart);
    }

    const existingProduct = cartItems.find((item) => item._id === product._id);
    if (existingProduct) {
      console.log('Product already exists in cart.');
    } else {
      cartItems.push(product);
      sessionStorage.setItem(cartKey, JSON.stringify(cartItems));
      console.log('Product added to cart:', product);
    }
  }

  getCart(userEmail: string): any[] {
    const cartKey = `cart_${userEmail}`;
    const cart = sessionStorage.getItem(cartKey);

    return cart ? JSON.parse(cart) : [];
  }

  clearCart(userEmail: string): void {
    const cartKey = `cart_${userEmail}`;
    sessionStorage.removeItem(cartKey);
  }

}
