import {Component, OnInit, ViewChild} from '@angular/core';
import {LoginComponent} from "./login/login.component";
// import {AuthenticationService} from

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'kontext';
  isLoggedIn: boolean = false;

  @ViewChild(LoginComponent)
  public loginModal: LoginComponent;

  // constructor(private auth: AuthentificaitonService){
  //   this.isLoggedIn = this.auth.isLoggedIn();
  //   console.log(this);
  //
  // }
  //
  // public ngOnInit(): void{
  //   if(!userIsLoggedIn){
  //     this.loginModal.open();
  //   }
  // }

  ngOnInit(){
    
  }

}
