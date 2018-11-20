import { Component, OnInit } from '@angular/core';
import {FilterService} from "../filter/filter.service";
import {MenuService} from "../shared/menu.service";
import {BaseService} from "../shared/base.service";
import {AuthenticationService} from "../shared/authentication.service";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {ApiService} from "../shared/api.service";

declare var $: any;

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})

export class NavComponent implements OnInit {
  tree: boolean = true;
  current_user: any;
  route: any;
  host: string;

  constructor(private baseService: BaseService,
              private router: Router,
              private active_route: ActivatedRoute,
              private apiService: ApiService,
              private authenticationService: AuthenticationService) {


    baseService.visibleTree.subscribe(
      visible_projectTree => {
        this.tree = visible_projectTree;
      }
    );

    this.router.events.subscribe(
      route =>{
        this.route = route;
      }
    );

    this.host = this.apiService.host;
  }



  // todo: probably should put this into ApiService? or make a part of a service?
  // todo: I think the logic for route switching should be contained to one primary location.
  toggleMenuTree(){
    this.tree = !this.tree;

    if(this.apiService.menuTreeFromRoute(this.route.url)){
      this.baseService.toggleProjectTree(this.tree);
    } else{
      this.baseService.toggleSpecTree(this.tree);
    }

  }

  toggleFilter(){
    this.baseService.toggleProjectFilter();

  }
  logout(){
    this.authenticationService.logout();
  }

  ngOnInit() {
    this.current_user = JSON.parse(localStorage.getItem('currentUser'));
  }
}
