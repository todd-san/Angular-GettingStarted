import {Component, OnInit, ViewChild} from '@angular/core';
import {ContextMenuService, ContextMenuComponent} from "ngx-contextmenu";
import {FilterService} from "../filter/filter.service";
import {NestedTreeControl} from "@angular/cdk/tree";
import {MatTreeNestedDataSource} from "@angular/material/tree";
import {ToastaService, ToastaConfig, ToastOptions, ToastData} from 'ngx-toasta';


import {KontextItem} from "../shared/kontextItem";
import {CrudService} from "../crud/crud.service";
import {Router} from "@angular/router";
import {PaginationHeaders} from "./interfaces/paginationHeaders";
import {Page} from "./interfaces/page";
import {MenuService} from "../shared/menu.service";
import {BaseService} from "../shared/base.service";
import {ProjectCrudComponent} from "../crud/project-crud.component";


declare var $: any;


@Component({
  selector: 'app-project-tree',
  templateUrl: './project-tree.component.html',
  styleUrls: ['./project-tree.component.css']
})

export class ProjectTreeComponent implements OnInit {
  kontextDetail: any;
  page: Page = <Page>{};
  paginationHeaders: PaginationHeaders;
  filter_params: any;
  message: string;
  showProjects: boolean = true;
  nestedTreeControl: NestedTreeControl<KontextItem>;
  nestedDataSource: MatTreeNestedDataSource<KontextItem>;
  selectedKontext: any = {};


  @ViewChild('kontextMenu') public kontextMenu: ContextMenuComponent;

  constructor(
    private menuService: MenuService,
    private filterService : FilterService,
    private contextMenuService: ContextMenuService,
    private toastaService: ToastaService,
    private toastaConfig: ToastaConfig,
    private crudService: CrudService,
    private baseService: BaseService,
    private router: Router,) {

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
        this.nestedDataSource.data = this.buildFileTree(items, 0);
        if(this.filter_params.hasOwnProperty('updates')){
          this.expandFiltered();
        }
      }
    );
    filterService.currentPagination.subscribe(
      pagination =>{
        this.paginationHeaders = pagination;
        this.setPagination();
      }
    );
  }

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
    console.log(this.page)
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
  public toggleFilter(){
    this.baseService.toggleProjectFilter();
  }
  public closeProjectTree(){
    this.baseService.toggleProjectTree(false);
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
    this.menuService.getMenu({},1).subscribe(
      items => {
        this.nestedDataSource.data = this.buildFileTree(items.body, 0);
        this.filterService.currentPagination.subscribe(
          pagination =>{
            this.paginationHeaders = pagination;
            console.log('------------------------------------');
            console.log(this.paginationHeaders);
            console.log('------------------------------------');
            this.setPagination();
          }
        );
      }
    );

  }

  /* some handy logger functions
  * */
  public log(item){
    this.crudService.getKontextById(item.type, item.id).subscribe(
      details =>{
        this.kontextDetail = details.body;
      }
    );
  }

  /* context menu CRUD triggers
  *
  * */
  public createItem(obj, sibling=false){
    function toggleCreateProjectModal(){
      $('#projectCreateModal').modal('show');
    }
    function toggleCreatePhaseModal(){
      $("#phaseCreateModal").modal('show');
    }
    function toggleCreateDesignModal(){
      $("#designCreateModal").modal('show');
    }
    function toggleCreateSpecModal(){
      $("#specCreateModal").modal('show');
    }
    this.crudService.setCurrentKontext(obj.type, obj.id);

    switch (obj.type && sibling){
      case 'project' && true:
        return toggleCreateProjectModal();
      case 'project' && false:
        return toggleCreatePhaseModal();
      case 'phase' && true:
        return toggleCreatePhaseModal();
      case 'phase' && false:
        return toggleCreateDesignModal();
      case 'design' && true:
        return toggleCreateDesignModal();
      case 'design' && false:
        return toggleCreateSpecModal();
      case 'spec' && true:
        return toggleCreateSpecModal();

    }
  }
  public editItem(obj){
    console.log('edit attempt: ', obj);
    this.crudService.setCurrentKontext(obj.type, obj.id);
    switch (obj.type){
      case 'project':
        return $('#projectEditModal').modal('show');
      case 'phase':
        console.log('trying to edit phase!');
        return $("#phaseEditModal").modal('show');
      case 'design':
        return $("#designEditModal").modal('show');
      case 'spec':
        return $("#specEditModal").modal('show');
    }
  }
  public deleteItem(obj){
    console.log(obj);
    this.crudService.setCurrentKontext(obj.type, obj.id);
    switch (obj.type){
      case 'project':
        return $('#projectDeleteModal').modal('show');
      case 'phase':
        return $("#phaseDeleteModal").modal('show');
      case 'design':
        return $("#designDeleteModal").modal('show');
      case 'spec':
        return $("#specDeleteModal").modal('show');
    }

  }


  /* Route content to new page
  * */
  public activateRoute(node){
    console.log(node.type+"/"+node.id);
    this.router.navigate([node.type + "/" + node.id]);
    // this.activeLink = !this.activeLink;

    this.nestedTreeControl.expand(node);

  }
  public isExpandedOrActive(node){
    let ans = false;

    // console.log(this.router);

    return this.nestedTreeControl.isExpanded(node);




  }
  public expandFiltered(){
    // maybe I should make expansion recursive?

    let params = {};

    this.filterService.filter_params.subscribe(
      items =>{
          params = items;
        });

    // this.filter_params['updates'].forEach(item=>{
    //   params[item.param] = item.value;
    // });

    console.log('===================================================');
    console.log('params: ', params);
    console.log('===================================================');

    if (params['pid']){
      this.nestedDataSource.data.forEach(item =>{
        if(item.name === params['pid'].name){
          this.nestedTreeControl.expand(item);
        }
      })
    }

    if (params['phase']){
      this.nestedDataSource.data.forEach( item =>{
        item.children.forEach(nested_item =>{
          this.nestedTreeControl.expand(nested_item)
        })
      })
    }

    if (params['size']){
      this.nestedDataSource.data.forEach( item =>{
        item.children.forEach(nested_item =>{
          nested_item.children.forEach(dble_nested_item => {
            this.nestedTreeControl.expand(dble_nested_item);
          })
        })
      })
    }

    console.log('---------------------------------------');
    console.log(this.filter_params.updates);
    console.log(params);
    console.log(this.nestedDataSource.data);
    console.log('---------------------------------------');

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
    this.toastaConfig.theme = 'material';
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



