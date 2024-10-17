import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ImageService } from '../services/image.service';
import { Observable, Subscription } from 'rxjs';
import { BlogImage } from '../../models/blog-image.model';

@Component({
  selector: 'app-image-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './image-selector.component.html',
  styleUrl: './image-selector.component.css',
})
export class ImageSelectorComponent implements OnInit, OnDestroy {
  @ViewChild('form') form?: NgForm;
  private file?: File;
  imageUrl?: string;
  fileName: string = '';
  title: string = '';
  images$?: Observable<BlogImage[]>;
  sortedBy: string;
  sortDirection: string;
  deleteUploadedImage$?: Subscription;

  constructor(private imageService: ImageService) {
    this.sortedBy = 'DateCreated';
    this.sortDirection = 'asc';
  }
  
  ngOnInit(): void {
    this.getImages();
  }

  onFileUploadChange(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    this.file = element.files?.[0];
  }

  uploadImage(): void {
    if (this.file && this.fileName !== '' && this.title !== '') {
      // Image service to upload the image
      this.imageService
        .uploadImage(this.file, this.fileName, this.title)
        .subscribe({
          next: (response) => {
            this.getImages(); // Get all images again
            this.selectImage(response); // Send image Url to the parent component
            this.form?.resetForm(); // Reset the form // Reset form after successful submission
          },
        });
    }
  }

  selectImage(image: BlogImage): void {
    this.imageService.selectImage(image);
  }

  deleteImage(image: BlogImage): void {
    if (image.id) {
      this.deleteUploadedImage$ = this.imageService.deleteUploadedImage(image.id).subscribe({
        next: (response) => {
          this.getImages();
        },
      });
    }
  }

  getImages() {
    this.images$ = this.imageService.getAllImages(
      this.sortedBy,
      this.sortDirection
    );
  }

  ngOnDestroy(): void {
    this.deleteUploadedImage$?.unsubscribe();
  }
}
