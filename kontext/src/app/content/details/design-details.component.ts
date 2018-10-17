import { Component, } from '@angular/core';
import {CrudService} from "../../crud/crud.service";
import {Router} from "@angular/router";

@Component({
  templateUrl: './design-details.component.html',
  styleUrls: ['./details.component.css']
})

export class DesignDetailsComponent {
  route: any;
  design: any;

  constructor(private crudService: CrudService, private router: Router) {
    this.crudService.currentKontext.subscribe(
      item => {
        this.design = item;
        console.log('design-detail: ', item)
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
        this.design = item.body;
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
    if(DesignDetailsComponent.isEmpty(this.design)){
      this.lazyLoadProjectByRoute();
    }
  }
}
