import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';
import { User } from '../../../features/auth/models/user.model';
import { PublicBlogSummeryComponent } from '../../../features/public-data/public-blog-summery/public-blog-summery.component';
import { Subscription } from 'rxjs';
import { BlogPostService } from '../../../features/blog-post/services/blog-post.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, PublicBlogSummeryComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  user?: User;
  userName: string = '';
  isSmallScreen = false;
  isMediumScreen = false;
  searchExpanded = false;
  navBarExpanded = false;
  private userSubscription?: Subscription;
  blogPostService = inject(BlogPostService); // to be able to call it directly in html

  @ViewChild('searchInput') searchInput!: ElementRef;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

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

  // Check screen size
  checkScreenSize() {
    const width = window.innerWidth;
    this.isSmallScreen = width < 576;
    this.isMediumScreen = width < 992;
  }

  // Monitor navbar toggle
  navToggled() {
    this.navBarExpanded = !this.navBarExpanded;
  }

  toggleSearchBar(query: string) {
    if (this.searchExpanded == false) {
      this.searchExpanded = true;
    } else {
      this.searchExpanded = false;
    }

    // If the searchbar is toggled the navbar is closed
    if(this.navBarExpanded) {
      const navbarToggler = document.querySelector('.navbar-toggler');
      if (navbarToggler) {
        navbarToggler.classList.toggle('collapsed');
      }
      const navbar = document.getElementById('navbarSupportedContent');
      if (navbar && navbar.classList.contains('show')) {
        navbar.classList.remove('show');
      }
      this.navBarExpanded = false;
    }

    this.blogPostService.navSort.next(query)
  }

  collapseSearch(query: string) {
    this.searchExpanded = false;
    this.searchInput.nativeElement.value = '';

    this.blogPostService.navSort.next(query)
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }
}
