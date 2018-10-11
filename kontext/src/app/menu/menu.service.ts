import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse, HttpParams, HttpResponse} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {catchError, tap,} from "rxjs/operators";
import {throwError} from "rxjs/internal/observable/throwError";

import {Project} from "./interfaces/project";
import {KontextItem} from "../shared/kontextItem";
import {PaginationHeaders} from "./interfaces/paginationHeaders";


@Injectable({
  providedIn: 'root'
})

export class MenuService {
  private treeUrl: string = "http://127.0.0.1:8000/kontext/projects/nav_menu/";

  constructor(private http: HttpClient){}

  getMenu(qp, page?): Observable<HttpResponse<KontextItem[]>>{
    let url: string = this.treeUrl;
    let params = new HttpParams();

    if(!!qp){
      params = new HttpParams()
        .set('member', qp.uid ? qp.uid.username: null)
        .set('project', qp.pid ? qp.pid.name : null)
        .set('phase', qp.phid ? qp.phid.name : null)
        .set('size', qp.sid ? qp.sid.size : null)
        .set('line', qp.lid ? qp.lid.id : null)
        .set('page', page ? page : 1);
    }

    return this.http.get<KontextItem[]>(url, {observe: 'response', params: params})
      .pipe(
        tap(resp => console.log('TREE: ', resp)),
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
