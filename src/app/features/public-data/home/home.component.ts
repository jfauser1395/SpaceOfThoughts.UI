import { Component, OnInit } from '@angular/core';
import { BlogPostService } from '../../blog-post/services/blog-post.service';
import { Observable } from 'rxjs';
import { BlogPost } from '../../blog-post/models/blog-post.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StyleService } from '../../../../services/style.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  blogs$?: Observable<BlogPost[]>;
  imageLoaded = false;

  constructor(
    private blogPostService: BlogPostService,
    private loadingIconService: StyleService
  ) {}
  ngOnInit(): void {
    this.blogs$ = this.blogPostService.getAllBlogPosts();

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  loadImageOn() {
    this.loadingIconService.setBodyStyle('overflow', 'hidden');
  } 
  loadImageOff() {
    this.loadingIconService.setBodyStyle('overflow', 'auto');
  }
    
  
}
