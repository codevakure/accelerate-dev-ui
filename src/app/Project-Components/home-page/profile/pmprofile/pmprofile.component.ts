import { AcquisitionService } from './../../../../Services/acquisition.service';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../../Services/authentication.service';
import { cognitoattr } from '../../../../Models/cognitoattr.model';

@Component({
  selector: 'app-pmprofile',
  templateUrl: './pmprofile.component.html',
  styleUrls: ['../profile.component.css']
})
export class PmprofileComponent implements OnInit {

  getattributes: any;
  profileData;
  constructor(private auth: AuthenticationService, private ap: AcquisitionService) { }

  ngOnInit() {
    this.ap.getUserprofile().subscribe(response => {
      this.profileData = response;
  });
  }
}

