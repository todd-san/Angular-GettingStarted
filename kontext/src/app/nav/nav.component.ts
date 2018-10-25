import { Component, OnInit } from '@angular/core';
import {FilterService} from "../filter/filter.service";
import {MenuService} from "../shared/menu.service";
import {BaseService} from "../shared/base.service";

declare var $: any;

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})

export class NavComponent implements OnInit {
  title: string = 'KTEK';
  filter_menu: boolean;
  filter_params: any;
  project_tree: boolean = true;

  constructor(private menuService: MenuService,
              private filterService: FilterService,
              private baseService: BaseService
  ) {

    filterService.filter_menu.subscribe(
      state =>{
        this.filter_menu = state;
      }
    );

    menuService.menuTree_params.subscribe(
      params => {
        this.filter_params = params;
        console.log(params);
      }
    );

    baseService.visible_projectTree.subscribe(
      visible_projectTree => {
        this.project_tree = visible_projectTree;
      }
    )
  }

  public emptyParams() {
      let empty = true;
      this.filter_params.updates.forEach((param) =>{
        if (param.value != null && param.param != 'page'){
          empty = false;
        }
      });
      return empty;
    }
  public toggleProjectTree(){
    this.project_tree = !this.project_tree;
    this.baseService.toggleProjectTree(this.project_tree);
  }
  public toggleFilter(){
    this.baseService.toggleProjectFilter();

  }

  ngOnInit() {
  }
}
