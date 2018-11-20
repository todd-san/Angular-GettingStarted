import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs/index";
import {KontextItem} from "../shared/kontextItem";
import {catchError, tap} from "rxjs/operators";
import {throwError} from "rxjs/internal/observable/throwError";
import {ProjectType} from "../shared/projectType";
import {BaseService} from "../shared/base.service";
import {EMPTY} from "rxjs/index";
import {map} from "rxjs/internal/operators";
import {ApiService} from "../shared/api.service";

@Injectable({
  providedIn: 'root'
})

export class CrudService  {

  private kontext = new BehaviorSubject({});
  private _project_types = new BehaviorSubject([]);
  private _tire_lines = new BehaviorSubject([]);
  private _tire_types = new BehaviorSubject([]);
  private _speed_ratings = new BehaviorSubject([]);
  private _load_ratings = new BehaviorSubject([]);
  private _factories = new BehaviorSubject([]);
  private _regions = new BehaviorSubject([]);

  token: any;

  tire_lines = this._tire_lines.asObservable();
  regions = this._regions.asObservable();
  factories = this._factories.asObservable();
  tire_types = this._tire_types.asObservable();
  load_ratings = this._load_ratings.asObservable();
  speed_ratings = this._speed_ratings.asObservable();
  project_types = this._project_types.asObservable();



  currentKontext= this.kontext.asObservable();

  constructor(private http: HttpClient,
              private baseService: BaseService,
              private apiService: ApiService) {

    this.baseService.currentToken.subscribe(token => this.token = token);

  }

  get_ProjectTypes(): Observable<HttpResponse<any>>{
    let url: string = this.apiService.project_types;

    return this.http.get<any>(url, {observe: 'response'})
      .pipe(
        tap(resp => this._project_types= resp.body),
        catchError(CrudService.handleError)
      )

  }
  get_TireLines(): Observable<HttpResponse<any>>{
    let url = this.apiService.tire_lines;
    return this.http.get<any>(url, {observe: 'response'})
      .pipe(
        tap(resp => this._tire_lines = resp.body),
        catchError(CrudService.handleError)
      )
  }
  get_TireTypes(): Observable<HttpResponse<any>>{
    let url = this.apiService.tire_types;
    return this.http.get<any>(url, {observe: 'response'})
      .pipe(
        tap(resp => this._tire_types = resp.body),
        catchError(CrudService.handleError)
      )
  }
  get_SpeedRatings(): Observable<HttpResponse<any>>{
    let url = this.apiService.speed_ratings;
    return this.http.get<any>(url, {observe: 'response'})
      .pipe(
        tap(resp => this._speed_ratings = resp.body),
        catchError(CrudService.handleError)
      )
  }
  get_LoadRatings(): Observable<HttpResponse<any>>{
    let url = this.apiService.load_ratings;
    return this.http.get<any>(url, {observe: 'response'})
      .pipe(
        tap(resp => this._load_ratings = resp.body),
        catchError(CrudService.handleError)
      )
  }
  get_Factories(): Observable<HttpResponse<any>>{
    let url = this.apiService.factories;
    return this.http.get<any>(url, {observe: 'response'})
      .pipe(
        tap(resp => this._factories = resp.body),
        catchError(CrudService.handleError)
      )
  }
  get_Regions(): Observable<HttpResponse<any>>{
    let url = this.apiService.regions;
    return this.http.get<any>(url, {observe: 'response'})
      .pipe(
        tap(resp => this._regions = resp.body),
        catchError(CrudService.handleError)
      )
  }

  getKontextById(type, id): Observable<HttpResponse<KontextItem[]>>{

    let url: string = this.getUrl(type, id);
    if (url){
      return this.http.get<any[]>(url, {observe: 'response'})
        .pipe(
          tap(resp => this.kontext.next(resp.body)),
          catchError(CrudService.handleError)
        )
    } else{
      return EMPTY
    }
  }
  setCurrentKontext(type, id){
      this.getKontextById(type, id).subscribe(
        item =>{
          this.kontext.next(item.body);
        }
      );
    }

  create(url, model): Observable<HttpResponse<any>>{
    return this.http.post<any>(url, model, {observe: 'response'})
        .pipe(
          map(resp => {return resp}),
          catchError(CrudService.handleError)
        )
  }
  destroy(url): Observable<HttpResponse<any>>{
    return this.http.delete<any>(url, {observe: 'response'})
      .pipe(
        map(resp => {return resp}),
        catchError(CrudService.handleError)
      )
  }
  update(url, model): Observable<HttpResponse<any>>{
    console.log('crudService: ', model);
    return this.http.put<any>(url, model, {observe: 'response'})
      .pipe(
        map(resp=> {return resp}),
        catchError(CrudService.handleError)
      )
  }

  private getUrl(type, id){
    switch (type){
      case 'project': {
        return this.apiService.host + "/kontext/projects/" + id.toString() + '/';
      }
      case 'phase': {
        return this.apiService.host + "/kontext/phases/" + id.toString() + '/';
      }
      case 'design': {
        return this.apiService.host + "/kontext/designs/" + id.toString() + '/';
      }
      case 'spec': {
        return this.apiService.host + "/kontext/specs/" + id.toString() + '/';
      }
      default: {
        return null
      }
    }
  }
  private static handleError(err: HttpErrorResponse){
    let errorMessage = '';
    if (err.error instanceof ErrorEvent){
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    return throwError(errorMessage);
  }
}
