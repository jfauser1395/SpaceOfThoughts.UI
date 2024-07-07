import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';
import { User } from '../../../features/auth/models/user.model';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  user?: User;
  userName: string = '';
  isSmallScreen = false;


  constructor(
    private authService: AuthService,
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {}

  ngOnInit(): void {
    this.authService.user().subscribe({
      next: (response) => {
        this.user = response;
        if (this.user) {
          this.userName = this.user.email.split('@')[0];
        }
      },
    });

    this.user = this.authService.getUser();
    this.checkScreenSize();
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }

  checkScreenSize() {
    const width = window.innerWidth;
    this.isSmallScreen = width < 576;
  }
}
