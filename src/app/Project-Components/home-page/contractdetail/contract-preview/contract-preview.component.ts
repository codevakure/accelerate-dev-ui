import { Component, OnInit, SimpleChanges } from '@angular/core';
import { DatePipe} from '@angular/common';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import * as $ from 'jquery';
import { FormsService } from '../../../../Services/forms.service';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { SectionsService } from '../../../../Services/sections.service';
import {ContractService} from '../../../../Services/contract.service';
import { AcquisitionService } from '../../../../Services/acquisition.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';

//import * as jsPDF from 'jspdf'
import { callbackify } from 'util';


@Component({
  selector: 'app-contract-preview',
  templateUrl: './contract-preview.component.html',
  styleUrls: ['./contract-preview.component.css']
})
export class ContractPreviewComponent implements OnInit {

  date = '';
  edit2:boolean=false;

  SF1449 = new FormGroup(
    {
      eightA: new FormControl(false),
      requisitionNumber:new FormControl(''),
      contract_no:new FormControl(''),
      unrestricted:new FormControl(false),
      sol_no:new FormControl(''),
      coName:new FormControl(''),
      coPhone:new FormControl(''),
      issuededby:new FormControl(''), 
      officeCode:new FormControl(''),
      setAside:new FormControl(false),
      smallBusiness:new FormControl(''),
      hubzoneSB:new FormControl(false),
      SDVOB:new FormControl(false),
      womenSB:new FormControl(false),
      EDWOSB:new FormControl(false),
      percent:new FormControl(''),
      sizestandard:new FormControl(''),
      naicscode:new FormControl(''),
      startdate:new FormControl(''),
      qandaDate:new FormControl(''),
      RFQ:new FormControl(false),
      method_of_solicitation:new FormControl(''),
      RFP:new FormControl(false),
      aco1:new FormControl(''),
      cori1:new FormControl(''),
      contractor:new FormControl(''),
      paymentsby:new FormControl(''),
      deliverto:new FormControl(''),
      a27_yes:new FormControl(false),
      a27_no:new FormControl(false),
      awarddate:new FormControl('')



     
    }
  )

  formid;
  solid;

  allsoldata={FORM:{productkind:'',sol_no:'',startdate:''}};
  coAddress;
  contract_no;
 
  StartDate;
  offerDueDate;
  offerDueTime;
  requisitionNumber;
  solicitationNumber;
  method_of_solicitation;
  orderNumber;
  contractNumber;
  unrestricted;
  setAside;
  percent;
  hubzoneSB;
  SDVOB;
  womenSB;
  EDWOSB;
  eightA;
  RFQ;
  IFB;
  RFP;
  DueDate = undefined;
  bType;
  Name;
  Phone;
  soldata;
  htmldata=[];
  status;
  boo;
  solno;
 
  awardate;
  hideclausepreview = false;
  sections =[];
  contractId;
  qandaDate;
  issuededby;
  rAddress;
  adminby;
  coName;
  paymentby;
  naicscode;
  aco1;
  cori1;
  a27_yes;
  a27_no;
  awarddate;
  coPhone;
  startdate;
  sizestandard;
  awardedvendor;
  qandaTime;
  smallBusiness;
  disable;
  officeCode;
  getapno;
  attachmentsdata=[];
  type = "Attachments";
  username;
  formHTML


  modules={toolbar:false}

  myDataArray=[];

  columnsToDisplay = ['item', 'schedule','quanity','unit','unitprice','amount'];
  

  pos = { x: 0, y: 0 };
  constructor(
    private route: ActivatedRoute,
    private httpClient: Http, 
    private formservice:FormsService, 
    private acqservice:AcquisitionService,
    private datepipe: DatePipe,
    private contract :ContractService,
    private sec : SectionsService,private sanitizer: DomSanitizer
  ) { }




  // ngOnChanges(changes: SimpleChanges) {
  //   console.log(changes)
  // }

  ngOnInit() {
    setTimeout(() => {
      this.getfullcontract();
    }, 500);
    
    //Script to reformat the docuement text
    setTimeout(() => {

      let spans = document.getElementById("pdfadd").querySelectorAll("span, div");
      spans.forEach(span =>{
        (<HTMLElement>span).style.fontSize = "12px";
      });
      let headers = document.getElementById("pdfadd").querySelectorAll("h1,h2,h3,h4,h5,h6");
      console.log(headers)
      headers.forEach(header =>{
        (<HTMLHeadElement>header).style.fontSize = "13px";
        (<HTMLHeadElement>header).style.fontWeight ="bold";
      });

    
    }, 2000);
    
   

  }

  getfullcontract() {
    let pathname = window.location;
    this.contract_no =pathname.toString().split("contracts/")[1];



    this.contract.getfullContract(this.contract_no).subscribe(res =>{
     this.contractId = res.CONTRACT.id;
     this.allsoldata = res;
     this.solno = res.FORM.sol_no; 
     

     
    
     this.awardedvendor = res.FORM.awardedvendor;
     this.formid=res.FORM.id
     let formkeys = Object.keys(this.SF1449.value);
     this.contract.getcontract(this.contractId).subscribe(response =>{
       console.warn("Contract Information",response)
       
        //Script to check status
        this.getapno = response.ap_no
        this.officeCode = response.coOfficecode;
        this.status = response.status

        this.formHTML = this.sanitizer.bypassSecurityTrustHtml(response.fullHTML)
         this.soldata = response;
         this.myDataArray = res.CONTRACT.itemsTableData?res.CONTRACT.itemsTableData:[];
         console.log('datatable',this.myDataArray)
         for(let key in response){
          
            if(formkeys.includes(key)){
            if(key == 'naicscode'){
              this.SF1449.get(key).setValue(response[key].substring(0,6))
            }else{
              this.SF1449.get(key).setValue(response[key])
            }

            if(key =="awarddate"){
              let date = this.datepipe.transform(response[key],'M/d/yy h:mm a ')
              this.SF1449.get(key).setValue(date)
            }

          }
        }
        
        this.SF1449.get('startdate').setValue(this.allsoldata.FORM.startdate)
        this.SF1449.get('sol_no').setValue(this.allsoldata.FORM.sol_no)
        this.SF1449.get('qandaDate').setValue(this.datepipe.transform(res.CONTRACT.qandaDate,'M/d/yy h:mm a '));
        this.SF1449.get('requisitionNumber').setValue(res.CONTRACT.requisitionNumber);

         // Script to disable Editting
        setTimeout(() => {

          this.acqservice.getUserprofile().subscribe(response => {
            // console.log("Uderinformation",response,response.pkId);
            console.log("user response",response)
            let username = response.pkId;
            let  coId = this.soldata.pointsofContact[1];
            console.log(this.status,username,coId)
            if(this.status == "Finalized"){
               this.disable = true
            }else{
              username != coId?this.disable = true: this.disable = false;
            }
            
           

          })
         
        }, 500);

     });

     
   


    });



  }


  //Script to make the  form selections editable()
  edit(event) {
    $(event.currentTarget).prop("contenteditable","true");
    event.currentTarget.focus()
  }

  unedit(event) {
    $(event.currentTarget).prop("contenteditable","false")
  }

  capturechange(id,text){
    console.log(id,text);
  //   var data ={};
  //   data[id]=text
  //  this.contract.patchcontract(this.contractId,data).subscribe(res =>{
  //    console.log(res)
  //  })
  }



  updatesection(){
  
    let html =document.querySelector("#pdfadd").innerHTML;
    let formDataJson= this.SF1449.value
    formDataJson.fullHTML=html
    formDataJson.setAside = formDataJson.setAside.toString()
    formDataJson.awarddate = new Date(formDataJson.awarddate)
    console.log(formDataJson)
    this.acqservice.putContractData(this.contractId,formDataJson).subscribe(res=>{
      console.log(res)
    },e=>{
      console.warn('Patch to Contract Error')
    })
   
    
  }

  checkbox(event, id='') {
    event.preventDefault;
    let key = id==''?event.target.id:'method_of_solicitation';
    event.target.innerHTML == ""?event.target.innerHTML = "X":event.target.innerHTML = "";
    let data=id==''?event.target.innerHTML? true: "":id;
   this.capturechange(key,data);
  
  }

  makepdf() {
    $(".close").click();
    // document.querySelector("#outercontainer").scroll(0,0)
    document.querySelector("body").style.background="white"
    setTimeout(function(){
      window.print();
    },500);
    window.onafterprint= function (){
      document.querySelector("body").style.background="rgb(249, 250, 251)"
    }


  
  } 

  finialize() {
    let data={
      status:"Finalized"
    }
    this.contract.patchcontract(this.contractId,data).subscribe(res =>{
      console.log(res)
      this.status="Finalized"
    });

  }


  // new position from mouse event
setPosition(e) {
  console.log('drawmousedown',e);
  console.log(this.pos.x, this.pos.y)
  this.pos.x = e.offsetX ;
  this.pos.y = e.offsetY;
}


d = "";
 draw(e) {
    console.log(e);
    console.log("intial draw position",this.pos.x, this.pos.y);
    console.log("offset",e.offsetX , e.offsetY)
    // function to allow the user to create mulitple seperate signature vectors.
    let reset = () =>{
      console.log( this.d.search("Z"));
      this.d.search("Z") > -1? '' :this.d += ' Z M ';
      return
    }
    // function to allow the user to create mulitple seperate signature vectors.
    let recordsig = ()=>{
      //remove the end marker in the svg;
      this.d =this.d.replace("Z",'')
      
      this.d += " " + this.pos.x +" " + this.pos.y;
      this.setPosition(e);
      $("#write").attr("d",this.d)
    }

    e.buttons !== 1? reset():recordsig();
}


findsection(text) {
  document.getElementById(text).scrollIntoView();
  window.scrollBy(0, -120);
}





}

