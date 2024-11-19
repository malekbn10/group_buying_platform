import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @ViewChild('navList') navList!: ElementRef;
  activeLink: string = '';
  loggedInUsername: string | null = null;
  showDropdown: boolean = false;
  displaySection: boolean = false;
  shouldAnimate: boolean = false;
  loggedInRole: string | null = null;
  constructor(private router: Router, private authService: AuthService) {
    this.router.events.subscribe((event) => {
      if (this.router.url === '/home') {
        this.displaySection = true;
      } else {
        this.displaySection = false;
      }
    });
  }
  ngOnInit() {
    this.authService.loggedInUsername.subscribe(username => {
      this.loggedInUsername = username;
    });
    this.loggedInRole = sessionStorage.getItem('role'); 
    this.activeLink = this.router.url.split('/')[1];
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }
  toggleAnimation(): void {
    this.shouldAnimate = !this.shouldAnimate; // Toggle animation state
  }
  logout(): void {

    this.authService.logout();

    this.router.navigate(['/login']);
  }

  navigateTo(page: string): void {
    this.router.navigate([page]);

  }


}
