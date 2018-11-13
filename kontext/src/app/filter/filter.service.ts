import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse, HttpResponse, HttpParams} from "@angular/common/http";
import {Observable, Subject, BehaviorSubject} from "rxjs";
import {catchError, tap,} from "rxjs/operators";
import {throwError} from "rxjs/internal/observable/throwError";

import {KontextItem} from "../shared/kontextItem";

import {ProjectName} from "./interfaces/projectName"
import {PhaseName} from "./interfaces/phaseName"
import {DesignSize} from "./interfaces/designSize"
import {TireLine} from "./interfaces/tireLine"
import {UserName} from "./interfaces/userName"
import {PaginationHeaders} from "../project-tree/interfaces/paginationHeaders";
import {ApiService} from "../shared/api.service";


@Injectable({
  providedIn: 'root'
})

export class FilterService {

  /* Private, Behavior-Subject, Variables
  * */
  private query_parameters = new BehaviorSubject({});
  private menuItems = new BehaviorSubject([]);
  private menuPagination = new BehaviorSubject(<PaginationHeaders>{});
  private filterMenu = new BehaviorSubject(false);

  /* Public, Observable-Set, of private variables.
  * */
  filter_params = this.query_parameters.asObservable();
  currentItems = this.menuItems.asObservable();
  currentPagination: Observable<PaginationHeaders> = this.menuPagination.asObservable();
  filter_menu = this.filterMenu.asObservable();

  constructor(private http: HttpClient, private apiService: ApiService){}

  getUserNames(): Observable<HttpResponse<UserName[]>>{
    return this.http.get<UserName[]>(this.apiService.filter_menu_users, {observe: 'response', })
      .pipe(
        // tap(resp => console.log('response: ', resp)),
        catchError(FilterService.handleError)
      );
  }
  getProjectNames(qp?): Observable<HttpResponse<ProjectName[]>>{
    let params = new HttpParams();
    if(!!qp) {
      params = new HttpParams()
        .set('member', qp.uid ? qp.uid.username : null);

      console.log('PROJECT NAME PARAMS: ', params);
    }
    return this.http.get<ProjectName[]>(this.apiService.filter_menu_projects, {observe: 'response', params: params})
        .pipe(
          // tap(resp => console.log('response: ', resp)),
          catchError(FilterService.handleError)
        );
  }
  getPhaseNames(qp?): Observable<HttpResponse<PhaseName[]>>{
    let params = new HttpParams();
    if(!!qp){
      params = new HttpParams()
        .set('member', qp.uid ? qp.uid.username : null)
        .set('project', qp.pid ? qp.pid.name : null);

    }
    return this.http.get<PhaseName[]>(this.apiService.filter_menu_phases, {observe: 'response', params: params})
      .pipe(
        // tap(resp => console.log('response: ', resp)),
        catchError(FilterService.handleError)
      );
  }
  getDesignSizes(qp?): Observable<HttpResponse<DesignSize[]>>{
    let params = new HttpParams();
    if(!!qp){
      params = new HttpParams()
        .set('member', qp.uid ? qp.uid.username: null)
        .set('project', qp.pid ? qp.pid.name : null)
        .set('phase', qp.phid ? qp.phid.name : null)
        .set('line', qp.lid ? qp.lid.id : null)
    }
    return this.http.get<DesignSize[]>(this.apiService.filter_menu_sizes, {observe: 'response', params: params})
      .pipe(
        tap(resp => console.log('response: ', resp)),
        catchError(FilterService.handleError)
      );
  }
  getTireLines(qp?): Observable<HttpResponse<TireLine[]>>{
    let params = new HttpParams();
    if(!!qp){
      params = new HttpParams()
        .set('owner', qp.uid ? qp.uid.username: null)
        .set('project', qp.pid ? qp.pid.name : null)
        .set('phase', qp.phid ? qp.phid.name : null)
        .set('size', qp.sid ? qp.sid.size : null)

    }
    return this.http.get<TireLine[]>(this.apiService.filter_menu_lines, {observe: 'response', params: params})
      .pipe(
        // tap(resp => console.log('response: ', resp)),
        catchError(FilterService.handleError)
      );
  }

  changeParams(params: any){
    this.query_parameters.next(params)
  }
  changeItems(items: KontextItem[]){
    this.menuItems.next(items);
  }
  changePagination(paginate: PaginationHeaders){
    this.menuPagination.next(paginate)
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
