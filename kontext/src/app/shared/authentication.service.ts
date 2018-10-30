import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {map} from "rxjs/internal/operators";
import {Observable} from "rxjs/index";
import {MenuService} from "./menu.service";
import {catchError, tap} from "rxjs/operators";
import {KontextItem} from "./kontextItem";


@Injectable()
export class AuthenticationService {
  user: any;
  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
      return this.http.post<any>('http://127.0.0.1:8000/login/', { username: username, password: password })
        .pipe(map(user => {
          // login successful if there's a jwt token in the response
          if (user && user.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            // localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('currentUser', JSON.stringify(user));

            }
            this.user = user;
          return user;
        }))
  }

  logout() {
    // remove user from local storage to log user out
    this.user = {};
    localStorage.removeItem('currentUser');
  }
}
