import { Component } from '@angular/core';
import { AppAuthService } from '../../core/services/appAuthService';
import { TestService } from '../../core/services/test.service';
import { TestModel } from '../../models/datamodels/testmodel';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule,RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  username: string = "";
  testData: any[] = [];
  isAdmin: boolean = false;
  constructor(private auth: AppAuthService, private testService: TestService) {
    this.auth.getUser().subscribe(user => {
      if (user) {
        this.username = user.nickname ?? "";
      }
    });

    this.getTestData();

    this.auth.getPermissions().subscribe(permissions => {
      this.isAdmin = permissions.includes('admin');
    });
  }

  getTestData() {
   this.testService.getAllTests().subscribe((data:TestModel[])=>{
    this.testData = data;
   })
  }

  
  

}