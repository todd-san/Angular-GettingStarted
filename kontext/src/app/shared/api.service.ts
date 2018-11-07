import {Injectable, } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs/index";
import {catchError, tap} from "rxjs/operators";
import {throwError} from "rxjs/internal/observable/throwError";



@Injectable({
  providedIn: 'root'
})

export class ApiService  {

  /* One host address to rule them all
  *
  * The idea here is to have the host address and all of the api-routes in one common location
  * so that if they need switched you don't have to search around the client project to switch
  * all different instances
  *
  * */
  // public host: string = "http://127.0.0.1:8000";
  // public host = "http://ktek/";
  // public host = "http://127.0.0.1:8888";
  public host = "http://kendaeng02:8080";


  /* Login Route
  * */
  public login: string = this.api('/login/');

  /* Base-Routes for creating CRUD
  * */
  public projects: string = this.api('/kontext/projects/');
  public phases: string = this.api('/kontext/phases/');
  public designs: string = this.api('/kontext/designs/');
  public specs: string = this.api('/kontext/specs/');

  /* Routes used by FilterComponent & FilterService
  * */
  public filter_menu_users: string = this.api("/kore/api/users/");
  public filter_menu_projects: string = this.api("/kontext/projects/names/");
  public filter_menu_phases: string = this.api("/kontext/phases/names/");
  public filter_menu_sizes: string = this.api("/kontext/designs/sizes/");
  public filter_menu_lines: string = this.api("/kore/api/lines/");

  /* Routes used by ProjectTreeComponent & MenuService
  * */
  public project_tree: string = this.api("/kontext/projects/nav_menu/");

  /* Routes used by CrudService & all of the CrudComponents
  * */
  public project_types: string = this.api('/kontext/projects/project_types/');
  public tire_types: string = this.api('/kontext/designs/tire_types/');
  public tire_lines = this.filter_menu_lines;
  public load_ratings: string = this.api('/kore/api/load_ratings/');
  public speed_ratings: string = this.api('/kore/api/speed_ratings/');
  public factories: string = this.api('/kore/api/factories/');
  public regions: string = this.api('/kore/api/regions/');


  /* Simply stiches the "host" and the route together
  * */
  public api(address){
    return this.host + address;
  }

  public obj_detail(address, id){
    return address + id.toString()+'/';
  }


  constructor() {}

}
