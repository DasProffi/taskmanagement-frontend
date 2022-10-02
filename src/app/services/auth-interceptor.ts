import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS
} from '@angular/common/http';

import { Observable } from 'rxjs';
import {CookieService} from "ngx-cookie-service";
import {API_URL} from "../config";
import {UserHandlerService} from "./user-handler.service";

/** Pass untouched request through to the next request handler. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private cookieService: CookieService,private user: UserHandlerService){};

  getToken(isRefreshToken:boolean=false){
    return this.user.getToken(isRefreshToken);
  }

  setToken(value:string,isRefreshToken:boolean=false){
    this.user.setToken(value,isRefreshToken);
  }

  intercept(request: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    if (!request.headers.has('Content-Type')) {
      request = request.clone({
        headers: request.headers.set('Content-Type', 'application/json')
      });
    }

    if (request.url.match(new RegExp("^"+API_URL+".*"))){
      if(!request.headers.has("Authorization") && this.getToken()){
        request = request.clone({
          headers: request.headers.set("Authorization","Bearer " + this.getToken())
        });
      }
    }
    return next.handle(request);
  }
}

export const authInterceptor = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];
