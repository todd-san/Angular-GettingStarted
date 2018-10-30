import { Component, OnInit } from '@angular/core';
import {FilterService} from "../filter/filter.service";
import {MenuService} from "../shared/menu.service";
import {BaseService} from "../shared/base.service";
import {AuthenticationService} from "../shared/authentication.service";

declare var $: any;

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})

export class NavComponent implements OnInit {
  project_tree: boolean = true;
  current_user: any;

  constructor(private baseService: BaseService, private authenticationService: AuthenticationService) {


    baseService.visible_projectTree.subscribe(
      visible_projectTree => {
        this.project_tree = visible_projectTree;
      }
    );

  }

  toggleProjectTree(){
    this.project_tree = !this.project_tree;
    this.baseService.toggleProjectTree(this.project_tree);
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
