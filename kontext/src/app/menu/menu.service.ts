import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {catchError, tap,} from "rxjs/operators";
import {throwError} from "rxjs/internal/observable/throwError";

// import {IProduct} from "./product";


@Injectable({
  providedIn: 'root'
})


export class MenuService {
  // private productUrl = "api/products/products.json";

  private treeUrl = "http://127.0.0.1:8000/kontext/projects/nav_menu/";

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(private http: HttpClient){}

  getMenu(page?): Observable<any[]>{
    if(page){
      return this.http.get<any[]>(this.treeUrl+"?page="+page,).pipe(
        tap(data => console.log('Page'+page+', data: ', data)),
        catchError(this.handleError)
      );
    } else{
      return this.http.get<any[]>(this.treeUrl,).pipe(
        tap(data => console.log('Page 1, data: ', data)),
        catchError(this.handleError)
      );
    }

  }

  private handleError(err: HttpErrorResponse){
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
