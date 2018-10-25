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
import { PaginationHeaders} from "../project-tree/interfaces/paginationHeaders";


@Injectable({
  providedIn: 'root'
})

export class FilterService {
  private query_parameters = new BehaviorSubject({});
  filter_params = this.query_parameters.asObservable();

  private menuItems = new BehaviorSubject([]);
  currentItems = this.menuItems.asObservable();

  private menuPagination = new BehaviorSubject(<PaginationHeaders>{});
  currentPagination: Observable<PaginationHeaders> = this.menuPagination.asObservable();

  private filterMenu = new BehaviorSubject(false);
  filter_menu = this.filterMenu.asObservable();

  toggleFilter(state){
    this.filterMenu.next(state);
  }


  private projectNameUrl: string = "http://127.0.0.1:8000/kontext/projects/names/";
  private phaseNameUrl: string = "http://127.0.0.1:8000/kontext/phases/names/";
  private designSizeUrl: string = "http://127.0.0.1:8000/kontext/designs/sizes/";
  private tireLineUrl: string = "http://127.0.0.1:8000/kore/api/lines/";
  private userNameUrl: string = "http://127.0.0.1:8000/kore/api/users/";

  /*
  *
  * */
  private removeEmpty = (obj) => {
    Object.keys(obj).forEach((key) => (obj[key] == null) && delete obj[key]);
  };
  private loopThroughParams(params){
    Object.keys(params).forEach(key => console.log('PARAMETER KEYS!: ', params[key]))
  }
  private toHttpParams(params) {
      return Object.getOwnPropertyNames(params)
                   .reduce((p, key) => p.set(key, params[key]), new HttpParams());
  }

  constructor(private http: HttpClient){}

  getUserNames(): Observable<HttpResponse<UserName[]>>{
    return this.http.get<UserName[]>(this.userNameUrl, {observe: 'response', })
      .pipe(
        // tap(resp => console.log('response: ', resp)),
        catchError(FilterService.handleError)
      );
  }
  getProjectNames(qp?): Observable<HttpResponse<ProjectName[]>>{
    let params = new HttpParams();
    if(!!qp) {
      this.loopThroughParams(qp);
      params = new HttpParams()
        .set('member', qp.uid ? qp.uid.username : null);

      console.log('PROJECT NAME PARAMS: ', params);
    }
    return this.http.get<ProjectName[]>(this.projectNameUrl, {observe: 'response', params: params})
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
    return this.http.get<PhaseName[]>(this.phaseNameUrl, {observe: 'response', params: params})
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
    return this.http.get<DesignSize[]>(this.designSizeUrl, {observe: 'response', params: params})
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
    return this.http.get<TireLine[]>(this.tireLineUrl, {observe: 'response', params: params})
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
