import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from "@angular/router";
import {AuthenticationService} from "../shared/authentication.service";
import {ToastaService, ToastaConfig, ToastOptions, ToastData} from 'ngx-toasta';

@Component({
  // moduleId: module.id,
  templateUrl: './login.component.html',
  // styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  model: any = {};
  loading: boolean = false;
  returnUrl: string;

  constructor(private toastaService: ToastaService,
              private toastaConfig: ToastaConfig,
              private route: ActivatedRoute,
              private router: Router,
              private authenticationService: AuthenticationService) {}


  ngOnInit(){
    this.authenticationService.logout();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login(){
    this.loading = true;
    this.authenticationService.login(this.model.username, this.model.password).subscribe(
      data => {
        this.router.navigate([this.returnUrl]);
      },
      error =>{
        this.loading=false;

      }
    )
  }
}
