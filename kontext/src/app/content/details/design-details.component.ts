import { Component, OnInit} from '@angular/core';
import {CrudService} from "../../crud/crud.service";
import {ActivatedRoute, Router} from "@angular/router";
import {BaseService} from "../../shared/base.service";

@Component({
  templateUrl: './design-details.component.html',
  styleUrls: ['./details.component.css']
})

export class DesignDetailsComponent implements OnInit{
  route: any;
  design: any;

  constructor(
    private crudService: CrudService,
    private router: Router,
    private baseService: BaseService,
    private current_route: ActivatedRoute) {

    this.router.events.subscribe(
      route =>{
        this.route = route;
      }
    );

    this.current_route.params.subscribe(
      val =>{
        this.crudService.getKontextById('design', val.id).subscribe(
          design => {this.design = design.body}
        )
      }
    )
  }

  public lazyLoadProjectByRoute(){
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

  public updateMenuTree(){
    console.log('here!');
    this.baseService.setTreeToProject();
  }

  ngOnInit() {
    if(DesignDetailsComponent.isEmpty(this.design)){
      this.lazyLoadProjectByRoute();
    }
  }
}
