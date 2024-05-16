import { Component, OnInit } from "@angular/core";
import { AcquisitionService } from "../../../../Services/acquisition.service";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Cookie } from 'ng2-cookies/ng2-cookies';
import * as jwt_decode from "jwt-decode";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  Form,
  FormArray
} from "@angular/forms";
declare var $: any;


@Component({
  selector: 'app-tradeoffs',
  templateUrl: './tradeoffs.component.html',
  styleUrls: ['./tradeoffs.component.css']
})
export class TradeoffsComponent implements OnInit {
  getapno;
  description;
  id;
  userexists;
  userid;
  status;
  igceDecsriptions;
  category;
  productService;
  far7105b6 = "IGCE Description";

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private ap: AcquisitionService,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.getapno = this.route.snapshot.parent.params.apid;
    this.ap.getUserprofile().subscribe(response => {
      //console.log(response);
     // this.userid = response.pkId
    })

    this.igceDecsriptions = new FormGroup({ 
      igceDescription: new FormControl(""),
      coastGoals: new FormControl(""),
      funding: new FormControl(""),
    })

    var tokenInformation = Cookie.get('hhs-a-token');
    var decodedValue = this.getDecodedAccessToken(tokenInformation);
    this.userid = decodedValue.pkId
    
    this.getTradeoff();
  }

  
    
  getDecodedAccessToken(token: string): any {
    try{
        return jwt_decode(token);
    }
    catch(Error){
        return null;
    }
  }
  onChange(igceDescription) {
    console.log(igceDescription.value);
      this.ap.patchTradeoffs(this.id, igceDescription.value).subscribe(response => {
        if (response) {
          setTimeout(() =>
            this.toastr.success("Error Occured", "Server Error", {
              timeOut: 2000
            })
          );
        } else {
         // console.log("Updated Successfully");
        }
      });
    }


    getTradeoff() {
      this.ap.getApdappids(this.getapno).subscribe(response => {
        this.id = response.tradeoffId;
        this.ap.getApdata(response.apId).subscribe(response1 => {
          this.status = response1.status;
          this.category = response1.categoryManagement;
          this.productService = response1.productService;
          this.ap.getTradeoffs(this.id).subscribe(response2 => {
            console.log("IGCE Description", response2);
            if(this.category == 'Medical' && this.productService == 'sup'){
              this.igceDecsriptions.get("coastGoals").setValue("N/A");
             // this.igceDecsriptions.get("coastGoals").disable();
              this.igceDecsriptions.get("igceDescription").setValue(response2.igceDescription);
              this.igceDecsriptions.get("funding").setValue(response2.funding);
            } else if((this.productService != "sup" || this.category != "Medical") && response2.coastGoals == "N/A") {
              this.igceDecsriptions.get("coastGoals").setValue("");
              this.igceDecsriptions.get("igceDescription").setValue(response2.igceDescription);
              this.igceDecsriptions.get("funding").setValue(response2.funding);
            }  else {
              this.igceDecsriptions.get("igceDescription").setValue(response2.igceDescription);
              this.igceDecsriptions.get("coastGoals").setValue(response2.coastGoals);
              this.igceDecsriptions.get("funding").setValue(response2.funding);
            }

          });
          this.userexists = response1.pointsofContact.includes(this.userid);
          if(this.status == 'Shared' && this.userexists == false || this.status == 'Accepted' || this.status == 'Initiated' || this.status == 'Published') {
            this.igceDecsriptions.get("igceDescription").disable();;
            this.igceDecsriptions.get("coastGoals").disable();
            this.igceDecsriptions.get("funding").disable();
          }
        });

      });
    }

}
