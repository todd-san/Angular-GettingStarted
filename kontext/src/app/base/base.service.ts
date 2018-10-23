import {Component, Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs/index";
import {catchError, tap} from "rxjs/operators";
import {throwError} from "rxjs/internal/observable/throwError";


@Injectable({
  providedIn: 'root'
})

export class BaseService  {
  private token = new BehaviorSubject({});
  currentToken = this.token.asObservable();

  constructor(private http: HttpClient) {}

  public login(username, password): Observable<HttpResponse<any>>{
    let url: string = "http://127.0.0.1:8000/login/";
    let user = {username:  username, password: password};

    console.log('BaseService.login(', user,')');

    return this.http.post<HttpResponse<any>>(url, user, {observe: 'response'})
      .pipe(
        tap(resp => {
          console.log("response from public login", resp);
          this.token.next(resp.body);
        }),
        catchError(BaseService.handleError)
      );


  }

  currentUser(token): Observable<HttpResponse<any>>{
    let url: string = "http://127.0.0.1:8000/kore/api/users/current_user/";
    console.log('CURRENT USER TOKEN: ', token);

    const httpOptions = {
      headers: new HttpHeaders().set('Authorization', token)
    };

    return this.http.get<any>(url, {headers:
      new HttpHeaders()
        .append('Authorization', token)
  });

  }

  private static handleError(err: HttpErrorResponse){
    let errorMessage = '';
    if (err.error instanceof ErrorEvent){
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
