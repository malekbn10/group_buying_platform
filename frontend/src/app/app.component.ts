import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showNavbar: boolean = true;
  loading: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {


    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = event.url;
        this.showNavbar = !(url.includes('login') || url.includes('verification') || url.includes('profile') || url.includes('forgot_pass') || url.includes('reset_pass') || url.includes('order'));
      }
    });
  }
}
