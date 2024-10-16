import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BlogImage } from '../../models/blog-image.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  selectedImage: BehaviorSubject<BlogImage> = new BehaviorSubject<BlogImage>({
    id: '',
    fileExtension: '',
    fileName: '',
    title: '',
    url: '',
  });

  constructor(private http: HttpClient) {}

  getAllImages(
    sortBy?: string,
    sortDirection?: string
  ): Observable<BlogImage[]> {
    let params = new HttpParams();

    if (sortBy) {
      params = params.set('sortBy', sortBy);
    }

    if (sortDirection) {
      params = params.set('sortDirection', sortDirection);
    }
    return this.http.get<BlogImage[]>(`${environment.apiBaseUrl}/api/Images`, {
      params: params,
    });
  }

  uploadImage(
    file: File,
    fileName: string,
    title: string
  ): Observable<BlogImage> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);
    formData.append('title', title);

    return this.http.post<BlogImage>(
      `${environment.apiBaseUrl}/api/Images`,
      formData
    );
  }

  selectImage(image: BlogImage): void {
    this.selectedImage.next(image);
  }

  onSelectImage(): Observable<BlogImage> {
    return this.selectedImage.asObservable();
  }

  deleteUploadedImage(id: string): Observable<BlogImage> {
    return this.http.delete<BlogImage>(
      `${environment.apiBaseUrl}/api/Images/${id}?addAuth=true`
    );
  }
}
