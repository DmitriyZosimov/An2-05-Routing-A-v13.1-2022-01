import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router, UrlTree} from '@angular/router';
import { Location } from '@angular/common';
// rxjs
import {Observable, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';

import {UserModel} from './../../models/user.model';
import {UserArrayService} from './../../services/user-array.service';
import {AutoUnsubscribe, CanComponentDeactivate, DialogService} from './../../../core';
import {UserObservableService} from "../../services";

@Component({
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
@AutoUnsubscribe()
export class UserFormComponent implements OnInit, CanComponentDeactivate {
  user!: UserModel;
  originalUser!: UserModel;

  private sub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService,
    private userObservableService: UserObservableService,
    private location: Location
  ) {
  }

  ngOnInit(): void {
    this.route.data.pipe(map(data => data.user)).subscribe((user: UserModel) => {
      this.user = { ...user };
      this.originalUser = { ...user };
    });

  }

  // ngOnDestroy(): void {
  //   this.sub?.unsubscribe();
  // }

  onSaveUser(): void {
    const user = {...this.user};
    const method = user.id ? 'updateUser' : 'createUser';
    const observer = {
      next: (savedUser: UserModel) => {
        this.originalUser = { ...savedUser };
        user.id
          ? // optional parameter: http://localhost:4200/users;editedUserID=2
          this.router.navigate(['users', { editedUserID: user.id }])
          : this.onGoBack();
      },
      error: (err: any) => console.log(err)
    };
    this.sub = this.userObservableService[method](user).subscribe(observer);
  }

  onGoBack(): void {
    // this.router.navigate(['./../../'], {relativeTo: this.route});
    this.location.back();
  }

  canDeactivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const flags = Object.keys(this.originalUser).map(key => {
      // @ts-ignore
      if (this.originalUser[key] === this.user[key]) {
        return true;
      }
      return false;
    });
    if (flags.every(el => el)) {
      return true;
    }
    // Otherwise ask the user with the dialog service and return its
    // promise which resolves to true or false when the user decides
    return this.dialogService.confirm('Discard changes?');
  }
}
