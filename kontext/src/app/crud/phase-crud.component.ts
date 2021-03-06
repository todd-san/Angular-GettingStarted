import { Component,} from '@angular/core';
import {Router} from "@angular/router";
import {ToastaConfig, ToastaService, ToastOptions} from "ngx-toasta";
import {CrudService} from "./crud.service";
import {MenuService} from "../shared/menu.service";
import {FilterService} from "../filter/filter.service";
import {ProjectTreeComponent} from "../project-tree/project-tree.component";
import {ApiService} from "../shared/api.service";

declare var $: any;

@Component({
  selector: 'phase-crud',
  templateUrl: './forms/phase.component.html',
  styleUrls: ['./crud.component.css']
})

export class PhaseCrudComponent{
  loading: boolean = false;
  model: any = {};
  parent: any = {};
  route: any;
  current_user: any;

  constructor(private crudService: CrudService,
              private router: Router,
              private apiService: ApiService,
              private toastaService: ToastaService,
              private toastaConfig: ToastaConfig,
              private projectTreeComponent: ProjectTreeComponent,
              private filterService: FilterService,
              private menuService: MenuService) {

    this.crudService.currentKontext.subscribe( resp => {
      if(resp['type'] === 'project'){
        this.parent = resp;
      } else {
        this.model = resp;
      }
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
          title: 'Phase Created!',
          msg: this.parent.name + '-> ' + this.model.phase_name + ' '+ response.status + ', Created Successfully',
          showClose: true,
          timeout: 5000,
        };
        this.router.navigate(["/phase/"+response.body.id.toString()]);
        this.toastaService.success(toastOptions);
        this.loading = false;
        this.filterService.changeParams({pid: {name:this.parent.name}});

        return this.menuService.getMenu({}, 1).subscribe(
          resp =>{
            this.filterService.changeItems(resp.body);
            this.projectTreeComponent.expandFiltered();
            this.model = {};
            $('#phaseCreateModal').modal('toggle');
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
            $('#phaseDeleteModal').modal('toggle');
          });
      }
      case 'update':
        let toastOptions = {
          title: 'Phase Updated!',
          msg: this.model.project.name + '-> ' + this.model.phase_name + ' '+ response.status + ', Updated Successfully',
          showClose: true,
          timeout: 5000,
        };
        this.toastaService.success(toastOptions);
        this.loading = false;
        this.router.navigate(["/phase/"+response.body.id.toString()]);
        this.filterService.changeParams({pid: {name: this.model.project.name}, phid:{name:this.model.name}});

        return this.menuService.getMenu({}, 1).subscribe(
          resp =>{
            this.filterService.changeItems(resp.body);
            this.projectTreeComponent.expandFiltered();
            this.model = {};
            $('#phaseEditModal').modal('toggle');
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

        return this.menuService.getMenu({}, 1).subscribe(
          resp =>{
            this.filterService.changeItems(resp.body);
          });
      }
    }
  }
  private handleError(action, error){
    this.toastaConfig.theme = 'default';
    switch (action){
      case 'create': {
        let toastOptions = {
          title: 'Phase Create Error!',
          msg: this.parent.name + ' -> ' + this.model.phase_name + ', Could Not be Created  \n ERROR: '+ error,
          showClose: true,
          timeout: 5000,
        };
        this.toastaService.error(toastOptions);
        this.loading = false;
        return
      }
      case 'destroy': {
        let toastOptions = {
          title: 'Phase Delete Error!',
          msg: this.parent.name + ' -> ' + ': ' + this.model.name + ', Could Not be Deleted  \n ERROR: '+ error,
          showClose: true,
          timeout: 5000,
        };
        this.toastaService.error(toastOptions);
        this.loading = false;
        return
      }
      case 'update': {
        let toastOptions = {
          title: 'Phase Update Error!',
          msg: this.parent.name + ' -> ' + this.model.phase_name + ', Could Not be Updated  \n ERROR: '+ error,
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
    this.model['tire_project_id'] = this.parent.id;
    this.crudService.create(this.apiService.phases, this.model).subscribe(
      resp =>{
        this.handleSuccess('create', resp);
        this.model = {};
      },
      error =>{
        console.log('ERRRRRROR!: ', error);
        this.handleError('create', error);
        this.model = {};
      }
    );
  }
  destroy(){

    console.log('model:', this.model);
    console.log('parent:', this.parent);

    this.loading = true;
    this.model['owner'] =  this.current_user.id;
    console.log(this.model);
    this.crudService.destroy(this.apiService.obj_detail(this.apiService.phases, this.model.id)).subscribe(
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
    console.log('model:', this.model);
    console.log('parent:', this.parent);
    this.loading = true;
    this.model['owner'] =  this.current_user.id;
    this.model['phase_name'] = this.model.name;

    this.crudService.update(this.apiService.obj_detail(this.apiService.phases, this.model.id), this.model).subscribe(
      resp => {
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
