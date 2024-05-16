import { Component, OnInit } from "@angular/core";
import { AcquisitionService } from "../../../../Services/acquisition.service";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
declare var $: any;
import { Cookie } from 'ng2-cookies/ng2-cookies';
import * as jwt_decode from "jwt-decode";

@Component({
  selector: 'app-estimate',
  templateUrl: './estimate.component.html',
  styleUrls: ['./estimate.component.css']
})
export class EstimateComponent implements OnInit {
  getapno;
  description;
  id;
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
    this.ap.getUserprofile().subscribe(response => {
      //console.log(response);
    })
    this.getEstimates();
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
      this.ap.patchEstimates(this.id, event.html).subscribe(response => {
        if (response) {
          setTimeout(() =>
            this.toastr.success("Error Occured", "Server Error", {
              timeOut: 2000
            })
          );
        } else {
          //console.log("Updated Successfully");
        }
      });
    }


    getEstimates() {
      this.ap.getApdappids(this.getapno).subscribe(response => {
        this.ap.getApdata(response.apId).subscribe(response => {
          this.status = response.status;
          this.userexists = response.pointsofContact.includes(this.userid);
        });
        this.id = response.estimateId;
        this.ap.getEstimates(this.id).subscribe(response => {
          this.description = response.description;
        });
      });
    }

}
