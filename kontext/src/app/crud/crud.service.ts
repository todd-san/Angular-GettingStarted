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

@Injectable({
  providedIn: 'root'
})

export class CrudService  {

  private kontext = new BehaviorSubject({});
  private project_types = new BehaviorSubject({});

  currentKontext= this.kontext.asObservable();
  token: any;

  constructor(private http: HttpClient, private baseService: BaseService) {
    this.baseService.currentToken.subscribe(token => this.token = token)
  }

  getProjectTypes(): Observable<HttpResponse<ProjectType>>{
    let url: string = "http://127.0.0.1:8000/kore/api/project_types/";

    return this.http.get<ProjectType>(url, {observe: 'response'})
      .pipe(
        tap(resp => this.setProjectTypes(resp)),
        catchError(CrudService.handleError)
      )

  }

  getKontextById(type, id): Observable<HttpResponse<KontextItem[]>>{

    let url: string = CrudService.getUrl(type, id);
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


  setCurrentKontext(type, id){
    this.getKontextById(type, id).subscribe(
      item =>{
        this.kontext.next(item.body);
      }
    );
  }
  setProjectTypes(response){
    this.project_types.next(response.body);
  }

  private static getUrl(type, id){
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
