import { Injectable } from '@angular/core';
import {CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {UserHandlerService} from "./user-handler.service";

@Injectable({
  providedIn: 'root'
})

@Injectable()
export class AuthGuardService implements CanActivate {
  private loginRoute='/login'

  constructor(
    private router: Router,
    private user: UserHandlerService
  ) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const isLoggedIn = this.user.isLoggedIn();
    let forward = "";
    route.url.forEach(value => forward+="/"+value)
    if (isLoggedIn) {
      return true;
    } else {
      let success=false
      await this.user.refresh().then(value => {
        if(value){
          success=true
        }else {
          this.router.navigate([this.loginRoute,{"forwardLink":forward}]).then();
        }
      })
      return success;
    }
  }

}
