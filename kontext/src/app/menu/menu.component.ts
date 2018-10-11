import {Component, OnInit, ViewChild} from '@angular/core';
import {MenuService} from "./menu.service";
import {ContextMenuService, ContextMenuComponent} from "ngx-contextmenu";
import {FilterService} from "../filter/filter.service";
import {NestedTreeControl} from "@angular/cdk/tree";
import {MatTreeNestedDataSource} from "@angular/material/tree";


// Interfaces
import {PaginationHeaders} from "./interfaces/paginationHeaders";
import {Page} from "./interfaces/page";
import {KontextItem} from "../shared/kontextItem";


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})


export class MenuComponent implements OnInit {

  page: Page = <Page>{};
  paginationHeaders: PaginationHeaders;
  filter_params: any;
  message: string;

  showTools: boolean = false;
  showProjects: boolean = false;
  showFilter: boolean = false;

  nestedTreeControl: NestedTreeControl<KontextItem>;
  nestedDataSource: MatTreeNestedDataSource<KontextItem>;


  @ViewChild('kontextMenu') public kontextMenu: ContextMenuComponent;

  constructor(private menuService: MenuService,
              private filterService : FilterService,
              private contextMenuService: ContextMenuService) {

    this.nestedTreeControl = new NestedTreeControl<KontextItem>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();

    filterService.filter_params.subscribe(
      params => {
        this.filter_params = params;
      }
    );
    filterService.currentItems.subscribe(
      items =>{
        // this.items = items;
        this.nestedDataSource.data = this.buildFileTree(items, 0)
      }
    );
    filterService.currentPagination.subscribe(
      pagination =>{
        this.paginationHeaders = pagination;
        this.setPagination();
      }
    );

  }

  /* Pagination Control
  * */
  public fetchMenuItems(page){
    console.log("filter_params: ", this.filter_params);
    console.log("requesting page: ", page)
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

  /* Mat-tree controllers and build
  *
  * */
  public hasNestedChild = (_: number, nodeData: KontextItem) => {
    if (nodeData.children){
      return nodeData.children.length > 0;
    } else{
      return false;
    }
  };
  private buildFileTree(obj: any[], level: number): KontextItem[] {
    return obj.map(item => new KontextItem(item));
  }
  private _getChildren = (node: KontextItem) => node.children;

  /* DOM toggles
  *
  * */
  public toggleProjects(){
    this.showProjects = !this.showProjects;
  }
  public toggleTools(){
    this.showTools = !this.showTools;
  }
  public toggleFilter(){
    this.showFilter = !this.showFilter;
  }

  /* Context Menu
  *
  *
  * */
  public showMessage(item, value){
    console.log(item, value);
  }
  public onContextMenu($event: MouseEvent, item: any): void {
    this.contextMenuService.show.next({ event: $event, item: item });
    $event.preventDefault();
  }

  ngOnInit() {

  }
}


