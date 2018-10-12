import { Component, ViewChild, Inject, OnInit } from '@angular/core';
import {ToastaService, ToastaConfig, ToastOptions, ToastData} from 'ngx-toasta';

declare var $:any;

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
})

export class ContentComponent implements OnInit{
 constructor(private toastaService: ToastaService,
              private toastaConfig: ToastaConfig){
   this.toastaConfig.theme = 'material';
   this.toastaConfig.position= 'top-center';
   this.toastaConfig.position.big();
 }

 addToast(title, msg) {
    // Just add default Toast with title only
    // Or create the instance of ToastOptions
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
    // Add see all possible types in one shot
    // this.toastaService.info(toastOptions);
    this.toastaConfig.position = 'bottom-fullwidth';
    this.toastaService.success(toastOptions);
    // this.toastaService.wait(toastOptions);
    // this.toastaService.error(toastOptions);
    // this.toastaService.warning(toastOptions);
 }


 ngOnInit() {

 }



}
