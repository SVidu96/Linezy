import { Component } from '@angular/core';
import { AdminService } from '../../core/services/admin.service';

@Component({
  selector: 'app-admin-panel',
  imports: [],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.scss'
})
export class AdminPanel {
constructor(private adminService: AdminService) {}

ngOnInit(): void {
  this.adminService.getAdminTests().subscribe(tests => {
    console.log(tests);
  });
}
}
