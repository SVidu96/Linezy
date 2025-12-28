import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserMenu } from "../user-menu/user-menu";

@Component({
  selector: 'app-header',
  imports: [RouterLink, UserMenu],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

}
