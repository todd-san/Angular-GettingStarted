import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { BaseComponent } from "../base/base.component";
import {HttpClient, HttpErrorResponse, HttpParams, HttpResponse} from "@angular/common/http";
import {BaseService} from "../base/base.service";
import {current} from "codelyzer/util/syntaxKind";


export class LoginUser{
  constructor(){}
    username: string = '';
    password: string = '';
}

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loggedIn: boolean;
  user: any;
  token: any;

  constructor(private router: Router, private baseComponent: BaseComponent, private baseService: BaseService
  ) {
    baseComponent.isUserLoggedIn.subscribe(
      value =>{
        this.loggedIn = value;
      }
    );

    // baseService.login(null, null).subscribe(token=>this.token = token);
  }

  public onLoginClick(){
    this.baseService.login(this.user.username, this.user.password).subscribe(
      token => {
        this.token = token.body.token ? token.body['token'] : null;
        console.log('loginComponent.onLoginClick', token.body.token);
        console.log('this.token: ', this.token);

        this.baseService.currentUser(this.token).subscribe(
          currentUser => console.log(currentUser)
        )
      });

    // this.router.navigate(['./home']);
    // this.baseComponent.setLoggedIn(true);
  }


  ngOnInit(){
    this.user = new LoginUser();
  }

}
