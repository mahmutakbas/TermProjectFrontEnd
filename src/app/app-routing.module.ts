import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrawsearchComponent } from './components/drawsearch/drawsearch.component';
import { GuzergahComponent } from './components/guzergah/guzergah.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { UserComponent } from './components/user/user.component';
import { UserguzergahComponent } from './components/userguzergah/userguzergah.component';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
    {path:"",pathMatch:"full",component:HomeComponent,canActivate:[LoginGuard]},
    {path:"users",component:UserComponent,canActivate:[LoginGuard]},
    {path:"users/friend/:userId",component:UserComponent,canActivate:[LoginGuard]},
    {path:"users/guzergah/:userId",component:GuzergahComponent,canActivate:[LoginGuard]},
    {path:"drawsearch",component:DrawsearchComponent,canActivate:[LoginGuard]},
    {path:"login",component:LoginComponent},
    {path:"users/userguzergah/:userId",component:UserguzergahComponent,canActivate:[LoginGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
