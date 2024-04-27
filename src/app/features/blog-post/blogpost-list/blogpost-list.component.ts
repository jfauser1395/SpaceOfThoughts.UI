import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-blogpost-list',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './blogpost-list.component.html',
  styleUrl: './blogpost-list.component.css',
})
export class BlogpostListComponent {}
