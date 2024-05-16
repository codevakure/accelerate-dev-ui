import { Response } from '@angular/http';
import { Event } from '@angular/router';
import { Component, OnInit, OnChanges, NgZone } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray
} from "@angular/forms";
import { AcquisitionService } from "../../../../Services/acquisition.service";
import { AuthenticationService } from "../../../../Services/authentication.service";
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import {DatePipe , DecimalPipe, CurrencyPipe} from '@angular/common';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import * as jwt_decode from "jwt-decode";
import { element } from 'protractor';
declare var $: any;

@Component({
  selector: 'app-appreview',
  templateUrl: './appreview.component.html',
  styleUrls: ['./appreview.component.css']
})
export class AppreviewComponent implements OnInit, OnChanges {



  getapno
  igceData
  AP_FULL_AP;
  sowid;
  sow;
  marketid;
  market;
  attachmentsdata;
  tradeoffid;
  tradeoff

  evalu;
  evaluation;

  sec;
  security={
    informationSecurity:'',
    informationSecurity1:'',
    informationSecurity2:'',
    informationSecurity3:'',
    informationSecurity4:'',
  };

  con;
  consideration;
  products=[]

  s508id;
  s508;

  clins=[];
  igcetotal=0;
 

  pointsofContact = [];

  constructor(private _formBuilder: FormBuilder, private route: ActivatedRoute,
    private auth: AuthenticationService,
    private fb: FormBuilder,
    private ap: AcquisitionService,
    private zone: NgZone,
    private currencyPipe: CurrencyPipe) { }

  ngOnChanges( ) {
    this.getapno = this.route.snapshot.parent.params.apid;
    this.ap.getAPFull(this.getapno).subscribe(res => {
      console.log('****AP FULL JSON****', res);
      this.AP_FULL_AP = res;
    })
  }


  ngOnInit() {

    this.getapno = this.route.snapshot.parent.params.apid;
    this.ap.getAPFull(this.getapno).subscribe(res => {
      console.log('****AP FULL JSON****', res);
      this.AP_FULL_AP = res; 
      this.igceData =res.IGCE;
      
      console.log("Points of Contact", res.AP.pointsofContact);
      this.pointsofContact = res.AP.pointsofContact;
      this.pointsofContact.forEach(contact =>{
        this.ap.getrequestedtUser(contact).subscribe(res =>{
          console.log('got user info',res)
        })
      })
      console.log('Points of Contact', this.pointsofContact);

      //add the CoInformation to collaborators json
      let data = {
        value: res.AP.coName,
        Phone: res.AP.coPhone,
        email: res.AP.coEmail,
        role: 'CO'
      }
      this.AP_FULL_AP.AP.collaborators.push(data)





      this.sowid = res.SOW.id;
      //Get SOW information
      this.ap.getSow(this.sowid).subscribe(res => {
        this.sow = res;
      }, error => {
        console.log(error)
      })


      this.marketid = res.Compatibility.id;
      //Get MarketResearch information
      this.ap.getMR(this.marketid).subscribe(res => {
        this.market = res;
        console.log("Market Research",res);
        this.ap.getAttachments(this.getapno, 'MarketResearch').subscribe((response) => {
          //console.log(response);
          this.attachmentsdata = response;
          console.log(response)
          
          
        })
      }, error => {
        console.log(error)
      })



      this.tradeoffid = res.Tradeoffs.id;
      //Get TradeOffs information
      this.ap.getTradeoffs(this.tradeoffid).subscribe(res => {
        this.tradeoff = res;

      }, error => {
        console.log(error)
      });


      this.evalu = res.Evaluation_Criteria.id;
      //Get Evaluation information
      this.ap.getEvaluations(this.evalu).subscribe(res => {
        this.evaluation = res;
      }, error => {
        console.log(error)
      });


      this.sec = res.SECURITY.id;
      //Get Security information
      this.ap.getSecurity(this.sec).subscribe(res => {
        this.security = res;
        console.log('Security Json****', res)
      }, error => {
        console.log(error)
      });


      this.con = res.CONSIDERATIONS.id;
      //Get Evaluation information
      this.ap.getOtherConsiderations(this.con).subscribe(res => {
        this.consideration = res;
        console.log('Others Considerations****', res)
      }, error => {
        console.log(error)
      });

      this.s508id = res.SECTION508.id;
      //Get Evaluation information
      this.ap.getSection508(this.s508id).subscribe(res => {
        this.s508 = res;
      }, error => {
        console.log(error)
      });

      // console.log('ALL IGCE DATA',this.igceData)

      this.igceData.optionYears.forEach(element => {
        this.igcetotal += element.totalbaseyear
      });



    });

  }


  

  IDIQ(select) {
    return this.AP_FULL_AP.AP.idiq == select ? true : false
  }

  Severability(select) {
      return this.AP_FULL_AP.AP.severability == select ? true : false
  }

  IS(select) {
    return this.security.informationSecurity == select ? true : false
  }

  IGF(select, sec) {
    return this.AP_FULL_AP.AP[sec] == select ? true : false
  }

  Req(select) {
    return this.AP_FULL_AP.REQUISITION.option == select ? true : false
  }

  convertspecial(abbrivation) {
   if( typeof abbrivation != undefined){
    if(abbrivation == 'IA' ){
      return 'Interagency Acquisitions'
    }
    if(abbrivation == 'LOC' ){
      return 'Leader Company Contracting'
    }
    if( abbrivation == 'MOC'){
      return 'Management and Operating Contracts'
    }
    if(abbrivation == 'MYC' ){
      return 'Multi-year Contracting'
    }

    if(abbrivation == 'Options'){
      return 'Options'
    }
  }else{
    return ''
  }
  }


  convertContractMethod(abb){
    if( typeof abb != undefined){
      if(abb == 'SAP' ){
        return 'Simplified Acquisition Procedures'
      }
      if(abb == 'SLDBID' ){
        return 'Sealed Bidding'
      }
      if( abb == 'NEGCON'){
        return 'Contracting by Negotiation'
      }
      if(abb == 'N/A') {
        return 'N/A'
      }
      if(abb == 'MYC') {
        return 'Multi-year Contracting'
      }
      if(abb == 'IA') {
        return 'Interagency Acquisitions'
      }
      if(abb == 'LOC') {
        return 'Leader Company Contracting'
      }
      if(abb == 'MOC') {
        return 'Management and Operating Contracts'
      }
      if(abb == 'Options') {
        return 'Options'
      }
    }else{
      return ''
    }
  }

  



   async printme() {

    window.onbeforeprint = function() {
     (<HTMLDivElement> document.querySelector( '#documentwrapper')).style.marginTop = '200px'
     };
   await window.print();
    setTimeout(() => {
      (<HTMLDivElement> document.querySelector( '#documentwrapper')).style.marginTop = '0px'
    }, 100);
   
  }

  turn(text){
    return parseFloat(text)
  }

}
