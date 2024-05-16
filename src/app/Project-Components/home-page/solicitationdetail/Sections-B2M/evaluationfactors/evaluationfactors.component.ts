import { Component, OnInit } from '@angular/core';
import { Directive, HostListener, HostBinding, Input } from "@angular/core";
import { AcquisitionService } from "../../../../../Services/acquisition.service";
import { AuthenticationService } from "../../../../../Services/authentication.service";
import { acquisition } from "../../../../../Models/acquisition.model";
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
import { ConsoleService } from '@ng-select/ng-select/ng-select/console.service';
import { SectionsService } from "../../../../../Services/sections.service";
declare var $: any;

@Component({
  selector: 'app-evaluationfactors',
  templateUrl: './evaluationfactors.component.html',
  styleUrls: ['./evaluationfactors.component.css']
})
export class EvaluationfactorsComponent implements OnInit {

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
  @Input() solno: string;
  simNumber;
  similarContractss;
  value;
  evaldata;
  scoscore;
  scosolid;
  scosow;
  status;
  disable;
  response;
  getnameofeditors;
  clauseString;
  

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
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private ap: AcquisitionService,
    private toastr: ToastrService,
    private sections: SectionsService
  ) {}
  ngOnInit() {
    this.solno = this.route.snapshot.parent.params.sid;
    if(this.solno == undefined) {
      this.solno = this.route.snapshot.parent.parent.params.sid;
    }
   // console.log(this.route.snapshot.parent.parent.params.sid);
    this.getAp();
    this.evaluations = new FormGroup({
      sourceSelectionPlan: new FormControl(),
      mandatoryCriterias: new FormControl(),
      scoringMechanism: new FormControl(),
      evaluationCriteria: new FormArray([
        //this.initVolumes(),
      ])
    });

  
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
  console.log(e)
    const control = <FormArray>this.evaluations.get("evaluationCriteria");

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

    
  }

  addFactors(j, event) {
    const newVal = event.target.value;
    //console.log(newVal);
    const elements = document.getElementsByTagName("select");
    for (var i = 0; i < elements.length; i++) {
      elements[i].selectedIndex = 0;
    }
    const control = <FormArray>(
      this.evaluations.get("evaluationCriteria").controls[j].get("factorRows")
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

    setTimeout(() => {
      let len =  this.evaluations.get("evaluationCriteria").controls[j].get("factorRows").length;
    
      let n = 'undefined'
      let ic = len -1;
      let id = '#active' + n + ic;
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
   // console.log(this.textVolume);
  }

  setrows(x) {
    let arr = new FormArray([]);
    x.factorRows.forEach(y => {
     // console.log(y);
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

  getAp() {
    this.ap.getsoldappids(this.solno).subscribe(response => {
      this.evaluationsId = response.evaluationCriteriaId;
     // console.log(response)
     // console.log(this.evaluationsId);
     this.ap.getSolicitation(response.solId).subscribe(res =>{
      //console.log(res);
      this.response = res;
      //console.log(this.response);
      this.status = res.status;
      //console.log("Status" +this.status);

      this.ap.getUserprofile().subscribe(response => {
        //Code to verify the user is the Main CO
        let validate =(text)=>{
          if(text =="false"){
            this.disable = true;
            console.log('val',this.disable);
            this.evaluations
            .get("sourceSelectionPlan").disable();
            this.evaluations
            .get("mandatoryCriterias").disable();
            this.evaluations
            .get("scoringMechanism").disable();
            this.evaluations
            .get("evaluationCriteria").disable();
          }else{

            let povalidate = ()=>{
              if(this.response.pointsofContact[0] != response.pkId){
                this.disable = true;
                console.log('val',this.disable);
                this.evaluations
                .get("sourceSelectionPlan").disable();
                this.evaluations
                .get("mandatoryCriterias").disable();
                this.evaluations
                .get("scoringMechanism").disable();
                this.evaluations
                .get("evaluationCriteria").disable();
              }

              return this.response.pointsofContact[0] == response.pkId ?false:true;
            }
             this.response.pointsofContact[1] == response.pkId ? this.disable =false:povalidate();
              }
          
        }
         this.status == "Initiated"?validate("true"):validate("false");  
      })

      })


      //Script to pull the clauses.
      this.sections.getSections( this.evaluationsId, 'evaluation-criteria').subscribe(response => {
        //Script to filter the Contract clauses depending on the Sol type.
        this.clauseString = response.clause
        console.log('eval clauses',response)
        // this.data = response.description;
      });

         


      this.ap
        .getEvaluations(response.evaluationCriteriaId)
        .subscribe(response => {
          console.log(response);
          console.log("Logging Evaluation Response");
          if (response) {
            this.evaluations
              .get("sourceSelectionPlan")
              .setValue(response.sourceSelectionPlan);
              // var mandatory = response.mandatoryCriterias? response.mandatoryCriterias == '<div><br></div>'?'<div><h3><b>M. Evaluation Factors</b></h3></div><div><br></div>':response.mandatoryCriterias:'<div><h3><b>M. Evaluation Factors</b></h3></div><div><br></div>';
              var mandatory = response.mandatoryCriterias
              this.evaluations
              .get("mandatoryCriterias")
              .setValue(mandatory);
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
    //console.log(evaluations.value)
    this.ap
      .patchEvaluations(this.evaluationsId, evaluations.value)
      .subscribe(response => {
        //console.log(response);
      });

      
  }

  
  sourceSelectionPlan(event) {
    // this.ssPlan = event.html;
    this.getnameofeditors = "";
    this.getnameofeditors = "sourceSelectionPlan";
  }
  mandatoryCriteria(event) {
    console.log(event)
    this.getnameofeditors = "";
    this.getnameofeditors = "mandatoryCriterias";
  }
  scoringMechanism(event) {
    this.getnameofeditors = "";
    this.getnameofeditors = "scoringMechanism";
  }
  factorText(event) {
    this.ftext = event.html;
    //  this.onChange(this.evaluations);
  }

  onKeyy() {
    //console.log("update");
    this.onChange(this.evaluations);
  }

  textV(event: any) {
    // without type info
    this.values = event.target.value;
    const control = <FormArray>this.evaluations.get("evaluationCriteria");
    if (this.values == "") {
      this.textVolume[control.value.length - 1] = false;
    } else {
      this.textVolume[control.value.length - 1] = true;
    }
   // console.log(this.textVolume);
  }

  getIndex(i) {
   // console.log(i);
    this.textVolumeIndex = i;
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



}
