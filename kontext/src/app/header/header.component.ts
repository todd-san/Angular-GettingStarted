import { Component, OnInit } from '@angular/core';
import {FilterService} from "../filter/filter.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  title: string = 'KTEK';
  filter_menu: boolean;

  constructor(private filterService: FilterService) {
    filterService.filter_menu.subscribe(
      state =>{
        this.filter_menu = state;
      }
    );
  }

  toggleFilter(){
    this.filter_menu =! this.filter_menu;
    this.filterService.toggleFilter(this.filter_menu);
  }

  ngOnInit() {
  }

}
