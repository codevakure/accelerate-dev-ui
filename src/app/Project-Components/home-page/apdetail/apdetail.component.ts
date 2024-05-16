import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  Form
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { NgForm } from "@angular/forms";
import { AuthenticationService } from "../../../Services/authentication.service";
import { AcquisitionService } from "../../../Services/acquisition.service";
import { NgxSpinnerService } from "ngx-spinner";
declare var $: any;

@Component({
  selector: "app-apdetail",
  templateUrl: "./apdetail.component.html",
  styleUrls: ["./apdetail.component.css"]
})
export class ApdetailComponent implements OnInit {
  apdata;
  status;
  getattributes;
  picture;
  role;
  name;
  routeHeader;
  sectionHeader;
  hide: boolean = true;
  getapno;
  solno;
  productService;
  hideSolicitations: boolean = false;
  comments: boolean = false;
  projectTitle;
  statementofneed;
  popstartDate;
  popendDate;
  estimatedBudgett;
  smallBusiness;
  specialcontractingmethod;
  idiq;
  subcontractCompetition;
  contractType;
  uniqueSolicitationClauses;
  governmentFurnishedProperty;
  governmentFurnishedInformation;
  organizationalConflict;
  requiredFields = "";
  acceptButton: boolean = false;
  intitiateButton: boolean = false;
  userexists;
  userid;
  emailUsers;
  role3;
  usercommentsname;
  responseapno;
  responsecreateduser;
  disable: boolean = false;
  commercialYes;
  commercialPurchase;
  errorMessage = "";
  hideco: boolean = false;
  hidepm: boolean = false;
  userid3;
  errorMessages;
  evalCriteria;
  constructor(
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private auth: AuthenticationService,
    private ap: AcquisitionService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.getapno = this.route.snapshot.params.apid;
    this.ap.getUserprofile().subscribe(response => {
      this.userid = response.pkId;
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
        console.log("Logged in as CO");
      } else if (response.roles[0].roleName == "Program Manager (PM)") {
        this.role = "Program Officer";
        //console.log("Logged in as PM");
      }
    });

    this.route.url.subscribe(event => {
      //console.log(event);
      console.log(
        this.route.snapshot["_routerState"].url.split(
          "/home/" + this.getapno + "/"
        )[1]
      );
      this.routeHeader = this.route.snapshot["_routerState"].url.split(
        "/home/" + this.getapno + "/"
      )[1];
      if (this.routeHeader == undefined) {
        this.sectionHeader = "General";
      } else if (this.routeHeader == "market_research") {
        this.sectionHeader = "Market Research";
      } else if (this.routeHeader == "sow") {
        this.sectionHeader = "Statement of Work";
      } else if (this.routeHeader == "reqform") {
        this.sectionHeader = "Requisition Form";
      } else if (this.routeHeader == "evaluations") {
        this.sectionHeader = "Evaluations";
      } else if (this.routeHeader == "attachments") {
        this.sectionHeader = "Attachments";
      } else if (this.routeHeader == "igce") {
        this.sectionHeader = "IGCE";
      } else if (this.routeHeader == "igceDescription") {
        this.sectionHeader = "IGCE Description";
      } else if (this.routeHeader == "security") {
        this.sectionHeader = "Security";
      } else if (this.routeHeader == "other") {
        this.sectionHeader = "Other Considerations";
      } else if (this.routeHeader == "poc") {
        this.sectionHeader = "Points of Contact";
      } else if (this.routeHeader == "resources") {
        this.sectionHeader = "Resources";
      } else if (this.routeHeader == "section508") {
        this.sectionHeader = "Section 508";
      } else if (this.routeHeader == "appreview") {
        this.sectionHeader = "Preview";
      }

      this.ap.collabHeader.next(this.sectionHeader);
      this.ap.routeHeader.next(this.routeHeader);
    });
    this.getAp();
    // $(document).ready(function() {
    //   $("#sidebar").mCustomScrollbar({
    //     theme: "minimal"
    //   });
    //   $("#sidebarCollapse").on("click", function() {
    //     $("#sidebar, #content").toggleClass("active");
    //     $(".collapse.in").toggleClass("in");
    //     $("a[aria-expanded=true]").attr("aria-expanded", "false");
    //   });
    // });
    this.pageRefresh();
  }

  pageRefresh(){
    this.ap.generalPageEvent.subscribe((response)=> {
     // console.log("Response from project general page", response);
      this.ngOnInit();
    })
  }
  getAp() {
    //console.log(this.getapno);
    this.ap.getApdappids(this.getapno).subscribe(response1 => {
      this.ap.getApdata(response1.apId).subscribe(response => {
        this.ap
        .getEvaluations(response1.evaluationCriteriaId)
        .subscribe(evalRes => {
          console.log("Eval Criteria from topnav", evalRes.evaluationCriteria);
        this.evalCriteria = evalRes.evaluationCriteria;
        this.apdata = response;
        console.log("adData from apdetail", this.apdata);
        console.log(this.apdata.productService);
        this.productService = this.apdata.productService;
        this.status = this.apdata.status;
        this.commercialPurchase = this.apdata.Source;
        this.responseapno = response.ap_no;
        this.responsecreateduser = response.createdUsername;
        this.projectTitle = this.apdata.projectTitle;
        this.statementofneed = this.apdata.statementofNeed;
        this.popstartDate = this.apdata.popstartDate;
        this.popendDate = this.apdata.popendDate;
        this.estimatedBudgett = this.apdata.estimatedBudgett;
        this.smallBusiness = this.apdata.smallBusines;
        this.specialcontractingmethod = this.apdata.specialcontractingmethod;
        this.idiq = this.apdata.idiq;
        this.commercialYes = this.apdata.productKind;
        this.subcontractCompetition = this.apdata.subcontractCompetition;
        this.contractType = this.apdata.contractType;
        this.uniqueSolicitationClauses = this.apdata.uniqueSolicitationClauses;
        this.governmentFurnishedProperty = this.apdata.governmentFurnishedProperty;
        this.governmentFurnishedInformation = this.apdata.governmentFurnishedInformation;
        this.organizationalConflict = this.apdata.organizationalConflict;
        this.ap.getUserprofile().subscribe(response3 => {
          this.userid3 = response3.pkId;
          if (response3.roles[0].roleName == "Contracting Officer (CO)") {
            this.role3 = "Contracting Officer";
            console.log("Logged in as CO");
          } else if (response3.roles[0].roleName == "Program Manager (PM)") {
            this.role3 = "Program Officer";
            //console.log("Logged in as PM");
          }
          this.userexists = response.pointsofContact.includes(this.userid3);
          console.log("3 Options", this.role3, this.userexists, this.status, this.userid3);
          if (
            this.status == "Shared" &&
            this.userexists == true &&
            this.role3 == "Contracting Officer"
          ) {
            console.log("Accept True");
            this.acceptButton = true;
            this.intitiateButton = false;
          } else if (
            this.status == "Accepted" &&
            this.userexists == true &&
            this.role3 == "Contracting Officer"
          ) {
            console.log("Accept False");
              this.intitiateButton = true;
              this.acceptButton = false;
          }
        });



        if (this.projectTitle &&
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
            this.organizationalConflict &&
            this.governmentFurnishedInformation &&
            this.evalCriteria &&
            this.governmentFurnishedProperty != "" || undefined) {
          console.log("All the fields are filled");
          this.requiredFields = "Completed";
        } else {
          this.requiredFields = "NotCompleted";

          console.log("Required Fields needs to be completed");
        }
        console.log(this.status);
        if (this.status == "Draft" || this.status == "Shared") {
          this.hideSolicitations = false;
          this.comments = true;
        } else if (this.status == "Accepted") {
          this.hideSolicitations = false;
          this.comments = false;
        } else if (this.status == "Initiated" || this.status == "Published") {
          this.hideSolicitations = true;
          this.comments = false;
        }
     
      });
    });
    });
  }

  sidebarFunction() {
    var x = document.getElementById("material");
    if (x.innerHTML === "arrow_forward") {
      x.innerHTML = "arrow_back";
      this.hide = true;
    } else {
      x.innerHTML = "arrow_forward";
      this.hide = false;
    }
  }

  backtoSol() {
    this.ap.getSoldappapno(this.getapno).subscribe(response => {
      // console.log(response);
      this.router.navigate(["/home/sol/" + response[0].sol_no]);
    });
  }

  acceptAp() {
    this.ngOnInit();
    setTimeout(() => {
      if (this.requiredFields == "Completed") {
        console.log("Accepted Succeesfull");
        this.ap.getApdappids(this.responseapno).subscribe(response => {
          //console.log(response);
          var data = {
            status: "Accepted",
            acceptedBy: this.usercommentsname,
            acceptedDate: new Date()
          };
          var data1 = {
            ap_no: this.responseapno,
            users: [this.responsecreateduser],
            textUser: this.usercommentsname,
            text: "accepted acquisition",
            iconstyle: "fa-check-square-o",
            message: "for AP" + " " + "#" + this.responseapno,
            date: new Date(),
            type: "Accepted"
          };
          this.ap.postAttnotifications(data1).subscribe(Response => {
            //console.log(Response);
            console.log("Accepted AP Notification");

          });
          this.ap.putApData(response.apId, data).subscribe(response => {
            console.log("Updated");
            this.ap.pageRefresh.next("PageRefresh");
          });
        });
        this.ap.acceptAP(this.responseapno).subscribe(response => {
          if (response) {
            this.ngOnInit();
            setTimeout(() =>
              this.toastr.success(
                "Acquisition accepted Successfully",
                "Accepted Acquisition",
                { timeOut: 2000 }
              )
            );
          
          } else {
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
      } else if (this.requiredFields == "NotCompleted") {
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

        if(this.commercialPurchase == "") {
          this.errorMessage += "<br/> * Commercial Purchase";
          //this.toastr.error("Commercial Purchase");
        }

        if(this.commercialPurchase == true && this.commercialYes == "") {
          this.errorMessage += "<br/> * UCF or Streamlined";
       //   this.toastr.error("UCF or Streamlined");
        }

        if(this.organizationalConflict == ""){
          console.log("Organizational Conflict", this.organizationalConflict);
          this.errorMessage += "<br/> * Organizational Conflict of interest";
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
        // this.toastr.error("Government Furnished Information");
        }


        if (this.evalCriteria == "" || this.evalCriteria == undefined) {
          console.log("evalCriteria");
          this.errorMessage += "<br/><br/><b>Evaluations<b><br/> * Evaluation Criteria";
        // this.toastr.error("Government Furnished Information");
        }
       // this.toastr.error(this.errorMessage);
        this.toastr.error(this.errorMessage,
          'Below fields are required to Accept AP' , {
                   enableHtml: true,
                   closeButton: true,
                   timeOut: 4000
               });
        setTimeout(()=>{
          console.log (this.errorMessage);

          this.errorMessage = "";
          // this.toastr.show('<font color=\"red\">Hi<b>Hello</b></red></font>"',
          //  'title' , {
          //           enableHtml: true,
          //           closeButton: true,
          //           timeOut: 10000
          //       });
        },1000)

      }
      
      // console.log("Required Fields", this.requiredFields);
      // console.log("Accept AP");
    }, 500);
  }

  initiateAp() {
    this.ap.InitiateAP(this.responseapno).subscribe(response => {
      if (response) {
        console.log(response);
        this.errorMessages = response.error != undefined;
        console.log(this.errorMessages);
        if (this.errorMessages == false) {
          this.ap.getApdappids(this.responseapno).subscribe(response => {
            this.disable = true;
            var data = {
              status: "Initiated",
              initiatedBy: this.usercommentsname,
              initiatedDate: new Date()
            };

            this.ap.putApData(response.apId, data).subscribe(response => {
              console.log("Updated");
            });
          });
         
          this.ap.postComments(response.sol_no, "Form").subscribe();
          this.ap
            .postComments(response.sol_no, "Supplies and Services")
            .subscribe();
          this.ap
            .postComments(response.sol_no, "Statement of Work")
            .subscribe();
          this.ap
            .postComments(response.sol_no, "Packaging and Marking")
            .subscribe();
          this.ap
            .postComments(response.sol_no, "Inspection and Acceptance")
            .subscribe();
          this.ap
            .postComments(response.sol_no, "Deliveries and Performance")
            .subscribe();
          this.ap
            .postComments(response.sol_no, "Contract Administration Data")
            .subscribe();
          this.ap
            .postComments(response.sol_no, "Special Contract Requirements")
            .subscribe();
          this.ap.postComments(response.sol_no, "Clauses").subscribe();
          this.ap.postComments(response.sol_no, "Attachments").subscribe();
          this.ap
            .postComments(response.sol_no, "Representation and Certifications")
            .subscribe();
          this.ap.postComments(response.sol_no, "Instructions").subscribe();
          this.ap
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
            this.ap.getsoldappids(response.sol_no).subscribe(response => {
              //console.log(response);
              var data1 = {
                ap_no: this.responseapno,
                sol_no: response.sol_no,
                users: [this.responsecreateduser],
                textUser: this.usercommentsname,
                text: "initiated acquisition",
                iconstyle: "fa-info-circle",
                message: "for AP" + " " + "#" + this.responsecreateduser,
                date: new Date(),
                type: "Initiated"
              };
              this.ap.postAttnotifications(data1).subscribe(Response => {
                //console.log(Response);
                console.log("Initiated AP Notification");
              });
              var data = {
                status: "Initiated"
              };
              this.ap.putSolData(response.solId, data).subscribe(response => {
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
      error => {
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

  clickIgceCollapse() {
    let elements = document.querySelectorAll('.collapse')
    for (var i = 0; i < elements.length; i++) {
      elements[i].classList.remove('show');
   }


  }
}
