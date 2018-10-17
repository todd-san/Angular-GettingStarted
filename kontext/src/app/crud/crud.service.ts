import {Component, Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams, HttpResponse} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs/index";
import {KontextItem} from "../shared/kontextItem";
import {MenuService} from "../menu/menu.service";
import {catchError, tap} from "rxjs/operators";
import {throwError} from "rxjs/internal/observable/throwError";

@Injectable({
  providedIn: 'root'
})

export class CrudService  {

  private kontext = new BehaviorSubject({});
  currentKontext= this.kontext.asObservable();


  constructor(private http: HttpClient) { }



  getKontextById(type, id): Observable<HttpResponse<KontextItem[]>>{
    let url: string = CrudService.getUrl(type, id);
    console.log('url used: ', url);
    return this.http.get<any[]>(url, {observe: 'response'})
      .pipe(
        tap(resp => this.setCurrentKontext(resp)),

        catchError(CrudService.handleError)
      )
  }
  static getUrl(type, id){
       switch (type){
        case 'project': {
          return "http://127.0.0.1:8000/kontext/projects/" + id.toString() + '/';
        }
        case 'phase': {
          return "http://127.0.0.1:8000/kontext/phases/" + id.toString() + '/';
        }
        case 'design': {
          return "http://127.0.0.1:8000/kontext/designs/" + id.toString() + '/';
        }
        case 'spec': {
          return "http://127.0.0.1:8000/kontext/specs/" + id.toString() + '/';
        }
        default: {
          return 'type: ' + type + ' and id: ' + id.toString() + ' were not able to be parsed into a url'
        }
      }
    }
  public setCurrentKontext(response){
    this.kontext.next(response.body);
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
