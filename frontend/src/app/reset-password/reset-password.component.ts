import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  token: string = '';

  constructor(private route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  resetPassword(newPassword: string, event: Event): void {
    if (!this.token) {
      console.error('Token not found in query params');
      return;
    }


    if (event) {
      event.preventDefault();
    }

    // Call resetPassword function from AuthService
    this.authService.resetPassword(this.token, newPassword).subscribe(
      (response) => {
        console.log('Password reset successful:', response);
        // Optionally, navigate to a success page
      },
      (error) => {
        console.error('Error resetting password:', error);
        // Handle error accordingly
      }
    );
  }
}
