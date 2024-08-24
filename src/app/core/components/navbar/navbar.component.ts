import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';
import { User } from '../../../features/auth/models/user.model';
import { Subscription } from 'rxjs';

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
  isMediumScreen = false;
  searchExpanded = false;
  private userSubscription?: Subscription;

  @ViewChild('searchInput') searchInput!: ElementRef;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.user().subscribe({
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
    this.isMediumScreen = width < 992;
  }

  toggleSearchBar() {
    if (this.searchExpanded == false) {
      this.searchExpanded = true;
    } else {
      this.searchExpanded = false;
    }
  }

  collapseSearch() {
    this.searchExpanded = false;
    this.searchInput.nativeElement.value = '';
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }
}
