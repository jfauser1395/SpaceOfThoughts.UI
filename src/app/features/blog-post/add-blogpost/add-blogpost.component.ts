import { Component, OnDestroy, OnInit } from '@angular/core';
import { AddBlogPost } from '../models/add-blog-post.model';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BlogPostService } from '../services/blog-post.service';
import { Router } from '@angular/router';
import { CategoryService } from '../../category/services/category.service';
import { Observable, Subscription } from 'rxjs';
import { Category } from '../../category/models/category.model';
import { CommonModule } from '@angular/common';
import { MarkdownComponent } from 'ngx-markdown';
import { ImageSelectorComponent } from '../shared/components/image-selector/image-selector.component';
import { ImageService } from '../shared/components/services/image.service';

@Component({
  selector: 'app-add-blogpost',
  standalone: true,
  templateUrl: './add-blogpost.component.html',
  styleUrl: './add-blogpost.component.css',
  imports: [
    FormsModule,
    DatePipe,
    MarkdownComponent,
    CommonModule,
    ImageSelectorComponent,
  ],
})
export class AddBlogpostComponent implements OnInit, OnDestroy {
  model: AddBlogPost;
  categories$?: Observable<Category[]>;

  imageSelectorSubscription?: Subscription;


  constructor(
    private blogpostService: BlogPostService,
    private categoryService: CategoryService,
    private imageService: ImageService,
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
      categories: [],
    };
  }

  ngOnInit(): void {
    this.categories$ = this.categoryService.getAllCategories();

    this.imageSelectorSubscription = this.imageService
      .onSelectImage()
      .subscribe({
        next: (selectedImage) =>
          (this.model.featuredImageUrl = selectedImage.url),
      });
  }

  onFormSubmit(): void {
    this.blogpostService.createBlogPost(this.model).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/admin/blogposts');
      },
    });
  }

  ngOnDestroy(): void {
    this.imageSelectorSubscription?.unsubscribe();
  }
}
