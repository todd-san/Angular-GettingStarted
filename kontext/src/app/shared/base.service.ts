import {Injectable, } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs/index";
import {catchError, tap} from "rxjs/operators";
import {throwError} from "rxjs/internal/observable/throwError";
import {ApiService} from "./api.service";

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
  constructor(private http: HttpClient,
              private apiService: ApiService,) {}

  /*
  * */
  public login(username, password): Observable<HttpResponse<any>>{
    let url: string = this.apiService.login;
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
  public getCurrentUser(): Observable<HttpResponse<any>>{
    return this.http.get<any>(this.apiService.current_user, {observe: 'response'});
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
