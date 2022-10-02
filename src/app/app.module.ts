import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatIconModule} from "@angular/material/icon";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {TasksApiService} from './services/tasks-api.service';
import {TaskCreationComponent} from './pages/task/task-creation/task-creation.component';
import {TaskViewComponent} from './pages/task/task-view/task-view.component';
import {TaskListTileComponent} from './pages/task/task-list-tile/task-list-tile.component';
import {TaskUpdateViewComponent} from './pages/task/task-update-view/task-update-view.component';
import {TaskFormComponent} from './pages/task/task-form/task-form.component';
import {MatButtonModule} from "@angular/material/button";
import {TaskHandlerService} from "./services/task-handler.service";
import {DialogTaskDeleteComponent} from './pages/task/dialog-task-delete/dialog-task-delete.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule} from "@angular/material/dialog";
import { HomepageComponent } from './pages/home/homepage/homepage.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { TopBannerComponent } from './pages/reusable/top-banner/top-banner.component';
import { LoginComponent } from './pages/login/login.component';
import {UserHandlerService} from "./services/user-handler.service";
import {CookieService} from "ngx-cookie-service";
import {authInterceptor} from "./services/auth-interceptor";
import { RegistrationComponent } from './pages/registration/registration.component';

@NgModule({
  declarations: [
    AppComponent,
    TaskCreationComponent,
    TaskViewComponent,
    TaskListTileComponent,
    TaskUpdateViewComponent,
    TaskFormComponent,
    DialogTaskDeleteComponent,
    HomepageComponent,
    PageNotFoundComponent,
    TopBannerComponent,
    LoginComponent,
    RegistrationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatIconModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
  ],
  providers: [TasksApiService, TaskHandlerService, {
    provide: MAT_DIALOG_DEFAULT_OPTIONS,
    useValue: {hasBackdrop: false}
  },UserHandlerService, CookieService, authInterceptor],
  bootstrap: [AppComponent],
})
export class AppModule {
}
