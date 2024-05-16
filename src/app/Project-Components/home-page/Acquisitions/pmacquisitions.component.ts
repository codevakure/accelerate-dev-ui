import { element } from 'protractor';
import { Response } from '@angular/http';
import { Component, OnInit, ViewChild } from "@angular/core";
import { AcquisitionService } from "../../../Services/acquisition.service";
import { AuthenticationService } from "../../../Services/authentication.service";
import { Router } from "@angular/router";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import * as jwt_decode from "jwt-decode";

@Component({
  selector: 'app-pmacquisitions',
  templateUrl: './pmacquisitions.component.html',
  styleUrls: ['./pmacquisitions.component.css']
})


export class PmacquisitionsComponent implements OnInit {
  getacquisition;
  getdrafts;
  getdraftcount;
  displayedColumns: string[] = [
    "ap_no",
    "description",
    "productorService",
    "anticipatedDate",
    "status",
    "action",
  ];
  dataSource;
  searchKey: string;


  draftColumns: string[] = [
    "ap_no",
    "description",
    "productorService",
    "deliveryDate",
    "status",
    "action"
  ];
  draftSource;
  draftKey: string;
  role;
  username;
  userid;
  hideco: boolean = false;
  hidepm: boolean = false;
  disable :boolean = false;
  errorMessage;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private auth: AuthenticationService,
    private acqco: AcquisitionService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.acqco.getUserprofile().subscribe(response => {
    
      var fullName = response.email.split('@')[0].split('.');
      var firstName = fullName[0].charAt(0).toUpperCase() + fullName[0].slice(1);
      var lastName = fullName[ fullName.length-1 ].charAt(0).toUpperCase() + fullName[ fullName.length-1 ].slice(1);
      if(response.firstName == "Not") {
          this.username = firstName
      } else {
          this.username = response.firstName
      }
      if(response.roles[0].roleName == "Contracting Officer (CO)") {
        this.role = "Contracting Officer"
        this.hideco = true;
      } else if (response.roles[0].roleName == "Program Manager (PM)") {
        this.role = "Program Officer"
        this.hidepm = true;
      }
    })
    this.acqco.getAcquisitions().subscribe((Response) => {
      if(Response) {
        this.getdrafts = Response;
        this.draftSource = new MatTableDataSource(this.getdrafts);
        this.draftSource.paginator = this.paginator;
        this.draftSource.sort = this.sort;
      } else {
        console.log("error");
      }
    });
    var tokenInformation = Cookie.get('hhs-a-token');
    var decodedValue = this.getDecodedAccessToken(tokenInformation);
    this.userid = decodedValue.pkId;
  }

  getDecodedAccessToken(token: string): any {
    try{
        return jwt_decode(token);
    }
    catch(Error){
        return null;
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  applyFilterDrafts(filterValue: string) {
    this.draftSource.filter = filterValue.trim().toLowerCase();
  }



  
  onInitiate(selectedSol: any) {
    console.log(selectedSol.ap_no);
    this.acqco.InitiateAP(selectedSol.ap_no).subscribe(response => {
      if (response) {
        console.log(response.error);
        this.errorMessage = (response.error != undefined)
        console.log(this.errorMessage);
        if( this.errorMessage == false ) {
          this.acqco.getApdappids(selectedSol.ap_no).subscribe(response => {
            this.disable = true;
            var data = {
              status: "Initiated",
              initiatedBy:this.username,
              initiatedDate: new Date(),
            };
            this.acqco.putApData(response.apId, data).subscribe(response => {
              console.log("Updated");
            });
          });
          setTimeout(() => {
            document.getElementById("id1").click();
          }, 2000);
          setTimeout(() => {
            document.getElementById("id2").click();
          }, 4000);
          setTimeout(() => {
            document.getElementById("id3").click();
          }, 6000);
          setTimeout(() => {
            document.getElementById("id4").click();
          }, 8000);
          console.log(response);
          this.spinner.show();
          setTimeout(() => {
            this.toastr.success(
              "AI has built the form Successfully",
              "Initiated Successfully",
              { timeOut: 2000 }
            );
          }, 8000);
          setTimeout(() => {
            this.spinner.hide();
            this.acqco.getsoldappids(response.sol_no).subscribe(response => {
             
              this.acqco.postComments(response.sol_no,"Form").subscribe();
              this.acqco.postComments(response.sol_no,"Supplies and Services").subscribe();
              this.acqco.postComments(response.sol_no,"Statement of Work").subscribe();
              this.acqco.postComments(response.sol_no,"Packaging and Marking").subscribe();
              this.acqco.postComments(response.sol_no,"Inspection and Acceptance").subscribe();
              this.acqco.postComments(response.sol_no,"Deliveries and Performance").subscribe();
              this.acqco.postComments(response.sol_no,"Contract Administration Data").subscribe();
              this.acqco.postComments(response.sol_no,"Special Contract Requirements").subscribe();
              this.acqco.postComments(response.sol_no,"Clauses").subscribe();
              this.acqco.postComments(response.sol_no,"Attachments").subscribe();
              this.acqco.postComments(response.sol_no,"Representation and Certifications").subscribe();
              this.acqco.postComments(response.sol_no,"Instructions").subscribe();
              this.acqco.postComments(response.sol_no,"Evaluation Factors").subscribe();
              var data = {
                status: "Initiated"
              };
                var data1 = {
                  ap_no: selectedSol.ap_no,
                  sol_no: response.sol_no,
                  users: [selectedSol.createdUsername],
                  textUser: this.username,
                  text: "initiated acquisition",
                  iconstyle:"fa-info-circle",
                  message: "for AP"+" "+"#"+selectedSol.ap_no,
                  date: new Date(),
                  type: "Initiated",
                }
                this.acqco.postAttnotifications(data1).subscribe(Response => {
                  
                  console.log("Initiated AP Notification");
                })
              this.acqco.putSolData(response.solId, data).subscribe(response => {
                console.log("Updated");
              });
            });
            this.router.navigate(["/home/sol/", response.sol_no]);
          }, 10000);
        } else if(this.errorMessage == true ) {
          this.router.navigate(["/home/acquisitions"]);
          this.toastr.error(
            "Please contact Administrator",
            response.error.code + " " + response.error.message,
            { timeOut: 3000 }
          );
        }

      } else {
        console.log("error");
      }
    },
    error=>{
      this.toastr.error(
        "Please contact Administrator",
        error.statusCode + " " + error.message,
        { timeOut: 3000 }
      );
    });
  }

  onAccept(selectedSol: any) {
    this.acqco.getApdappids(selectedSol.ap_no).subscribe(response => {
     
      var data = {
        status: "Accepted",
        acceptedBy:this.username,
        acceptedDate: new Date(),
      };
      var data1 = {
        ap_no: selectedSol.ap_no,
        users: [selectedSol.createdUsername],
        textUser: this.username,
        text: "accepted acquisition",
        iconstyle:"fa-check-square-o",
        message: "for AP"+" "+"#"+selectedSol.ap_no,
        date: new Date(),
        type: "Accepted",
      }
      this.acqco.postAttnotifications(data1).subscribe(Response => {
        
        console.log("Accepted AP Notification");
      })
      this.acqco.putApData(response.apId, data).subscribe(response => {
        console.log("Updated");
      });
    });
    this.acqco.acceptAP(selectedSol.ap_no).subscribe(response => {
      if (response) {
        this.ngOnInit();
        setTimeout(() =>
          this.toastr.success(
            "Acquisition accepted Successfully",
            "Accepted Acquisition",
            { timeOut: 2000 }
          )
        );
     
        this.ngOnInit();
        setTimeout(() =>
          this.toastr.success(
            "Acquisition accepted Successfully",
            "Accepted Acquisition",
            { timeOut: 2000 }
          )
        );
     
        console.log("Accepted AP");
      }
    });
  }

  review(id: any) {
    this.router.navigate(['/home/'+id.ap_no]);
  }

  sendEmailPm(element) {
    var email = element.rEmail;
    var subject = "Regarding"+" "+element.ap_no+" "+element.projectTitle;
    var emailBody = 'Hi '+element.rName;
    document.location.href = "mailto:"+email+"?subject="+subject+"&body="+emailBody;
  }

  sendEmailCo(element) {
    var email = element.coEmail;
    var subject = "Regarding"+" "+element.ap_no+" "+element.projectTitle;
    var emailBody = 'Hi '+element.coName;
    document.location.href = "mailto:"+email+"?subject="+subject+"&body="+emailBody;
  }
}
