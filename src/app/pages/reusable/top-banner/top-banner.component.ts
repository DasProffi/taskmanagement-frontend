import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserHandlerService} from "../../../services/user-handler.service";

@Component({
  selector: 'app-top-banner',
  templateUrl: './top-banner.component.html',
  styleUrls: ['./top-banner.component.css']
})
export class TopBannerComponent implements OnInit {
  @Input()bannerText: String = "Website";
  @Input()currentHomeLink: String = "/home";
  @Input()homeLink: String = "/home";
  @Input()loginLink: String = "/login";
  @Input()loginForwardLink: String | null = null;
  @Input()showLogin: boolean = true;

  constructor(private router: Router, private user:UserHandlerService, private route:ActivatedRoute) { }

  ngOnInit(): void {}

  bannerClicked() {
    this.router.navigate([this.currentHomeLink]).then();
  }

  logoClicked() {
    this.router.navigate([this.homeLink]).then();
  }

  loginClicked() {
    let routeURL = this.route.url;
    let forward = "";
    routeURL.forEach(value => forward += "/" + value)
    if(this.loginForwardLink){
      forward = <string>this.loginForwardLink;
    }
    this.router.navigate([this.loginLink, {"forwardLink": forward}]).then();
  }

  logoutClicked() {
    this.user.logout().then(value => {
      if(value){
        this.router.navigate([this.homeLink]).then();
      }else {
        // TODO display Toast/Popup for failure
        console.log("failed to logout")
      }
    })
  }


  isInLoginMode(){
    return !this.user.isLoggedIn();
  }
}
