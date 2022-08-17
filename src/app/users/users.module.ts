import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { UserComponent, UserListComponent, UserFormComponent } from './components';

import { UsersRoutingModule } from './users-routing.module';
import {UsersComponent} from "./users.component";


@NgModule({
  declarations: [UserComponent, UserListComponent, UserFormComponent, UsersComponent],
  imports: [
    CommonModule,
    FormsModule,
    UsersRoutingModule
  ]
})
export class UsersModule { }
