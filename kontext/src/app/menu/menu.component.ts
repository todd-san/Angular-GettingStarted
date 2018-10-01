import { Component, OnInit } from '@angular/core';
import {MenuService} from "./menu.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  providers: [MenuService,]
})
export class MenuComponent implements OnInit {
  items: any = [];
  filteredItems: any = [];
  errorMessage: string;

  constructor(private menuService: MenuService) { }

  ngOnInit() {
    this.menuService.getMenu().subscribe(
      items => {
        this.items = items;
        this.filteredItems = this.items;
      },
      error => this.errorMessage = <any>error
    );
  }

}
