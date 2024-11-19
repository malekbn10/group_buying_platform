import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forogot-pass',
  templateUrl: './forogot-pass.component.html',
  styleUrls: ['./forogot-pass.component.css']
})
export class ForogotPassComponent implements OnInit {
  forgotPasswordForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }


  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.get('email')?.value;

      // Call AuthService method to send reset password email
      this.authService.sendResetPasswordEmail(email).subscribe(
        (response) => {
          console.log('Email sent successfully:', response);
          // Redirect to reset password component
          this.router.navigate(['/reset_pass']);
        },
        (error) => {
          console.error('Error sending email:', error);
        }
      );
    }
  }
}
