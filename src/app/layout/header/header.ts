import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Auth0AuthButtonComponent } from '../../components/auth0authbutton/auth0-auth-button';


@Component({
  selector: 'app-header',
  imports: [RouterLink, Auth0AuthButtonComponent],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

}
