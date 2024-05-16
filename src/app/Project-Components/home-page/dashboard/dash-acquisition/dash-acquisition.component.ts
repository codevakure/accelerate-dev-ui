import { Component, OnInit, Input } from "@angular/core";
import { AcquisitionService } from "../../../../Services/acquisition.service";
import { AuthenticationService } from "../../../../Services/authentication.service";
import { acquisition } from "../../../../Models/acquisition.model";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { Cookie } from "ng2-cookies/ng2-cookies";
import * as jwt_decode from "jwt-decode";
import { environment } from "../../../../../environments/environment";
declare var $: any;

@Component({
  selector: "app-dash-acquisition",
  templateUrl: "./dash-acquisition.component.html",
  styleUrls: ["./dash-acquisition.component.css"],
})
export class DashAcquisitionComponent implements OnInit {
  getacq;
  role = "";
  userexists;
  userid;
  status;
  username;
  disable: boolean = false;
  errorMessage = "";
  errorMessages;
  hideco: boolean = false;
  hidepm: boolean = false;
  emailUsers;
  usercommentsname;
  projectTitle;
  statementofneed;
  popstartDate;
  popendDate;
  estimatedBudgett;
  smallBusiness;
  specialcontractingmethod;
  idiq;
  commercialYes;
  commercialPurchase;
  subcontractCompetition;
  contractType;
  uniqueSolicitationClauses;
  governmentFurnishedProperty;
  governmentFurnishedInformation;
  organizationalConflict;
  requiredFields = "";
  apdata;
  apid;
  evalCriteria;
  DOMAIN_URL = environment.UNITED_ENV;

  constructor(
    private auth: AuthenticationService,
    private acqco: AcquisitionService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    // this.auth.getAttributes().subscribe(data => {
    //   this.role = data[20].Value;
    // });

    this.acqco.getUserprofile().subscribe((response) => {
      //console.log(response.firstName);
      //  this.userid = response.pkId;
      this.username = response.firstName;
      var fullName = response.email.split("@")[0].split(".");
      var firstName =
        fullName[0].charAt(0).toUpperCase() + fullName[0].slice(1);
      var lastName =
        fullName[fullName.length - 1].charAt(0).toUpperCase() +
        fullName[fullName.length - 1].slice(1);
      this.emailUsers = firstName + " " + lastName;
      if (response.firstName == "Not") {
        this.usercommentsname = firstName;
      } else {
        this.usercommentsname = response.firstName;
      }
      if (response.roles[0].roleName == "Contracting Officer (CO)") {
        this.role = "Contracting Officer";
        this.hideco = true;
      } else if (response.roles[0].roleName == "Program Manager (PM)") {
        this.role = "Program Officer";
        this.hidepm = true;
      }
    });
    this.getAcquisitions();
    var tokenInformation = Cookie.get("hhs-a-token");
    var decodedValue = this.getDecodedAccessToken(tokenInformation);
    this.userid = decodedValue.pkId;
    //   console.log(this.userid)
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }
  getAcquisitions() {
    this.acqco.getAcquisitions().subscribe((data) => {
      this.getacq = data;
      console.log("Acquisition data", this.getacq);
      console.log("Varun");
      //  console.log(this.getacq);
    });
  }
  onInitiate(selectedSol: any) {
    this.acqco.InitiateAP(selectedSol.ap_no).subscribe((response) => {
      if (response) {
        console.log(response);
        this.errorMessages = response.error != undefined;
        console.log(this.errorMessages);
        if (this.errorMessages == false) {
          this.acqco.getApdappids(selectedSol.ap_no).subscribe((response) => {
            this.disable = true;
            var data = {
              status: "Initiated",
              initiatedBy: this.usercommentsname,
              initiatedDate: new Date(),
            };

            this.acqco.putApData(response.apId, data).subscribe((response) => {
              console.log("Updated");
            });
          });
          // setTimeout(() => {
          //  // document.getElementById("id1").click();
          // }, 1000);
          // setTimeout(() => {
          //  // document.getElementById("id2").click();
          // }, 2000);
          // setTimeout(() => {
          //  // document.getElementById("id3").click();
          // }, 3000);
          // setTimeout(() => {
          //   //document.getElementById("id4").click();
          // }, 4000);
          //console.log(response.error.message);
          this.acqco.postComments(response.sol_no, "Form").subscribe();
          this.acqco
            .postComments(response.sol_no, "Supplies and Services")
            .subscribe();
          this.acqco
            .postComments(response.sol_no, "Statement of Work")
            .subscribe();
          this.acqco
            .postComments(response.sol_no, "Packaging and Marking")
            .subscribe();
          this.acqco
            .postComments(response.sol_no, "Inspection and Acceptance")
            .subscribe();
          this.acqco
            .postComments(response.sol_no, "Deliveries and Performance")
            .subscribe();
          this.acqco
            .postComments(response.sol_no, "Contract Administration Data")
            .subscribe();
          this.acqco
            .postComments(response.sol_no, "Special Contract Requirements")
            .subscribe();
          this.acqco.postComments(response.sol_no, "Clauses").subscribe();
          this.acqco.postComments(response.sol_no, "Attachments").subscribe();
          this.acqco
            .postComments(response.sol_no, "Representation and Certifications")
            .subscribe();
          this.acqco.postComments(response.sol_no, "Instructions").subscribe();
          this.acqco
            .postComments(response.sol_no, "Evaluation Factors")
            .subscribe();
          this.spinner.show();
          setTimeout(() => {
            this.toastr.success(
              "AI has built the form Successfully",
              "Initiated Successfully",
              { timeOut: 2000 }
            );
          }, 4000);
          setTimeout(() => {
            this.spinner.hide();
            this.acqco.getsoldappids(response.sol_no).subscribe((response) => {
              //console.log(response);
              var data1 = {
                ap_no: selectedSol.ap_no,
                sol_no: response.sol_no,
                users: [selectedSol.createdUsername],
                textUser: this.usercommentsname,
                text: "initiated acquisition",
                iconstyle: "fa-info-circle",
                message: "for AP" + " " + "#" + selectedSol.ap_no,
                date: new Date(),
                type: "Initiated",
              };
              this.acqco.postAttnotifications(data1).subscribe((Response) => {
                //console.log(Response);
                console.log("Initiated AP Notification");
              });

              var dataEmail = {
                to: [selectedSol.commentMention[1].email],
                subject:
                  this.usercommentsname +
                  " " +
                  "initiated" +
                  " " +
                  selectedSol.projectTitle +
                  " " +
                  "and AP#" +
                  selectedSol.ap_no,
                body: `
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td>
      
      <div style="background:#FFFFFF; border: 2px solid #F6F2F2;  padding: 30px; text-align:center">
      <img src="https://sandbox.accelerate.hhs.gov/landing/assets/logo/product-logo.png" height="35">
      <div style="background:#F6F2F2; padding: 20px; margin-top: 30px">
      <div style="color: #2E73DC; font-size:16px; font-weight: 600;">New Activity<div>
      <hr style="border: 2px solid #22E73DC">
      <div style="color:#000000; font-size: 14px; font-weight: 400; padding: 20px; text-align: left">
      <span style="color:#2E73DC; font-weight: 600">${this.usercommentsname}</span> shared acquisition with you for <span style="color:#2E73DC; font-weight: 600">${selectedSol.projectTitle}</span> <span style="color:#2E73DC; font-weight: 600">AP#${selectedSol.ap_no}</span> 
      </div>
        <a href="${this.DOMAIN_URL}/#/home/sol/${response.sol_no}" style="background-color:#2E73DC;border:1px solid #2E73DC;border-radius:3px;color:#ffffff;display:inline-block;font-family:sans-serif;font-size:14px;line-height:30px;text-align:center;text-decoration:none;width:150px;-webkit-text-size-adjust:none;mso-hide:all; margin-top: 20px">View Update &rarr;</a>
        </div>
      </div>
    
    </td>
  </tr>
</table>
      `,
              };
              console.log(dataEmail);
              this.acqco.postEmail(dataEmail).subscribe((Response) => {});
              var data = {
                status: "Initiated",
              };
              this.acqco
                .putSolData(response.solId, data)
                .subscribe((response) => {
                  console.log("Updated");
                });
            });
            console.log(response);
            this.ngOnInit();
            this.router.navigate(["/home/sol/", response.sol_no]);
          }, 5700);
        } else if (this.errorMessages == true) {
          console.log(response);
          this.router.navigate(["/home"]);
          this.toastr.error(
            "Please contact Administrator",
            response.error.code + " " + response.error.message,
            { timeOut: 3000 }
          );
        }
      }
      (error) => {
        console.log(response);
        this.toastr.error(
          "Please contact Administrator",
          error.statusCode + " " + error.message,
          { timeOut: 3000 }
        );
        console.log(error);
        this.router.navigate(["/home"]);
      };
    });
  }

  onAccept(selectedSol) {
    console.log(selectedSol.ap_no);
    this.acqco.getApdappids(selectedSol.ap_no).subscribe((response1) => {
      //console.log(response);
      this.apid = response1.apId;
      this.acqco.getApdata(this.apid).subscribe((response) => {
        this.acqco
          .getEvaluations(response1.evaluationCriteriaId)
          .subscribe((evalRes) => {
            console.log(
              "Eval Criteria from topnav",
              evalRes.evaluationCriteria
            );
            this.evalCriteria = evalRes.evaluationCriteria;
            this.apdata = response;
            this.status = this.apdata.status;
            this.projectTitle = this.apdata.projectTitle;
            this.statementofneed = this.apdata.statementofNeed;
            this.popstartDate = this.apdata.popstartDate;
            this.popendDate = this.apdata.popendDate;
            this.estimatedBudgett = this.apdata.estimatedBudgett;
            this.smallBusiness = this.apdata.smallBusines;
            this.specialcontractingmethod = this.apdata.specialcontractingmethod;
            this.idiq = this.apdata.idiq;
            this.subcontractCompetition = this.apdata.subcontractCompetition;
            this.contractType = this.apdata.contractType;
            this.uniqueSolicitationClauses = this.apdata.uniqueSolicitationClauses;
            this.governmentFurnishedProperty = this.apdata.governmentFurnishedProperty;
            this.governmentFurnishedInformation = this.apdata.governmentFurnishedInformation;
            this.organizationalConflict = this.apdata.organizationalConflict;
            this.commercialPurchase = this.apdata.Source;
            this.commercialYes = this.apdata.productKind;

            if (
              (this.projectTitle &&
                this.statementofneed &&
                this.popstartDate &&
                this.popendDate &&
                this.estimatedBudgett &&
                this.smallBusiness &&
                this.specialcontractingmethod &&
                this.idiq &&
                this.subcontractCompetition &&
                this.contractType &&
                this.commercialPurchase &&
                this.commercialYes &&
                this.uniqueSolicitationClauses &&
                this.governmentFurnishedInformation &&
                this.evalCriteria &&
                this.governmentFurnishedProperty) != ""
            ) {
              // console.log("All the fields are filled");
              this.requiredFields = "Completed";
              var data = {
                status: "Accepted",
                acceptedBy: this.usercommentsname,
                acceptedDate: new Date(),
              };
              var data1 = {
                ap_no: selectedSol.ap_no,
                users: [selectedSol.createdUsername],
                textUser: this.usercommentsname,
                text: "accepted acquisition",
                iconstyle: "fa-check-square-o",
                message: "for AP" + " " + "#" + selectedSol.ap_no,
                date: new Date(),
                type: "Accepted",
              };
              this.acqco.postAttnotifications(data1).subscribe((Response) => {
                //console.log(Response);
                console.log("Accepted AP Notification");
              });

              var dataEmail = {
                to: [selectedSol.commentMention[1].email],
                subject:
                  this.usercommentsname +
                  " " +
                  "accepted" +
                  " " +
                  selectedSol.projectTitle +
                  " " +
                  "and AP#" +
                  selectedSol.ap_no,
                body: `
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td>
            
            <div style="background:#FFFFFF; border: 2px solid #F6F2F2;  padding: 30px; text-align:center">
            <img src="https://sandbox.accelerate.hhs.gov/landing/assets/logo/product-logo.png" height="35">
            <div style="background:#F6F2F2; padding: 20px; margin-top: 30px">
            <div style="color: #2E73DC; font-size:16px; font-weight: 600;">New Activity<div>
            <hr style="border: 2px solid #22E73DC">
            <div style="color:#000000; font-size: 14px; font-weight: 400; padding: 20px; text-align: left">
            <span style="color:#2E73DC; font-weight: 600">${this.usercommentsname}</span> shared acquisition with you for <span style="color:#2E73DC; font-weight: 600">${selectedSol.projectTitle}</span> <span style="color:#2E73DC; font-weight: 600">AP#${selectedSol.ap_no}</span> 
            </div>
              <a href="${this.DOMAIN_URL}/#/home/${selectedSol.ap_no}" style="background-color:#2E73DC;border:1px solid #2E73DC;border-radius:3px;color:#ffffff;display:inline-block;font-family:sans-serif;font-size:14px;line-height:30px;text-align:center;text-decoration:none;width:150px;-webkit-text-size-adjust:none;mso-hide:all; margin-top: 20px">View Update &rarr;</a>
              </div>
            </div>
          
          </td>
        </tr>
        </table>
            `,
              };
              console.log(dataEmail);
              this.acqco.postEmail(dataEmail).subscribe((Response) => {});
              this.acqco.putApData(this.apid, data).subscribe((response) => {
                console.log("Updated");
              });
              this.acqco.acceptAP(selectedSol.ap_no).subscribe((response) => {
                if (response) {
                  this.ngOnInit();
                  setTimeout(() =>
                    this.toastr.success(
                      "Acquisition accepted Successfully",
                      "Accepted Acquisition",
                      { timeOut: 2000 }
                    )
                  );
                  //this.router.navigate(["/home"]);
                } else {
                  this.ngOnInit();
                  setTimeout(() =>
                    this.toastr.success(
                      "Acquisition accepted Successfully",
                      "Accepted Acquisition",
                      { timeOut: 2000 }
                    )
                  );
                  //this.router.navigate(["/home"]);
                  console.log("Accepted AP");
                }
              });
            } else {
              console.log("Not Accepted");
              this.requiredFields = "NotCompleted";
              console.log("Not Accepted");
              //this.toastr.info("");
              if (this.statementofneed == "") {
                console.log("statement of need is empty", this.statementofneed);
                this.errorMessage += "<br/> * Statement of Need";
                //this.toastr.error("Statement of Need");
              }
              if (this.projectTitle == "") {
                console.log("projectTile is empty", this.projectTitle);
                this.errorMessage += "<br/> * Project Title";
                //this.toastr.error("Project Title");
              }

              if (this.commercialPurchase == "") {
                this.errorMessage += "<br/> * Commercial Purchase";
                //this.toastr.error("Commercial Purchase");
              }

              if (this.commercialPurchase == true && this.commercialYes == "") {
                this.errorMessage += "<br/> * UCF or Streamlined";
                //   this.toastr.error("UCF or Streamlined");
              }

              if (this.organizationalConflict == "") {
                console.log(
                  "Organizational Conflict",
                  this.organizationalConflict
                );
                this.errorMessage +=
                  "<br/> * Organizational Conflict of interest";
                //this.toastr.error("Organizational Conflict of interest");
              }
              if (this.popstartDate == "") {
                console.log("POP Start Daate");
                this.errorMessage += "<br/> * POP start date";
                //this.toastr.error("POP start date");
              }

              if (this.popendDate == "") {
                console.log("POP End Daate");
                // console.log("POP Start Daate");
                this.errorMessage += "<br/> * POP end date";
                //this.toastr.error("POP end date");
              }

              if (this.estimatedBudgett == "") {
                console.log("EB");
                this.errorMessage += "<br/> * Estimated Budget";
                //this.toastr.error("Estimated Budget");
              }

              if (this.smallBusiness == "") {
                console.log("SmallBuss", this.smallBusiness);
                this.errorMessage += "<br/> * Small Business";
                //this.toastr.error("Small Business");
              }

              if (this.specialcontractingmethod == "") {
                console.log("SCM");
                this.errorMessage += "<br/> * Special Contracting Method";
                // this.toastr.error("Special Contracting Method");
              }

              if (this.idiq == "") {
                console.log("idiq");
                this.errorMessage += "<br/> * IDIQ";
                // this.toastr.error("IDIQ");
              }

              if (this.subcontractCompetition == "") {
                console.log("SubConComp");
                this.errorMessage += "<br/> * Subcontract Competition";
                //this.toastr.error("Subcontract Competition");
              }

              if (this.contractType == "") {
                console.log("contravttype");
                this.errorMessage += "<br/> * Contract Type";
                // this.toastr.error("Contract Type");
              }

              if (this.uniqueSolicitationClauses == "") {
                console.log("unique solicitation Claues");
                this.errorMessage += "<br/> * Unique Solicitation Clauses";
                // this.toastr.error("Unique Solicitation Clauses");
              }

              if (this.governmentFurnishedProperty == "") {
                console.log("GFP");
                this.errorMessage += "<br/> * Government Furnished Property";
                //   this.toastr.error("Government Furnished Property");
              }

              if (this.governmentFurnishedInformation == "") {
                console.log("GFI");
                this.errorMessage += "<br/> * Government Furnished Information";
                //this.toastr.error("Government Furnished Information");
              }

              if (this.evalCriteria == "" || this.evalCriteria == undefined) {
                console.log("evalCriteria");
                this.errorMessage +=
                  "<br/><br/><b>Evaluations<b><br/> * Evaluation Criteria";
                // this.toastr.error("Government Furnished Information");
              }
              // this.toastr.error(this.errorMessage);
              this.toastr.error(
                this.errorMessage,
                "Below fields are required to Accept AP",
                {
                  enableHtml: true,
                  closeButton: true,
                  timeOut: 4000,
                }
              );
              setTimeout(() => {
                console.log(this.errorMessage);

                this.errorMessage = "";
                // this.toastr.show('<font color=\"red\">Hi<b>Hello</b></red></font>"',
                //  'title' , {
                //           enableHtml: true,
                //           closeButton: true,
                //           timeOut: 10000
                //       });
              }, 1000);
              // console.log("Required Fields needs to be completed");
            }
          });
      });
    });
  }
  review(id: any) {
    console.log(id.id);
    this.router.navigate(["/home/" + id.ap_no]);
  }
  sendEmailPm(element) {
    var email = element.rEmail;
    var subject =
      "Regarding" + " " + element.ap_no + " " + element.projectTitle;
    var emailBody = "Hi " + element.rName;
    document.location.href =
      "mailto:" + email + "?subject=" + subject + "&body=" + emailBody;
  }

  sendEmailCo(element) {
    var email = element.coEmail;
    var subject =
      "Regarding" + " " + element.ap_no + " " + element.projectTitle;
    var emailBody = "Hi " + element.coName;
    document.location.href =
      "mailto:" + email + "?subject=" + subject + "&body=" + emailBody;
  }
}
