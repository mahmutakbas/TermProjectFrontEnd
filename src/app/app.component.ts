import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private authService:AuthService){}
  title: string = 'TermProject';
  user: string = "Mahmut AKBAŞ";
  isValid:boolean;
  ngOnInit(): void {
    this.isValid=this.authService.isAuthenticated();
    console.log(this.isValid);
  }


}


