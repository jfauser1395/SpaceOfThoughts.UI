import { Injectable } from '@angular/core';
import { AddBlogPost } from '../models/add-blog-post.model';
import { Observable, Subject } from 'rxjs';
import { BlogPost } from '../models/blog-post.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { UpdateBlogPost } from '../models/update-blog-post.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BlogPostService {
  constructor(private http: HttpClient) {}

  createBlogPost(data: AddBlogPost): Observable<BlogPost> {
    return this.http.post<BlogPost>(
      `${environment.apiBaseUrl}/api/Blogposts?addAuth=true`,
      data
    );
  }

  getAllBlogPosts(
    query?: string,
    sortBy?: string,
    sortDirection?: string,
    pageNumber?: number,
    pageSize?: number
  ): Observable<BlogPost[]> {
    let params = new HttpParams();

    if (query) {
      params = params.set('query', query);
    }

    if (sortBy) {
      params = params.set('sortBy', sortBy);
    }

    if (sortDirection) {
      params = params.set('sortDirection', sortDirection);
    }

    if (pageNumber) {
      params = params.set('pageNumber', pageNumber);
    }

    if (pageSize) {
      params = params.set('pageSize', pageSize);
    }

    return this.http.get<BlogPost[]>(
      `${environment.apiBaseUrl}/api/Blogposts`,
      { params: params }
    );
  }

  checkIfImagesEmpty(): Observable<boolean> {
    return this.getAllBlogPosts().pipe(
      map(blogs => blogs.length === 0)
    );
  }

  getBlogPostCount(): Observable<number> {
    return this.http.get<number>(
      `${environment.apiBaseUrl}/api/BlogPosts/count`
    );
  }

  getBlogPostById(id: string): Observable<BlogPost> {
    return this.http.get<BlogPost>(
      `${environment.apiBaseUrl}/api/Blogposts/${id}`
    );
  }

  // to use the sorting functionality of a component by another one
  navSort = new Subject<string>();

  getBlogPostByUrlHandle(urlHandle: string): Observable<BlogPost> {
    return this.http.get<BlogPost>(
      `${environment.apiBaseUrl}/api/Blogposts/${urlHandle}`
    );
  }

  updateBlogPost(
    id: string,
    updateBlogPost: UpdateBlogPost
  ): Observable<BlogPost> {
    return this.http.put<BlogPost>(
      `${environment.apiBaseUrl}/api/Blogposts/${id}?addAuth=true`,
      updateBlogPost
    );
  }

  deleteBlogPost(id: string): Observable<BlogPost> {
    return this.http.delete<BlogPost>(
      `${environment.apiBaseUrl}/api/blogposts/${id}?addAuth=true`
    );
  }
}
