import { Response } from "@angular/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { AcquisitionService } from "../../../../Services/acquisition.service";
import { AuthenticationService } from "../../../../Services/authentication.service";
import { acquisition } from "../../../../Models/acquisition.model";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  Form,
  FormArray
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { Cookie } from 'ng2-cookies/ng2-cookies';
import * as jwt_decode from "jwt-decode";
import { ConsoleService } from "@ng-select/ng-select/ng-select/console.service";
declare var $: any;
@Component({
  selector: 'app-section508',
  templateUrl: './section508.component.html',
  styleUrls: ['./section508.component.css']
})
export class Section508Component implements OnInit {

  section508;
  far39201="Section 508";
  userid;
  getapno;
  sectionid;
  simNumber;
  status;
  sectionData;
  userexists;

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private ap: AcquisitionService,
    private auth: AuthenticationService,
  ) { }

  ngOnInit() {
    this.getapno = this.route.snapshot.parent.params.apid;
    this.ap.getUserprofile().subscribe(response => {
     // console.log(response);
    })
    this.get508();
    //this.similarContracts();
    var tokenInformation = Cookie.get('hhs-a-token');
    var decodedValue = this.getDecodedAccessToken(tokenInformation);
    this.userid = decodedValue.pkId
  }

  getDecodedAccessToken(token: string): any {
    try{
        return jwt_decode(token);
    }
    catch(Error){
        return null;
    }
  }

  onSection508(event) {
    console.log(event.html);
    this.ap.patchSection508(this.sectionid, event.html).subscribe(response => {});
  }

  get508(){
    this.ap.getApdappids(this.getapno).subscribe(response => {
      console.log("IDS", response);
      this.ap.getApdata(response.apId).subscribe(response => {
        this.simNumber = response.similarNumber;
        this.status = response.status;
        this.userexists = response.pointsofContact.includes(this.userid);
        // if(this.status == 'Shared' && this.userexists == false || this.status == 'Accepted'){
        //   document.getElementById('similarContracts').classList.add('disabled')
        // } else  {
        //   document.getElementById('similarContracts').classList.remove('disabled')
        // }
      });
      this.sectionid = response.section508Id;
      this.ap.getSection508(this.sectionid).subscribe(response => {
        console.log(response);
        this.sectionData = response.description;
      });
    });
  }
}
