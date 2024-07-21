import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit {
  users$?: Observable<User[]>;
  id: string | null = null;
  deleteUserSubscription?: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // get all users from the API/
    this.users$ = this.authService.getAllUsersFromDatabase();
  }

  setUserId(userId: string) {
    this.id = userId;
    console.log(this.id);
  }
  onDelete(): void {
    if (this.id) {
      // Call service and delete a user
      this.deleteUserSubscription = this.authService
        .deleteUser(this.id)
        .subscribe({
          next: (response) => {
            this.ngOnInit();
          },
        });
    }
  }
}
