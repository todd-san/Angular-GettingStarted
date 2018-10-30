import { Component, OnInit} from '@angular/core';
import {CrudService} from "./crud.service";
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../shared/user";
import {MenuService} from "../shared/menu.service";
import {ProjectTreeComponent} from "../project-tree/project-tree.component";
import {FilterService} from "../filter/filter.service";

declare var $: any;

export class NewProject {
  constructor(){}
    id: number;
    name: string = '';
    owner: number = null;
    project_type: string = '';
    description: string = '';
    customer: string = '';
    tag: string = '';
    date_modified: string = '';
    owner_username: string = '';
    type: string = 'project';
}

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
  current_project: any;
  new_project: NewProject = new NewProject();

  constructor(private crudService: CrudService,
              private router: Router,
              private filterService: FilterService,
              private menuService: MenuService) {
    this.crudService.currentKontext.subscribe(
      item => {
        this.current_project = item;
      }
    );
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

  create(){
    this.loading = true;
    this.model['owner'] =  this.current_user.id;
    console.log(this.model);
    this.crudService.create('http://127.0.0.1:8000/kontext/projects/', this.model).subscribe(
      resp =>{
        if(resp.status === 201){
          this.router.navigate(["/project/"+resp.body.id.toString()]);

          this.menuService.getMenu({}, 1).subscribe(
            resp =>{

              this.filterService.changeItems(resp.body);
              $('#projectCreateModal').modal('toggle');
            })

        }
        console.log(resp)
      }
    );


  }

  ngOnInit(){
    if(this.isEmpty()){
      this.lazyLoadProjectByRoute();
    }

    this.current_user = JSON.parse(localStorage.getItem('currentUser'));

  }
}
