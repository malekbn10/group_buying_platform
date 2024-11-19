import { Component, OnInit } from '@angular/core';
import { CarteServiceService } from '../Services/carte-service.service';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartproduct: any[] = [];
  userEmail = sessionStorage.getItem("loggedInemail");
  total: any = 0;
  success: boolean = false;
  errorMessage: string = ''; // Add this line

  constructor(private service: CarteServiceService, private router: Router) { }

  ngOnInit(): void {
    this.getCardproduct();
  }

  getCardproduct(): void {
    const userEmail = this.userEmail;

    if (userEmail) {
      const cartKey = `cart_${userEmail}`;
      this.cartproduct = JSON.parse(sessionStorage.getItem(cartKey) || '[]');
    }

    this.getCartTotal();
  }

  getCartTotal(): void {
    this.total = 0;
    for (let x in this.cartproduct) {
      this.total += this.cartproduct[x].item.newPrice * this.cartproduct[x].quantity;
    }
  }

  minamount(index: number): void {
    this.cartproduct[index].quantity--;
    this.updateCart();
  }

  addamount(index: number): void {
    this.cartproduct[index].quantity++;
    this.updateCart();
  }

  detectchange(): void {
    this.getCartTotal();
    this.updateCart();
  }

  deleteproduct(index: number): void {
    this.cartproduct.splice(index, 1);
    this.updateCart();
  }

  cleardata(): void {
    this.cartproduct = [];
    this.updateCart();
  }

  updateCart(): void {
    sessionStorage.setItem(`cart_${this.userEmail}`, JSON.stringify(this.cartproduct));
    this.getCartTotal(); // Update total after changes
  }

  navigateTo(page: string): void {
    this.router.navigate([page]);
  }

  addcart(): void {
    if (this.cartproduct.length === 0) {
      this.errorMessage = 'The cart should have a minimum of 1 product to order.';
      return;
    }

    const product = this.cartproduct.map(item => {
      return { ProductId: item.item.id, quantity: item.quantity };
    });

    const model = {
      userid:sessionStorage.getItem('') ,
      date: new Date(),
      product: product
    };

    this.service.creatnewcart(model).subscribe(res => {
      this.success = true;
      this.router.navigate(['/order']);
    });

    console.log(model);
  }
}
