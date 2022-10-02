import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TaskCreationComponent} from './pages/task/task-creation/task-creation.component'
import {TaskViewComponent} from "./pages/task/task-view/task-view.component";
import {TaskUpdateViewComponent} from "./pages/task/task-update-view/task-update-view.component";
import {HomepageComponent} from "./pages/home/homepage/homepage.component";
import {PageNotFoundComponent} from "./pages/page-not-found/page-not-found.component";
import {LoginComponent} from "./pages/login/login.component";
import {AuthGuardService} from "./services/auth-guard.service";
import {RegistrationComponent} from "./pages/registration/registration.component";

const routes: Routes = [
  // Home
  {path: 'home', component: HomepageComponent},
  {path: 'registration', component: RegistrationComponent},

  // Task
  {path: 'task', component: TaskViewComponent,canActivate:[AuthGuardService]},
  {path: 'task/update/:id', component: TaskUpdateViewComponent,canActivate:[AuthGuardService]},
  {path: 'task/create', component: TaskCreationComponent,canActivate:[AuthGuardService]},
  {path: 'task/create/p/:parentID', component: TaskCreationComponent, pathMatch: 'full',canActivate:[AuthGuardService]},
  {path: 'task/create/n/:name', component: TaskCreationComponent, pathMatch: 'full',canActivate:[AuthGuardService]},
  {
    path: 'task/create/nd/:name/:description',
    component: TaskCreationComponent,
    pathMatch: 'full',
    canActivate:[AuthGuardService]
  },
  {path: 'task/view', component: TaskViewComponent, canActivate:[AuthGuardService]},
  {path: 'task/home', redirectTo: '/task/view', pathMatch: 'full',canActivate:[AuthGuardService]},

  // Auth/Login
  {path: 'login', component: LoginComponent},

  // General
    // root
  {path: '', component: HomepageComponent, pathMatch: 'full'},
    // not found
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
