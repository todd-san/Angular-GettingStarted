import { Component, OnInit} from '@angular/core';
import {FilterService} from "./filter.service";
import {MenuService} from "../menu/menu.service";


import {ProjectName} from "./interfaces/projectName";
import {PhaseName} from "./interfaces/phaseName";
import {DesignSize} from "./interfaces/designSize";
import {TireLine} from "./interfaces/tireLine";
import {UserName} from "./interfaces/userName";
import {Project} from "../menu/interfaces/project";
import {PaginationHeaders} from "../menu/interfaces/paginationHeaders";

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
})

export class FilterComponent implements OnInit {
  /* placeholder for filter.service HTTP errors
  * */
  private errorMessage: string;

  message: string;
  params: any = {};
  items: Project[];
  paginationHeaders: PaginationHeaders;

  /* interfaced variable types for KTEK API objects
  *
  * */
  users: UserName[];
  projects: ProjectName[];
  phases: PhaseName[];
  sizes: DesignSize[];
  lines: TireLine[];

  /* placeholders to generate filter query params
  *
  * */
  selectedUser: UserName;
  selectedProject: ProjectName;
  selectedPhase: PhaseName;
  selectedSize: DesignSize;
  selectedLine: TireLine;

  constructor(private filterService: FilterService, private menuService: MenuService) {
    filterService.filter_params.subscribe(
      params => {
        this.params = params;
      }
    );
    filterService.currentItems.subscribe(
      items =>{
        this.items = items;
      }
    );
    filterService.currentPagination.subscribe(
       item =>{
        this.paginationHeaders = item;
      }
    )
  }

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
    this.filterService.getTireLines(params).subscribe(
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
  public updateBySelected(type, id){
    switch (type){
      case 'user': {
        console.log('CASE=USER');
        this.params = {
          uid: this.getSelected('selectedUser', this.users, id),
        };
        this.getProjects(this.params);
        this.getPhases(this.params);
        this.getSizes(this.params);
        this.getLines(this.params);
        this.filterService.changeParams(this.params);

        break
      }
      case 'project': {
        console.log('CASE=PROJECT');
        this.params = {
          uid: this.selectedUser ? this.selectedUser: null,
          pid: this.getSelected('selectedProject', this.projects, id),
        };
        this.getPhases(this.params);
        this.getSizes(this.params);
        this.getLines(this.params);
        this.filterService.changeParams(this.params);
        break
      }
      case 'phase': {
        console.log('CASE=PHASE');
        this.params = {
          uid: this.selectedUser ? this.selectedUser : null,
          pid: this.selectedProject ? this.selectedProject: null,
          phid: this.getSelected('selectedPhase', this.phases, id),
        };
        this.getSizes(this.params);
        this.getLines(this.params);
        this.filterService.changeParams(this.params);
        break
      }
      case 'size': {
        console.log('CASE=SIZE');
        this.params = {
          uid: this.selectedUser ? this.selectedUser : null,
          pid: this.selectedProject ? this.selectedProject: null,
          phid: this.selectedPhase ? this.selectedPhase : null,
          sid: this.getSelected('selectedSize', this.sizes, id),
        };
        this.getLines(this.params);
        this.filterService.changeParams(this.params);
        break
      }
      case 'line': {
        console.log('CASE=LINE');
        this.params = {
          uid: this.selectedUser ? this.selectedUser : null,
          pid: this.selectedProject ? this.selectedProject: null,
          phid: this.selectedPhase ? this.selectedPhase : null,
          sid: this.selectedSize ? this.selectedSize : null,
          lid: this.getSelected('selectedLine', this.lines, id),
        };
        this.getSizes(this.params);
        this.filterService.changeParams(this.params);
        break
      }
      default: {
        this.params = {};
        console.log('ERROR! shit did not work!');
        break
      }
    }
    console.log('Current Message: ', this.message);
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

  /* returns object from a filter-by-pk function
  *
  */
  public getSelected(selectedItem, obj_array, selectedId){
    if(!!selectedId) {
      // converting back to the old style of filtering by username
      this[selectedItem] = obj_array.filter(function (x) {
        return (Number(x.id) === Number(selectedId))
      })[0];
    } else{
      this[selectedItem] = null;
    }
    return this[selectedItem];
  }

  /* returns a unique set of objects
   *
   * uniqueness is judged by a passed property arg
   */
  public unique(array, propertyName){
    return array.filter((e, i) =>
      array.findIndex(a => a[propertyName] === e[propertyName]) === i);
  }

  public filterMenu(){
    console.log('=====================================');
    console.log('PARAMS on FILTER MENU! ', this.params);
    console.log('=====================================');
    this.menuService.getMenu(this.params, null).subscribe(
      items => {
        this.filterService.changeItems(items.body);
        this.filterService.changePagination({
          xPage: parseInt(items.headers.get('X-Page')),
          xPerPage: parseInt(items.headers.get('X-Per-Page')),
          xTotal: parseInt(items.headers.get('X-Total')),
          xTotalPages: parseInt(items.headers.get('X-Total-Pages'))
        });
      }
    );
  }

  /* tasks on page load
  *
  * */
  ngOnInit() {
    this.getUsers();
    this.getProjects({});
    this.getPhases({});
    this.getSizes({});
    this.getLines({});
    this.filterMenu();

  }

}
