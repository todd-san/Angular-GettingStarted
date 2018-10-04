import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse, HttpResponse, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {catchError, tap,} from "rxjs/operators";
import {throwError} from "rxjs/internal/observable/throwError";
import {ProjectName} from "./interfaces/projectName"
import {PhaseName} from "./interfaces/phaseName"
import {DesignSize} from "./interfaces/designSize"
import {TireLine} from "./interfaces/tireLine"
import {UserName} from "./interfaces/userName"


@Injectable({
  providedIn: 'root'
})

export class FilterService {
  private projectNameUrl: string = "http://127.0.0.1:8000/kontext/projects/names/";
  private phaseNameUrl: string = "http://127.0.0.1:8000/kontext/phases/names/";
  private designSizeUrl: string = "http://127.0.0.1:8000/kontext/designs/sizes/";
  private tireLineUrl: string = "http://127.0.0.1:8000/kore/api/lines/";
  private userNameUrl: string = "http://127.0.0.1:8000/kore/api/users/";

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
      params = new HttpParams()
        .set('member', qp.uid ? qp.uid : null);
    }
    // console.log('PROJECT PARAMS: ', params);
    return this.http.get<ProjectName[]>(this.projectNameUrl, {observe: 'response', params: params})
        .pipe(
          tap(resp => console.log('response: ', resp)),
          catchError(FilterService.handleError)
        );
  }
  getPhaseNames(qp?): Observable<HttpResponse<PhaseName[]>>{
    let params = new HttpParams();
    if(!!qp){
      params = new HttpParams()
        .set('member', qp.uid ? qp.uid : null)
        .set('project', qp.pid ? qp.pid : null);

    }
    // console.log('PHASE PARAMS: ', params);
    return this.http.get<PhaseName[]>(this.phaseNameUrl, {observe: 'response', params: params})
      .pipe(
        // tap(resp => console.log('response: ', resp)),
        catchError(FilterService.handleError)
      );
  }
  getDesignSizes(qp?): Observable<HttpResponse<DesignSize[]>>{

    console.log('filter_service.SIZE PARAMS 3: ', qp);

    let params = new HttpParams();
    if(!!qp){
      params = new HttpParams()
        .set('member', qp.uid ? qp.uid: null)
        .set('project', qp.pid ? qp.pid : null);
    }
    return this.http.get<DesignSize[]>(this.designSizeUrl, {observe: 'response', params: params})
      .pipe(
        // tap(resp => console.log('response: ', resp)),
        catchError(FilterService.handleError)
      );
  }
  getTireLines(qp?): Observable<HttpResponse<TireLine[]>>{
    let params = new HttpParams();
    if(!!qp){
      params = new HttpParams()
        .set('owner', qp.uid ? qp.uid: null)
        .set('project', qp.pid ? qp.pid : null);

    }
    return this.http.get<TireLine[]>(this.tireLineUrl, {observe: 'response', params: params})
      .pipe(
        // tap(resp => console.log('response: ', resp)),
        catchError(FilterService.handleError)
      );
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
