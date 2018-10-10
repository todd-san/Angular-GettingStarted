import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse, HttpParams, HttpResponse} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {catchError, tap,} from "rxjs/operators";
import {throwError} from "rxjs/internal/observable/throwError";

import {Project} from "./interfaces/project";
import {PaginationHeaders} from "./interfaces/paginationHeaders";


@Injectable({
  providedIn: 'root'
})

export class MenuService {
  private items = new BehaviorSubject([]);
  private headers: PaginationHeaders;
  private treeUrl: string = "http://127.0.0.1:8000/kontext/projects/nav_menu/";

  private removeEmpty = (obj) => {
    Object.keys(obj).forEach((key) => (obj[key] == null) && delete obj[key]);
  };
  private loopThroughParams(params){
    Object.keys(params).forEach(key => console.log('MENU PARAMS!: ', params[key]))
  }
  private toHttpParams(params) {
      return Object.getOwnPropertyNames(params)
                   .reduce((p, key) => p.set(key, params[key]), new HttpParams());
  }

  constructor(private http: HttpClient){}

  getMenu(qp, page?): Observable<HttpResponse<Project[]>>{
    let url: string;
    let params = new HttpParams();

    if(!!page && !qp){
      url = this.treeUrl+"?page="+page;
    } else{
      url = this.treeUrl;
    }
    if(!!qp){
      this.loopThroughParams(qp);
      params = new HttpParams()
        .set('member', qp.uid ? qp.uid.username: null)
        .set('project', qp.pid ? qp.pid.name : null)
        .set('phase', qp.phid ? qp.phid.name : null)
        .set('size', qp.sid ? qp.sid.size : null)
        .set('line', qp.lid ? qp.lid.id : null);
    }

    return this.http.get<Project[]>(url, {observe: 'response', params: params})
      .pipe(
        tap(resp => console.log('PROJECTS: ', resp)),
        catchError(MenuService.handleError)
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
