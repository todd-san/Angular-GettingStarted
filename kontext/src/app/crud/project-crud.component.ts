import { Component, OnInit} from '@angular/core';
import {CrudService} from "./crud.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MenuService} from "../shared/menu.service";
import {FilterService} from "../filter/filter.service";
import {ToastaConfig, ToastaService, ToastOptions} from "ngx-toasta";

declare var $: any;


@Component({
  selector: 'project-crud',
  templateUrl: './forms/project.component.html',
  styleUrls: ['./crud.component.css'],
})

export class ProjectCrudComponent implements OnInit {
  loading: boolean = false;
  model: any = {};
  route: any;
  current_user: any;

  constructor(private crudService: CrudService,
              private router: Router,
              private toastaService: ToastaService,
              private toastaConfig: ToastaConfig,
              private filterService: FilterService,
              private menuService: MenuService) {

    this.crudService.currentKontext.subscribe( resp => {
      this.model = resp;
    });
    this.router.events.subscribe(
      route =>{
        this.route = route;
      }
    );
  }

  private handleSuccess(action, response){

    this.toastaConfig.theme = 'default';

    switch (action){
      case 'create': {
        let toastOptions = {
          title: 'Project Created!',
          msg: this.model.project_type.toUpperCase() + ': ' + this.model.name + ' '+ response.status + ', Created Successfully',
          showClose: true,
          timeout: 5000,
        };
        this.router.navigate(["/project/"+response.body.id.toString()]);
        this.toastaService.success(toastOptions);
        this.loading = false;

        return this.menuService.getMenu({}, 1).subscribe(
          resp =>{
            this.filterService.changeItems(resp.body);
            this.model = {};
            $('#projectCreateModal').modal('toggle');
          });
      }
      case 'destroy': {
        let toastOptions = {
          title: 'Project Deleted!',
          msg: this.model.type.toUpperCase() + ': ' + this.model.name + ' '+ response.status + ', Deleted Successfully',
          showClose: true,
          timeout: 5000,
        };
        this.router.navigate(["/"]);
        this.toastaService.success(toastOptions);
        this.loading = false;

        return this.menuService.getMenu({}, 1).subscribe(
          resp =>{
            this.filterService.changeItems(resp.body);
            $('#projectDeleteModal').modal('toggle');
          });
      }
      case 'update':
        let toastOptions = {
          title: 'Project Updated!',
          msg: this.model.project_type.toUpperCase() + ': ' + this.model.name + ' '+ response.status + ', Updated Successfully',
          showClose: true,
          timeout: 5000,
        };
        this.router.navigate(["/project/"+response.body.id.toString()]);
        this.toastaService.success(toastOptions);
        this.loading = false;

        return this.menuService.getMenu({}, 1).subscribe(
          resp =>{
            this.filterService.changeItems(resp.body);
            this.model = {};
            $('#projectEditModal').modal('toggle');
          });

      default: {
        let toastOptions: ToastOptions = {
          title: 'Success',
          msg: 'Default Success Message',
          showClose: true,
          timeout: 5000,
        };
        this.router.navigate(["/"]);
        this.toastaService.success(toastOptions);
        this.loading = false;
        this.menuService.getMenu({}, 1).subscribe(
          resp =>{
            this.filterService.changeItems(resp.body);
          });
        return
      }
    }
  }
  private handleError(action, error){
    this.toastaConfig.theme = 'default';

    switch (action){
      case 'create': {
        let toastOptions = {
          title: 'Project Create Error!',
          msg: this.model.type.toUpperCase() + ': ' + this.model.name + ', Could Not be Created  \n ERROR: '+ error,
          showClose: true,
          timeout: 5000,
        };
        this.toastaService.error(toastOptions);
        this.loading = false;
        return
      }
      case 'destroy': {
        let toastOptions = {
          title: 'Project Delete Error!',
          msg: this.model.type.toUpperCase() + ': ' + this.model.name + ', Could Not be Deleted  \n ERROR: '+ error,
          showClose: true,
          timeout: 5000,
        };
        this.toastaService.error(toastOptions);
        this.loading = false;
        return
      }
      case 'update': {
        let toastOptions = {
          title: 'Project Update Error!',
          msg: this.model.type.toUpperCase() + ': ' + this.model.name + ', Could Not be Updated \n ERROR: '+ error,
          showClose: true,
          timeout: 5000,
        };
        this.toastaService.error(toastOptions);
        this.loading = false;
        return
      }
      default: {
        let toastOptions: ToastOptions = {
          title: 'Success',
          msg: 'Default Success Message',
          showClose: true,
          timeout: 5000,
        };
        this.router.navigate(["/"]);
        this.toastaService.success(toastOptions);
        this.loading = false;
        this.menuService.getMenu({}, 1).subscribe(
          resp =>{
            this.filterService.changeItems(resp.body);
          });
        return
      }
    }

  }

  create(){
    this.loading = true;
    this.model['owner'] =  this.current_user.id;

    this.crudService.create('http://127.0.0.1:8000/kontext/projects/', this.model).subscribe(
      resp =>{
        this.handleSuccess('create', resp);
        this.model = {};
      },
      error =>{
        this.handleError('create', error);
        this.model = {};
      }
    );


  }
  destroy(){
    this.loading = true;
    this.model['owner'] =  this.current_user.id;
    console.log(this.model);
    this.crudService.destroy('http://127.0.0.1:8000/kontext/projects/'+this.model.id+'/').subscribe(
      resp => {
        this.handleSuccess('destroy', resp);
        this.model = {};
      },
      error=>{
        this.handleError('destroy', error);
        this.model = {};
      }
    )
  }
  update(){
    this.loading = true;
    this.model['owner'] = this.current_user.id;

    this.crudService.update('http://127.0.0.1:8000/kontext/projects/'+this.model.id+'/', this.model).subscribe(
      resp =>{
        this.handleSuccess('update', resp);
        this.model = {};
      },
      error=>{
        this.handleError('update', error);
        this.model = {};
      }
    )
  }

  ngOnInit(){
    this.model = {};
    this.current_user = JSON.parse(localStorage.getItem('currentUser'));

  }
}
