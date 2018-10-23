import { Component, OnInit} from '@angular/core';
import {CrudService} from "./crud.service";
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../shared/user";

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
  styleUrls: ['./crud.component.css']
})

export class ProjectCrudComponent implements OnInit {
  route: any;
  current_user: any;
  current_project: any;
  new_project: NewProject = new NewProject();


  constructor(private crudService: CrudService, private router: Router) {
    this.crudService.currentKontext.subscribe(
      item => {
        this.current_project = item;
      }
    );

    // NEEDED SERVICES
    // this.crudService.getCurrentUser().subscribe(
    //   user  => {
    //     this.current_user = user;
    //   }
    // );

    // this.crudService.getProjectTypes.subscribe();
    // this.crudService.getCustomers.subscribe();



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

  public log(){
    console.log('current project: ', this.current_project);
    console.log('new project: ', this.new_project);
  }

  ngOnInit(){
    if(this.isEmpty()){
      this.lazyLoadProjectByRoute();
    }
  }
}
