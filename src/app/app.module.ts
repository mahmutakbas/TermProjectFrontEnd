import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { DlDateTimeDateModule, DlDateTimePickerModule } from 'angular-bootstrap-datetimepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserComponent } from './components/user/user.component';
import { FriendComponent } from './components/friend/friend.component';
import { MenuComponent } from './components/menu/menu.component';
import { FilterPipePipe } from './pipes/filter-pipe.pipe';
import  '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import { ToastrModule } from 'ngx-toastr';
import { GuzergahComponent } from './components/guzergah/guzergah.component';
import { DrawsearchComponent } from './components/drawsearch/drawsearch.component';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { UserguzergahComponent } from './components/userguzergah/userguzergah.component';



@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    FriendComponent,
    MenuComponent,
    FilterPipePipe,
    GuzergahComponent,
    DrawsearchComponent,
    LoginComponent,
    HomeComponent,
    UserguzergahComponent,   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    FeatherModule.pick(allIcons),
    DlDateTimeDateModule,  // <--- Determines the data type of the model
    DlDateTimePickerModule,
  ],
  exports:[FeatherModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
export class IconsModule { }
