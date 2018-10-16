import {Component, Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs/index";
import {KontextItem} from "../shared/kontextItem";
import {MenuService} from "../menu/menu.service";
import {catchError, tap} from "rxjs/operators";
import {throwError} from "rxjs/internal/observable/throwError";

@Injectable({
  providedIn: 'root'
})

export class CrudService  {

  constructor(private http: HttpClient) { }

  getProjects(): Observable<HttpResponse<KontextItem[]>>{
    let url: string = "http://127.0.0.1:8000/kontext/projects/";
    return this.http.get<any[]>(url, {observe: 'response'})
      .pipe(
        tap(resp => console.log('CrudService -> GET PROJECTS: ', resp)),
        catchError(CrudService.handleError)
      )
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
