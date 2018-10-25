import { Component, OnInit } from '@angular/core';
import {PhaseDetailsComponent} from "./phase-details.component";
import {CrudService} from "../../crud/crud.service";
import {Router} from "@angular/router";

@Component({
  templateUrl: './spec-details.component.html',
  styleUrls: ['./details.component.css']
})
export class SpecDetailsComponent {
  route: any;
  spec: any;

  constructor(private crudService: CrudService, private router: Router) {
    this.crudService.currentKontext.subscribe(
      item => {
        if(item.hasOwnProperty('type') && item['type'] === 'spec'){
          this.spec= item;
          console.log('spec-detail: ', item)
        }
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
        this.spec = item.body;
      }
    )
  }


  private static isEmpty(obj) {
    for(let prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return true;
  }


  ngOnInit() {
    if(SpecDetailsComponent.isEmpty(this.spec)){
      this.lazyLoadProjectByRoute();
    }
  }

}
