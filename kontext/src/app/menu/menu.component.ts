import {Component, OnInit, ViewChild} from '@angular/core';
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
import {CrudService} from "../crud/crud.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})


export class MenuComponent implements OnInit {
  kontextDetail: any;
  page: Page = <Page>{};
  paginationHeaders: PaginationHeaders;
  filter_params: any;
  message: string;

  showTools: boolean = false;
  showProjects: boolean = true;

  nestedTreeControl: NestedTreeControl<KontextItem>;
  nestedDataSource: MatTreeNestedDataSource<KontextItem>;


  @ViewChild('kontextMenu') public kontextMenu: ContextMenuComponent;

  /* constructor
  * menuService subscriptions
  * filterService subscriptions
  * toastaService & Config subscriptions
  *
  * */
  constructor(private menuService: MenuService,
              private filterService : FilterService,
              private contextMenuService: ContextMenuService,
              private toastaService: ToastaService,
              private toastaConfig: ToastaConfig,
              private crudService: CrudService,
              private router: Router,
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
    // console.log($('#headerFilterToggle').click());
    // $('#headerFilterToggle').click();
    console.log($('.offcanvas-collapse').toggleClass('open'))
  }
  public toggleProjectTree(){
    if(this.showProjects){
      if(this.filter_params.hasOwnProperty('updates')){
        return true;
      }
    }
    return false;
  }

  /*
  * */
  public emptyParams() {
    let empty = true;
    if(this.filter_params && this.filter_params.hasOwnProperty('updates')){
      this.filter_params.updates.forEach((param) =>{
        if (param.value != null && param.param != 'page'){
          empty = false;
        }
      });
    }

    return empty;
  }
  public cleanFilter(){
    // this.filterService.changeParams({});
    this.menuService.getMenu({},null).subscribe(
      items => {
        this.nestedDataSource.data = this.buildFileTree(items.body, 0);
      }
    );
  }

  /*
  * */
  public log(item){
    this.crudService.getKontextById(item.type, item.id).subscribe(
      details =>{
        this.kontextDetail = details.body;
      }
    );
  }

  /*
  *
  * */
  public createItem(obj, sibling=false){
    // console.log('======== CRUD MODAL LAUNCHER =========');
    // console.log(obj.type);
    // console.log(sibling);
    // console.log('======================================');

    // $("#projectCreateModal").modal('show')

    if (obj.type === 'project' && sibling){
      $("#projectCreateModal").modal('show');
    } else if (obj.type === 'project' && !sibling){
      $("#phaseCreateModal").modal('show');
    } else if (obj.type === 'phase' && sibling){
      $("#phaseCreateModal").modal('show');
    } else if (obj.type === 'phase' && !sibling){
      $("#designCreateModal").modal('show');
    } else if (obj.type === 'design' && sibling){
      $("#designCreateModal").modal('show');
    }  else if (obj.type === 'design' && !sibling){
      $("#specCreateModal").modal('show');
    }  else if (obj.type === 'spec' && sibling){
      $("#specCreateModal").modal('show');
    }
  }
  public editItem(obj){
    $("#projectEditModal").modal('show');
  }
  public deleteItem(obj){
    // console.log('delete: ', obj);
    $("#projectDeleteModal").modal('show');
  }

  /*
  * */
  public showCopyMessage(action, item){
    let toastOptions:ToastOptions = {
        title: action + ' Success!',
        msg: item.type.toUpperCase() + ': ' + item.name + ', Copied Successfully',
        showClose: true,
        timeout: 5000,
    };
    this.toastaConfig.theme = 'bootstrap';
    this.toastaService.success(toastOptions);

  }
  public onContextMenu($event: MouseEvent, item: any): void {
    this.contextMenuService.show.next({ event: $event, item: item });
    $event.preventDefault();
  }

  ngOnInit() {
    this.setPagination();
  }
}


