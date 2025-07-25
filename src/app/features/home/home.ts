import { Component } from '@angular/core';
import { AppAuthService } from '../../services/appAuthService';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  username: string = "";
constructor (auth:AppAuthService){
  auth.getUser().subscribe(user => {
    if (user) {
      this.username = user.nickname?? "";
    }
  });
}
}
