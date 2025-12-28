import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  userData: any;
  displayName:string ="";

  constructor(private userService : UserService){
    this.userService.currentUser$.subscribe(user => {
      this.displayName = user?.fullName.toString().split(' ')[0] || "";
    });
  }
}