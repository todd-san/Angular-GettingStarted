import { Component, OnInit } from '@angular/core';
import {BaseService} from "../shared/base.service";

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private baseService: BaseService) { }

  public updateMenuTree(){
    this.baseService.setTreeToProject();
  }
  ngOnInit() {
    this.updateMenuTree();
  }

}
