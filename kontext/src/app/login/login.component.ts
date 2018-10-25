import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
// import { BaseComponent } from "../base/base.component";
// import {BaseService} from "../base/base.service";
import {ToastaService, ToastaConfig, ToastOptions, ToastData} from 'ngx-toasta';


export class LoginUser{
  constructor(){}
    username: string = '';
    password: string = '';
}

@Component({
  // selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  loggedIn: boolean;
  user: any;
  token: any;

  constructor(private router: Router,
              // private baseComponent: BaseComponent,
              // private baseService: BaseService,
              private toastaService: ToastaService,
              private toastaConfig: ToastaConfig) {
    // baseComponent.isUserLoggedIn.subscribe(
    //   value =>{
    //     this.loggedIn = value;
    //   }
    // );
  }


  public onLoginClick(){
    // this.baseService.login(this.user.username, this.user.password).subscribe(
    //   token => {
    //     this.token = token.body.token ? token.body['token'] : null;
    //     this.baseService.currentUser(this.user.username, this.user.password).subscribe(
    //       currentUser => console.log('current_user!', currentUser)
    //     );
    //     this.router.navigate(['./home']);
    //     // this.baseComponent.setLoggedIn(true);
    //
    //   },
    //   error =>{
    //     let toastOptions:ToastOptions = {
    //         title: 'Login Error',
    //         msg: error,
    //         showClose: true,
    //         timeout: 5000,
    //     };
    //     this.toastaConfig.theme = 'bootstrap';
    //     this.toastaService.error(toastOptions);
    //
    //     console.log('LOGGING THE ERROR', error);
    //   });
  }

  ngOnInit(){
    this.user = new LoginUser();
  }
}
