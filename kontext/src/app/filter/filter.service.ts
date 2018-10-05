import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse, HttpResponse, HttpParams} from "@angular/common/http";
import {Observable, Subject, BehaviorSubject} from "rxjs";
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
  private query_parameters = new BehaviorSubject({});
  filter_params = this.query_parameters.asObservable();

  private messageSource = new BehaviorSubject('default message');
  currentMessage = this.messageSource.asObservable();

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
        .set('member', qp.uid ? qp.uid.username : null);
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
        // tap(resp => console.log('response: ', resp)),
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
    console.log('setValue.params: ', params);
    this.query_parameters.next(params)
  }

  changeMessage(message: string) {
    this.messageSource.next(message);
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
