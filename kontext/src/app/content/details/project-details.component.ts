import { Component, OnInit } from '@angular/core';
import {CrudService} from "../../crud/crud.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectCrudComponent} from "../../crud/project-crud.component";
import {BaseService} from "../../shared/base.service";

@Component({
  templateUrl: './project-details.component.html',
  styleUrls: ['./details.component.css']
})

export class ProjectDetailsComponent implements OnInit {
  route: any;
  project: any;

  constructor(private crudService: CrudService,
              private router: Router,
              private baseService: BaseService,
              private projectCrud: ProjectCrudComponent,
              private current_route: ActivatedRoute) {

    this.router.events.subscribe(
      route =>{
        this.route = route;
      }
    );

    this.current_route.params.subscribe(
      val => {
        this.crudService.getKontextById('project', val.id).subscribe(
          project =>{this.project = project.body;})
      }
    )
  }

  public lazyLoadProjectByRoute(){
    console.log('trying to lazy load from route!');
    this.crudService.getKontextById(
      this.route.url.split('/')[1],
      this.route.url.split('/')[2]
    ).subscribe(
      item => {
        this.project = item.body;
      }
    )
  }
  public isEmpty() {
    for(let prop in this.project) {
        if(this.project.hasOwnProperty(prop))
            return false;
    }
    return true;
  }
  public updateDescription(){
    console.log('AT UPDATE DESCRIPTION');
    console.log('project: ', this.project);

    this.projectCrud.update();

  }

  public updateMenuTree(){
    console.log('here!');
    this.baseService.setTreeToProject();
  }

  ngOnInit() {
    if(this.isEmpty()){
      this.lazyLoadProjectByRoute();
    }
  }
}
