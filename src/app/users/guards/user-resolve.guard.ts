import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router} from '@angular/router';
// rxjs
import {EMPTY, Observable, of} from 'rxjs';
import {catchError, switchMap, take, delay, finalize} from 'rxjs/operators';
import {UserModel} from './../models/user.model';
import {UserObservableService} from './../services';
import { SpinnerService } from './../../widgets';

@Injectable({
  providedIn: 'any'
})
export class UserResolveGuard implements Resolve<UserModel> {
  constructor(
    private userObservableService: UserObservableService,
    private router: Router,
    private spinner: SpinnerService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<UserModel> {
    console.log('UserResolve Guard is called');
    if (!route.paramMap.has('userID')) {
      return of(new UserModel(null, '', ''));
    }
    this.spinner.show();
    const id = route.paramMap.get('userID')!;
    return this.userObservableService.getUser(id).pipe(
      delay(2000),
      switchMap((user: UserModel) => {
        if (user) {
          return of(user);
        } else {
          this.router.navigate(['/users']);
          return EMPTY;
        }
      }),
      take(1),
      catchError(() => {
        this.router.navigate(['/users']);
        // catchError MUST return observable
        return EMPTY;
      }),
      finalize(() => this.spinner.hide())
    );
  }
}
