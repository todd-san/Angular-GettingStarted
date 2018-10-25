import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs/index";
import {KontextItem} from "../shared/kontextItem";
import {catchError, tap} from "rxjs/operators";
import {throwError} from "rxjs/internal/observable/throwError";
import {ProjectType} from "../shared/projectType";
import {BaseService} from "../shared/base.service";

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

  getProjectType(): Observable<HttpResponse<ProjectType>>{
    let url: string = "http://127.0.0.1:8000/kore/api/project_types/";

    return this.http.get<ProjectType>(url, {observe: 'response'})
      .pipe(
        tap(resp => this.setProjectTypes(resp)),
        catchError(CrudService.handleError)
      )

  }
  getKontextById(type, id): Observable<HttpResponse<KontextItem[]>>{

    let url: string = CrudService.getUrl(type, id);
    console.log('type & id used: ', type,',', id);
    console.log('url used: ', url);
    return this.http.get<any[]>(url, {observe: 'response'})
      .pipe(
        tap(resp => this.setCurrentKontext(resp)),
        catchError(CrudService.handleError)
      )


  }


  public setCurrentKontext(response){
    this.kontext.next(response.body);
  }
  public setProjectTypes(response){
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
        return 'type: ' + type + ' and id: ' + id.toString() + ' were not able to be parsed into a url'
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
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
