import { Component, } from '@angular/core';
import {CrudService} from "./crud.service";
import {ToastaConfig, ToastaService, ToastOptions} from "ngx-toasta";
import {ProjectTreeComponent} from "../project-tree/project-tree.component";
import {Router} from "@angular/router";
import {MenuService} from "../shared/menu.service";
import {FilterService} from "../filter/filter.service";

declare var $: any;

@Component({
  selector: 'design-crud',
  templateUrl: './forms/design.component.html',
  styleUrls: ['./crud.component.css']
})

export class DesignCrudComponent {
loading: boolean = false;
  model: any = {};
  parent: any = {};
  route: any;
  current_user: any;
  tire_lines: any;
  tire_types: any;
  load_ratings: any;
  speed_ratings: any;
  regions: any;
  factories: any;


  constructor(private crudService: CrudService,
              private router: Router,
              private toastaService: ToastaService,
              private toastaConfig: ToastaConfig,
              private projectTreeComponent: ProjectTreeComponent,
              private filterService: FilterService,
              private menuService: MenuService) {



    /* Subscription to crud.service.ts services
    *
    * */
    this.crudService.get_TireLines().subscribe(resp=>{
      this.tire_lines = resp.body;
    });
    this.crudService.get_LoadRatings().subscribe(resp =>{
      this.load_ratings = resp.body;
    });
    this.crudService.get_SpeedRatings().subscribe(resp =>{
      this.speed_ratings = resp.body;
      console.log('SPEED RATINGS: ', this.speed_ratings)
    });
    this.crudService.get_TireTypes().subscribe(resp=>{
      this.tire_types = resp.body;
    });
    this.crudService.get_Factories().subscribe(resp=>{
      this.factories = resp.body
    });
    this.crudService.get_Regions().subscribe( resp =>{
      this.regions = resp.body;
    });

    this.crudService.currentKontext.subscribe( resp => {
          if(resp['type'] === 'phase'){
            this.parent = resp;
          } else if(resp['type'] === 'design') {
            this.model = resp;
          }
        });

    /* Subscription to router.events to pickup the current route
    *
    * */
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

    console.log(this.model);

  }
  destroy(){

    console.log('model:', this.model);
    console.log('parent:', this.parent);

    this.loading = true;
    this.model['owner'] =  this.current_user.id;
    console.log(this.model);
    this.crudService.destroy('http://127.0.0.1:8000/kontext/phases/'+this.model.id+'/').subscribe(
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

    this.crudService.update('http://127.0.0.1:8000/kontext/phases/'+this.model.id+'/', this.model).subscribe(
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
