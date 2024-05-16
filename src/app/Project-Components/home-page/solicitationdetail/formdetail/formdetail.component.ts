import { Component, OnInit   } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { FormsService } from '../../../../Services/forms.service';
import { AcquisitionService } from "../../../../Services/acquisition.service";
import { AuthenticationService } from "../../../../Services/authentication.service";
import { acquisition } from "../../../../Models/acquisition.model";
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/switchMap';
import { DatePipe} from '@angular/common';
import { ToastrService } from "ngx-toastr";
import {AllhtmlPipe} from '../../../../allhtml.pipe'


declare var $: any;


@Component({
  selector: 'app-formdetail',
  templateUrl: './formdetail.component.html',
  styleUrls: ['./formdetail.component.css' ]
  
})

export class FormdetailComponent implements OnInit  {
 
  public cssClass: string = 'e-custom-style';
  // Create Solication variables
  formData;
  solno;
  formsid;
  solstatus;
  ap_no;
  solId;
  Naiscsall;

   //varibles in the Overview section
  requisitionNumber;
  solicitationNumber;
  orderNumber : string = "12345678";
  projectTitle : string = "Sample Solicitation Title";
  
  // ICO(Issuing Contracting Office), PM and R information
  ICOName;
  ICOL1;
  ICOL2;
  baAddress;
  baEmail;
  baName;
  enddate2;
  qandadate2;
  baPhone;
  rAddress;
  rEmail;
  rName;
  rPhone;
  coAddress;
  coEmail;
  coName;
  coPhone;
  email;

// Deadline Variables
qandaduedate:string;
solduedate:string;
mindate;
mintime;


  // Variables for Acquisition Information
  method_of_solicitation;
  setAside: string ;
  percentage: string;
  btype: JSON;
  btypeSelect: string ='';
  proposedAction:string;
  Unrestricted:string;
  NAICS:string;
  apdata:any;

  //Schedule & Clauses
  a27_no:boolean =false;
  a27_yes:boolean =false;

    sow: any;
    phoneNumber;
    date;
    officecode;
    address;
    username;
    fieldArray: Array<any> = [];
    newAttribute: any = {};
    patchurl: string ;
    startmindate;

  hiddenobj:Array<any>=[];
  show:boolean = false;
  validate:boolean= false;
  begin;
  qandaDate;
  qandaTime;
  enddate;
  endtime;
  cori1;
  aco1;

  disable;

  itemsarray=[];

  item;
  schedule;
  quanity;
  unit;
  unitprice;
  amount;
  allusers=[];

  coId;
  uservalidate:boolean = true;

  myval ="<button onclick='edithide(event)' class='selection'>thisis wokring </button><script>function edithide(){alert()}</scipt>"

 testarray ={
  "Bundling": "",
  "orderNumber":"4567879",
  "requisitionNumber":"789867",
"SDVOB": "",
"acqConsideration": "",
"acqMethod": "",
"anticipatedPop": "",
"awardType": "",
"baAddress": "",
"baEmail": "",
"baName": "",
"baPhone": "",
"bundlingDetermination": "",
"capabilityPerformance": "",
"catalogue": "",
"coAddress": "",
"coEmail": "",
"coName": "",
"coPhone": "",
"contractType": "",
"contractVehicle": "",
"createdBy": "",
"description": "",
"eightA": "",
"estimatedBudgett": "",
"form_id": "",
"hubzoneSB": "",
"id": "",
"itornonit": "",
"method_of_solicitation": "",
"percent": "",
"performanceApproach": "",
"productKind": "",
"productService": "",
"projectTitle": "",
"proposedAction": "",
"rAddress": "",
"rEmail": "",
"rName": "",
"rPhone": "",
"requirementsType": "",
"selection": "",
"setAside": "",
"similarNumber": "",
"smallBusiness": "",
"sol_no": "",
"statementofNeed": "",
"status": "Initiated",
"typeofWork": "",
"unrestricted": "",
"womenSB": "",
"popendDate": "",
"popstartDate": "",
"a27_yes":false,
"a27_no":false,
"aco1":"",
"cori1":"",
"size_standards_dollars":"",
"viewed":"opened",
"issuededby":""
  }


  label="color: #1f5fbd;font-weight: normal;font-size: 14px;font-family: 'Arial',' SansSerif';";
  input='outline:none;text-transform: none;color: #606060;font-weight: normal;text-decoration: none;font-size: 14px;font-family: "Arial"," SansSerif";font-style: normal;background:transparent;';
  datepicker ='<div class="container"><div class="row"><div class="col-sm-6"><div class="form-group"><div class="input-group date" id="datetimepicker1"><input type="text" class="form-control" /><span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span></div></div></div>';
  edit="position:absolute;top:5px;right:10px;width:25px;height:25px;z-index:1;";
  radio = "margin:10px;font-size:20px";
  radioLabel='position:relative:float:left;color: #183e67;font-weight: normal;font-size: 14px;font-family: "Arial"," SansSerif";text-align: left;text-decoration: none;font-style: normal;text-transform: none;';

  soldata: any = {"form":{
            "ov_dropdown":{ 
            "parentid":"parent",
            "elem":"<div></div>",
            "style":'position:relative;float:left;width:100%;height:100%',
            "class":"",
            "insert":[ 
              {"id":"ov_editall",
                "elem":"<img data-input-links='SOLT' >",
                "style":this.edit,
                "class":"edit"
             },
              {
                "id":"",
                "elem":"<label class='label'>Requisition Number</label>",
                "style":this.label +"position:relative;float:left;width:100%;margin-top:10px",
                "class":""
              },
              {
                "id":"OVRN",
                "elem":'<input type="input" contenteditable="false" value="" readonly>',
                "style":this.input +"border:none;position:relative;float:left",
                "class":""
              },{
              "id":"",
              "elem":"<label class='label'>Order Number</label>",
              "style":this.label +"position:relative;float:left;width:100%;margin-top:10px",
              "class":""
            },
            {
              "id":"ORN",
              "elem":'<input type="input" contenteditable="false" value="" readonly>',
              "style":this.input +"border:none;position:relative;float:left",
              "class":""
            },
            {
              "id":"",
              "elem":"<img data-input-links='SOLT'>",
              "style":this.edit+"top:109px;left:108px",
              "class":"lineedit"
            },{
              "id":"",
              "elem":"<label class='label'>Solicitation Title</label>",
              "style":this.label +"position:relative;float:left;width:100%;margin-top:10px",
              "class":""
            }
            ,
            {
              "id":"SOLT",
              "elem":'<input type="input" contenteditable="false" value="" readonly>',
              "style":this.input +"border:none;position:relative;float:left;width:fit-content !Important",
              "class":""
             }

            ]},
          "ov_edit":{ 
            "parentid":"parent",
            "elem":"<div></div>",
            "style":'position:relative;float:left;width:100%;height:100%',
            "class":"",
            "insert":[ 
                  
                   {
                      "id":"space",
                      "elem":"<div></div>",
                      "style":"position:relative;float:left;width:100%;height:5px"

                    },
                    {
                    "id":"field1",
                    "elem":"<p>The Proposed Action is</p>",
                    "style":this.label +"position:relative;float:left;margin-top:7px",
                    "class":"labelstyle"},
                    {"id":"",
                      "elem":"<div></div>",
                    "style":"font-size:20px;width:100%",
                    "class":"",
                    "insert":[
                        {"id":"Competitive",
                         "elem":'<input type="radio"  name="drone" value="Competitive">',
                         "style":this.radio,
                         "class":"radio"
                      },
                      {
                        "id":"",
                        "elem":'<label for="Competitive" style="">Competitive</label>',
                        "style":this.radioLabel,
                        "class":""
                      },
                      {"id":"NonCompetitive",
                      "elem":'<input type="radio"  name="drone" value="Non-Competitive">',
                      "style":this.radio,
                      "class":"radio"
                      
                      },
                      {
                        "id":"",
                        "elem":'<label for="Non-Competitive" style="">Non-Competitive</label>',
                        "style":this.radioLabel,
                        "class":""
                      }
                   ]}, {
                    "id":"space",
                    "elem":"<div></div>",
                    "style":"position:relative;float:left;width:100%;height:5px"

                  },
                   //start of second line
                   {"id":"field2",
                   "elem":"<p>Unrestricted, full and open?</p>",
                   "style":this.label +"position:relative;float:left;margin-top:7px",
                   "class":"labelstyle"
                   },{
                     "id":"",
                      "elem":"<div></div>",
                      "style":"font-size:20px;width:100%",
                      "class":"",
                      "insert":[
                          {"id":"unrestrictyes",
                            "elem":'<input type="radio" name="unrestricted" value="Yes">',
                            "style":this.radio,
                            "class":"radio"
                          },
                          {
                            "id":"",
                            "elem":'<label for="Yes" style="">Yes</label>',
                            "style":this.radioLabel,
                            "class":""
                          },
                          {"id":"unrestrictno",
                            "elem":'<input type="radio" name="unrestricted" value="No">',
                            "style":this.radio,
                            "class":"radio"
                          },
                          {
                            "id":"",
                            "elem":'<label for="No" style="">No</label>',
                            "style":this.radioLabel,
                            "class":""
                      }
                ]},{
                  "id":"space",
                  "elem":"<div></div>",
                  "style":"position:relative;float:left;width:100%;height:5px"

                },
                {"id":"field3",
                "elem":"<p>Partial set-aside?</p>",
                "style":this.label +"position:relative;float:left;margin-top:7px",
                "class":"labelstyle"
                },{
                  "id":"",
                   "elem":"<div></div>",
                   "style":"position:relative;float:left;margin-left:66px",
                   "class":"",
                   "insert":[
                       {"id":"setasideYes",
                         "elem":'<input type="radio" name="setaside" value="Yes">',
                         "style":this.radio,
                         "class":"radio"
                       },
                       {
                         "id":"",
                         "elem":'<label for="Yes" style="">Yes</label>',
                         "style":this.radioLabel,
                         "class":""
                       },
                       {"id":"setasideNo",
                         "elem":'<input type="radio" name="setaside" value="No">',
                         "style":this.radio,
                         "class":"radio"
                       },
                       {
                         "id":"",
                         "elem":'<label for="No" style="">No</label>',
                         "style":this.radioLabel,
                         "class":""
                   }
             ]},
             {
              "id":"space",
              "elem":"<div></div>",
              "style":"position:relative;float:left;width:100%;height:5px"

            },
            {
              "id":"percent_container",
              "elem":"<div></div>",
              "styel":"",
              "class":"",
              "insert":[
                {
                  "id":"field4",
                  "elem":'<label>Insert Percentage and Socioeconomic Category</label>',
                  "style":this.label +"position:relative;float:left",
                  "class":''
                }, {
                 "id":"space",
                 "elem":"<div></div>",
                 "style":"position:relative;float:left;width:100%;height:1px"
   
               },
                {
                  "id":"input_percentage",
                  "elem":'<input placeholder="(e.g.  50%)">',
                  "style":'width:400px;border:none;border-bottom:3px solid rgba(0,130,200,1);background:white;position:relative;float:left',
                  "class":''
                },{
                  "id":"newline",
                  "elem":"<div>",
                  "style":"position:relative;float:left;width:100%;height:10px",
                  'class':""
                },
                {
                  "id":"eightA",
                  "elem":'<input type="checkbox">',
                  "style":'position:relative;float:left;margin:5px;margin-left:40px',
                  "class":'',
                  'click':'this.btypeSelect = "eightA";' 
                },
                {
                  "id":"",
                  "elem":'<label>(8a)</label>',
                  "style":this.label + "position:relative;float:left",
                  "class":""
                },{
                 "id":"space",
                 "elem":"<div></div>",
                 "style":"position:relative;float:left;width:100%;height:5px"
   
               },{
                 "id":"SDVOB",
                 "elem":'<input type="checkbox">',
                 "style":'position:relative;float:left;margin:5px;margin-left:40px;',
                 "class": "",
                 'click':'this.btypeSelect = "SDVOSB";' 
               },
               {
                 "id":"",
                 "elem":'<label>Service-Disabled Veteran-Owned Small Business</label>',
                 "style":this.label + "position:relative;float:left",
                 "class":""
               },
               {
                 "id":"space",
                 "elem":"<div></div>",
                 "style":"position:relative;float:left;width:100%;height:5px"
   
               },
               {
                 "id":"smallBusiness",
                 "elem":'<input type="checkbox">',
                 "style":'position:relative;float:left;margin:5px;margin-left:40px;',
                 "class":'',
                 'click':'this.btypeSelect = "smallBusiness";' 
               },
               {
                 "id":"",
                 "elem":'<label>Small Business</label>',
                 "style":this.label + "position:relative;float:left",
                 "class":""
               },
               {
                 "id":"space",
                 "elem":"<div></div>",
                 "style":"position:relative;float:left;width:100%;height:5px"
   
               },
               {
                 "id":"EDWOSB",
                 "elem":'<input type="checkbox">',
                 "style":'position:relative;float:left;margin:5px;margin-left:40px;',
                 "class":'',
                 'click':'this.btypeSelect = "EDWOSB";' 
               },
               {
                 "id":"",
                 "elem":'<label>EDWOSB</label>',
                 "style":this.label + "position:relative;float:left",
                 "class":""
               },
               {
                 "id":"space",
                 "elem":"<div></div>",
                 "style":"position:relative;float:left;width:100%;height:5px"
   
               },
               {
                 "id":"hubzoneSB",
                 "elem":'<input type="checkbox">',
                 "style":'position:relative;float:left;margin:5px;margin-left:40px;',
                 "class":'',
                 'click':'this.btypeSelect = "hubzoneSB";'
               },
               {
                 "id":"",
                 "elem":'<label>Hub Zone Small Business</label>',
                 "style":this.label + "position:relative;float:left",
                 "class":""
               },
               {
                 "id":"space",
                 "elem":"<div></div>",
                 "style":"position:relative;float:left;width:100%;height:5px"
   
               },
               {
                 "id":"womenSB",
                 "elem":'<input type="checkbox">',
                 "style":'position:relative;float:left;margin:5px;margin-left:40px;',
                 "class":'',
                 'click':'this.btypeSelect = "womenSB";'
               },
               
               {
                 "id":"",
                 "elem":'<label>Women-Owned Small Business(WOSB) Eligible Under the Women-Owned Small Business Program</label>',
                 "style":this.label + "position:relative;float:left",
                 "class":""
               }
                 
              ]

            }]     
            },
            "aq_dropdown":{
              "parentid":"parent",
            "elem":"<div></div>",
            "style":'position:relative;float:left;width:100%;height:100%',
            "class":"",
            "insert":[
              {
                "id":"",
                "elem":"<img data-input-links='acqu1 acqu2 acqu3 RFP NAICS '>",
                "style":this.edit,
                "class":"edit"
              },
              {
                "id":"RFP_special",
                "elem":"<img data-input-links='RFP ' >",
                "style":this.edit+"top:5px;left:140px",
                "class":"lineedit"
              },
              {
                "id":"acq_special",
                "elem":"<img data-input-links='acqu1 acqu2 acqu3 '>",
                "style":this.edit+"top:58px;left:108px",
                "class":"lineedit"
              },
              { 
                "id":"aq_edit",
                "elem":'<i class="fa fa-pencil-square-o" aria-hidden="true"></i>',
                "style":"position:absolute;top:0px;right:0px;height:15px;width:15px",
                "class":""
              },
              {
                "id":"",
                "elem":"<label class='label'>Method of Solicitation</label>",
                "style":this.label +"position:relative;float:left;width:100%;margin-top:10px",
                "class":""
              },
              {
                "id":"RFP",
                "elem":'<select disabled></select>',
                "style":this.input +"border:none;position:relative;float:left;width:250px",
                "class":"","insert":[
                  {
                    "id":"",
                    "elem":'<option value="Select - Acquisition Method">Select - Acquisition Method</option>',
                    "style":"",
                    "class":""
                  },
                  {
                    "id":"",
                    "elem":'<option value="RFP">RFP</option>',
                    "style":"",
                    "class":""
                  },
                  {
                    "id":"",
                    "elem":'<option value="RFQ">RFQ</option>',
                    "style":"",
                    "class":""
                  }
                ]
              },{
                "id":"",
                "elem":"<label class='label'>Acquisition Type</label>",
                "style":this.label +"position:relative;float:left;width:100%;margin-top:10px",
                "class":""
              },{
                "id":"ov_edit",
                "elem":"<div></div>",
                "style":"position:relative;float:left;width:100%;display:none",
                "class":""
              },
              {
                "id":"acqu1",
                "elem":'<input type="input" contenteditable="false" value="Competitive" readonly>',
                "style":this.input +"border:none;position:relative;float:left;width:100%",
                "class":""
              },
              {
                "id":"space",
                "elem":'<div></div>',
                "style":"position:relative;float:left;width:100%;height:5px",
                "class":""
              },
              {
                "id":"acqu2",
                "elem":'<input type="input" contenteditable="false" value="" readonly>',
                "style":this.input +"border:none;position:relative;float:left;width:100%",
                "class":""
              },
              {
                "id":"space",
                "elem":'<div></div>',
                "style":"position:relative;float:left;width:100%;height:5px",
                "class":""
              },
              {
                "id":"acqu3",
                "elem":'<input type="input" contenteditable="false" value="" readonly>',
                "style":this.input +"border:none;position:relative;float:left;width:100%",
                "class":""
              },
              {
                "id":"",
                "elem":"<div></div>",
                "style":"position:relative;float:left;width:100%;height:1px"
              },
              {
                "id":"",
                "elem":'<label>NAICS Code</label>',
                "style":this.label+"position:relative;float:left"
              },{
                "id":"",
                  "elem":"<img data-input-links='NAICS' >",
                  "style":this.edit+"top: -6px;right:0px;margin-left:7px;position:relative;float:left",
                  "class":"lineedit"
              },{
                "id":"",
                "elem":"<div></div>",
                "style":"position:relative;float:left;width:100%;height:1px"
              },
              {
                "id":"NAICS",
                "elem":'<input type="input" value="NAICS Code" readonly>',
                "style":this.input+"position:relative;float:left;border:none; width:350px"
              }
                        
            ]
            },
            "dl_label1":{
              "parentid":'parent',
              "elem":"<div></div>",
            "style":'position:relative;float:left;width:100%;height:100%',
            "class":"",
            "insert":[
              {
                "id":"",
                "elem":'<label>Question & Answer Due Date and Time</label>',
                "style":this.label +"position:relative;float:left",
                "class":""
              }

            ]
          },"dl_label2":{
            "parentid":'parent',
            "elem":"<div></div>",
          "style":'position:relative;float:left;width:100%;height:100%',
          "class":"",
          "insert":[
            {
              "id":"",
              "elem":'<label>Solicitation Due Date and Time</label>',
              "style":this.label +"position:relative;float:left",
              "class":""
            }
          ]
        },
          "pa_dropdown":{
            "parentid":'parent',
              "elem":"<div></div>",
            "style":'position:relative;float:left;width:100%;height:100%',
            "class":"",
            "insert":[
              {
                "id":"",
                "elem":"<img data-input-links='aco1 dl1 cori1' >",
                "style":this.edit,
                "class":"edit"
              },
              {
                "id":"",
                "elem":"<img data-input-links='dl1 ' >",
                "style":this.edit+"top:0px;left:109px",
                "class":"lineedit"
              },
              {
                "id":"",
                "elem":"<img data-input-links='aco1  '>",
                "style":this.edit+"top:74px;left:207px",
                "class":"lineedit"
              },
              {
                "id":"",
                "elem":"<img data-input-links='cori1'>",
                "style":this.edit+"top:171px;left:240px",
                "class":"lineedit"
              },
              {
                "id":"",
                "elem":"<label class='label'>Delivery Location</label>",
                "style":this.label +"position:relative;float:left;width:100%;margin-top:10px",
                "class":""
              },
              {
                "id":"dl1",
                "elem":'<textarea type="input" contenteditable="false" readonly>',
                "style":this.input +"border:none;position:relative;float:left;width:100%",
                "class":""
              },
              {
                "id":"space",
                "elem":'<div></div>',
                "style":"position:relative;float:left;width:100%;height:1px",
                "class":""
              },
              {
                "id":"",
                "elem":"<label class='label'>Administering Contracting Office</label>",
                "style":this.label +"position:relative;float:left;width:100%;margin-top:10px",
                "class":""
              },
              {
                "id":"aco1",
                "elem":'<textarea type="input" contenteditable="false" readonly></textarea>',
                "style":this.input +"border:none;position:relative;float:left;width:200px;height:auto",
                "class":""
              },
              {
                "id":"",
                "elem":"<label class='label'>Contracting Office to Receive Invoices</label>",
                "style":this.label +"position:relative;float:left;width:100%;margin-top:10px",
                "class":""
              },
              {
                "id":"cori1",
                "elem":'<textarea  contenteditable="false"  readonly></textarea>',
                "style":this.input +"border:none;position:relative;float:left;width:200px;height:auto",
                "class":""
              }
            ]
          }
          


          }


      }

      solType1: boolean = false;
      state:boolean = false;
  constructor(private route: ActivatedRoute, private router: Router,
     private formsService: FormsService,
    private acqService: AcquisitionService,
     private auth: AuthenticationService, 
     private http: Http, private datepipe: DatePipe,
     private toast:ToastrService) { }

    
  ngOnInit() {

    //Set the startmin date
    this.startmindate = this.datepipe.transform(new Date(),"yyyy-MM-ddThh:mm")
    
    //Script to get all the formdata to update the Form.
    this.formsService.updatesection("ov_dropdown",this.soldata);
    // this.formsService.updatesection("sc_dropdown",this.soldata);
    this.formsService.updatesection("aq_dropdown",this.soldata);
    this.formsService.updatesection("dl_label1",this.soldata);
    this.formsService.updatesection("dl_label2",this.soldata);
    this.formsService.updatesection("pa_dropdown",this.soldata);

    this.formsService.updatesection("ov_edit",this.soldata);


    this.solno = this.route.snapshot.parent.params.sid;
    console.log(this.solno);
    //Script to get the Username
  

    this.acqService.getsoldappids(this.solno).subscribe((response) => {
      console.log("Dapp data", response);
      this.ap_no=response.ap_no;
      console.log("AP number ",this.ap_no);
      this.formsid=response.formId;
      console.log(this.formsid);
      this.solId =response.solId;

      

        this.acqService.getSolicitation(response.solId).subscribe((response) => {
          
        this.apdata = response;
        if(response.Source == true && response.productKind == 'full' || response.Source == false || response.productKind == ''){
          this.solType1 = true;
        } else if(response.Source == true && response.productKind != 'full'){
          this.solType1 = false;

        }

        // this.formsService.putFormData(this.formsid, {status:'Initiated'}).subscribe(res=>{
        //   console.log("Force Change",res)
        // })
          //Script to capture the FORMDATA
        this.formsService.getFormData(this.formsid).subscribe((response) => {
          console.log("response from get formData in formsService",response);
          //Capture the response
          this.formData = response;
          console.log('all Form data',this.formData);



        //update CO selection boxes
        setTimeout(() => {
          this.acqService.getContractingRole().subscribe(res=>{    
            this.allusers=res.results;  
            console.log('ALL USERS LIST',res)
        });
        }, 500);

        
          if(this.formData.a27_yes == true ||this.formData.a27_yes == 'true' ){
            console.log('ran');
            (<HTMLInputElement>document.querySelector("#a27_yes")).checked = true
          }

          if(this.formData.a27_no == true || this.formData.a27_yes == 'true'){
            (<HTMLInputElement>document.querySelector("#a27_no")).click()
          }
        
        
        // Script to validate if the Sol has been worked previously?
        setTimeout(()=>{
            if(this.apdata.status == 'Published') {
              this.state = true;
            } else {
              this.state = false;
            }
        },10)

        if( this.formData.viewed == "opened" ){
          // if yes pull data from sol form
          console.log("exist");
          console.log("form length",this.formData);
          
          this.solstatus = this.formData.status == 'Accepted'? 'Initiated':this.formData.status;
          this.requisitionNumber = this.formData.requisitionNumber;
          this.solicitationNumber = this.formData.sol_no;
          this.date = this.formData.startdate;

          this.baAddress = this.formData.baAddress;
          this.baEmail = this.formData.baEmail;
          this.baName = this.formData.baName;
          this.baPhone = this.formData.baPhone;
          this.rAddress = this.formData.rAddress;
          this.rEmail = this.formData.rEmail;
          this.rName = this.formData.rName;
          this.rPhone = this.formData.rPhone;
          this.coAddress = this.formData.coOfficeName+" "+this.formData.coAddress;
          this.coEmail = this.formData.coEmail;
          this.coName = this.formData.coName;
          this.coPhone = this.formData.coPhone;
          this.email = this.formData.coEmail;
          this.officecode = this.formData.coOfficecode;
        
          this.method_of_solicitation = this.formData.method_of_solicitation;
          this.setAside = this.formData.setAside;
          this.percentage = this.formData.percent;
          this.proposedAction = this.formData.proposedAction;
          this.Unrestricted = this.formData.unrestricted;
          this.NAICS = this.formData.naicscode;
          this.orderNumber = this.formData.orderNumber;
          this.projectTitle = this.formData.projectTitle;
         this.enddate = '';
         this.enddate2 = this.apdata.popendDate;
          console.warn("Form Data Q & A Date", this.formData.qandaDate);
          console.warn("Form Data Offer Due Date", this.formData.offerDueDate);
            this.qandaDate = this.formData.qandaDate;
            this.enddate = this.formData.offerDueDate
         
         this.qandadate2 = this.apdata.popstartDate;
         console.log("Valid End Date and aandaDate", this.enddate2, this.qandadate2)
          this.cori1=this.formData.cori1;
          this.aco1=this.formData.aco1;
          this.itemsarray=this.formData.itemsTableData?this.formData.itemsTableData:[];
          
          setTimeout(() => {
            this.validate_date(null);
          }, 500);
          
          console.log(this.formData);


        }else{
           // if no pull data from ap
          console.log("doesnot");
          console.log("Apdata captured",this.apdata);
         
          for(var key in this.apdata){
            this.testarray[key] = this.apdata[key];
            console.log("apdata section data",this.apdata[key]);
            console.log(" log updated section in json",this.testarray[key]);
          };
          console.log(this.testarray);
          //Add data to the Form.
          this.nostatus();
         };


        //Start of javascript code data mFapping
            //run function to update the socialEconomic Status
        this.updateSocandPercent();
        document.getElementById("OVRN").setAttribute("value",this.requisitionNumber);
        document.getElementById("ORN").setAttribute("value",this.orderNumber);

        if(this.method_of_solicitation){

         if(this.method_of_solicitation == "RFP" || this.method_of_solicitation == "RFQ" ){
          document.getElementById("RFP").querySelector('option[value="'+this.method_of_solicitation  +'"]').setAttribute("selected","selected");
         } 

         if(this.method_of_solicitation == "" ){
         
         } 
       
        }

        
          let value = this.setAside != "X"? '':'Set Aside';
          document.getElementById("acqu2").setAttribute("value",value);

        
        
        document.getElementById("NAICS").setAttribute("value",this.NAICS);
        document.getElementById("acqu1").setAttribute("value",this.proposedAction);
        
        document.getElementById("dl1").innerText= this.baAddress;
        document.getElementById("aco1").innerText=this.aco1 ==""?this.coAddress:this.aco1;
        document.getElementById("cori1").innerText=this.cori1 ==""?this.coAddress:this.cori1;

        document.getElementById("input_percentage").setAttribute("value",this.percentage);
        document.getElementById("SOLT").setAttribute("value",this.projectTitle);
        document.querySelector(".projecttitle").innerHTML = this.projectTitle;      
      
    

        this.percentage?document.getElementById("acqu3").setAttribute("value",this.percentage +"% "+ this.btypeSelect.substring(0, this.btypeSelect.length - 2)):'';

        if(this.percentage =='100'){
          eval('document.getElementById("setasideNo").checked = true;');
        }else{
          if(this.percentage !== '' ){
            eval('document.getElementById("setasideYes").checked = true;');
          }
          
        }
                
  
              //Script to set the proposed Action;
            if( typeof this.proposedAction != undefined){
              
              if(this.proposedAction == "Competitive"){
                console.log(this.proposedAction)
                setTimeout(() => {
                  eval('document.getElementById("Competitive").checked = true;');
                  let hide =$("#ov_edit").find("#field2");
                  hide.show();
                  hide.next().show(); 
                  let hide2 =$("#ov_edit").find("#field3");
                  hide2.show();
                  hide2.next().show(); 
                }, 700);
                
              }else{
                setTimeout(() => {
                  eval('document.getElementById("NonCompetitive").checked = true');
                let hide =$("#ov_edit").find("#field2");
                hide.hide();
                hide.next().hide();
                let hide2 =$("#ov_edit").find("#field3");
                hide2.hide();
                hide2.next().hide(); 
                hide2.next().find("input[type=radio]").prop("checked", false);
                
                }, 700);
                
              }
            }

             //Script to set the Unrestricted and set the Partial SetAside;
             if(typeof this.Unrestricted != undefined){
              console.log("this unrestricted",this.Unrestricted)
             if(this.Unrestricted == "X"){
               console.log("ITS UNrestricted")
               setTimeout(() => {
                 eval('document.getElementById("unrestrictyes").checked = true')
                 let hide =$("#ov_edit").find("#field3");
                 $("#setasideYes").attr("checked",false)
                     hide.hide();
                     hide.next().hide();
                     $("#input_percentage").val(this.percentage);
                   }, 500);
                      
             }else{
              
               console.log("ITS UNrestricted")
               eval('document.getElementById("unrestrictno").checked = true')
               let hide =$("#ov_edit").find("#field3");
               hide.show();
               hide.next().show();
               setTimeout(() => {
                 if(this.percentage != "100"){
                   $("#setasideYes").attr("checked",true);
                 }
                 
                  if(this.percentage =="100"){
                    $("#setasideNo").attr({"checked":true});
                    $("#input_percentage").attr({"readonly":true})
                  }
                   
                 
               }, 500);
            }
         }

            

      // Status validation functions( remove editablity)    
      console.log("status of solicitation json and corrected status", this.formData.status , this.solstatus );

       if(this.solstatus == "Initiated"){
        let lineditbuttons = document.querySelectorAll(".lineedit");
       lineditbuttons.forEach((button,index)=>{
         (<HTMLImageElement>button).src = "assets/Pencil-Icon-PNG.png";
         (<HTMLButtonElement>button).addEventListener('click',(e:Event) =>{
           this.editshow(e);
         });
      
       });

       let editall = document.querySelectorAll(".edit");
       editall.forEach((button,index)=>{
         (<HTMLImageElement>button).src = "assets/Pencil-Icon2-PNG.png";
         (<HTMLButtonElement>button).addEventListener('click',(e:Event) =>{
        
          $(e.currentTarget).parent().find(".lineedit").each(function(){
            $(this).click();
          })
         });

       });

       
       $("#proposalevaluation").remove();
       $("#Question").remove();
       $("#cornomination").remove();
       
      


      $(" th input").focus(function(){
        $(this).css({"border-bottom":"2px solid #0844a4","outline":'none'})
      });

      $(" th input").focusout(function(){
        $(this).css({"border-bottom":"2px solid gray"})
      });
   
      



       }
       
       //Script to lock the Soliciation if status is Published
       if(this.formData.status != "Initiated" && this.formData.status != "Accepted" ){ 
         console.log('DIsabled RAN');
          let lineditbuttons = document.querySelectorAll(".lineedit");
          lineditbuttons.forEach((button,index)=>{
            (<HTMLImageElement>button).remove();
            
          });
  
          let editall = document.querySelectorAll(".edit");
         editall.forEach((button,index)=>{
          (<HTMLImageElement>button).remove();
         });

        //  let images = document.querySelectorAll('img');
        //  console.warn('All images',images)
        //  images.forEach((img,index)=>{
        //   (<HTMLImageElement>img).remove();
        //  });

         $("input").focus(function(){
          $(this).css({"pointer-events":"none","outline":'none'})
        });

        if(document.getElementById("a27_yes") !=undefined){
          (<HTMLInputElement>document.getElementById("a27_yes")).disabled = true;
          (<HTMLInputElement>document.getElementById("a27_no")).disabled = true; 
        }
       
       }  

        
       //Script to User profile ID
       this.acqService.getUserprofile().subscribe(response => {
        this.uservalidate = true;
         this.username = response.pkId;
         console.log('userpkid',this.username,response)
         this.coId = this.formData.pointsofContact[1];


        if(this.username != this.formData.pointsofContact[1] ){
          if(document.getElementById("a27_yes")){
            (<HTMLInputElement>document.getElementById("a27_yes")).disabled = true;
          (<HTMLInputElement>document.getElementById("a27_no")).disabled = true;
          }
          
          let lineditbuttons = document.querySelectorAll(".lineedit");

          lineditbuttons.forEach((button,index)=>{
            (<HTMLImageElement>button).remove();
            
          });

          $("input").focusin(function(){
            $(this).css({"pointer-events":"none","outline":'none'})
          });
  
          let editall = document.querySelectorAll(".edit");
         editall.forEach((button,index)=>{
          (<HTMLImageElement>button).remove();
         });

         //Script to remove onlick from input
         let allipnuts = document.querySelectorAll("ipnut");
         allipnuts.forEach(elem =>{
          
          (<HTMLInputElement>elem).addEventListener("click", function(event){
            (<HTMLInputElement>elem).style.border= 'none'
          });

         })

       
        }


      },error=>{
        console.log('Userservice not working');
        console.log(error)
      });





        },error =>{
          console.log(error)
        });

    },error =>{
      console.log(error)
    });
        console.log("apdata",this.apdata);
         },error =>{
          console.log(error)
        });


          //Script to update the overriew information
          document.getElementById("SOLT").onchange = function(){
            datag((<HTMLInputElement>document.getElementById("SOLT")).value,"projectTitle");
            document.querySelector(".projecttitle").nodeValue = (<HTMLInputElement>document.getElementById("SOLT")).value;

          };

          document.getElementById("ICO1").onchange = function(){
            datag((<HTMLInputElement>document.getElementById("ICO1")).value,"coAddress");
          };


          //Script to update the Acquistion Information
          $("#Competitive").click(function() {
              datag("Competitive","proposedAction");
              let hide =$("#ov_edit").find("#field2");
              hide.show();
              hide.next().show();
              let hide2 =$("#ov_edit").find("#field3");
              hide2.show();
              hide2.next().show();
              $("#percent_container").show();
              $("#acqu1").val("Competitive")
          });

          $("#NonCompetitive").click(function(){
            //Script to reset all Acquition Information
            datag("Non-Competitive","proposedAction");
            $("#acqu1").val("Non-Competitive")
            let hide =$("#ov_edit").find("#field2");
            hide.hide();
            hide.next().hide();
            hide.next().find("input[type=radio]").prop("checked", false);
            let percentinput = (<HTMLInputElement>document.getElementById("input_percentage"));
            (<HTMLInputElement>document.getElementById("acqu2")).value='';
            document.getElementById("acqu3").setAttribute("value",'');
           
            percentinput.readOnly = true;
            let hide2 =$("#ov_edit").find("#field3");
             hide2.hide();
             hide2.next().hide(); 
             datag("","unrestricted");
             datag("","percent");
             datag("","setAside");
             hide2.next().find("input[type=radio]").prop("checked", false);
            $("#percent_container").hide();
            var boxes = document.querySelectorAll("input[type=checkbox]");
            $.each(boxes,function(index){
              let id = boxes[index].id.toString();
              console.log(id);
              $(id).prop("checked",false);
              datag(false,id);
            })
           
            
        });

          $("#unrestrictyes").click( function() {
             datag("X","unrestricted");
          });

          $("#unrestrictno").click(function(){ 
             datag("","unrestricted");
             
            });
          
          $("#setasideNo").click(function(){ 
            datag("100","percent");
            datag("X","setAside");
            $("#acqu2").val("Set Aside");
            let percentinput = (<HTMLInputElement>document.getElementById("input_percentage"));
            percentinput.value = '100';
            percentinput.readOnly = true;
            updatePandS('100',"","")
            $("#percent_container").show();
 
          });


          
          $("#setasideYes").click(function(){ 
            let percentinput = (<HTMLInputElement>document.getElementById("input_percentage"));
            datag(percentinput.value,"percent");
            datag("X","setAside");
            $("#acqu2").val("Set Aside")
            percentinput.readOnly = false;
            percentinput.hidden = false;
            percentinput.value = '';
            $("#percent_container").show();
            
            
          })

            //Script to check the 'Are Attached' buttons;
        
        
        
        
         
         

          document.getElementById("RFP").onchange = function(){
            datag((<HTMLInputElement>document.getElementById("RFP")).value,"method_of_solicitation");
          };

          let updatePandS = (x,id,val)=>{
           if(id !=''){
             this.formData[id]= val
           }
            this.btypeSelect = '';
            this.percentage = x;
            let length = this.formData;
            console.log(this.formData)
            for(let key in length){
              let value = length[key]
              if (value == true && key !="is_commercial" && key !="Source"
              && key !="noncomoption1" && key !="noncomoption2"
              && key !="noncomoption3"
              && key !="noncomoption4"
              && key !="noncomoption5"
              && key !="noncomoption6"
              ){
                let map ={
                  "eightA":"8a,",
                  "EDWOSB":"EDWOSB,",
                  "SDVOB":"Service-Disabled Veteran-Owned Small Business,",
                  "hubzoneSB":"Hub Zone Small Business,",
                  "smallBusiness":"Small Business,",
                  "womenSB":"Women-Owned Small Business(WOSB) Eligible Under the Women-Owned Small Business Program,"
                }
                console.log("Key",key);
      
                if(this.btypeSelect.indexOf('undefined',0) != -1){
                  this.btypeSelect += `${map[key]} `;
                }
                else{
                  this.btypeSelect +=  `${map[key]} `;
                };
                (<HTMLInputElement>document.getElementById(key)).checked = document.getElementById(key)?true:false;
              }
              
            }
              this.percentage?document.getElementById("acqu3").setAttribute("value",x +"% "+ this.btypeSelect.substring(0, this.btypeSelect.length - 2)):'';
          }

          (<HTMLInputElement>document.getElementById("input_percentage")).onchange = function(){
            let objvalue =(<HTMLInputElement>document.getElementById("input_percentage"));
            //Scipt to only allow no-numerical chacters
            objvalue.value = objvalue.value.replace(/[^\d.-]/g,'');
            updatePandS(objvalue.value,"","")
            datag( objvalue.value,"percent");

          };

          document.getElementById("NAICS").onkeyup = function(event){
            let element =(<HTMLInputElement>document.getElementById("NAICS"))
            datag(element.value,"naicscode");
            datag(element.getAttribute("data-size"),"size_standards_dollars");
            

          };

          $("#NAICS").click(function(){
            if($(this).prop("readonly")){
                // do nothing
            }else{
            $("#curtian").animate({width:"400px"},500);
            $("#curtian").show();
            $("#curtian p").each(function(index){
            $(this).show();
            })
            }
          });
          
          $("#NAICS").keyup(function(){
            let string = $(this).val().toLowerCase();
            $("#curtian tr").each(function(index){
              if($(this).attr("code").toLowerCase().includes(string)){
                $(this).show();
              }else{
                $(this).hide();
              };
            })
          });

          
         //Socioeconomic  checkboxes
          var boxes = document.querySelectorAll("input[type=checkbox]");
          for (var i =0; i<boxes.length; i++){
            boxes[i].addEventListener("click", function(event){
               var id = this.getAttribute("id");
               (<HTMLInputElement>document.getElementById(id)).checked?datag(true,id):datag(false,id);
               let objvalue =(<HTMLInputElement>document.getElementById("input_percentage"));
               //Scipt to only allow no-numerical chacters
               objvalue.value = objvalue.value.replace(/[^\d.-]/g,'');
               (<HTMLInputElement>document.getElementById(id)).checked?updatePandS(objvalue.value,id,true):updatePandS(objvalue.value,id,false);
               
            });
            
          };

            this.acqService.getallNaics().subscribe(res =>{
            this.Naiscsall = res;
            console.log(this.Naiscsall);
            })
            
       document.getElementById("dl1").onchange = function(event){
        let element =(<HTMLInputElement>document.getElementById("dl1"))
        datag(element.value,"baAddress");
      };

      document.getElementById("aco1").onchange = function(event){
        let element =(<HTMLInputElement>document.getElementById("aco1"))
        datag(element.value,"aco1");
      };
        document.getElementById("cori1").onchange = function(event){
          let element =(<HTMLInputElement>document.getElementById("cori1"))
          datag(element.value,"cori1");
        };

      let datag =(update,section) =>{
        var data = {};
        data[section]=update;
        this.formsService.putFormData(this.formsid, data).subscribe((Response) => {
          if(Response) {
          } else {
            console.log(data);
            console.log('updated')
          }
        })
      
      }

     
  
     

 
      $("#exitnaics").click(function(){
        $(this).parent().hide()
      });

    

     
      
}

 datag =(update,section) =>{
  var data = {};
  data[section]=update;
  this.formsService.putFormData(this.formsid, data).subscribe((Response) => {
    if(Response) {
    } else {
      console.log(data);
      console.log('updated')
    }
  })

}

setvalues(pkId){
    this.acqService.getrequestedtUser(pkId).subscribe(res=>{
      
      this.email = res.email;
      this.officecode = res.officeCode;
      this.coAddress = res.address;
      this.coPhone = res.phone;
      this.coName= `${res.firstName}  ${res.middleName}  ${res.lastName}`

      var data = {
        coAddress: res.address,
        coEmail: res.email,
        coName: res.firstName + ' '+ res.lastName,
        coOfficecode:res.officeCode,
        coPhone:  res.phone,
        pointsofContact:[this.formData.pointsofContact[0],pkId]
      };
      this.formsService.putFormData(this.formsid, data).subscribe((Response) => {
      });
     this.acqService.putSolData(this.solId, data).subscribe(response => {

    });
    })
}




NAICSclick(event,p) {
  let input = $("#NAICS");
  var codesize = event.currentTarget.getAttribute("data-size");
  input.val(this.Naiscsall[p].naics_code +" " +this.Naiscsall[p].naics_title);
  input.attr("data-size",codesize);
  input.trigger('keyup');
  input.css({"width":"300px"});
  $("#curtian").animate({width:"0px"},500);
  $("#curtian").hide();

}


  editshow(event) {
    let element = event.currentTarget;
    $(element).hide("fadeout");
    this.hiddenobj = this.hiddenobj.concat(element.getAttribute("data-input-links").split(" "));
    this.hiddenobj.forEach(id =>{
      if( id.length != 0){
        let currelem = (<HTMLInputElement>document.getElementById(id));
        currelem.readOnly = false;
        currelem.disabled = false;
        this.show = true;
        currelem.style.background = "white";
        currelem.style.width = "300px";
        currelem.style.padding = "3px";
      }   
    });

    //Script to hide the initial Acquition types input field
    if(event.currentTarget.id == "acq_special"){
      $("#ov_edit").show("fade-in");
      let actypehide = ["acqu1","acqu2","acqu3"]
      actypehide.forEach((id)=>{
        document.getElementById(id).style.display = "none"
      })
    }
    console.log(this.hiddenobj);
  }


  edithide(event) {
    $(event.currentTarget).show("fadein")
    this.hiddenobj.forEach(id =>{
      if( id.length != 0){
        let currelem =document.getElementById(id);
        if(currelem.tagName){
        if(currelem.tagName == "INPUT"){
         let ncurrelem = (<HTMLInputElement>currelem);
          ncurrelem.readOnly = true;
          ncurrelem.disabled = true;
          ncurrelem.style.background = "transparent";
          ncurrelem.style.borderBottom = "none";
          ncurrelem.style.width = "100%";
          ncurrelem.style.padding = "0px";
          this.show = false;
        }else{
          let ncurrelem = (<HTMLTextAreaElement>currelem);
          ncurrelem.readOnly = true;
          ncurrelem.disabled = true;
          ncurrelem.style.background = "transparent";
          ncurrelem.style.borderBottom = "none";
          ncurrelem.style.padding = "0px";
          this.show = false;
        }
        }
        
      }    
    });
    $('.lineedit').each(function(){
      $(this).show('fadein')
    });

    $('.edit').each(function(){
      $(this).show('fadein')
    });
    $("#ov_edit").hide("fadeout");
    let actypehide = ["acqu1","acqu2","acqu3"]
      actypehide.forEach((id)=>{
        document.getElementById(id).style.display = "block"
     })
    this.hiddenobj = [];
  }

  nostatus() {
          console.log("formdata is converted to json:",this.testarray);
              this.formData = this.testarray;
              this.formData["viewed"] = "opened";
              this.solstatus = this.formData.status == 'Accepted'? 'Initiated':this.formData.status;
              this.requisitionNumber = this.formData.requisitionNumber;
              this.solicitationNumber = this.formData.solicitationNumber;
              this.baAddress = this.formData.baAddress;
              this.baEmail = this.formData.baEmail;
              this.baName = this.formData.baName;
              this.baPhone = this.formData.baPhone;
              this.rAddress = this.formData.rAddress;
              this.rEmail = this.formData.rEmail;
              this.rName = this.formData.rName;
              this.rPhone = this.formData.rPhone;
              this.coAddress = this.formData.coAddress;
              this.coEmail = this.formData.coEmail;
              this.coName = this.formData.coName;
              this.coPhone = this.formData.coPhone;        
              this.method_of_solicitation = this.formData.method_of_solicitation;
              this.setAside = this.formData.setAside;
              this.percentage = this.formData.percent;
              this.proposedAction = this.formData.proposedAction;
              this.Unrestricted = this.formData.unrestricted;
              this.NAICS = this.formData.naicscode;
              this.orderNumber = this.formData.orderNumber;
              this.projectTitle = this.formData.projectTitle;
             
              this.cori1=this.formData.coAddress;
              this.aco1=this.formData.coAddress;
              this.formData.aco1 = this.formData.coAddress;
              this.formData.cori1 = this.formData.coAddress;
              this.officecode = this.formData.coOfficecode
              this.formData['a27_yes']=false
              this.formData['a27_no']=false

              console.log('Patached Form JSON to FORM DATA',this.formsid,this.formData);
              
                this.formsService.putFormData(this.formsid,this.formData).subscribe(res =>{
                  console.log(res)
                },error =>{
                  console.error(error)
                }); 
              setTimeout(() => {
                this.validate_date(null);
              }, 500);
              
              
         
               
              
             
  }






  validate_date(t) {

    let amdate,evaldate
    console.log('start of validation')
    console.warn('BQ',this.qandaDate,this.enddate)

    if(this.qandaDate != '' && this.qandaDate!= undefined ){
      
      // if(this.qandaDate.toString.includes('GMT')){
      //         this.qandaDate= this.datepipe.transform(this.qandaDate,"yyyy-MM-ddThh:mm")
      // this.enddate = this.datepipe.transform(this.enddate,"yyyy-MM-ddThh:mm") 
      // }

      amdate = new Date(this.qandaDate)
      evaldate = new Date(this.enddate)

      this.validate= true;
      console.warn('Q',this.qandaDate)
      let dateerror = ()=>{
        
        if(this.enddate !='' &&this.enddate !=undefined ){
          this.enddate = '';
        console.log('date Error');
        this.toast.error('Invalid End Date')
        }else{
          this.enddate = '';
        }
        
        
        
      
      }

      let updatedate=()=>{
        if(t != null && t != ''){
          var data = {
            // offerDueDate:new Date(this.enddate),
            // qandaDate: new Date(this.qandaDate)
             offerDueDate:this.enddate,
            qandaDate: this.qandaDate

  
          };
         this.senddateData(data)
        }
      
      }
  
      amdate.getTime() < evaldate.getTime()?updatedate():dateerror();

      console.warn('**Validate**',this.validate)
    }
   
     }



      //Function to correct the system saving the day before the selected date.
     datecorrector(inputdate){
      let date = new Date(inputdate);
      let mili = date.getTime();
      let nextday = mili + 86400000*1;
      let nextdate = new Date(nextday)
      return nextdate;
     }

     
    

    senddateData(data){    
      console.log(this.solno,data);
      
      this.formsService.putFormData(this.formsid, data).subscribe((Response) => {
       if(Response) {
         console.log(Response);
       } else {
         console.log('updated')
       }
     },error =>{
       console.log(error)
     });
     var data2 = {
      proposalEvalDate: this.enddate,
      qandaDate: this.qandaDate
     }
     this.acqService.putSolData(this.solId, data2).subscribe(response => {
      console.log("Dates Updated")
    });
    }



    addrow(){
      console.log(this.item,this.schedule,this.quanity,this.unit,
        this.unitprice,this.amount)
      if(
      this.item == undefined ||
      this.schedule == undefined ||
      this.quanity == undefined||
      this.unit==undefined ||
      this.quanity == ''||
      this.unit=='' ||
      this.unitprice==undefined){
        this.toast.error('Please Complete All Fields','')
      }else{
        this.amount = this.quanity*this.unitprice.replace('$','');
      let data={
         
        "item":this.item,
        "schedule":this.schedule,
        "quanity":this.quanity,
        "unit":this.unit,
        "unitprice":this.unitprice,
        "amount":this.amount
      }
      this.itemsarray.push(data);

      let pushData ={
        "itemsTableData":this.itemsarray
      }
         
  
     
      this.formsService.putFormData(this.formsid, pushData).subscribe((Response) => {

      },error =>{
        console.log(error)
      });

        this.item ='';
        this.schedule ='',
        this.quanity ='',
        this.unit='',
        this.unitprice='',
        this.amount =''

      }
      

     

    }
    removerow(index) {
      this.itemsarray.splice(index, 1);
      let pushData ={
        "itemsTableData":this.itemsarray
      }
      this.formsService.putFormData(this.formsid, pushData).subscribe((Response) => {

      },error =>{
        console.log(error)
      });
    }

    
    onlynumbers(vare,val){
      eval( `this.${vare} = parseFloat(this.${val}.replace(/\D/g,''))`)
        
    }

    
     updateSocandPercent=async()=>{
     
      let length = this.formData;
      for(let key in length){
        let value = length[key]
        if (value == true && key !="is_commercial" && key !="Source"
        && key !="noncomoption1" && key !="noncomoption2"
        && key !="noncomoption3"
        && key !="noncomoption4"
        && key !="noncomoption5"
        && key !="noncomoption6"
        ){
          let map ={
            "eightA":"8a,",
            "EDWOSB":"EDWOSB,",
            "SDVOB":"Service-Disabled Veteran-Owned Small Business,",
            "hubzoneSB":"Hub Zone Small Business,",
            "smallBusiness":"Small Business,",
            "womenSB":"Women-Owned Small Business(WOSB) Eligible Under the Women-Owned Small Business Program,"
          }
          console.log("Key",key);

          if(this.btypeSelect.indexOf('undefined',0) != -1){
            this.btypeSelect += `${map[key]} `;
          }
          else{
            this.btypeSelect +=  `${map[key]} `;
          };
          (<HTMLInputElement>document.getElementById(key)).checked = document.getElementById(key)?true:false;
        }
        
      }
        this.percentage?document.getElementById("acqu3").setAttribute("value",this.percentage +"% "+ this.btypeSelect.substring(0, this.btypeSelect.length - 2)):'';
    }

    keyPress(evt: any) {
      console.log(evt)
      var iKeyCode = evt.which ? evt.which : evt.keyCode;
      if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57)) {
        this.toast.info("Only Numbers");
        return false;
      } else {
        return true;
      }
    }

    closeModal() {
      var x = document.getElementById("closeModalPmdashboard").click();
      return x;
    }

    createAmmendment() {
      var data = {
        status: 'Amendment'
      }
      

      this.acqService.patchSol(data, this.solId).subscribe(response=>{

      })



      this.acqService.createAmmendment(this.solno).subscribe(ammendmentResponse => {
        console.log(ammendmentResponse);

        // var data = {
        //   status: `Amendment_To_#${this.solno}`
        // }
        
  
        // this.acqService.patchSol(data, ammendmentResponse.solId).subscribe(response=>{
  
        // })
        this.toast.success('Amendment Created Successfully')
        setTimeout(() => {
          this.acqService.preview.next('Update Navigation');
        //  this.router.navigate(["home/sol/", this.solno, "sf30"]);
        }, 300);

        this.closeModal();  
      },
      error => {
        var data = {
          status: 'Published'
        }
        this.toast.error(error.message);
        //this.closeModal();
        //console.log(error);
        this.acqService.patchSol(data, this.solId).subscribe(response=>{})
      })
    }
    
}
