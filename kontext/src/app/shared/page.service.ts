import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class PageService {
  public query_params: any;
  // constructor(){}

  set setQueryParams(params: {}){
    console.log(params);
    this.query_params = params;
  }
  get getQueryParams(){
    return this.query_params;
  }


}
