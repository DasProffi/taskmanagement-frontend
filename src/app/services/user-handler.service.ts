import {Injectable} from '@angular/core';
import {httpExecute} from "../utilities";
import {HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {ACCESS_TOKEN_NAME, API_URL, REFRESH_TOKEN_NAME} from "../config";
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class UserHandlerService {
  private refreshCookieName: string = REFRESH_TOKEN_NAME
  private accessCookieName: string = ACCESS_TOKEN_NAME

  constructor(private http: HttpClient, private cookieService: CookieService) {
  }

  async tryCookies() {
    let success: boolean = false;
    await firstValueFrom(httpExecute<any>(this.http, "post",
      "/token/test", {}, {})).then(
      value => {
        success = value["login"];
      }
    ).catch(_ => success = false)
    return success;
  }

  async login(name: string, password: string) {
    let success: boolean = false;
    await firstValueFrom(this.http.post(API_URL + "/token/auth", {},
      {headers: {'Authorization': 'Basic ' + btoa(name + ":" + password)}, observe: "response"})).then(
      value => {
        success = true;
        let access = value.headers.get(this.accessCookieName)
        let refresh = value.headers.get(this.refreshCookieName)
        if (access) {
          this.setToken(access)
        } else {
          success = false
        }
        if (refresh) {
          this.setToken(refresh, true)
        } else {
          success = false
        }

      }
    ).catch(_ => success = false)
    return success;
  }

  async refresh() {
    let success: boolean = false;
    let refresh = this.getToken(true);
    if (!refresh) {
      return false;
    }
    await firstValueFrom(this.http.post(API_URL + "/token/refresh", {},
      {headers: {'Authorization': 'Bearer ' + refresh}, observe: "response"})).then(
      value => {
        success = true;
        let access = value.headers.get(this.accessCookieName)
        if (access) {
          this.setToken(access)
        } else {
          success = false
        }
      }
    ).catch(_ => success = false)
    return success;
  }

  async logout() {
    let success: boolean = false;
    await firstValueFrom(this.http.post(API_URL + "/token/remove", {[this.refreshCookieName]: this.getToken(true)},
      {headers: {'Authorization': 'Bearer ' + this.getToken(false)}, observe: "body"})).then(
      _ => {
        success = true;
        //console.log(value)
      }
    ).catch(_ => success = false)
    if (success) {
      this.deleteTokens()
    }
    return success;
  }

  setToken(token: string, isRefreshToken: boolean = false) {
    let tokenName: string = this.accessCookieName
    let saveTime = 24 * 3600 * 1; //one day
    if (isRefreshToken) {
      tokenName = this.refreshCookieName
      saveTime = 24 * 3600 * 364; //one year
    }
    this.cookieService.set(tokenName, token, new Date(Date.now() + saveTime));
  }

  getToken(isRefreshToken: boolean = false) {
    let tokenName: string = this.accessCookieName
    if (isRefreshToken) {
      tokenName = this.refreshCookieName
    }
    return this.cookieService.get(tokenName)
  }

  deleteTokens() {
    this.cookieService.delete(this.refreshCookieName)
    this.cookieService.delete(this.accessCookieName)
  }

  isLoggedIn() {
    return !!this.getToken();
  }

  async register(email:string,password:string,name:string): Promise<boolean> {
    let success=false
    await firstValueFrom(httpExecute<{ [k: string]: any }>(this.http, "post", "/api/register",
      {name:name,password:password,email:email})).then(value => {
      success = value["success"];
      //console.log(value)
    }).catch(_ => success=false)
    return success;
  }

  async deregister(email:string,password:string): Promise<boolean> {
    let success=false
    await firstValueFrom(httpExecute<{ [k: string]: any }>(this.http, "post", "/api/deregister",
      {email:email,password:password})).then(value => {
      success = value["success"];
      //console.log(value)
    })
    return success;
  }
}
