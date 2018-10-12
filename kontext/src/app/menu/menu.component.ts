import {ChangeDetectorRef, Component, enableProdMode, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {MenuService} from "./menu.service";
import {ContextMenuService, ContextMenuComponent} from "ngx-contextmenu";
import {FilterService} from "../filter/filter.service";
import {NestedTreeControl} from "@angular/cdk/tree";
import {MatTreeNestedDataSource} from "@angular/material/tree";
import {ToastaService, ToastaConfig, ToastOptions, ToastData} from 'ngx-toasta';



declare var $: any;

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
  showProjects: boolean = true;

  nestedTreeControl: NestedTreeControl<KontextItem>;
  nestedDataSource: MatTreeNestedDataSource<KontextItem>;


  @ViewChild('kontextMenu') public kontextMenu: ContextMenuComponent;

  constructor(private menuService: MenuService,
              private filterService : FilterService,
              private contextMenuService: ContextMenuService,
              private toastaService: ToastaService,
              private toastaConfig: ToastaConfig,
              ) {

    this.nestedTreeControl = new NestedTreeControl<KontextItem>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();

    this.toastaConfig.theme = 'material';
    menuService.menuTree_params.subscribe(
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
    console.log("requesting page: ", page);

    let params = {
      uid: {username: this.filter_params.updates[0].value},
      pid: {name: this.filter_params.updates[1].value},
      phid: {name: this.filter_params.updates[2].value},
      sid: {size: this.filter_params.updates[3].value},
      lid: {id: this.filter_params.updates[4].value},
    };


    this.menuService.getMenu(params, page).subscribe(
      items => {
        this.nestedDataSource.data = this.buildFileTree(items.body, 0);
        this.paginationHeaders = {
          xPage: parseInt(items.headers.get('X-Page')),
          xPerPage: parseInt(items.headers.get('X-Per-Page')),
          xTotal: parseInt(items.headers.get('X-Total')),
          xTotalPages: parseInt(items.headers.get('X-Total-Pages'))
        };
        this.setPagination();
      }
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

    console.log(this.page);
    console.log(this.paginationHeaders);
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
    console.log($('#headerFilterToggle').click());
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

  public showProjectTree(){
    if(this.showProjects){
      if(this.filter_params.hasOwnProperty('updates')){
        return true;
      }
    }
    return false;
  }

  public cleanFilter(){
    console.log('here!');
    // this.filterService.changeParams({});
    this.menuService.getMenu({},null).subscribe(
      items => {
        this.nestedDataSource.data = this.buildFileTree(items.body, 0);
      }
    );
  }

  showCopyMessage(action, item){
    var toastOptions:ToastOptions = {
        title: action + ' Success!',
        msg: item.type.toUpperCase() + ': ' + item.name + ', Copied Successfully',
        showClose: true,
        timeout: 5000,

        // onAdd: (toast:ToastData) => {
        //     console.log('Toast ' + toast.id + ' has been added!');
        // },
        // onRemove: function(toast:ToastData) {
        //     console.log('Toast ' + toast.id + ' has been removed!');
        // }
    };
    this.toastaConfig.theme = 'bootstrap';
    this.toastaService.success(toastOptions);

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
    this.setPagination();
  }
}


