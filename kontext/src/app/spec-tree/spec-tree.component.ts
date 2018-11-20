import { Component, OnInit } from '@angular/core';
import {KontextItem} from "../shared/kontextItem";
import {CrudService} from "../crud/crud.service";
import {MenuService} from "../shared/menu.service";
import {BaseService} from "../shared/base.service";
import {NestedTreeControl} from "@angular/cdk/tree";
import {MatTreeNestedDataSource} from "@angular/material/tree";
import {ContextMenuService, ContextMenuComponent} from "ngx-contextmenu";
import {ToastaService, ToastaConfig, ToastOptions} from 'ngx-toasta';
import {Router, ActivatedRoute} from "@angular/router";

declare var $: any;

@Component({
  selector: 'app-spec-tree',
  templateUrl: './spec-tree.component.html',
})

export class SpecTreeComponent implements OnInit {
  spec: any;
  route: any;
  nestedTreeControl: NestedTreeControl<KontextItem>;
  nestedDataSource: MatTreeNestedDataSource<KontextItem>;


  constructor(private crudService: CrudService,
              private contextMenuService: ContextMenuService,
              private toastaService: ToastaService,
              private toastaConfig: ToastaConfig,
              private menuService: MenuService,
              private current_route: ActivatedRoute,
              private baseService: BaseService,
              private router: Router,) {

    this.nestedTreeControl = new NestedTreeControl<KontextItem>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();


    this.router.events.subscribe(
      route =>{
        this.route = route;
      }
    );

    this.menuService.spec_tree.subscribe(item=>{
      this.spec = item;
    })
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
  public closeProjectTree(){
    this.baseService.toggleProjectTree(false);
  }
  public closeSpecTree(){
    this.baseService.toggleSpecTree(false);
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

    console.log('obj: ', obj);
    console.log('sibling: ', sibling);

    switch (obj.type){
      case 'project':
        if(sibling){
          return toggleCreateProjectModal();
        }
        return toggleCreatePhaseModal();

      case 'phase':
        if(sibling){
          return toggleCreatePhaseModal();
        }
        return toggleCreateDesignModal();

      case 'design':
        if(sibling){
          return toggleCreateDesignModal();
        }
        return toggleCreateSpecModal();

      case 'spec':
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

    if(node.type === 'spec'){
      console.log('TRIGGER spec-tree menu now!');
      this.baseService.toggleSpecTree(true);
    }

    this.router.navigate([node.type + "/" + node.id]);
    this.nestedTreeControl.expand(node);

  }
  public isExpandedOrActive(node){
    let ans = false;

    // console.log(this.router);

    return this.nestedTreeControl.isExpanded(node);
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

  /* LOG
  * */
  public log(){
    console.log('=====================================');
    console.log('SPEC-TREE');
    console.log(this.spec);
    console.log(this.menuService.spec_tree);
    console.log('ROUTER');
    console.log(this.router);
    console.log('=====================================');
  }
  
  ngOnInit() {
  }

}
