import { Component, OnInit } from '@angular/core';
import {CrudService} from "../../crud/crud.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  templateUrl: './phase-details.component.html',
  styleUrls: ['./details.component.css']
})
export class PhaseDetailsComponent implements OnInit{
  route: any;
  phase: any;

  constructor(
    private crudService: CrudService,
    private router: Router,
    private current_route: ActivatedRoute) {

    this.router.events.subscribe(
      route =>{
        this.route = route;
      }
    );

    this.current_route.params.subscribe(
      val => {
        this.crudService.getKontextById('phase', val.id).subscribe(
          phase => {this.phase = phase.body}
        )
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
