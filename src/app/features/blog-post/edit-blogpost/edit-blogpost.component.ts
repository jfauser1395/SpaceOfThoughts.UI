import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { BlogPostService } from '../services/blog-post.service';
import { BlogPost } from '../Models/blog-post.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddBlogPost } from '../Models/add-blog-post.model';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MarkdownComponent} from 'ngx-markdown';
import { CategoryService } from '../../category/services/category.service';
import { Category } from '../../category/Models/category.model';


@Component({
  selector: 'app-edit-blogpost',
  standalone: true,
  imports: [CommonModule, FormsModule, MarkdownComponent, DatePipe],
  templateUrl: './edit-blogpost.component.html',
  styleUrl: './edit-blogpost.component.css',
})
export class EditBlogpostComponent implements OnInit, OnDestroy {
  id: string | null = null;
  model?: BlogPost;
  routeSubscribtion?: Subscription;
  categories$?: Observable<Category[]>;
  selectedCategories?: string[];

  constructor(
    private route: ActivatedRoute,
    private blogPostService: BlogPostService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.categories$ = this.categoryService.getAllCategories();


    this.routeSubscribtion = this.route.paramMap.subscribe({
      next: (params) => {
        this.id = params.get('id');

        // Get BlogPost from API
        this.blogPostService.getBlogPostById(this.id).subscribe({
          next: (response) => {
            this.model = response;
            this.selectedCategories = response.categories.map(x => x.id);
          }
        })
      },
    });
  }

  onFormSubmit(): void {

  }

  ngOnDestroy(): void {
    this.routeSubscribtion?.unsubscribe();
  }
}
