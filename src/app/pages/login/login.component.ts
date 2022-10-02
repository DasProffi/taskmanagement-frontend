import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {UserHandlerService} from "../../services/user-handler.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Input()loginForwardLink: string = "/task/home";
  registrationLink:string = "/registration"
  hidePassword=true

  loginForm: FormGroup = new FormGroup({
    "name": new FormControl(),
    "password": new FormControl(),
  });

  constructor(private user:UserHandlerService, private router: Router,private route: ActivatedRoute) { }

  ngOnInit(): void {
    let forward=this.route.snapshot.paramMap.get("forwardLink")
    if(forward){
      this.loginForwardLink = <string>forward
    }

    if(this.user.isLoggedIn()){
      this.router.navigate([this.loginForwardLink]).then();
    }
  }

  login():void{
    let controls = this.loginForm.controls;
    this.user.login(controls["name"].value, controls["password"].value).then(
      r => {
        if(r){
          this.router.navigate([this.loginForwardLink]).then();
        }else {
          //console.log("failure")
        }
      });
  }

  register() {
    this.router.navigate([this.registrationLink]).then();
  }

  changePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
