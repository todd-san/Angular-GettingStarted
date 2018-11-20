import { Component, OnInit} from '@angular/core';
import {CrudService} from "../../crud/crud.service";
import {ActivatedRoute, Router} from "@angular/router";
import {BaseService} from "../../shared/base.service";
import {MenuService} from "../../shared/menu.service";

@Component({
  templateUrl: './spec-details.component.html',
  styleUrls: ['./details.component.css']
})
export class SpecDetailsComponent implements OnInit{
  route: any;
  spec: any;

  constructor(private crudService: CrudService,
              private router: Router,
              private menuService: MenuService,
              private baseService: BaseService,
              private current_route: ActivatedRoute) {

    this.router.events.subscribe(
      route =>{
        this.route = route;
      }
    );

    this.current_route.params.subscribe(
      val => {
        console.log('SPEC-DETAILS: current_route.params -> val: ', val);
        this.crudService.getKontextById('spec', val.id).subscribe(
          spec => {this.spec = spec.body}
        );
        this.menuService.getSpecMenu(val.id).subscribe(
          item =>{
            this.menuService.nextSpec(item.body)
          }
        );
      }
    );

  }

  public lazyLoadProjectByRoute(){
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

  public updateMenuTree(){
    this.baseService.setTreeToProject();
  }

  ngOnInit() {
    if(SpecDetailsComponent.isEmpty(this.spec)){
      this.lazyLoadProjectByRoute();
    }
  }

}
