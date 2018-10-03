import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {catchError, tap,} from "rxjs/operators";
import {throwError} from "rxjs/internal/observable/throwError";

import {Project} from "./interfaces/project";


@Injectable({
  providedIn: 'root'
})

export class MenuService {

  private treeUrl: string = "http://127.0.0.1:8000/kontext/projects/nav_menu/";

  constructor(private http: HttpClient){}

  getMenu(page?): Observable<HttpResponse<Project[]>>{
    if(page){
      return this.http.get<Project[]>(this.treeUrl+"?page="+page, {observe: 'response', })
        .pipe(
          tap(resp => console.log('header page: ', resp.headers.get('X-Page'))),
          catchError(MenuService.handleError)
        );
    } else{
      return this.http.get<Project[]>(this.treeUrl,{observe: 'response'}).pipe(
        tap(resp => console.log('project page: ', resp.headers.get('X-Page'))),
        catchError(MenuService.handleError)
      );
    }
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
