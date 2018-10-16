import { Component, OnInit } from '@angular/core';
import {CrudService} from "./crud.service";

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})
export class CrudComponent implements OnInit {
  projects: any;

  constructor(private crudService: CrudService) {
    crudService.getProjects().subscribe(
      items => {
        this.projects = items;
      }
    );
  }

  ngOnInit() {
  }

}
