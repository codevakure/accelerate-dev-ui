import { Component, OnInit } from "@angular/core";
import { AcquisitionService } from "../../../../Services/acquisition.service";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Cookie } from 'ng2-cookies/ng2-cookies';
import * as jwt_decode from "jwt-decode";
declare var $: any;


@Component({
  selector: 'app-competetion',
  templateUrl: './competetion.component.html',
  styleUrls: ['./competetion.component.css']
})
export class CompetetionComponent implements OnInit {

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
    this.getCompetetion();
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
      this.ap.patchCompetitions(this.id, event.html).subscribe(response => {
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


    getCompetetion() {
      this.ap.getApdappids(this.getapno).subscribe(response => {
        this.id = response.competitionId;
        this.ap.getApdata(response.apId).subscribe(response => {
          this.status = response.status;
          this.userexists = response.pointsofContact.includes(this.userid);
        });
        this.ap.getCompetitions(this.id).subscribe(response => {
          this.description = response.description;
        });
      });
    }
  
}