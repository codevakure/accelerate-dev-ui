import { AcquisitionService } from './../../../../Services/acquisition.service';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../../Services/authentication.service';
import { cognitoattr } from '../../../../Models/cognitoattr.model';

export class attributeSchema {
  Name: String;
  Value: String;
}


@Component({
  selector: 'app-coprofile',
  templateUrl: './coprofile.component.html',
  styleUrls: ['../profile.component.css']
})
export class CoprofileComponent implements OnInit {

  getattributes: any;
  specialist;
  division;
  po;
  warrant;
  phone;
  firstname;
  lastname;
  picture;
  role;
  email;
  code;
  profileData;
  constructor(private auth: AuthenticationService, private ap: AcquisitionService) { }

  ngOnInit() {
    this.ap.getUserprofile().subscribe(response => {
        this.profileData = response;
        console.log(this.profileData);
    });
  }
}