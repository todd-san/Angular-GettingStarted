import {Component, OnInit, ViewChild, Input} from '@angular/core';
import {MenuService} from "./menu.service";
import {ContextMenuService, ContextMenuComponent} from "ngx-contextmenu";
import {FilterService} from "../filter/filter.service";

// Interfaces
import {PaginationHeaders} from "./interfaces/paginationHeaders";
import {Project} from "./interfaces/project";
import {Page} from "./interfaces/page";
import {filter} from "rxjs/internal/operators";


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})


export class MenuComponent implements OnInit {

  page: Page = <Page>{};
  items: Project[] = [];
  paginationHeaders: PaginationHeaders;
  errorMessage: string;
  filter_params: any;
  message: string;

  private contextMenuService;
  // private filterService;

  @ViewChild('projectMenu') public projectMenu: ContextMenuComponent;
  @ViewChild('phaseMenu') public phaseMenu: ContextMenuComponent;
  @ViewChild('designMenu') public designMenu: ContextMenuComponent;
  @ViewChild('specMenu') public specMenu: ContextMenuComponent;

  constructor(private menuService: MenuService, private filterService : FilterService) {
    filterService.currentMessage.subscribe(
      message => {
        this.message =message;
      }
    );
    this.contextMenuService = ContextMenuService;
  }

  public onContextMenu($event: MouseEvent, item: any): void {
    this.contextMenuService.show.next({ event: $event, item: item });
    $event.preventDefault();
  }

  public fetchMenuItems(page?){
    // this.filterService.filter_params.subscribe(filter_params => this.filter_params = filter_params);
    // console.log('query_params @ menu.component.ts: ', this.filter_params);
    // console.log(this.filterService);
    this.newMessage();
    this.menuService.getMenu(page).subscribe(
      items => {
        this.items = items.body;
        this.paginationHeaders = {
          xPage: parseInt(items.headers.get('X-Page')),
          xPerPage: parseInt(items.headers.get('X-Per-Page')),
          xTotal: parseInt(items.headers.get('X-Total')),
          xTotalPages: parseInt(items.headers.get('X-Total-Pages'))
        };
        this.setPagination();
      },
      error => this.errorMessage = <any>error
    );
  }

  public setPagination(){
    let next = function(page, total){
      return page < total
    };
    let prev = function(page){
      return page > 1
    };

    let double_next = function(page, total){
      return (page+1) < total;
    };
    let double_prev = function(page){
      return (page-1) > 1
    };

    this.page.page = this.paginationHeaders.xPage;
    this.page.next = next(this.page.page, this.paginationHeaders.xTotalPages);
    this.page.prev = prev(this.page.page);
    this.page.double_next = double_next(this.page.page, this.paginationHeaders.xTotalPages);
    this.page.double_prev = double_prev(this.page.page);

  }

  newMessage(){
    console.log('===============================');
    console.log('current message: ', this.message);
    console.log('-------------------------------');
    console.log('setting new message!');
    this.filterService.changeMessage('Hello From MenuComponent!');
    console.log(this.message);
    console.log('===============================');
  }


  ngOnInit() {
    this.fetchMenuItems();
  }
}


