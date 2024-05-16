import { Component, OnInit } from "@angular/core";
import { AcquisitionService } from "../../../../Services/acquisition.service";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Cookie } from 'ng2-cookies/ng2-cookies';
import * as jwt_decode from "jwt-decode";
declare var $: any;

@Component({
  selector: 'app-compatibility',
  templateUrl: './compatibility.component.html',
  styleUrls: ['./compatibility.component.css']
})


export class CompatibilityComponent implements OnInit {
  getapno;
  compatibilitydata;
  compatibilityid;
  userexists;
  userid;
  status;

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private ap: AcquisitionService,
  ) {}

  ngOnInit() {
    this.getapno = this.route.snapshot.parent.params.apid;
    this.getCompatibility();
    this.ap.getUserprofile().subscribe(response => {
      //console.log(response);
      
    })
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

  onContentChanged(event) {
  //  console.log(event.html);
    this.ap.patchMR(this.compatibilityid, event.html, "Hello").subscribe(response => {
      if (response) {
        setTimeout(() =>
          this.toastr.success("Error Occured", "Server Error", {
            timeOut: 2000
          })
        );
      } else {
        console.log("Updated Successfully");
      }
    });
  }


  getCompatibility() {
    this.ap.getApdappids(this.getapno).subscribe(response => {
      this.compatibilityid = response.compatibilityId;
      this.ap.getApdata(response.apId).subscribe(response => {
        this.status = response.status;
        this.userexists = response.pointsofContact.includes(this.userid);
      });
      this.ap.getMR(this.compatibilityid).subscribe(response => {
        this.compatibilitydata = response.description;
        //console.log(this.compatibilitydata);
      });
    });
  }

}