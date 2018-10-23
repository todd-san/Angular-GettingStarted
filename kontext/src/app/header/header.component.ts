import { Component, OnInit, Input } from '@angular/core';
import {FilterService} from "../filter/filter.service";
import {MenuService} from "../menu/menu.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {

  title: string = 'KTEK';
  filter_menu: boolean;
  filter_params: any;

  constructor(private menuService: MenuService, private filterService: FilterService) {
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

  ngOnInit() {
  }

}
