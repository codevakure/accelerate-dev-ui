import { element } from "protractor";
import { Response } from "@angular/http";
import { acquisition } from "./../../../../../Models/acquisition.model";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import { FormsService } from "../../../../../Services/forms.service";
import { DatePipe, formatDate } from "@angular/common";
import { AcquisitionService } from "../../../../../Services/acquisition.service";
import { AuthenticationService } from "../../../../../Services/authentication.service";
import { ContractService } from "../../../../../Services/contract.service";
import { Cookie } from "ng2-cookies/ng2-cookies";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import "rxjs/add/operator/switchMap";
import { map } from "rxjs/operators";
import { DataRowOutlet } from "@angular/cdk/table";

declare var $: any;

@Component({
  selector: "app-proposalevalhome",
  templateUrl: "./proposalevalhome.component.html",
  styleUrls: ["./proposalevalhome.component.css"],
})
export class ProposalevalhomeComponent implements OnInit {
  assignedco;
  userid;
  solno;
  solid;
  formid;
  proposalEvaluation;
  dataSource;
  searchKey: string;
  currentDate;
  lengthProposalEval;
  displayedColumns: string[] = [
    "Vendor",
    "SubmissionDate",
    "Status",
    // "MyScore",
    "Action",
  ];
  undefined: boolean = true;
  dueTime;
  singleVendor;
  sectionname = "proposal-eval";
  data;
  userfirstname;
  evaluators = ["Ashley", "Mehul", "Imneet"];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  id;
  evaluatorid;
  responseSplice;
  unitedproposalResults;
  evaluationFactors;
  hideAddEvaluator: boolean = false;

  vendorResponse = [
    {
      vendorName: "SunTrust",
      submissionTimeStamp: "01/12/2019 3:00 PM EST",
      status: "",
      score: "",
      vendorFiles: [
        {
          volumeName: "Volume1: Past Performance",
          pdfSrc: "assets/Resources/security-privacy-language_1.pdf",
          strengths: "",
          weaknesses: "",
          deficiencies: "",
          remarks: "",
          score: "",
          status: "",
        },
        {
          volumeName: "Volume2: Pricing",
          pdfSrc: "assets/Resources/security-privacy-language_1.pdf",
          strengths: "",
          weaknesses: "",
          deficiencies: "",
          remarks: "",
          score: "",
          status: "",
        },
        {
          volumeName: "Volume3: Technical",
          pdfSrc: "assets/Resources/security-privacy-language_1.pdf",
          strengths: "",
          weaknesses: "",
          deficiencies: "",
          remarks: "",
          score: "",
          status: "",
        },
        {
          volumeName: "Technical Architecture Diagram",
          pdfSrc: "assets/Resources/security-privacy-language_1.pdf",
          strengths: "",
          weaknesses: "",
          deficiencies: "",
          remarks: "",
          score: "",
          status: "",
        },
        {
          volumeName: "Key Personnel Template",
          pdfSrc: "assets/Resources/security-privacy-language_1.pdf",
          strengths: "",
          weaknesses: "",
          deficiencies: "",
          remarks: "",
          score: "",
          status: "",
        },
      ],
      supportedFiles: [
        {
          fileName: "Solicitation",
          pdfSrc: "assets/Resources/security-privacy-language_1.pdf",
        },
        {
          fileName: "Evaluation Criteria",
          pdfSrc: "assets/Resources/security-privacy-language_1.pdf",
        },
        {
          fileName: "Scoring Guidelines",
          pdfSrc: "assets/Resources/security-privacy-language_1.pdf",
        },
        {
          fileName: "Proposal Instructions",
          pdfSrc: "assets/Resources/security-privacy-language_1.pdf",
        },
      ],
    },
    {
      vendorName: "PNC",
      submissionTimeStamp: "01/12/2019 3:00 PM EST",
      status: "Completed",
      score: "",
      vendorFiles: [
        {
          volumeName: "Volume1: Past Performance",
          pdfSrc: "assets/Resources/security-privacy-language_1.pdf",
          strengths: "",
          weaknesses: "",
          deficiencies: "",
          remarks: "",
          score: "",
          status: "",
        },
        {
          volumeName: "Volume2: Pricing",
          pdfSrc: "assets/Resources/security-privacy-language_1.pdf",
          strengths: "",
          weaknesses: "",
          deficiencies: "",
          remarks: "",
          score: "",
          status: "",
        },
        {
          volumeName: "Volume3: Technical",
          pdfSrc: "assets/Resources/security-privacy-language_1.pdf",
          strengths: "",
          weaknesses: "",
          deficiencies: "",
          remarks: "",
          score: "",
          status: "",
        },
        {
          volumeName: "Technical Architecture Diagram",
          pdfSrc: "assets/Resources/security-privacy-language_1.pdf",
          strengths: "",
          weaknesses: "",
          deficiencies: "",
          remarks: "",
          score: "",
          status: "",
        },
        {
          volumeName: "Key Personnel Template",
          pdfSrc: "assets/Resources/security-privacy-language_1.pdf",
          strengths: "",
          weaknesses: "",
          deficiencies: "",
          remarks: "",
          score: "",
          status: "",
        },
      ],
      supportedFiles: [
        {
          fileName: "Solicitation",
          pdfSrc: "assets/Resources/security-privacy-language_1.pdf",
        },
        {
          fileName: "Evaluation Criteria",
          pdfSrc: "assets/Resources/security-privacy-language_1.pdf",
        },
        {
          fileName: "Scoring Guidelines",
          pdfSrc: "assets/Resources/security-privacy-language_1.pdf",
        },
        {
          fileName: "Proposal Instructions",
          pdfSrc: "assets/Resources/security-privacy-language_1.pdf",
        },
      ],
    },
  ];

  displayEvalTab: boolean;
  dueDate;
  emailUser;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formsService: FormsService,
    private acqService: AcquisitionService,
    private toastr: ToastrService,
    private auth: AuthenticationService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private datepipe: DatePipe,
    private contract: ContractService
  ) {}

  ngOnInit() {
    this.solno = this.route.snapshot.parent.parent.params.sid;
    //console.log("Solicitation Number",this.solno);
    this.displayEvalTab = false;
    this.acqService.getsoldappids(this.solno).subscribe((vendorResponse) => {
      console.log("response from sol-dapp", vendorResponse);
      this.solid = vendorResponse.solId;
      this.formid = vendorResponse.formId;
      this.id = vendorResponse.evaluatorId;
      this.formsService
        .getFormData(vendorResponse.formId)
        .subscribe((vendorResponse) => {
          //console.log(vendorResponse);
          this.dueDate = vendorResponse;

          this.assignedco = vendorResponse.pointsofContact[1];
        });
      setTimeout(() => {
        this.acqService.getUserprofile().subscribe((response) => {
          //console.log("Userprofile information",response);
          //console.log( this.assignedco   );
          this.userid = response.pkId;
          var fullName = response.email.split("@")[0].split(".");
          var firstName =
            fullName[0].charAt(0).toUpperCase() + fullName[0].slice(1);
          var lastName =
            fullName[fullName.length - 1].charAt(0).toUpperCase() +
            fullName[fullName.length - 1].slice(1);
          this.emailUser = firstName;
          console.log(this.emailUser);
          this.userfirstname = response.firstName;
          if (response.firstName == "Not") {
            this.userfirstname = this.emailUser;
          } else if (response.firstName != "Not") {
            //  this.rUsername= this.username;
            this.userfirstname = response.firstName + " " + response.lastName;
          }
          let hideall = () => {
            let buttons = document.querySelectorAll(".actiondropdown");
            buttons.forEach((button) => {
              (<HTMLButtonElement>button).style.display = "none";
              (<HTMLButtonElement>button).disabled = true;
            });
          };
          this.userid == this.assignedco ? "" : hideall();
        });
      }, 500);

    //  this.generateContract('Aurotech')
    });

    this.proposalEvaluation = new FormGroup({
      addEvaluators: new FormArray([this.initEvaluators()]),
    });
    this.getVendorResponse();


  }

  notselected(element) {
    var data = {
      status: "Rejected",
    };
    console.log(element.ID);
    this.acqService.patchProposalEval(element.ID, data).subscribe((response) => {
      console.log(response);
    });


    this.getVendorResponse();

    
  }

  hideEvaluate() {
    this.hideAddEvaluator = true;
  }

  showEvaluate() {
    this.hideAddEvaluator = false;
  }

  updatePropsoalEvaluation(id) {
    let data = {
      status: "Rejected",
    };
    this.acqService.patchAuroProposaleval(id, data).subscribe((response) => {});
  }

  onChange(proposalEvaluation) {
    console.log(proposalEvaluation.value);
    this.acqService
      .patchEvaluator(this.id, proposalEvaluation.value)
      .subscribe((response) => {
        //console.log(response);
        console.log("Updated");
      });
  }

  initEvaluators() {
    return new FormGroup({
      evaluatorName: new FormControl(""),
      forms: new FormArray([this.initCheckbox()]),
      status: new FormControl("", Validators.required),
    });
  }

  initCheckbox() {
    return new FormGroup({
      COR: new FormControl(false),
      NDA: new FormControl(false),
    });
  }
  addEvaluator() {
    const control = <FormArray>this.proposalEvaluation.get("addEvaluators");
    //this.index = control.controls.length;

    control.push(this.initEvaluators());
  }

  getEvaluator(form) {
    return form.controls.addEvaluators.controls;
  }

  getForms(form) {
    return form.controls.forms.controls;
  }

  removeEvaluator(i) {
    const control = <FormArray>this.proposalEvaluation.get("addEvaluators");
    control.removeAt(i);
    this.onChange(this.proposalEvaluation);
  }

  setrows(x) {
    let array = new FormArray([]);
    x.forms.forEach((y) => {
      array.push(
        this.fb.group({
          COR: y.COR,
          NDA: y.NDA,
        })
      );
    });
    return array;
  }

  ngetRangeLabel(page, pageSize, length) {
    if (length == 0 || pageSize == 0) {
      return length;
    }
    length = Math.max(length, 0);
    /** @type {?} */
    var startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    /** @type {?} */
    var endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;
    return length;
  }

  getVendorResponse() {
    //console.log(this.solno);
    this.acqService.getsoldappids(this.solno).subscribe((response) => {
      this.acqService
        .getEvaluations(response.evaluationCriteriaId)
        .subscribe((response) => {
          this.evaluationFactors = response;

          console.log(
            "Response for evaluation factors",
            response
          );
          console.log("Current Version");
        });
    });
    this.acqService.getProposalEval(this.solno).subscribe((response) => {
      var proposalData;
      var solresp;
      var d3;
      this.unitedproposalResults= response;
      var proposalData = response;
      console.log(proposalData.length);
      this.lengthProposalEval = proposalData.length;
      this.dataSource = new MatTableDataSource(proposalData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.paginator._intl.itemsPerPageLabel = "VIEW";
      let page = 0;
    

    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  review(element, index) {
    console.log(element);
                this.router.navigate([
              "/home/sol/" +
                this.solno +
                "/proposalevaluation/" +
                element.ID
            ]);
    // var data = {
    //   vendorId: element.vendorPkId,
    //   blockchainID: element.dltId,
    //   sol_no: this.solno,
    // };
    // console.log(data);
    // this.acqService
    //   .getAuroProposaleval(element.vendorPkId)
    //   .subscribe((idresponse) => {
    //     console.log(idresponse);
    //     if (idresponse != "") {
    //       if (idresponse[0].vendorId == element.vendorPkId) {
    //         console.log("VolumeID Matched");
    //         this.router.navigate([
    //           "/home/sol/" +
    //             this.solno +
    //             "/proposalevaluation/" +
    //             element.dltId,
    //         ]);
    //       } else if (idresponse[0].vendorId != element.vendorPkId) {
    //         console.log("VolumeID not matched Matched");
    //         this.acqService.postAuroProposaleval(data).subscribe((response) => {
    //           console.log(response);
    //           this.router.navigate([
    //             "/home/sol/" +
    //               this.solno +
    //               "/proposalevaluation/" +
    //               element.dltId,
    //           ]);
    //         });
    //       }
    //     } else if (idresponse == "") {
    //       this.acqService.postAuroProposaleval(data).subscribe((response) => {
    //         console.log(response);
    //         this.router.navigate([
    //           "/home/sol/" +
    //             this.solno +
    //             "/proposalevaluation/" +
    //             element.dltId,
    //         ]);
    //       });
    //     }
    //   });
  }

  // getStatus() {
  //   var status;
  //   var elementId="bbec1b88-d166-4f9a-b5a0-03f36af3fb85"
  //   this.acqService
  //   .getAuroProposaleval(elementId).subscribe(response =>{
  //     //console.log(response[0].status);
  //     status = response[0].status;

  //   })
  //   console.log(status);
  // }

  changeItem() {
    this.undefined = false;
  }

  release(i) {
    this.currentDate = "Released" + " " + new Date().toDateString();
    this.proposalEvaluation
      .get("addEvaluators")
      .controls[i].get("status")
      .setValue(this.currentDate);
    setTimeout(() => this.toastr.success("Files Successfully Released !!"));
  }

  generateContract(vendor) {
    //console.log(vendor)
    let rightnow = $.now();
    let date = new Date();
    
    var data = {
      awardedvendor: vendor,
      awarddate: date,
      status: "Generated"
    }

    this.acqService.putSolData(this.solid, data).subscribe((answer) => {
       //create the contract
       this.spinner.show();
       this.formsService.putFormData(this.formid,data).subscribe(confirm=>{

         console.log("Update Form Confirmation",confirm)
         this.formsService.getFormData(this.formid).subscribe(formdata=>{
           console.log('All FORM DATA',formdata)
          //  formdata['otherDate']=formdata.offerDueDate
          //  delete formdata.offerDueDate

             this.contract.generateContract(this.solno).subscribe((response) => {
         
              console.log(response);


                this.acqService
                .putContractData(response.CONTRACT.id, formdata)
                .subscribe((response1) => {
                  console.log("Contract Response", response);
                  let contract_no = response.CONTRACT.contract_no;
                  setTimeout(() => {
                    this.router.navigate(["/home/contracts/", contract_no]);
                    this.spinner.hide();
                  }, 800);
  

                });
             
             


            });

         },error=>{
           console.warn("Unable to getform data")
         })
       })
      

    });

   
  }


  
}
