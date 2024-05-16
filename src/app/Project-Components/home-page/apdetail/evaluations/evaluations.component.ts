import { Component, OnInit } from "@angular/core";
import { Directive, HostListener, HostBinding, Input } from "@angular/core";
import { AcquisitionService } from "../../../../Services/acquisition.service";
import { AuthenticationService } from "../../../../Services/authentication.service";
import { acquisition } from "../../../../Models/acquisition.model";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { TouchSequence } from "selenium-webdriver";
import { Content } from "@angular/compiler/src/render3/r3_ast";
import { Cookie } from 'ng2-cookies/ng2-cookies';
import * as jwt_decode from "jwt-decode";
declare var $: any;

@Component({
  selector: "app-evaluations",
  templateUrl: "./evaluations.component.html",
  styleUrls: ["./evaluations.component.css"]
})
export class EvaluationsComponent implements OnInit {
  evaluations;
  evaluationsId;
  ssPlan;
  manCriteria;
  scMechanism;
  selected;
  text;
  ftext;
  createVolume: boolean = true;
  textVolume: boolean[] = [];
  pointScale: boolean[] = [];
  textVolumeIndex;
  textVolumes: boolean = false;
  values;
  getapno;
  simNumber;
  historicalReference: boolean = true;
  similarContractss;
  value;
  evaldata;
  scoscore;
  scosolid;
  scosow;
  getnameofeditors;
  status;
  userexists;
  userid;
  volumeIndex;
  factorIndex;
  volumeIndexadd;
  idFeedback;
  aiFeedbackForm;
  index;
  feedbackIndividual;
  historicalArray;
  show:boolean=true
  config;

  getacq = [
    {
      description: "Create Evaluation Factor",
      text:
        "The Indian Health Service (IHS), an agency in the U.S. Department of Health and Human Services (HHS), provides a comprehensive health service delivery system for approximately 2.2 million American Indians and Alaska Natives (AI/AN).The Indian Health Service is seeking consultants to provide multi-discipline professional design services related to the planning, design, construction contract administration, and other A/E related services and studies at various Indian Health Service and Tribal health facilities located in the twelve (12) physical areas of the United States; Alaska, New Mexico, Bemidji, Minnesota, Billings, Montana, California, Great Plains, South Dakota, Nashville, Tennessee Navajo, Oklahoma, Phoenix, Arizona, Portland, Oregon and Tucson, Arizona. Each of these areas has a unique group of Tribes that they work with on a daily basis."
    },
    {
      description: "Technical Capabilities",
      text:
        "The Millennium Challenge Corporation (MCC) is an independent U.S. foreign aid agency that is helping lead the fight against global poverty. Created by the U.S. Congress in January 2004 with bipartisan support, MCC is changing the conversation on how best to deliver foreign assistance by focusing on good policies, country ownership and results. Background The Economic Analysis Division of the Department of Policy and Evaluation (DPE) supports a process called Constraints Analysis (CA) at the early phases of engaging with partner countries"
    },
    {
      description: "Key Personnel",
      text:
        "The Indian Health Service (IHS), an agency in the U.S. Department of Health and Human Services (HHS), provides a comprehensive health service delivery system for approximately 2.2 million American Indians and Alaska Natives (AI/AN).The Indian Health Service is seeking consultants to provide multi-discipline professional design services related to the planning, design, construction contract administration, and other A/E related services and studies at various Indian Health Service and Tribal health facilities located in the twelve (12) physical areas of the United States; Alaska, New Mexico, Bemidji, Minnesota, Billings, Montana, California, Great Plains, South Dakota, Nashville, Tennessee Navajo, Oklahoma, Phoenix, Arizona, Portland, Oregon and Tucson, Arizona. Each of these areas has a unique group of Tribes that they work with on a daily basis."
    },
    {
      description: "Organizational Experience",
      text:
        "The Indian Health Service (IHS), an agency in the U.S. Department of Health and Human Services (HHS), provides a comprehensive health service delivery system for approximately 2.2 million American Indians and Alaska Natives (AI/AN).The Indian Health Service is seeking consultants to provide multi-discipline professional design services related to the planning, design, construction contract administration, and other A/E related services and studies at various Indian Health Service and Tribal health facilities located in the twelve (12) physical areas of the United States; Alaska, New Mexico, Bemidji, Minnesota, Billings, Montana, California, Great Plains, South Dakota, Nashville, Tennessee Navajo, Oklahoma, Phoenix, Arizona, Portland, Oregon and Tucson, Arizona. Each of these areas has a unique group of Tribes that they work with on a daily basis."
    },
    {
      description: "Pricing",
      text:
        "The Indian Health Service (IHS), an agency in the U.S. Department of Health and Human Services (HHS), provides a comprehensive health service delivery system for approximately 2.2 million American Indians and Alaska Natives (AI/AN).The Indian Health Service is seeking consultants to provide multi-discipline professional design services related to the planning, design, construction contract administration, and other A/E related services and studies at various Indian Health Service and Tribal health facilities located in the twelve (12) physical areas of the United States; Alaska, New Mexico, Bemidji, Minnesota, Billings, Montana, California, Great Plains, South Dakota, Nashville, Tennessee Navajo, Oklahoma, Phoenix, Arizona, Portland, Oregon and Tucson, Arizona. Each of these areas has a unique group of Tribes that they work with on a daily basis."
    },
    {
      description: "Past Performance",
      text:
        "The Indian Health Service (IHS), an agency in the U.S. Department of Health and Human Services (HHS), provides a comprehensive health service delivery system for approximately 2.2 million American Indians and Alaska Natives (AI/AN).The Indian Health Service is seeking consultants to provide multi-discipline professional design services related to the planning, design, construction contract administration, and other A/E related services and studies at various Indian Health Service and Tribal health facilities located in the twelve (12) physical areas of the United States; Alaska, New Mexico, Bemidji, Minnesota, Billings, Montana, California, Great Plains, South Dakota, Nashville, Tennessee Navajo, Oklahoma, Phoenix, Arizona, Portland, Oregon and Tucson, Arizona. Each of these areas has a unique group of Tribes that they work with on a daily basis."
    },
    {
      description: "Custom Input",
      text:
        "The Indian Health Service (IHS), an agency in the U.S. Department of Health and Human Services (HHS), provides a comprehensive health service delivery system for approximately 2.2 million American Indians and Alaska Natives (AI/AN).The Indian Health Service is seeking consultants to provide multi-discipline professional design services related to the planning, design, construction contract administration, and other A/E related services and studies at various Indian Health Service and Tribal health facilities located in the twelve (12) physical areas of the United States; Alaska, New Mexico, Bemidji, Minnesota, Billings, Montana, California, Great Plains, South Dakota, Nashville, Tennessee Navajo, Oklahoma, Phoenix, Arizona, Portland, Oregon and Tucson, Arizona. Each of these areas has a unique group of Tribes that they work with on a daily basis."
    }
  ];

  constructor(
    private _fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthenticationService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private ap: AcquisitionService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.getapno = this.route.snapshot.parent.params.apid;
    this.getAp();
    this.ap.getUserprofile().subscribe(response => {
      //console.log(response);
     // this.userid = response.pkId
    })
    this.evaluations = new FormGroup({
      sourceSelectionPlan: new FormControl(),
      mandatoryCriterias: new FormControl(),
      scoringMechanism: new FormControl(),
      evaluationCriteria: new FormArray([
        //this.initVolumes(),
      ])
    });
    setTimeout(() => {
      this.similarContracts();
    }, 20);

    this.aiFeedbackForm = new FormGroup({
      ap_no: new FormControl(""),
      keyword: new FormControl(""),
      is_commercial: new FormControl(""),
      estimatedBudget: new FormControl(""),
      contractType: new FormControl(""),
      productService: new FormControl(""),
      user:new FormControl(""),
      eval: this.fb.array([]),
      sow: this.fb.array([]),
    });

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

  initVolumes() {
    return new FormGroup({
      volumeName: new FormControl("", [Validators.required]),
      factorRows: new FormArray([
        //this.initFactors()
      ])
    });
  }

  initFactors() {
    return new FormGroup({
      factorName: new FormControl(this.selected),
      factorText: new FormControl(this.text),
      factorScore: new FormControl("", Validators.required),
      factorScoreUpdate:new FormControl("", Validators.required),
      factorPoints: new FormControl("", Validators.required)
    });
  }

  addVolume(e) {
    //this.volumeIndexadd = i;
    const control = <FormArray>this.evaluations.get("evaluationCriteria");
    console.log(e);
    if( e.offsetX != 0){
      this.textVolume.push(control.value.length);
      this.pointScale.push(control.value.length);
      console.log('control.value',control.value.length)
      control.push(this.initVolumes());
   
    }
 



    this.createVolume = false;
    this.onChange(this.evaluations);
    setTimeout(() => {
      document.getElementById("getIndexeval").click();
    }, 100);
    $('.collapseExample').removeClass('show');
    setTimeout(() => {
      let len =  this.evaluations.get("evaluationCriteria").length;
    
      let m = 'undefined'
      let ic = len -1;
      let id = '#prefix' + m + ic;
      let element = document.querySelector(id)
      element.classList.add('show');
      //Script to srcoll  to the position of the element added Factor
     let etop = (<HTMLDivElement>element).getBoundingClientRect().top;
     console.log(etop);
     window.scroll(0,etop-20);

     }, 200);
    
  }

  volumeClose(){
    $('.collapseExample').removeClass('show');
  }

  addFactors(i, event) {
    console.log(i);

    const newVal = event.target.value;
    //console.log(newVal);
    $('.collapseSix').removeClass('show');
    //$('.expansion-panel-toggler').removeClass('collapsed');
   // $('.expansion-panel-toggler').addClass('collapsed');
    //$('.expansion-panel-toggler').addClass('collapsed');
    const elements = document.getElementsByTagName("select");
    for (var j = 0; j < elements.length; j++) {
      elements[j].selectedIndex = 0;
    }
    const control = <FormArray>(
      this.evaluations.get("evaluationCriteria").controls[i].get("factorRows")
    );
    if (newVal == "Technical Capabilities") {
      this.selected = "Technical Capabilities";
      this.text =
        "<div>1. Understanding of the work, including creativity and thoroughness shown in understanding the objectives of the SOW and specific tasks, and planned execution of the project.</div><div>2. Evidence of specific methods and techniques for completing each discrete task, to include such items as quality assurance, and customer-service.</div><div>3. Ability to address anticipated potential problem areas, and creativity and feasibility of solutions to problems and future integration of new processes and technology enhancements.</div><div>4. Quality and effectiveness of the allocation of personnel and resources.</div><div><br></div>";
    } else if (newVal == "Key Personnel") {
      this.selected = "Key Personnel";
      this.text =
        "<div>1. The currency, quality and depth of experience of individual personnel in working on similar projects. Similar projects must convey similarity in topic, dollar value, workload, duration, and complexity.</div><div>2. Quality and depth of education and experience on other projects which may not be similar enough to include in response to #1. (Immediately above) but may be relevant.</div><div>3. The currency, quality and depth of how the Project Director will supervise and coordinate the workforce.</div><div><br></div>";
    } else if (newVal == "Organizational Experience") {
      this.selected = "Organizational Experience";
      this.text =
        "<div>1. Evidence that the organization has current capabilities; and for assuring performance of this requirement. Evidence of supporting subcontractors, consultants and business partners will be considered.</div><div>2. Appropriate mix and balance of education and training of team members.</div><div><br></div>";
    } else if (newVal == "Pricing") {
      this.selected = "Pricing";
      this.text =
        "Evidence that the organization has current capabilities; and for assuring performance of this requirement.";
    } else if (newVal == "Past Performance") {
      this.selected = "Past Performance";
      this.text =
        "<div>1. The organizations history of successful completion of projects; history of producing high-quality reports and other deliverables; history of staying on schedule and within budget.</div><div>2. The quality of cooperation (with each other) of key individuals within your organization, and quality of cooperation and performance between your organization and its clients.</div><div>3. The organization's specific past performance on prior similar efforts specified within this SOW</div><div><br></div>";
    } else if (newVal == "Custom Input") {
      this.selected = "";
      this.text = "";
    }
    control.push(this.initFactors());

     // Script to make the quill editor show for only the current new selection

     setTimeout(() => {
      let len =  this.evaluations.get("evaluationCriteria").controls[i].get("factorRows").length;
      console.log("Length of the factors array",len);
      let n = 'undefined'
      let ic = len -1;
      let id = '#active' + ic + i;
      console.log(id);
      let element = document.querySelector(id)
      element.classList.add('show');

      //Script to srcoll  to the position of the element added Factor
     let etop = (<HTMLDivElement>element).getBoundingClientRect().top;
     console.log(etop);
     window.scroll(0,etop-20);

     }, 200);

  }





  getVolumes(form) {
    return form.controls.evaluationCriteria.controls;
  }
  getFactors(form) {
    //  console.log(form.controls.factorRows.controls);
    return form.controls.factorRows.controls;
    
  }
  removeFactors(control, index) {
    control.removeAt(index);
    this.onChange(this.evaluations);
  }

  removeVolumes(i) {
    const control = <FormArray>this.evaluations.get("evaluationCriteria");
    this.textVolume.pop();
    this.pointScale.pop();
    control.removeAt(i);
    this.onChange(this.evaluations);
    //console.log(this.textVolume);
  }

  setrows(x) {
    let arr = new FormArray([]);
    x.factorRows.forEach(y => {
      console.log(y);
      arr.push(
        this.fb.group({
          factorName: y.factorName,
          factorText: y.factorText,
          factorScore: y.factorScore,
          factorScoreUpdate: y.factorScoreUpdate,
          factorPoints: y.factorPoints
        })
      );
      // console.log(tot);
      //this.total = tot;
    });
    return arr;
  }

  pageChanged(event){
    console.log(event);
    this.config.currentPage = event;
  }

  getAp() {
    this.ap.getApdappids(this.getapno).subscribe(response => {
      this.evaluationsId = response.evaluationCriteriaId;
      this.ap.getApdata(response.apId).subscribe(response => {
        this.simNumber = response.similarNumber;
        this.status = response.status;
        this.userexists = response.pointsofContact.includes(this.userid);
        if(this.status == 'Shared' && this.userexists == false || this.status == 'Accepted' || this.status == 'Initiated' || this.status == 'Published') {
          this.evaluations
          .get("sourceSelectionPlan").disable();
          this.evaluations
          .get("mandatoryCriterias").disable();
          this.evaluations
          .get("scoringMechanism").disable();
          this.evaluations
          .get("evaluationCriteria").disable();
          
        }
       // console.log(this.status);
      });
      this.ap
        .getEvaluations(response.evaluationCriteriaId)
        .subscribe(response => {
          if (response) {
            this.evaluations
              .get("sourceSelectionPlan")
              .setValue(response.sourceSelectionPlan);
            this.evaluations
              .get("mandatoryCriterias")
              .setValue(response.mandatoryCriterias);
            this.evaluations
              .get("scoringMechanism")
              .setValue(response.scoringMechanism);
            let control = <FormArray>(
              this.evaluations.controls.evaluationCriteria
            );
            if (response.evaluationCriteria != undefined) {
              response.evaluationCriteria.forEach(x => {
                x.factorRows.forEach(y => {
                  //console.log(y);
                });
                control.push(
                  this.fb.group({
                    volumeName: x.volumeName,
                    factorRows: this.setrows(x)
                  })
                );
              });
            }
          } else {
            //console.log("error");
          }
        });
    });
  }

  onChange(evaluations) {
    console.log(evaluations.value)
    this.ap
      .patchEvaluations(this.evaluationsId, evaluations.value)
      .subscribe(response => {
        //console.log(response);
      });

  }


  sourceSelectionPlan(event) {
    // this.ssPlan = event.html;
  //  this.historicalReference = true;
    this.getnameofeditors = "";
    this.getnameofeditors = "sourceSelectionPlan";
  }
  mandatoryCriteria(event) {
  //  this.historicalReference = true;
    this.getnameofeditors = "";
    this.getnameofeditors = "mandatoryCriterias";
  }
  scoringMechanism(event) {
  //  this.historicalReference = false;
    this.getnameofeditors = "";
    this.getnameofeditors = "scoringMechanism";
  }

  getFactorsText(i,j){
    this.getnameofeditors = 'evaluationCriteria';
   this.volumeIndex = i;
   this.factorIndex = j;
  }
  evalCriteria() {
    this.getnameofeditors = "evaluationCriteria";
    console.log("Evaluation Criteria");
  //  this.historicalReference = false;
  }
  factorText(event) {
    this.ftext = event.html;
    //  this.onChange(this.evaluations);
  }

  onKeyy(event) {
   
    console.log("update");
    this.onChange(this.evaluations);
  }

  textV(event: any) {
    console.log(event);
    var code = (event.keyCode ? event.keyCode : event.which);
    if(code != 13) { 
     event.preventDefault();
                // without type info
       this.values = event.target.value;
       const control = <FormArray>this.evaluations.get("evaluationCriteria");
       if (this.values == "") {
        this.textVolume[control.value.length - 1] = false;
        } else {
        this.textVolume[control.value.length - 1] = true;
        }


    }
 
   // console.log(this.textVolume);
  }

  getIndexs() {
    console.log("Index");
    $('.collapseSix').removeClass('show');
    // this.textVolumeIndex = i;
   // document.getElementById('activeundefined1').classList.remove('show');
  //  document.getElementById('hideCollapse').click();
    // $('#headingSix').collapse({
    //   toggle: true
    // })
  }



  similarContracts() {
  //  console.log(this.simNumber);
    // this.ap.getSowsimilarai(this.simNumber).subscribe(response => {
    //   if (response) {
    //    console.log("Similar Contracts",response);
    //     this.similarContractss = response.eval;
    //   }
    // });


    
    this.ap.getFeedbackdata(this.getapno).subscribe(response => {
      if (response) {
        console.log("Similar Contracts",response[0]);
        this.aiFeedbackForm.get("ap_no").setValue(response[0].ap_no);
        this.aiFeedbackForm.get("keyword").setValue(response[0].keyword);
        this.aiFeedbackForm.get("is_commercial").setValue(response[0].is_commercial);
        this.aiFeedbackForm.get("estimatedBudget").setValue(response[0].estimatedBudget);
        this.aiFeedbackForm.get("contractType").setValue(response[0].contractType);
        this.aiFeedbackForm.get("productService").setValue(response[0].productService);
        this.aiFeedbackForm.get("user").setValue(response[0].user);
        const control1 = <FormArray>this.aiFeedbackForm.controls.eval;
        const control2 = <FormArray>this.aiFeedbackForm.controls.sow;

        if (response[0].eval != undefined) {
          response[0].eval.forEach(evalData => {
           // console.log("Eval For Each",evalData);
            control1.push(new FormControl(evalData));
          });
        }

        if (response[0].sow != undefined) {
          response[0].sow.forEach(sowData => {
            control2.push(new FormControl(sowData));
          });
        }
        // this.aiFeedbackForm.get("eval").setValue(response[0].eval);
        // this.aiFeedbackForm.get("sow").setValue(response[0].sow);
          this.similarContractss = response[0].eval.slice(0,15);
         this.idFeedback = response[0].id;
         this.config = {
          itemsPerPage: 3,
          currentPage: 1,
          totalItems: this.similarContracts.length,
        };
       }
    })
  }

  add() {
    this.evaldata = "";
    setTimeout(() => {
      this.evaldata = JSON.stringify(this.scosow)
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
     if(this.getnameofeditors == 'evaluationCriteria'){
      console.log(this.volumeIndex, this.factorIndex);
     const control = <FormArray>(
      this.evaluations.get("evaluationCriteria").controls[this.volumeIndex].get("factorRows").controls[this.factorIndex].get("factorText")
    );
     control.setValue(this.evaldata);
     } else {
      this.evaluations.get(this.getnameofeditors).setValue(this.evaldata);
     }


      this.closeModal();
    }, 50);
    setTimeout(() => {
      this.onChange(this.evaluations);
    }, 100);
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
    $(".bd-example-modal-lg").on("show.bs.modal", function(e) {
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
    console.log(sco);
    this.index = i;
    var acqNum = sco.acqNumber;

    this.getSowDesc(acqNum);
   // this.scosow = sco.sow_text;
    $(".bd-example-modal-lg").modal({
      backdrop: "static",
      keyboard: false
    });
    $("#bd-example-modal-lg").on("shown.bs.modal", function(e) {
      $(".card-body").scrollTop(0);
    });
    $("#navdrawerRight").navdrawer("hide");
  }


  keyPress(evt: any) {

    var iKeyCode = evt.which ? evt.which : evt.keyCode;
    if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57)) {
      this.toastr.info("Only Numbers");
      return false;
    } else {
      return true;
    }
  }

  getSowDesc(acqNumbersow){
    this.ap.getSowsimilaraidesc(acqNumbersow).subscribe(acqdesc =>{
      this.scosolid = acqdesc.publicDescription;
      this.scosow = (acqdesc.eval_text)
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
    })
  }

  addFeedbacklike(sco,i){
    console.log("Table Records",sco,i);
    this.aiFeedbackForm
      .get("eval")
      .controls[i].patchValue({
        acqNumber: sco.acqNumber,
        publicDescription: sco.publicDescription,
        feedback_status: "Like"
      })
      console.log(this.aiFeedbackForm
        .get("eval")
        .controls[i].value.feedback_status)  
     console.log(this.aiFeedbackForm.value);

    // var feedback = {
    //   feedbackStatus: "Like"
    // }
    // var data = {
    //   sow:[feedback]
    // }
    this.ap.patchFeedback(this.idFeedback,this.aiFeedbackForm.value).subscribe((Response)=>{
      console.log(Response)
    })
  
  }

  addFeedbackdislike(sco,i) {
    console.log("Table Records",sco,i);
    this.aiFeedbackForm
      .get("eval")
      .controls[i].patchValue({
        acqNumber: sco.acqNumber,
        publicDescription: sco.publicDescription,
        feedback_status: "dislike"
      })
    console.log(this.aiFeedbackForm
      .get("eval")
      .controls[i].value.feedback_status)  
   console.log(this.aiFeedbackForm.value);
    // var feedback = {
    //   feedbackStatus: "Like"
    // }
    // var data = {
    //   sow:[feedback]
    // }
    this.ap.patchFeedback(this.idFeedback,this.aiFeedbackForm.value).subscribe((Response)=>{
      console.log(Response)
    })
  }
  

  nextHR(){

    this.index = this.index + 1
   this.feedbackIndividual = this.aiFeedbackForm.get('eval').controls[this.index].value.feedback_status;
   //this.scosolid = this.aiFeedbackForm.get('eval').controls[this.index].value.publicDescription;
   //this.historicalArray = this.aiFeedbackForm.get('sow').controls[this.index].value;
//   this.scosolid = this.aiFeedbackForm.get('sow').controls[this.index].value.acqNumber;
   this.getSowDesc(this.aiFeedbackForm.get('eval').controls[this.index].value.acqNumber);
   //this.scosow = this.aiFeedbackForm.get('sow').controls[this.index].value.sow_text;
   console.log(this.scosow, this.index);
  // $("#cardScroll").animate({ scrollTop: 0 }, "fast");
  document.getElementById("cardScroll").scrollTop = 0;
  }

  prevHR(){
    
   this.index = this.index - 1
   this.feedbackIndividual = this.aiFeedbackForm.get('eval').controls[this.index].value.feedback_status;
  // this.scosolid = this.aiFeedbackForm.get('eval').controls[this.index].value.publicDescription;
   this.getSowDesc(this.aiFeedbackForm.get('eval').controls[this.index].value.acqNumber);
 //  $("#cardScroll").animate({ scrollTop: 0 }, "fast");
   document.getElementById("cardScroll").scrollTop = 0;
  }
  
}
