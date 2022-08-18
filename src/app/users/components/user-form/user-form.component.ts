import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, UrlTree} from '@angular/router';
// rxjs
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {UserModel} from './../../models/user.model';
import {UserArrayService} from './../../services/user-array.service';
import {CanComponentDeactivate, DialogService} from './../../../core';

@Component({
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent implements OnInit, CanComponentDeactivate {
  user!: UserModel;
  originalUser!: UserModel;

  constructor(
    private userArrayService: UserArrayService,
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService
  ) {
  }

  ngOnInit(): void {
    this.route.data.pipe(map(data => data.user)).subscribe((user: UserModel) => {
      this.user = { ...user };
      this.originalUser = { ...user };
    });

  }

  onSaveUser(): void {
    const user = {...this.user};
    if (user.id) {
      this.userArrayService.updateUser(user);
      this.router.navigate(['/users', {editedUserID: user.id}]);
    } else {
      this.userArrayService.createUser(user);
      this.onGoBack();
    }
    this.originalUser = {...this.user};
  }

  onGoBack(): void {
    this.router.navigate(['./../../'], {relativeTo: this.route});
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
