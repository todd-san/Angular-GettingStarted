import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse, HttpParams, HttpResponse} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {catchError, tap,} from "rxjs/operators";
import {throwError} from "rxjs/internal/observable/throwError";

import {KontextItem} from "./kontextItem";
import { PaginationHeaders} from "../project-tree/interfaces/paginationHeaders";
import {Project} from "../project-tree/interfaces/project";
import {nextTick} from "q";
import {ApiService} from "./api.service";


@Injectable({
  providedIn: 'root'
})

export class MenuService {
  private tree = new BehaviorSubject([]);
  private tree_params = new BehaviorSubject({});

  menuTree_params = this.tree_params.asObservable();
  project_tree = this.tree.asObservable();

  constructor(private http: HttpClient, private apiService: ApiService){}

  getMenu(qp, page?): Observable<HttpResponse<KontextItem[]>>{

    let url: string = this.apiService.project_tree;
    let params = new HttpParams();

    if(!!qp){
      params = new HttpParams()
        .set('member', qp.uid ? qp.uid.username: null)
        .set('project', qp.pid ? qp.pid.name : null)
        .set('phase', qp.phid ? qp.phid.name : null)
        .set('size', qp.sid ? qp.sid.size : null)
        .set('line', qp.lid ? qp.lid.id : null)
        .set('page', page ? page : 1);

      this.tree_params.next(params);
    }

    return this.http.get<KontextItem[]>(url, {observe: 'response', params: params})
      .pipe(
        tap(resp => {
          console.log('TREE: ', resp);
          this.nextItems(resp.body);
        }),
        catchError(MenuService.handleError)
      )
  }

  nextItems(items){
    this.tree.next(items);
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
