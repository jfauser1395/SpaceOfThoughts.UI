import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormsModule,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { ImageService } from '../services/image.service';
import { isEmpty, Observable, Subscription } from 'rxjs';
import { BlogImage } from '../../models/blog-image.model';

@Component({
  selector: 'app-image-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './image-selector.component.html',
  styleUrl: './image-selector.component.css',
})
export class ImageSelectorComponent implements OnInit, OnDestroy {
  private file?: File;
  form!: FormGroup;
  fileName: string = '';
  title: string = '';
  images$?: Observable<BlogImage[]>;
  sortedBy: string;
  sortDirection: string;
  deleteUploadedImage$?: Subscription;
  noImages?: boolean;

  constructor(private imageService: ImageService) {
    this.sortedBy = 'DateCreated';
    this.sortDirection = 'asc';
  }

  ngOnInit(): void {
    // declare a new form group
    this.form = new FormGroup({
      file: new FormControl(null, Validators.required),
      fileName: new FormControl(null, Validators.required),
      title: new FormControl(null, Validators.required),
    });
    // get all pryer saved images
    this.getImages();
  }

  // map the uploaded file to the file variable on upload change event
  onFileUploadChange(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    this.file = element.files?.[0];
  }

  // upload new file
  uploadImage(): void {
    // map form values to the appropriate BlogImage values
    this.fileName = this.form.get('fileName')?.value;
    this.title = this.form.get('title')?.value;

    if (this.file && this.fileName !== '' && this.title !== '') {
      // Image service to upload the image
      this.imageService
        .uploadImage(this.file, this.fileName, this.title)
        .subscribe({
          next: (response) => {
            this.getImages(); // Get all images again
            this.selectImage(response); // Send image Url to the parent component
            this.form.reset(); // Reset form after upload
          },
        });
    }
  }

  selectImage(image: BlogImage): void {
    this.imageService.selectImage(image);
  }

  deleteImage(image: BlogImage): void {
    if (image.id) {
      this.deleteUploadedImage$ = this.imageService
        .deleteUploadedImage(image.id)
        .subscribe({
          next: () => {
            this.getImages();
          },
        });
    }
  }

  getImages() {
    this.images$ = this.imageService.getAllImages(
      this.sortedBy,
      this.sortDirection,
    );
    // Check if any images are uploaded
    this.imageService.checkIfImagesEmpty().subscribe((isEmpty) => {
      this.noImages = isEmpty;
    });
  }

  ngOnDestroy(): void {
    this.deleteUploadedImage$?.unsubscribe();
  }
}
