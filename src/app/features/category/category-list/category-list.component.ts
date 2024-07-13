import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css',
})
export class CategoryListComponent {
  categories$?: Observable<Category[]>;
  totalCount?: number;
  list: number[] = [];
  pageNumber = 1;
  pageSize = 6;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.categoryService.getCategoryCount().subscribe({
      next: (value) => {
        this.totalCount = value;

        this.list = new Array(Math.ceil(value / this.pageSize));

        this.categories$ = this.categoryService.getAllCategories(
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
    this.categories$ = this.categoryService.getAllCategories(query);
  }

  sort(sortBy: string, sortDirection: string) {
    this.categories$ = this.categoryService.getAllCategories(
      undefined,
      sortBy,
      sortDirection
    );
  }

  getPage(pageNumber: number) {
    this.pageNumber = pageNumber;
    
    this.categories$ = this.categoryService.getAllCategories(
      undefined,
      undefined,
      undefined,
      pageNumber,
      this.pageSize
    );
  }

  getNextPage() {
    if (this.pageNumber + 1 > this.list.length) {
      return;
    }

    this.pageNumber += 1;
    this.categories$ = this.categoryService.getAllCategories(
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
    this.categories$ = this.categoryService.getAllCategories(
      undefined,
      undefined,
      undefined,
      this.pageNumber,
      this.pageSize
    );
  }
}
