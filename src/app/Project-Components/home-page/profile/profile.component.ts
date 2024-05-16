import { AcquisitionService } from './../../../Services/acquisition.service';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../Services/authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  role;
  constructor(private auth: AuthenticationService, private ap: AcquisitionService) { }

  ngOnInit() {

    this.ap.getUserprofile().subscribe(response => {
      console.log(response.firstName);
      if(response.firstName == "Varun Kumar Reddy") {
        this.role = "Contracting Officer"
      } else if (response.roles[0].roleName == "Program Manager (PM)") {
        this.role = "Program Officer"
      }
    })
  }
}
