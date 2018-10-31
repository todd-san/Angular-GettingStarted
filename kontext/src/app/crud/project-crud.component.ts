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
  crud: any = {error: false, success: false, message: ''};
  model: any = {};
  route: any;
  current_user: any;
  current_project: any;

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

  public lazyLoadProjectByRoute(){
    console.log('trying to lazy load from route!');
    if (this.route){
      this.crudService.getKontextById(
        this.route.url.split('/')[1],
        this.route.url.split('/')[2]
      ).subscribe(
        item => {
          this.current_project = item.body;
        }
      )
    } else {
      this.current_project = {};
    }
  }
  public isEmpty() {
    for(let prop in this.current_project) {
        if(this.current_project.hasOwnProperty(prop))
            return false;
    }
    return true;
  }

  private onSuccess(action, response){

  }
  private onError(action, error){

  }

  private deletedSuccess(resp){

    let toastOptions:ToastOptions = {
      title: 'Project Deleted!',
      msg: this.model.type.toUpperCase() + ': ' + this.model.name + ' '+ resp.status + ', Deleted Successfully',
      showClose: true,
      timeout: 5000,
    };
    this.toastaConfig.theme = 'material';
    this.toastaService.success(toastOptions);

    this.router.navigate(["/"]);

    this.menuService.getMenu({}, 1).subscribe(
      resp => {
        this.filterService.changeItems(resp.body);
        $('#projectDeleteModal').modal('toggle');
      });
    this.loading = false;
    this.model = {};
  }
  private deletedError(error){
    let toastOptions:ToastOptions = {
      title: 'Project Delete Error!',
      msg: this.model.type.toUpperCase() + ': ' + this.model.name + ', Could Not be Deleted  \n ERROR: '+ error,
      showClose: true,
      timeout: 5000,
    };
    this.toastaConfig.theme = 'bootstrap';
    this.toastaService.error(toastOptions);
    this.loading = false;
  }

  private createdSuccess(resp){
    let toastOptions:ToastOptions = {
      title: 'Project Created!',
      msg: this.model.type.toUpperCase() + ': ' + this.model.name + ' '+ resp.status + ', Created Successfully',
      showClose: true,
      timeout: 5000,
    };
    this.toastaConfig.theme = 'material';
    this.toastaService.success(toastOptions);

    this.router.navigate(["/project/"+resp.body.id.toString()]);
    this.menuService.getMenu({}, 1).subscribe(
      resp =>{
        this.filterService.changeItems(resp.body);
        $('#projectCreateModal').modal('toggle');
      });
    this.loading = false;
    this.model = {};
  }
  private createdError(error){
    let toastOptions:ToastOptions = {
      title: 'Project Create Error!',
      msg: this.model.type.toUpperCase() + ': ' + this.model.name + ', Could Not be Created  \n ERROR: '+ error,
      showClose: true,
      timeout: 5000,
    };
    this.toastaConfig.theme = 'material';
    this.toastaService.error(toastOptions);
    this.loading = false;
  }

  create(){
    this.loading = true;
    this.model['owner'] =  this.current_user.id;

    this.crudService.create('http://127.0.0.1:8000/kontext/projects/', this.model).subscribe(
      resp =>{
        this.createdSuccess(resp);
      },
      error =>{
        this.createdError(error);
      }
    );


  }
  destroy(){
    this.loading = true;
    this.model['owner'] =  this.current_user.id;
    console.log(this.model);
    this.crudService.delete('http://127.0.0.1:8000/kontext/projects/'+this.model.id+'/').subscribe(
      resp => {
        this.deletedSuccess(resp);
      },
      error=>{
        this.deletedError(error);
      }
    )
  }

  ngOnInit(){
    if(this.isEmpty()){
      this.lazyLoadProjectByRoute();
    }

    this.current_user = JSON.parse(localStorage.getItem('currentUser'));

  }
}
