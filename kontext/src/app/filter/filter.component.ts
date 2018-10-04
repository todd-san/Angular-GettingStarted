import { Component, OnInit } from '@angular/core';
import {FilterService} from "./filter.service"

import {ProjectName} from "./interfaces/projectName";
import {PhaseName} from "./interfaces/phaseName";
import {DesignSize} from "./interfaces/designSize";
import {TireLine} from "./interfaces/tireLine";
import {UserName} from "./interfaces/userName";

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  errorMessage: string;

  users: UserName[];
  projects: ProjectName[];
  phases: PhaseName[];
  sizes: DesignSize[];
  lines: TireLine[];

  selectedUser: UserName;
  selectedProject: ProjectName;
  selectedPhase: PhaseName;
  selectedSize: DesignSize;
  selectedLine: TireLine;

  constructor(private filterService: FilterService) { }

  /* subscribers to filter.service.ts
  *
  * this functions provide the link between the filter form and the services
  * that fetch the observables.
  *
  * */
  public getUsers(){
    this.filterService.getUserNames().subscribe(
      user => {
        this.users = user.body;
        this.users.sort((a, b): number =>{
          if (a.username < b.username) return -1;
          if (a.username > b.username) return 1;
          return 0;
        })
      },
      error => this.errorMessage = <any>error
    );
  }
  public getProjects(params){
    this.filterService.getProjectNames(params).subscribe(
      projects => {
        let raw = projects.body;
        this.projects = this.unique(raw, 'name');
        this.projects.sort((a, b): number =>{
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
      },
      error => this.errorMessage = <any>error
    );
  }
  public getPhases(params){
    this.filterService.getPhaseNames(params).subscribe(
      phases => {
        let raw = phases.body;
        this.phases = this.unique(raw, 'name');
        this.phases.sort((a, b): number =>{
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
      },
      error => this.errorMessage = <any>error
    );
  }
  public getSizes(params){
    console.log('filter_component.SIZE PARAMS 2: ', params);
    this.filterService.getDesignSizes(params).subscribe(
      sizes => {
        let raw = sizes.body;
        this.sizes = this.unique(raw, 'size');
        this.sizes.sort((a, b): number =>{
          if (a.size < b.size) return -1;
          if (a.size > b.size) return 1;
          return 0;
        })
      },
      error => this.errorMessage = <any>error
    );
  }
  public getLines(params){
    this.filterService.getTireLines().subscribe(
      lines => {
        let raw = lines.body;
        this.lines = this.unique(raw, 'name');
        this.lines.sort((a, b): number =>{
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        })
      },
      error => this.errorMessage = <any>error
    );
  }

  /* trigger updates to linked filter drop-downs
  *
  * on each (change) event in the filter drop-downs a new request is
  * made through KTEK's API to update the subsequent drop-down lists
  * */
  public updateBySelectedUser(uid){
    console.log('filter_component.SIZE PARAMS 1: ', uid);

    this.getSelectedUser(uid);

    let params = {
      uid: this.selectedUser ? this.selectedUser.username : null,
    };

    this.getProjects(params);
    this.getPhases(params);
    this.getSizes(params);
    this.getLines(params);


  }
  public updateBySelectedProject(pid){

    this.getSelectedProject(pid);

    let params = {
      uid: this.selectedUser ? this.selectedUser.username: null,
      pid: this.selectedProject ? this.selectedProject.name: null,
    };

    this.getPhases(params);
    this.getSizes(params);
    this.getLines(params);

  }

  /* splits the projects list by ownership or membership
  *
  * this is just a nifty enhancement from KTEKv1.0
  * */
  public isProjectOwner(user){
    return this.projects.filter(function(x){
      return (x.owner_id === user.id)
    })
  }
  public isProjectMember(user){
    return this.projects.filter(function(x){
      return (x.owner_id !== user.id)
    })
  }

  //
  public getSelectedUser(uid){
    if(!!uid) {
      return this.selectedUser = this.users.filter(function (user) {
        return (Number(user.id) === Number(uid))
      })[0];

    } else {
      return null
    }
  }
  public getSelectedProject(pid){
    if(!!pid) {
      // converting back to the old style of filtering by username
      this.selectedProject = this.projects.filter(function (project) {
        return (Number(project.id) === Number(pid))
      })[0];
    } else{
      this.selectedProject = null;
    }
  }

  //
  public unique(array, propertyName){
    return array.filter((e, i) =>
      array.findIndex(a => a[propertyName] === e[propertyName]) === i);
  }

  //
  ngOnInit() {
    this.getUsers();
    this.getProjects({});
    this.getPhases({});
    this.getSizes({});
    this.getLines({});
  }

}
