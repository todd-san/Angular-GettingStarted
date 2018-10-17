import { Component, OnInit } from '@angular/core';
import {CrudService} from "../../crud/crud.service";
import {Router} from "@angular/router";

@Component({
  templateUrl: './phase-details.component.html',
  styleUrls: ['./details.component.css']
})
export class PhaseDetailsComponent{
  route: any;
  phase: any;

  constructor(private crudService: CrudService, private router: Router) {
    this.crudService.currentKontext.subscribe(
      item => {
        this.phase= item;
        console.log('phase-detail: ', item)
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
        this.phase = item.body;
      }
    )
  }

  public isEmpty() {
    for(let prop in this.phase) {
        if(this.phase.hasOwnProperty(prop))
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
