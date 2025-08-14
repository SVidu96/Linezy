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
  constructor(auth: AppAuthService, private testService: TestService) {
    auth.getUser().subscribe(user => {
      if (user) {
        this.username = user.nickname ?? "";
      }
    });

    this.getTestData();

  }

  getTestData() {
   this.testService.getAllTests().subscribe((data:TestModel[])=>{
    this.testData = data;
   })
  }

  

}