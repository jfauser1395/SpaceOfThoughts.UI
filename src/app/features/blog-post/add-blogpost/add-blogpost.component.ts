import { Component } from '@angular/core';
import { AddBlogPost } from '../Models/add-blog-post.model';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-blogpost',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './add-blogpost.component.html',
  styleUrl: './add-blogpost.component.css',
})
export class AddBlogpostComponent {
  model: AddBlogPost;

  constructor() {
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
    console.log(this.model);
  }
}
