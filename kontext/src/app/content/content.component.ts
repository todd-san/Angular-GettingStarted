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
  project_tree: boolean;
  container_class: string;

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

 addToast(title, msg) {
    var toastOptions:ToastOptions = {
        title: title,
        msg: msg,
        showClose: true,
        timeout: 5000,

        onAdd: (toast:ToastData) => {
            console.log('Toast ' + toast.id + ' has been added!');
        },
        onRemove: function(toast:ToastData) {
            console.log('Toast ' + toast.id + ' has been removed!');
        }
    };

    this.toastaConfig.position = 'bottom-fullwidth';
    this.toastaService.success(toastOptions);

 }

 log(){
    console.log("================== THIS.PROJECT_TREE =======================");
    console.log(this.project_tree);
    console.log("================== THIS.PROJECT_TREE =======================");
 }


 ngOnInit() {
    this.baseService.visible_projectTree.subscribe(
      next=>{
        this.project_tree = next;

      }
    )
 }



}
