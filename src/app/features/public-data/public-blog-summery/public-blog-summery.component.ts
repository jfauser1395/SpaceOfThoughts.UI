import { Component, OnInit } from '@angular/core';
import { BlogPostService } from '../../blog-post/services/blog-post.service';
import { Observable, Subscription } from 'rxjs';
import { BlogPost } from '../../blog-post/models/blog-post.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StyleService } from '../../../../services/style.service';
import { AuthService } from '../../auth/services/auth.service';
import { User } from '../../auth/models/user.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './public-blog-summery.component.html',
  styleUrl: './public-blog-summery.component.css',
})
export class PublicBlogSummeryComponent implements OnInit {
  blogs$?: Observable<BlogPost[]>;
  imageLoaded = false;
  user?: User;
  userSubscription?: Subscription;

  constructor(
    private blogPostService: BlogPostService,
    private loadingIconService: StyleService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    // scroll up
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    // get user
    this.userSubscription = this.authService.user().subscribe({
      next: (response) => {
        this.user = response;
      },
    });

    this.user = this.authService.getUser();

    // get blogs
    this.blogs$ = this.blogPostService.getAllBlogPosts();

   
  }

  loadImageOn() {
    this.loadingIconService.setBodyStyle('overflow', 'hidden');
  } 
  loadImageOff() {
    this.loadingIconService.setBodyStyle('overflow', 'auto');
  }
    
  
}
