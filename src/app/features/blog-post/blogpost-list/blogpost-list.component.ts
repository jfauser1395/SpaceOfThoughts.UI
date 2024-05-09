import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BlogPostService } from '../services/blog-post.service';
import { Observable } from 'rxjs';
import { BlogPost } from '../Models/blog-post.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blogpost-list',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './blogpost-list.component.html',
  styleUrl: './blogpost-list.component.css',
})
export class BlogpostListComponent {
  blogPost$?: Observable<BlogPost[]>;
  constructor(private blogpostService: BlogPostService) {}

  ngOnInit(): void {
    // get all blog posts from the API
    this.blogPost$ = this.blogpostService.getAllBlogPosts();
  }
}
