import { Component, OnInit } from '@angular/core';
import {CrudService} from "../../crud/crud.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable} from "rxjs/index";

@Component({
  templateUrl: './project-details.component.html',
  styleUrls: ['./details.component.css']
})

export class ProjectDetailsComponent implements OnInit {
  route: any;
  project: any;

  constructor(private crudService: CrudService, private router: Router) {
    this.crudService.currentKontext.subscribe(
      item => {
        this.project = item;
        console.log('project-detail: ', item)
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

  ngOnInit() {
    if(this.isEmpty()){
      this.lazyLoadProjectByRoute();
    }
  }
}