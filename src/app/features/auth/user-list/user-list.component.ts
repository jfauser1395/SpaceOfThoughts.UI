import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit, OnDestroy {
  users$?: Observable<User[]>;
  id: string | null = null;
  deleteUserSubscription$?: Subscription;
  usersQuant$?: Subscription;
  totalCount!: number;
  list: number[] = [];
  pageNumber = 1;
  pageSize = 5;
  sortedBy: string;
  sortDirection: string;

  constructor(private authService: AuthService) {
    this.sortedBy = 'userName';
    this.sortDirection = 'asc';
  }

  ngOnInit(): void {
    // get total user count
    this.usersQuant$ = this.authService.getUserCount().subscribe({
      next: (value) => {
        this.totalCount = value;

        this.list = new Array(Math.ceil(value / this.pageSize));

        // get all users from the API
        this.users$ = this.authService.getAllUsersFromDatabase(
          undefined,
          this.sortedBy,
          this.sortDirection
        );
      },
    });
  }
  setUserId(userId: string) {
    this.id = userId;
    console.log(this.id);
  }
  onDelete(): void {
    if (this.id) {
      // Call service and delete a user
      this.deleteUserSubscription$ = this.authService
        .deleteUser(this.id)
        .subscribe({
          next: (response) => {
            this.ngOnInit();
          },
        });
    }
  }

  onSearch(query: string) {
    this.users$ = this.authService.getAllUsersFromDatabase(query);
  }

  sort(sortBy: string, sortDirection: string) {
    this.users$ = this.authService.getAllUsersFromDatabase(
      undefined,
      sortBy,
      sortDirection
    );
  }

  getPage(pageNumber: number) {
    this.pageNumber = pageNumber;

    this.users$ = this.authService.getAllUsersFromDatabase(
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
    this.users$ = this.authService.getAllUsersFromDatabase(
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
    this.users$ = this.authService.getAllUsersFromDatabase(
      undefined,
      undefined,
      undefined,
      this.pageNumber,
      this.pageSize
    );
  }

  ngOnDestroy(): void {
    this.deleteUserSubscription$?.unsubscribe();
  }
}
