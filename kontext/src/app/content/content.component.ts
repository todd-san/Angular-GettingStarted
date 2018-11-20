import { Component, ViewChild, Inject, OnInit } from '@angular/core';
import {ToastaService, ToastaConfig, ToastOptions, ToastData} from 'ngx-toasta';
import {CrudService} from "../crud/crud.service";
import {BaseService} from "../shared/base.service";

declare var $:any;

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
})

export class ContentComponent implements OnInit{
  projects: any;
  tree: boolean;

  constructor(
    private toastaService: ToastaService,
    private toastaConfig: ToastaConfig,
    private crudService:CrudService,
    private baseService: BaseService,
  ){
    this.toastaConfig.theme = 'material';
    this.toastaConfig.position= 'top-center';
    this.toastaConfig.position.big();
 }

 log(){
    console.log("================== THIS.PROJECT_TREE =======================");
    console.log(this.tree);
    console.log("================== THIS.PROJECT_TREE =======================");
 }
 ngOnInit() {
    this.baseService.visibleTree.subscribe(
      next=>{
        this.tree = next;

      }
    )
 }

}
