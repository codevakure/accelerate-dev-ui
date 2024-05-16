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
  FormArray,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { Cookie } from "ng2-cookies/ng2-cookies";
import * as jwt_decode from "jwt-decode";
import { ConsoleService } from "@ng-select/ng-select/ng-select/console.service";
import { SCROLL_DISPATCHER_PROVIDER } from "@angular/cdk/scrolling";

declare var $: any;

@Component({
  selector: "app-sow",
  templateUrl: "./sow.component.html",
  styleUrls: ["./sow.component.css"],
})
export class SowComponent implements OnInit {
  getattributes;
  picture;
  status;
  role;
  timeStamp;
  paramsSubscription;
  id;
  commentResponse;
  getsow;
  getapno;
  sowdata;
  apdata;
  sowid;
  addsow;
  interval;
  OutputDec: boolean = true;
  OutputHea: boolean = false;
  submit;
  inc = 0;
  nex: boolean = true;
  prev: boolean = false;
  values;
  simNumber;
  similarSow;
  stringReplace;
  similarContractss;
  value = "";
  showinput: boolean = false;
  scoscore;
  scosow;
  scosolid;
  sowtest;
  displaycontent;
  sowdata1;
  error: boolean = true;
  userexists;
  userid;
  FAR7105a4 =
    "Specify the required capabilities or performance characteristics of the supplies or the performance standards of the services being acquired and state how they are related to the need.";
  capability;
  idFeedback;
  aiFeedbackForm;
  sowdesc;
  category;
  productService;
  getnameofeditors;
  index;
  feedbackIndividual;
  historicalArray;
  show: boolean = true;
  config: any;
  collection = { count: 60, data: [] };
  public maxSize: number = 7;
  public directionLinks: boolean = true;
  public autoHide: boolean = false;
  public responsive: boolean = true;
  public labels: any = {
    previousLabel: "<--",
    nextLabel: "-->",
    screenReaderPaginationLabel: "Pagination",
    screenReaderPageLabel: "page",
    screenReaderCurrentLabel: `You're on page`,
  };
  getacq = [
    {
      id: "HHSABC19C0001",
      Description: "Operations & Maintenance support of HHS Financial Systems ",
      sow:
        "The Indian Health Service (IHS), an agency in the U.S. Department of Health and Human Services (HHS), provides a comprehensive health service delivery system for approximately 2.2 million American Indians and Alaska Natives (AI/AN).The Indian Health Service is seeking consultants to provide multi-discipline professional design services related to the planning, design, construction contract administration, and other A/E related services and studies at various Indian Health Service and Tribal health facilities located in the twelve (12) physical areas of the United States; Alaska, New Mexico, Bemidji, Minnesota, Billings, Montana, California, Great Plains, South Dakota, Nashville, Tennessee Navajo, Oklahoma, Phoenix, Arizona, Portland, Oregon and Tucson, Arizona. Each of these areas has a unique group of Tribes that they work with on a daily basis.",
    },
    {
      id: "HHSABC19C0002",
      Description: "BlockChain Infrastructure Development",
      sow:
        "The Millennium Challenge Corporation (MCC) is an independent U.S. foreign aid agency that is helping lead the fight against global poverty. Created by the U.S. Congress in January 2004 with bipartisan support, MCC is changing the conversation on how best to deliver foreign assistance by focusing on good policies, country ownership and results. Background The Economic Analysis Division of the Department of Policy and Evaluation (DPE) supports a process called Constraints Analysis (CA) at the early phases of engaging with partner countries",
    },
  ];
  myForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private ap: AcquisitionService,
    private auth: AuthenticationService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.getapno = this.route.snapshot.parent.params.apid;
    this.ap.getUserprofile().subscribe((response) => {
      // console.log(response);
    });
    this.getSow();
    //this.similarContracts();
    var tokenInformation = Cookie.get("hhs-a-token");
    var decodedValue = this.getDecodedAccessToken(tokenInformation);
    this.userid = decodedValue.pkId;

    this.aiFeedbackForm = new FormGroup({
      ap_no: new FormControl(""),
      keyword: new FormControl(""),
      is_commercial: new FormControl(""),
      estimatedBudget: new FormControl(""),
      contractType: new FormControl(""),
      productService: new FormControl(""),
      user: new FormControl(""),
      eval: this.fb.array([]),
      sow: this.fb.array([]),
    });

    setTimeout(() => {
      this.similarContracts();
    }, 20);
  }
  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }

  hidehistorical(set) {
    console.log(set);
    this.show = set;
    console.log(this.show);
  }

  onSow(event) {
    this.sowdesc = event.html;
    this.ap
      .patchSow(this.sowid, this.sowdesc, this.capability)
      .subscribe((response) => {});
  }

  onSowClick() {
    this.getnameofeditors = "";
    this.getnameofeditors = "SOW";
    console.log(this.getnameofeditors);
  }

  onCapabilityClick() {
    this.getnameofeditors = "";
    this.getnameofeditors = "CAPABILITY";
    console.log(this.getnameofeditors);
  }

  onCapability(event) {
    this.capability = event.html;
    this.ap
      .patchSow(this.sowid, this.sowdesc, this.capability)
      .subscribe((response) => {});
  }

  getSow() {
    this.ap.getApdappids(this.getapno).subscribe((response1) => {
      this.ap.getApdata(response1.apId).subscribe((response2) => {
        this.simNumber = response2.similarNumber;
        this.status = response2.status;
        this.category = response2.categoryManagement;
        this.productService = response2.productService;
        this.userexists = response2.pointsofContact.includes(this.userid);
        if (
          (this.status == "Shared" && this.userexists == false) ||
          this.status == "Accepted"
        ) {
          document.getElementById("similarContracts").classList.add("disabled");
        } else {
          document
            .getElementById("similarContracts")
            .classList.remove("disabled");
        }
        this.sowid = response1.sowid;
        this.ap.getSow(this.sowid).subscribe((response) => {
          console.log(response);
          if (this.category == "Medical" && this.productService == "sup") {
            this.sowdata = response.description;
            this.sowdata1 = "N/A";
          } else if (
            (this.productService != "sup" || this.category != "Medical") &&
            response.description1 == "<div>N/A</div>"
          ) {
            this.sowdata = response.description;
            this.sowdata1 = "";
          } else {
            this.sowdata = response.description;
            this.sowdata1 = response.description1;
          }
        });
      });
    });
  }

  similarContracts() {
    console.log(this.aiFeedbackForm.value);
    //console.log(this.simNumber);
    // this.ap.getSowsimilarai(this.simNumber).subscribe(response => {
    //   if (response) {
    //    console.log("Similar Contracts",response);
    //     this.similarContractss = response.sow;
    //     console.log(response)
    //     console.log(this.similarContracts);
    //   }
    // });

    this.ap.getFeedbackdata(this.getapno).subscribe((response) => {
      if (response) {
        console.log("Similar Contracts", response[0]);
        this.aiFeedbackForm.get("ap_no").setValue(response[0].ap_no);
        this.aiFeedbackForm.get("keyword").setValue(response[0].keyword);
        this.aiFeedbackForm
          .get("is_commercial")
          .setValue(response[0].is_commercial);
        this.aiFeedbackForm
          .get("estimatedBudget")
          .setValue(response[0].estimatedBudget);
        this.aiFeedbackForm
          .get("contractType")
          .setValue(response[0].contractType);
        this.aiFeedbackForm
          .get("productService")
          .setValue(response[0].productService);
        this.aiFeedbackForm.get("user").setValue(response[0].user);

        const control1 = <FormArray>this.aiFeedbackForm.controls.eval;
        const control2 = <FormArray>this.aiFeedbackForm.controls.sow;

        console.log("Similar Contracts", response[0]);
        if (response[0].eval != undefined) {
          response[0].eval.forEach((evalData) => {
            control1.push(new FormControl(evalData));
          });
        }

        if (response[0].sow != undefined) {
          response[0].sow.forEach((sowData) => {
            // console.log("Eval For Each",sowData);
            control2.push(new FormControl(sowData));
          });
        }
        // this.aiFeedbackForm.get("eval").setValue(response[0].eval);
        // this.aiFeedbackForm.get("sow").setValue(response[0].sow);
        this.similarContractss = response[0].sow.slice(0, 15);
        this.idFeedback = response[0].id;
        console.log("Similar Contracts", response[0].sow.slice(0, 15));

        this.config = {
          itemsPerPage: 3,
          currentPage: 1,
          totalItems: this.similarContracts.length,
        };
        //  for(var i=0; i<response[0].sow[0]; i++){
        //   console.log("Similar Contracts1",response[0].sow[0]);
        //  }
        //    console.log(this.similarContracts);
      }
    });
  }

  grabTitle() {
    console.log("Clicked");
    console.log("Similar Contracts", this.similarContractss);
  }

  pageChanged(event) {
    console.log(event);
    this.config.currentPage = event;
  }

  closeModal() {
    let element: HTMLElement = document.getElementsByClassName(
      "close"
    )[0] as HTMLElement;
    return element.click();
  }

  closeModals() {
    $("#navdrawerRight").navdrawer("show");
    $(".modal-content").scrollTop(0);
    $(".bd-example-modal-lg").on("show.bs.modal", function (e) {
      $(".modal-content").scrollTop(0);
    });
    let element: HTMLElement = document.getElementsByClassName(
      "close"
    )[0] as HTMLElement;
    return element.click();
  }

  onKey(event: any) {
    this.value = event.target.value;
    this.simNumber = this.value;
    this.similarContracts();
  }

  clickSimilar(sco, i) {
    console.log(sco, i);
    this.feedbackIndividual = this.aiFeedbackForm.get("sow").controls[
      i
    ].value.feedback_status;
    this.historicalArray = this.aiFeedbackForm.get("sow").controls[i].value;
    this.index = i;
    //this.scoscore = sco.score;
    var acqNum = sco.acqNumber;
    //this.scosolid = this.aiFeedbackForm.get('sow').controls[this.index].value.publicDescription;
    this.getSowDesc(acqNum);
    // this.ap.getSowsimilaraidesc(acqNum).subscribe(acqdesc =>{
    //   this.scosolid = acqdesc.acqNumber;
    //   this.scosow = acqdesc.sow_text
    //   console.log("Description From Sow", acqdesc);
    // })
    // this.scosow = this.aiFeedbackForm.get('sow').controls[i].value.sow_text;
    //  console.log(this.scosow);
    $(".bd-example-modal-lg").modal({
      backdrop: "static",
      keyboard: false,
    });
    $("#bd-example-modal-lg").on("shown.bs.modal", function (e) {
      $(".card-body").scrollTop(0);
    });
    $("#navdrawerRight").navdrawer("hide");
  }

  getSowDesc(acqNumbersow) {
    this.ap.getSowsimilaraidesc(acqNumbersow).subscribe((acqdesc) => {
      this.scosolid = acqdesc.publicDescription;
      this.scosow = acqdesc.sow_text
        .replace(/\f/g, "")
        .replace(/\t/g, "")
        .replace(/"/g, "")
        .replace(/\n/g, "<br />")
        .replace(/\n\n/g, "<br />")
        .replace(/\n\n\n/g, "<br />")
        .replace(/\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g,"<br /><br />")

      //    console.log("Description From Sow",JSON.stringify(acqdesc.sow_text).replace(/\n/g, "<br />"));
    });
  }

  addFeedbacklike(sco, i) {
    setTimeout(() => {
      this.feedbackIndividual = this.aiFeedbackForm.get("sow").controls[
        i
      ].value.feedback_status;
    }, 20);

    console.log("Table Records", sco, i);
    this.aiFeedbackForm.get("sow").controls[i].patchValue({
      acqNumber: sco.acqNumber,
      publicDescription: sco.publicDescription,
      feedback_status: "Like",
    });

    console.log(this.aiFeedbackForm.value);

    // var feedback = {
    //   feedbackStatus: "Like"
    // }
    // var data = {
    //   sow:[feedback]
    // }
    this.ap
      .patchFeedback(this.idFeedback, this.aiFeedbackForm.value)
      .subscribe((Response) => {
        console.log(Response);
      });
  }

  addFeedbackdislike(sco, i) {
    console.log("Table Records", sco, i);
    setTimeout(() => {
      this.feedbackIndividual = this.aiFeedbackForm.get("sow").controls[
        i
      ].value.feedback_status;
    }, 20);

    this.aiFeedbackForm.get("sow").controls[i].patchValue({
      acqNumber: sco.acqNumber,
      publicDescription: sco.publicDescription,
      feedback_status: "dislike",
    });
    console.log(this.aiFeedbackForm.value);
    //   console.log(this.aiFeedbackForm
    //     .get("sow")
    //     .controls[i].value.feedback_status)
    //  console.log(this.aiFeedbackForm.value);
    // var feedback = {
    //   feedbackStatus: "Like"
    // }
    // var data = {
    //   sow:[feedback]
    // }
    this.ap
      .patchFeedback(this.idFeedback, this.aiFeedbackForm.value)
      .subscribe((Response) => {
        console.log(Response);
      });
  }

  textEditor() {
    // console.log(this.getnameofeditors);
    //   console.log(this.aiFeedbackForm.value);
    // this.closeModal();
    if (this.getnameofeditors == "SOW") {
      this.sowdata = "";
      setTimeout(() => {
        //  this.sowdata = this.scosow
        this.sowdata = JSON.stringify(this.scosow)
        .replace(/\f/g, "")
        .replace(/\t/g, "")
        .replace(/"/g, "")
        .replace(/\n/g, "<br />")
        .replace(/\n\n/g, "<br />")
        .replace(/\n\n\n/g, "<br />")
        .replace(/\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g,"<br /><br />")
        this.closeModal();
      }, 50);
    } else if (this.getnameofeditors == "CAPABILITY") {
      this.sowdata1 = "";
      setTimeout(() => {
        //   this.sowdata1 = this.scosow
        this.sowdata1 = JSON.stringify(this.scosow)
        .replace(/\f/g, "")
        .replace(/\t/g, "")
        .replace(/"/g, "")
        .replace(/\n/g, "<br />")
        .replace(/\n\n/g, "<br />")
        .replace(/\n\n\n/g, "<br />")
        .replace(/\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g, "<br />")
        .replace(/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/g,"<br /><br />")
        this.closeModal();
      }, 50);
    }
  }

  nextHR() {
    console.log(this.index);
    this.index = this.index + 1;
    this.feedbackIndividual = this.aiFeedbackForm.get("sow").controls[
      this.index
    ].value.feedback_status;
    //  this.scosolid = this.aiFeedbackForm.get('sow').controls[this.index].value.publicDescription;
    //this.historicalArray = this.aiFeedbackForm.get('sow').controls[this.index].value;
    //   this.scosolid = this.aiFeedbackForm.get('sow').controls[this.index].value.acqNumber;
    this.getSowDesc(
      this.aiFeedbackForm.get("sow").controls[this.index].value.acqNumber
    );
    //this.scosow = this.aiFeedbackForm.get('sow').controls[this.index].value.sow_text;
    console.log(this.scosow, this.index);
    // $("#cardScroll").animate({ scrollTop: 0 }, "fast");
    document.getElementById("cardScroll").scrollTop = 0;
  }

  prevHR() {
    this.index = this.index - 1;
    this.feedbackIndividual = this.aiFeedbackForm.get("sow").controls[
      this.index
    ].value.feedback_status;
    //  this.scosolid = this.aiFeedbackForm.get('sow').controls[this.index].value.publicDescription;
    this.getSowDesc(
      this.aiFeedbackForm.get("sow").controls[this.index].value.acqNumber
    );
    //  $("#cardScroll").animate({ scrollTop: 0 }, "fast");
    document.getElementById("cardScroll").scrollTop = 0;
  }
}
