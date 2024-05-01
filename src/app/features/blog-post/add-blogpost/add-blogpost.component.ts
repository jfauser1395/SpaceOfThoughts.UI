import { Component } from '@angular/core';
import { AddBlogPost } from '../Models/add-blog-post.model';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BlogPostService } from '../services/blog-post.service';
import { response } from 'express';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-blogpost',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './add-blogpost.component.html',
  styleUrl: './add-blogpost.component.css',
})
export class AddBlogpostComponent {
  model: AddBlogPost;

  constructor(
    private blogpostService: BlogPostService,
    private router: Router
  ) {
    this.model = {
      title: '',
      shortDescription: '',
      urlHandle: '',
      content: '',
      featuredImageUrl: '',
      author: '',
      isVisible: true,
      publishedDate: new Date(),
    };
  }

  onFormSubmit(): void {
    this.blogpostService.createBlogPost(this.model).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/admin/blogposts');
      },
    });
  }
}
