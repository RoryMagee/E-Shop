import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent }  from './home/home.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { AddressComponent } from './address/address.component';
import { CategoriesComponent } from './categories/categories.component';
import { PostProductComponent } from './post-product/post-product.component';
import { MyProductsComponent } from './my-products/my-products.component';
import { CategoryComponent } from './category/category.component';
import { ProductComponent } from './product/product.component';
import { SearchComponent } from './search/search.component';
import { CartComponent } from './cart/cart.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OrdersComponent } from './orders/orders.component';

import { AuthGuardService } from './auth-guard.service';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'profile/orders',
    component: OrdersComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'profile/orders/:id',
    component: OrderDetailsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'register',
    component: RegistrationComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'profile/settings',
    component: SettingsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'profile/address',
    component: AddressComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'categories',
    component: CategoriesComponent
  },
  {
    path: 'profile/postproduct',
    component: PostProductComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'profile/myproducts',
    component: MyProductsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'category/:id',
    component: CategoryComponent
  },
  {
    path: 'product/:id',
    component: ProductComponent
  },
  {
    path: 'search',
    component: SearchComponent
  },
  {
    path: 'cart',
    component: CartComponent
  },
  {
    path: '**',
    redirectTo: ''
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
