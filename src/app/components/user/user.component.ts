import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GuzergahService } from 'src/app/services/guzergah.service';
import { User } from '../../models/user';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  users: User[] = [];
  loadedData = false;
  filterText="";
  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private toastrService:ToastrService
    
  ) { }

  ngOnInit(): void {
    
    this.activatedRoute.params.subscribe((params) => {
      if (params['userId']) {
       
       this.getListFriends(params['userId']);
      } else {
        this.getUsers();
      }
    });
  }
  getUsers() {
    this.userService.getUsers().subscribe((response) => {
      this.users = response.data;
      this.loadedData = true;
    });
  }
  getListFriends(userId: number) {
    this.userService.getUsersByFriend(userId).subscribe((response) => {
      this.users = response.data;
     this.loadedData=true;
    });
  } 
}
