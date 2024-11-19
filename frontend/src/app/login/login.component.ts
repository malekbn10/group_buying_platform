import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  currentSignIn = 1;
  isSignUpActive = true;
  registrationForm!: FormGroup;
  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      role: ['', Validators.required],
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  //login inputs
  @ViewChild('email') emailInput!: ElementRef<HTMLInputElement>;
  @ViewChild('password') passwordInput!: ElementRef<HTMLInputElement>;
  //register inputs

  constructor(private authService: AuthService, private router: Router,private snackBar: MatSnackBar,private formBuilder: FormBuilder) {}

  next(event: Event, isSignUp: boolean): void {
    event.preventDefault();
    const currentPage = document.querySelector('.page') as HTMLElement;
    const inputs = currentPage.querySelectorAll('input');

    const isEmpty = Array.from(inputs).some((input: HTMLInputElement) => {
      if (input.value.trim() === '') {
        input.classList.add('empty');
        const errorMessage = document.createElement('span');
        errorMessage.classList.add('error-message');
        errorMessage.innerHTML = 'Ce champ est obligatoire';
        input.parentNode?.appendChild(errorMessage);
        return true;
      }
      return false;
    });
    if (isEmpty) {
      return;
    }
    inputs.forEach((input: HTMLInputElement) => {
      input.classList.remove('empty');
      const errorMessage = input.parentNode?.querySelector('.error-message');
      if (errorMessage) {
        errorMessage.remove();
      }
    });
    if (!isSignUp) {
      if (this.currentSignIn < 5) {
        this.currentSignIn++;
        this.updateBulletStateSignIn(true, !isSignUp);
        console.log(inputs);
      }
    }
  }
  prev(event: Event, isSignUp: boolean): void {
    event.preventDefault();

    if (!isSignUp) {
      if (this.currentSignIn > 1) {
        this.currentSignIn--;
        this.updateBulletStateSignIn(true , !isSignUp);
      }
    }
  }


  toggleSignUp(): void {
    this.isSignUpActive = !this.isSignUpActive;
    console.log('isSignUpActive:', this.isSignUpActive);

    if (this.isSignUpActive) {
      this.currentSignIn = 1;


    } else {

      this.currentSignIn = 1;
      this.updateBulletStateSignIn(true, this.isSignUpActive);
    }
  }
  updateBulletStateSignIn(isNext: boolean, isSignUp: boolean): void {
    const bullets = document.querySelectorAll('.bullet');
    const checks = document.querySelectorAll('.check');
    for (let i = 0; i < bullets.length; i++) {
      const bullet = bullets[i] as HTMLElement;
      const ck = checks[i] as HTMLElement;
      bullet.classList.toggle('active', i < this.currentSignIn - 1);
      ck.classList.toggle('active', i < this.currentSignIn - 1);
    }
  }

  registerUser() {

        if (this.registrationForm.valid) {
          const formValues = this.registrationForm.value;
          this.authService.register( formValues.name,
            formValues.lastName,
            formValues.email,
            formValues.phone,
            formValues.dateOfBirth,
            formValues.role,
            formValues.userName,
            formValues.password)
          .subscribe(
            response => {
              this.router.navigate(['/verification']);
            },
            error => {
              console.error('Register error:', error);
              // Handle error appropriately
            }
          );

        } else {
          console.log('Form is invalid');
        }
  }



  navigateTo(page: string): void {
    this.router.navigate([page]);

  }
  loginUser() {
    this.authService.login(this.emailInput.nativeElement.value, this.passwordInput.nativeElement.value).subscribe(
      response => {
        console.log('Login response:', response);
        if (response && response.isVerified) {
          this.router.navigate(['/home']); 
        }  else  {
          this.router.navigate(['/verification']); // Redirection vers la page de vérification si l'email n'est pas vérifié
        }
      },
      error => {
        console.error('Login error:', error);
        this.snackBar.open('Incorrect email or password', 'Dismiss', {
          duration: 13000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['custom-snackbar']
        });
      }
    );
  }

}
