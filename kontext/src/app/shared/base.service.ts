import {Injectable, } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs/index";
import {catchError, tap} from "rxjs/operators";
import {throwError} from "rxjs/internal/observable/throwError";

declare var $: any;

@Injectable({
  providedIn: 'root'
})

export class BaseService  {

  /*
  * */
  private token = new BehaviorSubject({});
  private project_tree = new BehaviorSubject(true);

  /*
  * */
  public currentToken = this.token.asObservable();
  public visible_projectTree = this.project_tree.asObservable();

  /*
  * */
  constructor(private http: HttpClient,) {}

  /*
  * */
  public login(username, password): Observable<HttpResponse<any>>{
    let url: string = "http://127.0.0.1:8000/login/";
    let user = {username:  username, password: password};

    return this.http.post<HttpResponse<any>>(url, user, {observe: 'response'})
      .pipe(
        tap(resp => {
          console.log("response from public login", resp);
          this.token.next(resp.body);
        }),
        catchError(this.handleLoginError)
      );
  }
  public currentUser(username, password): Observable<HttpResponse<any>>{
    let url: string = "http://127.0.0.1:8000/kore/api/users/current_user/";
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", "Basic " + btoa(username+":"+password));
    headers = headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http.get<any>(url, {headers: headers});
  }

  /*
  * */
  public toggleProjectTree(bool){
    this.project_tree.next(bool);
    $("#project-tree-offcanvas").toggle();
  }
  public toggleProjectFilter(){
    $('#filter-modal').modal('show');
  }

  /*
  * */
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
  private handleLoginError(err: HttpErrorResponse){
    let errorMessage = '';
    if (err.error instanceof ErrorEvent){
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    return throwError(errorMessage);
  }

}
