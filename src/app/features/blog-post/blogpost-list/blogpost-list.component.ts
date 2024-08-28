import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BlogPostService } from '../services/blog-post.service';
import { Observable, Subscription } from 'rxjs';
import { BlogPost } from '../models/blog-post.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blogpost-list',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './blogpost-list.component.html',
  styleUrl: './blogpost-list.component.css',
})
export class BlogpostListComponent implements OnInit, OnDestroy {
  blogPost$?: Observable<BlogPost[]>;
  blogPostQuant$?: Subscription;
  totalCount!: number;
  list: number[] = [];
  pageNumber = 1;
  pageSize = 4;

  constructor(private blogPostService: BlogPostService) {}

  ngOnInit(): void {
    // get total blogpost count
    this.blogPostQuant$ = this.blogPostService.getBlogPostCount().subscribe({
      next: (value) => {
        this.totalCount = value;

        this.list = new Array(Math.ceil(value / this.pageSize));

        // get all blog posts from the API
        this.blogPost$ = this.blogPostService.getAllBlogPosts(
          undefined,
          undefined,
          undefined,
          this.pageNumber,
          this.pageSize
        );
      },
    });
  }

  onSearch(query: string) {
    this.blogPost$ = this.blogPostService.getAllBlogPosts(query);
  }

  sort(sortBy: string, sortDirection: string) {
    this.blogPost$ = this.blogPostService.getAllBlogPosts(
      undefined,
      sortBy,
      sortDirection
    );
  }

  getPage(pageNumber: number) {
    this.pageNumber = pageNumber;

    this.blogPost$ = this.blogPostService.getAllBlogPosts(
      undefined,
      undefined,
      undefined,
      this.pageNumber,
      this.pageSize
    );
  }

  getNextPage() {
    if (this.pageNumber + 1 > this.list.length) {
      return;
    }

    this.pageNumber += 1;
    this.blogPost$ = this.blogPostService.getAllBlogPosts(
      undefined,
      undefined,
      undefined,
      this.pageNumber,
      this.pageSize
    );
  }

  getPrevPage() {
    if (this.pageNumber - 1 < 1) {
      return;
    }

    this.pageNumber -= 1;
    this.blogPost$ = this.blogPostService.getAllBlogPosts(
      undefined,
      undefined,
      undefined,
      this.pageNumber,
      this.pageSize
    );
  }

  ngOnDestroy(): void {
    this.blogPostQuant$?.unsubscribe();
  }
}
