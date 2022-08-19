import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, retry, share} from 'rxjs/operators';
import {UserModel} from './../models/user.model';
import {UsersAPI} from './../users.config';

@Injectable({
  providedIn: 'any'
})
export class UserObservableService {
  constructor(
    private http: HttpClient,
    @Inject(UsersAPI) private usersUrl: string
  ) {
  }

  getUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(this.usersUrl).pipe(
      retry(3),
      share(),
      catchError(this.handleError)
    );
  }

  getUser(id: number | string): Observable<UserModel> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.get<UserModel>(url)
      .pipe(
        retry(3),
        share(),
        catchError(this.handleError)
      );
  }

  updateUser(user: UserModel) {
  }

  createUser(user: UserModel) {
  }

  deleteUser(user: UserModel) {
  }

  private handleError(err: HttpErrorResponse) {
    // A client-side or network error occurred.
    if (err.error instanceof Error) {
      console.error('An error occurred:', err.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(`Backend returned code ${err.status}, body was: ${err.error}`);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
