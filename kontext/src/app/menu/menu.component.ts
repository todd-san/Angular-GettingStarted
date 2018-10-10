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

  @ViewChild('projectMenu') public projectMenu: ContextMenuComponent;
  @ViewChild('phaseMenu') public phaseMenu: ContextMenuComponent;
  @ViewChild('designMenu') public designMenu: ContextMenuComponent;
  @ViewChild('specMenu') public specMenu: ContextMenuComponent;

  constructor(private menuService: MenuService, private filterService : FilterService) {
    filterService.filter_params.subscribe(
      params => {
        this.filter_params = params;
      }
    );
    filterService.currentItems.subscribe(
      items =>{
        this.items = items;
      }
    );
    filterService.currentPagination.subscribe(
      pagination =>{
        this.paginationHeaders = pagination;
        this.setPagination();
      }
    );

    this.contextMenuService = ContextMenuService;
  }

  public onContextMenu($event: MouseEvent, item: any): void {
    this.contextMenuService.show.next({ event: $event, item: item });
    $event.preventDefault();
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

  public showMessage(item){
    console.log(item);
  }


  public log(item){
    console.log(item);
    console.log(this.filter_params)
  }

  ngOnInit() {

  }
}


