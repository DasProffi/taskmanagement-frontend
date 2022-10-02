import {Component, OnInit} from '@angular/core';
import {UserHandlerService} from "../../services/user-handler.service";
import {Router} from "@angular/router";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  forwardLink: string = '/task/home'
  hidePassword1: boolean = true;
  hidePassword2: boolean = true;
  passwordMinLength = 10
  nameMinLength = 3
  registerForm = new FormGroup({
    "name": new FormControl(),
    "email": new FormControl(),
    "password1": new FormControl(),
    "password2": new FormControl(),
  });

  constructor(private user: UserHandlerService, private router: Router) {
  }

  ngOnInit(): void {
    if (this.user.isLoggedIn()) {
      this.router.navigate([this.forwardLink]).then()
    }
  }

  login() {
    this.router.navigate(["/login"]).then()
  }

  changePasswordVisibility(number: number) {
    if (number == 1) {
      this.hidePassword1 = !this.hidePassword1
    } else {
      this.hidePassword2 = !this.hidePassword2
    }
  }

  register() {
    let controls = this.registerForm.controls
    if (this.isFullyValid()) {
      let email = controls["email"].value
      let name = controls["name"].value
      let password = controls["password1"].value
      this.user.register(email, password, name).then(value => {
        if (!value) {
          //TODO user notification
          console.log("registration failed")
        } else {
          this.user.login(email, password).then(value1 => {
            if (value1) {
              this.router.navigate([this.forwardLink]).then()
            }else {
              this.router.navigate(["/login"]).then()
            }
          })
        }
      })
    }
  }

  isValidName() {
    let controls = this.registerForm.controls
    let name = controls["name"].value
    return name && name.length > this.nameMinLength;
  }

  isValidEmail() {
    //TODO email checker
    let controls = this.registerForm.controls
    let email = controls["email"].value
    return email && email.length > 10;
  }

  isValidPassword1() {
    let controls = this.registerForm.controls
    let password1 = controls["password1"].value
    return password1 && password1.length >= this.passwordMinLength;
  }

  isValidPassword2() {
    let controls = this.registerForm.controls
    let password1: string = controls["password1"].value
    let password2: string = controls["password2"].value
    if (!password1) {
      return true
    }
    return (password1 && password2 && password1.startsWith(password2) && password2.startsWith(password1));
  }

  isFullyValid() {
    return this.isValidName() && this.isValidEmail() && this.isValidPassword1() && this.isValidPassword2()
      && this.registerForm.valid;
  }
}
