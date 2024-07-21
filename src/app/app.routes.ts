import { Routes } from '@angular/router';
import { CategoryListComponent } from './features/category/category-list/category-list.component';
import { AddCategoryComponent } from './features/category/add-category/add-category.component';
import { EditCategoryComponent } from './features/category/edit-category/edit-category.component';
import { BlogpostListComponent } from './features/blog-post/blogpost-list/blogpost-list.component';
import { AddBlogpostComponent } from './features/blog-post/add-blogpost/add-blogpost.component';
import { EditBlogpostComponent } from './features/blog-post/edit-blogpost/edit-blogpost.component';
import { HomeComponent } from './features/public-data/home/home.component';
import { BlogDetailsComponent } from './features/public-data/blog-details/blog-details.component';
import { LoginComponent } from './features/auth/login/login.component';
import { CreateAccountComponent } from './features/auth/create-account/create-account.component';
import { authGuard } from './features/auth/guards/auth.guard';
import { UserListComponent } from './features/auth/user-list/user-list.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'create-account',
    component: CreateAccountComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'blog/:url',
    component: BlogDetailsComponent,
  },
  {
    path: 'admin/categories',
    component: CategoryListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'admin/categories/add',
    component: AddCategoryComponent,
    canActivate: [authGuard],
  },
  {
    path: 'admin/categories/:id',
    component: EditCategoryComponent,
    canActivate: [authGuard],
  },
  {
    path: 'admin/blogposts',
    component: BlogpostListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'admin/blogposts/add',
    component: AddBlogpostComponent,
    canActivate: [authGuard],
  },
  {
    path: 'admin/blogposts/:id',
    component: EditBlogpostComponent,
    canActivate: [authGuard],
  },
  { 
    path: 'admin/users',
    component: UserListComponent,
    canActivate: [authGuard],
  },
];
