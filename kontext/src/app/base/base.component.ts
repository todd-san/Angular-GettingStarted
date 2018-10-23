import {Component, Inject, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {BehaviorSubject} from "rxjs/index";

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent implements OnInit {
  private loggedIn = new BehaviorSubject(false);


  @Input() public isUserLoggedIn = this.loggedIn.asObservable();

  constructor(private router: Router){}

  public setLoggedIn(value){
    this.loggedIn.next(value);
  }

  ngOnInit() {
    this.setLoggedIn(false);
  }

}
