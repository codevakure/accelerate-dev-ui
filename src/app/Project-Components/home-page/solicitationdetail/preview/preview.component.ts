import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  HostListener,
} from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormsService } from "../../../../Services/forms.service";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import * as $ from "jquery";
import { throwError, from } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { AcquisitionService } from "../../../../Services/acquisition.service";
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import { analyzeAndValidateNgModules } from "@angular/compiler";
import * as jsPDF from "jspdf";
import { callbackify } from "util";
import { FormdetailComponent } from "../formdetail/formdetail.component";
import { ClausesService } from "../../../../Services/clauses.service";
import { SectionsService } from "../../../../Services/sections.service";
import { NgHeaderTemplateDirective } from "@ng-select/ng-select/ng-select/ng-templates.directive";
import { environment } from "../../../../../environments/environment";

import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";

@Component({
  selector: "app-preview",
  templateUrl: "./preview.component.html",
  styleUrls: ["./preview.component.css"],
})
export class PreviewComponent implements OnInit {
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
  date = "";
  DOMAIN_URL = environment.UNITED_ENV;
  allsoldata;
  coAddress;
  solnum;
  solid;
  StartDate;
  usercommentsname;
  requisitionNumber;
  solicitationNumber;
  orderNumber;
  contractNumber;
  UNr;
  percent;
  RFQ;
  IFB;
  RFP;
  DueDate = undefined;
  bType;
  Name;
  Phone;
  soldata;
  htmldata = [];
  status;
  
  solno;
  formid;
  getapno;
  attachmentsdata;
  type = "Attachments";
  naicscode;
  hideclausepreview = false;
  boo:boolean;
  officeCode;
  myDataArray = [];
  allclauses;
  username;

  finilizeclausearray = {};
  allsectionclauses = [];

  columnsToDisplay = [
    "item",
    "schedule",
    "quanity",
    "unit",
    "unitprice",
    "amount",
  ];

  specialclauses = ["52.212-3", "52.212-5", "52.212-2"];

  constructor(
    private route: ActivatedRoute,
    private httpClient: Http,
    private formservice: FormsService,
    private acqservice: AcquisitionService,
    private datepipe: DatePipe,
    private toastr: ToastrService,
    private router: Router,
    private clauses: ClausesService,
    private sec: SectionsService
  ) {}

  ngOnInit() {
    var imgsrc = "assets/SF1449image.jpg";
    $("#image").attr("src", imgsrc);
    this.solno = this.route.snapshot.parent.params.sid;
    console.log(this.solno);
    //Script to load the Solication Section HTML Data

    this.getfullsol();
  }

  getfullsol() {
    let pathname = window.location;
    this.solnum = pathname.toString().split("sol/")[1].split("/")[0];
    this.acqservice.getsoldappids(this.solnum).subscribe((response) => {
      this.getapno = response.ap_no;
      console.log("soldapp id's", response);


      this.formservice.getFormData(response.formId).subscribe(response => {
        
        this.soldata = response;
        this.formid = this.soldata.id;
        this.requisitionNumber = this.soldata.requisitionNumber;
        this.solicitationNumber = this.soldata.sol_no;
        console.warn('Response from Form Service',response)
        //To Extract Time for Preview
        this.soldata.offerDueTime = new Date(
          "1970-01-01T" + this.soldata.offerDueTime + "Z"
        );
      });
    });

    this.acqservice.getfullsol(this.solnum).subscribe((res) => {
      this.createform(res)
    
    });





    // });

    //Script to reformat the docuement text

    let spans = document.getElementById("pdfadd").querySelectorAll("span, div");
    spans.forEach((span) => {
      (<HTMLElement>span).style.fontSize = "12px";
    });
    let headers = document
      .getElementById("pdfadd")
      .querySelectorAll("h1,h2,h3,h4,h5,h6");
    console.log(headers);
    headers.forEach((header) => {
      (<HTMLHeadElement>header).style.fontSize = "13px";
      (<HTMLHeadElement>header).style.fontWeight = "bold";
    });

    console.log("add clasues to dispcription array", this.finilizeclausearray);
  }

  createform(res){
    console.log("full SOL Respond", res);
    this.allsoldata = res;

    for (var key in res.CONTRACT_CLAUSE.clause) {
      for (let key2 in res.CONTRACT_CLAUSE.clause[key]) {
        if (key2 != "others" && key != "addedclauses") {
          res.CONTRACT_CLAUSE.clause[key][key2].forEach((clause) => {
            this.allsectionclauses.push(clause.id);
          });
        }
      }
    }

    console.log("FORMS SOLICIATION DATA", this.soldata);
    //Script to remove the Publish feature if status is exported.
    this.status = this.allsoldata.SOL.status;
    this.solid = this.allsoldata.SOL.id;
    
    
    this.boo = this.allsoldata.FORM.status == "Published" ? true : false;
    console.log("status on initiation", this.status);
    console.log("boo value =", this.boo );
 

    //Script to User profile ID

    this.acqservice.getUserprofile().subscribe((response) => {
      this.username = response.pkId;
      var fullName = response.email.split("@")[0].split(".");
      var firstName =
        fullName[0].charAt(0).toUpperCase() + fullName[0].slice(1);
      var lastName =
        fullName[fullName.length - 1].charAt(0).toUpperCase() +
        fullName[fullName.length - 1].slice(1);
      if (response.firstName == "Not") {
        this.usercommentsname = firstName;
      } else {
        this.usercommentsname = response.firstName;
      }
    });
    
    

   

    this.myDataArray = res.FORM.itemsTableData?res.FORM.itemsTableData:[];
    console.log('datatable',this.myDataArray)
    let formkeys = Object.keys(this.SF1449.value);
    for(let key in this.allsoldata.FORM){
     
       if(formkeys.includes(key)){
       if(key == 'naicscode'){
         this.SF1449.get(key).setValue(this.allsoldata.FORM[key].substring(0,6))
       }else{
         this.SF1449.get(key).setValue(this.allsoldata.FORM[key])
       }

       if(key =="awarddate"){
         let date = this.datepipe.transform(this.allsoldata.FORM[key],'M/d/yy h:mm a ')
         this.SF1449.get(key).setValue(date.toString())
       }

     }
   }
   
   this.SF1449.get('startdate').setValue(this.allsoldata.FORM.startdate)
   this.SF1449.get('sol_no').setValue(this.allsoldata.FORM.sol_no)
   this.SF1449.get('qandaDate').setValue(this.datepipe.transform(res.FORM.qandaDate,'M/d/yy h:mm a '));
   this.SF1449.get('requisitionNumber').setValue(res.FORM.requisitionNumber);
    //function required to add clauses
    let printview = document.getElementById("pdfadd");

    let clausefunction = (clasuesarray, name) => {
      let keyids = [];
      let table = document.createElement("table");
      let div = document.createElement("div");
      let headerdiv = document.createElement("div");
      headerdiv.innerHTML = `<br><br><div style="font-size: 12px; font-family:Arial;">CLAUSES INCORPORATED BY FULL TEXT</div><br> `;
      let clausecount = 0;
      let clausecountibr = 0;
      //Set the Section Div in the preview before any clauses are loaded.
      div.setAttribute("id", name);
      console.log("look for dive with", div, name);
      printview.appendChild(div);

      clasuesarray.forEach((json) => {
        for (key in json) {
          //Script to exlcude clauses in the other and addedclauses section
          if (key != "others" && key != "addedclauses") {
            json[key].forEach(async (json, index) => {
              if (json == null) {
              } else {
                //Exclude clause with P/C values of P
                if (key == "required") {
                  json.rao = "R";
                }
                if (key == "applicable") {
                  json.rao = "A";
                }
                if (key == "optional") {
                  json.rao = "O";
                }
                let date = json.clause_date;
                // console.log(json,this.specialclauses.includes(json.id))

                clausecount = clausecount + 1;
                let validate =
                  this.specialclauses.includes(json.id) == true
                    ? true
                    : false;

                let caluseNo = json.id;
                let title = json.title.toUpperCase();

                if (json.rao == "A" || json.rao == "R" || json.rao == "O") {
                  if (
                    (caluseNo == "52.212-5" ||
                      caluseNo == "52.212-2" ||
                      caluseNo == "52.212-3") &&
                    json.alt == 0
                  ) {
                    let div2 = document.createElement("div");
                    div.setAttribute("id", `${caluseNo}`);
                    div.innerHTML +=
                      `<br><br><div>${caluseNo}` +
                      "    " +
                      `${title} (${date})</div><br><br><div id="${caluseNo}${name}${json.alt}">(Begin Clause)<br><br></div>`;
                    div.appendChild(div2);
                    // console.log("parse clause id", caluseNo);
                    //check to see if clause var1 and var2 exist for clause 52.212-2
                    if (
                      typeof json.var1 != "undefined" &&
                      json.var1 != null &&
                      json.alt == 0
                    ) {
                      // console.log(
                      //   "*******Found Var1 and Var2",
                      //   json.var1,
                      //   json.var2,
                      //   json.rao
                      // );

                      if (json.id == "52.212-2") {
                        let divy = `
                            <div>
                            <span><br><br></span><span>(a)
                                          The Government will award a contract resulting from this solicitation to the responsible offeror whose
                                          offer
                                          conforming to the solicitation will be most advantageous to the Government, price and other factors
                                          considered.
                                          The following factors shall be used to evaluate offers:</span>
                                        <br><br>
                                        <span style="text-decoration: underline;">${
                                          json.var1
                                        }</span>
                            
                                        <br><br>
                                        <span>[Contracting
                                          Officer shall insert the significant evaluation factors, such as<br>(i) technical capability of the item
                                          offered
                                          to meet the Government requirement;<br>(ii) price;<br>(iii) past performance (see FAR
                                          15.304);<br><br></span><span>Technical
                                          and past performance, when combined, are&nbsp;
                                          
                                          <span style="text-decoration: underline;">${
                                            json.var2
                                          }</span>
                            
                                          <br> [Contracting Officer state, in accordance with FAR
                                          15.304,
                                          the relative importance of all other evaluation factors, when combined, when compared to
                                          price.]<br><br>(b) It
                                          is [${
                                            json.box1 == undefined
                                              ? " "
                                              : json.box1
                                          }] is not [${
                          json.box2 == undefined ? " " : json.box2
                        }] government evaluation. The Government will evaluate offers for
                                          award
                                          purposes by adding the total price for all options to the total price for the basic requirement. The
                                          Government
                                          may determine that an offer is unacceptable if the option prices are significantly unbalanced. Evaluation
                                          of
                                          options shall not obligate the Government to exercise the option(s).<br><br>(c) A written notice of award
                                          or
                                          acceptance of an offer, mailed or otherwise furnished to the successful offer or within the time for
                                          acceptance
                                          specified in the offer, shall result in a binding contract without further action by either party. Before
                                          the
                                          offer's specified expiration time, the Government may accept an offer (or part of an offer), whether or
                                          not
                                          there are negotiations after its receipt, unless a written notice of withdrawal is received before
                                          award.<br><br></span></div>
                                          
                                          <p>(End of clause)</p>`;

                        this.clauses
                          .getClauseDesc(caluseNo, json.alt)
                          .subscribe((element) => {
                            // show special clause if filled out variables have been filled out
                            if (
                              (typeof json.var1 != "undefined" &&
                                json.var1 != null &&
                                json.var1 != "") ||
                              (typeof json.var2 != "undefined" &&
                                json.var2 != null &&
                                json.var2 != "") ||
                              (typeof json.box1 != "undefined" &&
                                json.box1 != null &&
                                json.box1 != "") ||
                              (typeof json.box2 != "undefined" &&
                                json.box2 != null &&
                                json.box2 != "")
                            ) {
                              let id = `${caluseNo}${index}${name}`;
                              keyids.push(id);
                              document.getElementById(
                                caluseNo + name + element.alt
                              ).innerHTML += divy;
                              this.finilizeclausearray[name] +=
                                div.outerHTML + divy;
                            } else {
                              document.getElementById(
                                caluseNo + name + element.alt
                              ).innerHTML += element.description_html;
                              this.finilizeclausearray[name] +=
                                div.outerHTML + element.description_html;
                            }
                          });
                      }
                    }

                    //****Logic for if Clause = 52.212-5 and is required or Applicable. */
                    else if (json.id == "52.212-5" && json.alt == 0) {
                      json.description_html = `
                   
           <p>As prescribed in <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/Subpart%2012_3.html#wp1084399">12.301</a>(b)(4),
             insert the following clause:</p>
           <p>Contract Terms and Conditions Required To Implement Statutes or Executive Orders&mdash;Commercial Items
             (Aug 2018)</p>
           <p>(a) The Contractor shall comply with the following Federal Acquisition Regulation (FAR) clauses, which
             are incorporated in this contract by reference, to implement provisions of law or Executive orders
             applicable to acquisitions of commercial items:</p>
           <p>(1) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_200_206.html#wp1158787">52.203-19</a>,
             Prohibition on Requiring Certain Internal Confidentiality Agreements or Statements (Jan 2017) (section 743
             of Division E, Title VII, of the Consolidated and Further Continuing Appropriations Act, 2015 (Pub. L.
             113-235) and its successor provisions in subsequent appropriations acts (and as extended in continuing
             resolutions)).</p>
           <p>(2) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_200_206.html#wp1159972">52.204-23</a>,
             Prohibition on Contracting for Hardware, Software, and Services Developed or Provided by Kaspersky Lab and
             Other Covered Entities (Jul 2018) (Section 1634 of Pub. L. 115-91).</p>
           <p>(3) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_207_211.html#wp1146366">52.209-10</a>,
             Prohibition on Contracting with Inverted Domestic Corporations (Nov 2015).</p>
           <p>(4) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_233_240.html#wp1113329">52.233-3</a>,
             Protest After Award (Aug 1996) (<a
               href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t29t32+1665+30++%2831%29%20%20AND%20%28%2831%29%20ADJ%20USC%29%3ACITE%20%20%20%20%20%20%20%20%20">31
               U.S.C. 3553</a>).</p>
           <p>(5) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_233_240.html#wp1113344">52.233-4</a>,
             Applicable Law for Breach of Contract Claim (Oct 2004)(Public Laws 108-77 and 108-78 (<a
               href="http://uscode.house.gov/">19 U.S.C. 3805 note</a>)).</p>
           <p>(b) The Contractor shall comply with the FAR clauses in this paragraph (b) that the Contracting Officer
             has indicated as being incorporated in this contract by reference to implement provisions of law or
             Executive orders applicable to acquisitions of commercial items:</p>
           <p>[<em>Contracting Officer check as appropriate</em>.]</p>
           <p>_${this.checkclauses("52.203-6")}_ (1) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_200_206.html#wp1137622">52.203-6</a>,
             Restrictions on Subcontractor Sales to the Government (Sept 2006), with Alternate I (Oct 1995) (<a
               href="http://uscode.house.gov/">41 U.S.C. 4704</a> and <a href="http://uscode.house.gov/">10 U.S.C.
               2402</a>).</p>
           <p>_${this.checkclauses("52.203-13")}_ (2) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_200_206.html#wp1141983">52.203-13</a>,
             Contractor Code of Business Ethics and Conduct (Oct 2015) (<a href="http://uscode.house.gov/">41 U.S.C.
               3509</a>)).</p>
           <p>__${this.checkclauses("52.203-15")}__ (3) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_200_206.html#wp1144881">52.203-15</a>,
             Whistleblower Protections under the American Recovery and Reinvestment Act of 2009 (June 2010) (Section
             1553 of Pub. L. 111-5). (Applies to contracts funded by the American Recovery and Reinvestment Act of
             2009.)</p>
           <p>__${this.checkclauses("52.204-10")}__ (4) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_200_206.html#wp1141649">52.204-10</a>,
             Reporting Executive Compensation and First-Tier Subcontract Awards (Oct 2016) (Pub. L. 109-282) (<a
               href="http://uscode.house.gov/">31 U.S.C. 6101 note</a>).</p>
           <p>____ (5) [Reserved].</p>
           <p>__${this.checkclauses("52.204-14")}__ (6) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_200_206.html#wp1151163">52.204-14</a>,
             Service Contract Reporting Requirements (Oct 2016) (Pub. L. 111-117, section 743 of Div. C).</p>
           <p>__${this.checkclauses("52.204-15")}__ (7) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_200_206.html#wp1151299">52.204-15</a>,
             Service Contract Reporting Requirements for Indefinite-Delivery Contracts (Oct 2016) (Pub. L. 111-117,
             section 743 of Div. C).</p>
           <p>__${this.checkclauses("52.209-6")}__ (8) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_207_211.html#wp1140926">52.209-6</a>,
             Protecting the Government&rsquo;s Interest When Subcontracting with Contractors Debarred, Suspended, or
             Proposed for Debarment. (Oct 2015) (31 U.S.C. 6101 note).</p>
           <p>__${this.checkclauses("52.209-9")}__ (9) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_207_211.html#wp1145644">52.209-9</a>,
             Updates of Publicly Available Information Regarding Responsibility Matters (Jul 2013) (41 U.S.C. 2313).
           </p>
           <p>____ (10) [Reserved].</p>
           <p>__${this.checkclauses("52.219-3")}__ (11)(i) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_217_221.html#wp1135955">52.219-3</a>,
             Notice of HUBZone Set-Aside or Sole-Source Award (Nov 2011) (<a
               href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t13t16+492+90++%2815%29%20%20AND%20%28%2815%29%20ADJ%20USC%29%3ACITE%20%20%20%20%20%20%20%20%20">15
               U.S.C. 657a</a>).</p>
           <p>__${this.checkclauses(
             "52.219-3"
           )}__ (ii) Alternate I (Nov 2011) of <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_217_221.html#wp1135955">52.219-3</a>.
           </p>
           <p>__${this.checkclauses("52.219-4")}__ (12)(i) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_217_221.html#wp1135970">52.219-4</a>,
             Notice of Price Evaluation Preference for HUBZone Small Business Concerns (Oct 2014) (if the offeror
             elects to waive the preference, it shall so indicate in its offer) (<a
               href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t13t16+492+90++%2815%29%20%20AND%20%28%2815%29%20ADJ%20USC%29%3ACITE%20%20%20%20%20%20%20%20%20">15
               U.S.C. 657a</a>).</p>
           <p>__${this.checkclauses(
             "52.219-4"
           )}__ (ii) Alternate I (Jan 2011) of <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_217_221.html#wp1135970">52.219-4</a>.
           </p>
           <p>____ (13) [Reserved]</p>
           <p>__${this.checkclauses("52.219-6")}__ (14)(i) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_217_221.html#wp1136004">52.219-6</a>,
             Notice of Total Small Business Set-Aside (Nov 2011) (<a
               href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t13t16+492+90++%2815%29%20%20AND%20%28%2815%29%20ADJ%20USC%29%3ACITE%20%20%20%20%20%20%20%20%20">15
               U.S.C. 644</a>).</p>
           <p>__${this.checkclauses(
             "52.203-6"
           )}__ (ii) Alternate I (Nov 2011).</p>
           <p>__${this.checkclauses(
             "52.203-6"
           )}__ (iii) Alternate II (Nov 2011).</p>


           <p>__${this.checkclauses("52.219-7")}__ (15)(i) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_217_221.html#wp1136017">52.219-7</a>,
             Notice of Partial Small Business Set-Aside (June 2003) (<a
               href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t13t16+492+90++%2815%29%20%20AND%20%28%2815%29%20ADJ%20USC%29%3ACITE%20%20%20%20%20%20%20%20%20">15
               U.S.C. 644</a>).</p>


           <p>__${this.checkclauses(
             "52.219-7"
           )}__ (ii) Alternate I (Oct 1995) of <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_217_221.html#wp1136017">52.219-7</a>.
           </p>
           <p>__${this.checkclauses(
             "52.219-7"
           )}__ (iii) Alternate II (Mar 2004) of <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_217_221.html#wp1136017">52.219-7</a>.
           </p>


           <p>__${this.checkclauses("52.219-8")}__ (16) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_217_221.html#wp1136032">52.219-8</a>,
             Utilization of Small Business Concerns (Nov 2016) (<a
               href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t13t16+492+90++%2815%29%20%20AND%20%28%2815%29%20ADJ%20USC%29%3ACITE%20%20%20%20%20%20%20%20%20">15
               U.S.C. 637(d)(2)</a> and (3)).</p>


           <p>__${this.checkclauses("52.219-9")}__ (17)(i) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_217_221.html#wp1136058">52.219-9</a>,
             Small Business Subcontracting Plan (Aug 2018) (<a
               href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t13t16+492+90++%2815%29%20%20AND%20%28%2815%29%20ADJ%20USC%29%3ACITE%20%20%20%20%20%20%20%20%20">15
               U.S.C. 637(d)(4)</a>).</p>
           <p>__${this.checkclauses(
             "52.219-9"
           )}__ (ii) Alternate I (Nov 2016) of <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_217_221.html#wp1136058">52.219-9</a>.
           </p>
           <p>__${this.checkclauses(
             "52.219-9"
           )}__ (iii) Alternate II (Nov 2016) of <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_217_221.html#wp1136058">52.219-9</a>.
           </p>
           <p>__${this.checkclauses(
             "52.219-9"
           )}__ (iv) Alternate III (Nov 2016) of <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_217_221.html#wp1136058">52.219-9</a>.
           </p>
           <p>__${this.checkclauses(
             "52.219-9"
           )}__ (v) Alternate IV (Aug 2018) of <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_217_221.html#wp1136058">52.219-9</a>.
           </p>
           <p>__${this.checkclauses("52.219-13")}__ (18) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_217_221.html#wp1136174">52.219-13</a>,
             Notice of Set-Aside of Orders (Nov 2011) (<a href="http://uscode.house.gov">15 U.S.C. 644(r)</a>).</p>
           <p>__${this.checkclauses("52.219-14")}__ (19) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_217_221.html#wp1136175">52.219-14</a>,
             Limitations on Subcontracting (Jan 2017) (<a
               href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t13t16+492+90++%2815%29%20%20AND%20%28%2815%29%20ADJ%20USC%29%3ACITE%20%20%20%20%20%20%20%20%20">15
               U.S.C. 637(a)(14)</a>).</p>
           <p>__${this.checkclauses("52.219-16")}__ (20) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_217_221.html#wp1136186">52.219-16</a>,
             Liquidated Damages&mdash;Subcon-tracting Plan (Jan 1999) (<a
               href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t13t16+492+90++%2815%29%20%20AND%20%28%2815%29%20ADJ%20USC%29%3ACITE%20%20%20%20%20%20%20%20%20">15
               U.S.C. 637(d)(4)(F)(i)</a>).</p>
           <p>__${this.checkclauses("52.219-27")}__ (21) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_217_221.html#wp1136387">52.219-27</a>,
             Notice of Service-Disabled Veteran-Owned Small Business Set-Aside (Nov 2011) (<a
               href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t13t16+492+90++%2815%29%20%20AND%20%28%2815%29%20ADJ%20USC%29%3ACITE%20%20%20%20%20%20%20%20%20">15
               U.S.C. 657 f</a>).</p>
           <p>__${this.checkclauses("52.219-28")}__ (22) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_217_221.html#wp1139913">52.219-28</a>,
             Post Award Small Business Program Rerepresentation (Jul 2013) (<a
               href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t13t16+492+90++%2815%29%20%20AND%20%28%2815%29%20ADJ%20USC%29%3ACITE%20%20%20%20%20%20%20%20%20">15
               U.S.C. 632(a)(2)</a>).</p>
           <p>__${this.checkclauses("52.219-29")}__ (23) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_217_221.html#wp1144950">52.219-29</a>,
             Notice of Set-Aside for, or Sole Source Award to, Economically Disadvantaged Women-Owned Small Business
             Concerns (Dec 2015) (<a href="http://uscode.house.gov">15 U.S.C. 637(m)</a>).</p>
           <p>__${this.checkclauses("52.219-30")}__ (24) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_217_221.html#wp1144420">52.219-30</a>,
             Notice of Set-Aside for, or Sole Source Award to, Women-Owned Small Business Concerns Eligible Under the
             Women-Owned Small Business Program (Dec 2015) (<a href="http://uscode.house.gov">15 U.S.C. 637(m)</a>).
           </p>
           <p>__${this.checkclauses("52.222-3")}__ (25) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1147479">52.222-3</a>,
             Convict Labor (June 2003) (E.O. 11755).</p>
           <p>__${this.checkclauses("52.222-19")}__ (26) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1147630">52.222-19</a>,
             Child Labor&mdash;Cooperation with Authorities and Remedies (Jan 2018) (E.O. 13126).</p>
           <p>__${this.checkclauses("52.222-21")}__ (27) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1147656">52.222-21</a>,
             Prohibition of Segregated Facilities (Apr 2015).</p>


           <p>(28)(i) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1147711">52.222-26</a>,
             Equal Opportunity (Sept 2016) (E.O. 11246).</p>
           <p>(ii) Alternate I (Feb 1999) of <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1147711">52.222-26</a>.
           </p>
           <p>(29)(i) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1158632">52.222-35</a>,
             Equal Opportunity for Veterans (Oct 2015)(<a
               href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t37t40+200+2++%2838%29%20%20AND%20%28%2838%29%20ADJ%20USC%29%3ACITE%20%20%20%20%20%20%20%20%20">38
               U.S.C. 4212</a>).</p>
           <p>(ii) Alternate I (July 2014) of <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1158632">52.222-35</a>.
           </p>
           <p>(30)(i) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1162802">52.222-36</a>,
             Equal Opportunity for Workers with Disabilities (July 2014) (<a
               href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t29t32+2+78++%2829%29%20%20AND%20%28%2829%29%20ADJ%20USC%29%3ACITE%20%20%20%20%20%20%20%20%20">29
               U.S.C. 793</a>).</p>
           <p>(ii) Alternate I (July 2014) of <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1162802">52.222-36</a>.
           </p>


           <p>__${this.checkclauses("52.222-37")}__ (31) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1148123">52.222-37</a>,
             Employment Reports on Veterans (Feb 2016) (38 U.S.C. 4212).</p>
           <p>__${this.checkclauses("52.222-40")}__ (32) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1160019">52.222-40</a>,
             Notification of Employee Rights Under the National Labor Relations Act (Dec 2010) (E.O. 13496).</p>
           <p>__${this.checkclauses("52.222-50")}__ (33)(i) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1151848">52.222-50</a>,
             Combating Trafficking in Persons (Mar 2015) (<a href="http://uscode.house.gov/">22 U.S.C. chapter 78</a>
             and E.O. 13627).</p>
           <p>__${this.checkclauses(
             "52.222-50"
           )}__ (ii) Alternate I (Mar 2015) of <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1151848">52.222-50</a>
             (<a href="http://uscode.house.gov/">22 U.S.C. chapter 78</a> and E.O. 13627).</p>
           <p>__${this.checkclauses("52.222-54")}__ (34) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1156645">52.222-54</a>,
             Employment Eligibility Verification (Oct 2015). (Executive Order 12989). (Not applicable to the
             acquisition of commercially available off-the-shelf items or certain other types of commercial items as
             prescribed in <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/Subpart%2022_18.html#wp1089948">22.1803</a>.)
           </p>
           <p>__${this.checkclauses("52.223-9")}__ (35)(i) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1168892">52.223-9</a>,
             Estimate of Percentage of Recovered Material Content for EPA&ndash;Designated Items (May 2008) (<a
               href="http://uscode.house.gov/">42 U.S.C. 6962(c)(3)(A)(ii)</a>). (Not applicable to the acquisition of
             commercially available off-the-shelf items.)</p>
           <p>__${this.checkclauses(
             "52.223-9"
           )}__ (ii) Alternate I (May 2008) of <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1168892">52.223-9</a>
             (<a
               href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t41t42+250+1286++%2842%29%20%20AND%20%28%2842%29%20ADJ%20USC%29%3ACITE%20%20%20%20%20%20%20%20%20">42
               U.S.C. 6962(i)(2)(C)</a>). (Not applicable to the acquisition of commercially available off-the-shelf
             items.)</p>
           <p>__${this.checkclauses("52.223-11")}__ (36) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1168917">52.223-11</a>,
             Ozone-Depleting Substances and High Global Warming Potential Hydrofluorocarbons (Jun 2016) (E.O. 13693).
           </p>
           <p>__${this.checkclauses("52.223-12")}__ (37) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1168928">52.223-12</a>,
             Maintenance, Service, Repair, or Disposal of Refrigeration Equipment and Air Conditioners (Jun 2016) (E.O.
             13693).</p>
           <p>__${this.checkclauses("52.223-13")}__ (38)(i) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1168933">52.223-13</a>,
             Acquisition of EPEAT&reg;-Registered Imaging Equipment (Jun 2014) (E.O.s 13423 and 13514).</p>
           <p>__${this.checkclauses(
             "52.223-13"
           )}__ (ii) Alternate I (Oct 2015) of <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1168933">52.223-13</a>.
           </p>
           <p>__${this.checkclauses("52.223-14")}__ (39)(i) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1194330">52.223-14</a>,
             Acquisition of EPEAT&reg;-Registered Televisions (Jun 2014) (E.O.s 13423 and 13514).</p>
           <p>__${this.checkclauses(
             "52.203-6"
           )}__ (ii) Alternate I (Jun 2014) of <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1194330">52.223-14</a>.
           </p>
           <p>__${this.checkclauses("52.223-15")}__ (40) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1194323">52.223-15</a>,
             Energy Efficiency in Energy-Consuming Products (Dec 2007) (<a href="http://uscode.house.gov/">42 U.S.C.
               8259b</a>).</p>
           <p>__${this.checkclauses("52.223-16")}__ (41)(i) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1179078">52.223-16</a>,
             Acquisition of EPEAT&reg;-Registered Personal Computer Products (Oct 2015) (E.O.s 13423 and 13514).</p>
           <p>__${this.checkclauses(
             "52.223-16"
           )}__ (ii) Alternate I (Jun 2014) of <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1179078">52.223-16</a>.
           </p>
           <p>__${this.checkclauses("52.223-18")}__ (42) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1188603">52.223-18</a>,
             Encouraging Contractor Policies to Ban Text Messaging While Driving (Aug 2011) (E.O. 13513).</p>
           <p>__${this.checkclauses("52.223-20")}__ (43) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1189174">52.223-20</a>,
             Aerosols (Jun 2016) (E.O. 13693).</p>
           <p>__${this.checkclauses("52.223-21")}__ (44) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1197699">52.223-21</a>,
             Foams (Jun 2016) (E.O. 13693).</p>
           <p>__${this.checkclauses("52.224-3")}__ (45)(i) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1192898">52.224-3</a>,
             Privacy Training (JAN 2017) (5 U.S.C. 552a).</p>
           <p>__ (ii) Alternate I (JAN 2017) of 52.224-3.</p>
           <p>__ (46) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1192900">52.225-1</a>,
             Buy American&mdash;Supplies (May 2014) (<a href="http://uscode.house.gov/">41 U.S.C. chapter 83</a>).</p>
           <p>__${this.checkclauses("52.225-3")}__ (47)(i) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1169038">52.225-3</a>,
             Buy American&mdash;Free Trade Agreements&mdash;Israeli Trade Act (May 2014) (<a
               href="http://uscode.house.gov/">41 U.S.C. chapter 83</a>, <a
               href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t17t20+1727+50++%2819%29%20%20AND%20%28%2819%29%20ADJ%20USC%29%3ACITE%20%20%20%20%20%20%20%20%20">19
               U.S.C. 3301</a> note, <a
               href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t17t20+1727+50++%2819%29%20%20AND%20%28%2819%29%20ADJ%20USC%29%3ACITE%20%20%20%20%20%20%20%20%20">19
               U.S.C. 2112</a> note, <a href="http://uscode.house.gov">19 U.S.C. 3805</a> note, <a
               href="http://uscode.house.gov">19 U.S.C. 4001</a> note, Pub. L. 103-182, 108-77, 108-78, 108-286,
             108-302, 109-53, 109-169, 109-283, 110-138, 112-41, 112-42, and 112-43.</p>
           <p>__ (ii) Alternate I (May 2014) of <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1169038">52.225-3</a>.
           </p>
           <p>__ (iii) Alternate II (May 2014) of <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1169038">52.225-3</a>.
           </p>
           <p>__ (iv) Alternate III (May 2014) of <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1169038">52.225-3</a>.
           </p>
           <p>__${this.checkclauses("52.225-5")}__ (48) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1169151">52.225-5</a>,
             Trade Agreements (Aug 2018) (<a
               href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t17t20+1727+50++%2819%29%20%20AND%20%28%2819%29%20ADJ%20USC%29%3ACITE%20%20%20%20%20%20%20%20%20">19
               U.S.C. 2501</a>, <em>et seq</em>., <a
               href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t17t20+1727+50++%2819%29%20%20AND%20%28%2819%29%20ADJ%20USC%29%3ACITE%20%20%20%20%20%20%20%20%20">19
               U.S.C. 3301</a> note).</p>
           <p>__${this.checkclauses("52.225-13")}__ (49) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1169608">52.225-13</a>,
             Restrictions on Certain Foreign Purchases (June 2008) (E.O.&rsquo;s, proclamations, and statutes
             administered by the Office of Foreign Assets Control of the Department of the Treasury).</p>
           <p>__${this.checkclauses("52.225-26")}__ (50) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1192524">52.225-26</a>,
             Contractors Performing Private Security Functions Outside the United States (Oct 2016) (Section 862, as
             amended, of the National Defense Authorization Act for Fiscal Year 2008;<a
               href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t09t12+1445+65++%2810%20U.S.C.%202302%20Note%29%20%20%20%20%20%20%20%20%20%20">
               10 U.S.C. 2302 Note)</a>.</p>
           <p>__${this.checkclauses("52.226-4")}__ (51) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1173773">52.226-4</a>,
             Notice of Disaster or Emergency Area Set-Aside (Nov 2007) (<a
               href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t41t42+250+1286++%2842%29%20%20AND%20%28%2842%29%20ADJ%20USC%29%3ACITE%20%20%20%20%20%20%20%20%20">42
               U.S.C. 5150</a>).</p>
           <p>__${this.checkclauses("52.226-5")}__ (52) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1173393">52.226-5</a>,
             Restrictions on Subcontracting Outside Disaster or Emergency Area (Nov 2007) (<a
               href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t41t42+250+1286++%2842%29%20%20AND%20%28%2842%29%20ADJ%20USC%29%3ACITE%20%20%20%20%20%20%20%20%20">42
               U.S.C. 5150</a>).</p>
           <p>__${this.checkclauses("52.232-29")}__ (53) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_232.html#wp1153230">52.232-29</a>,
             Terms for Financing of Purchases of Commercial Items (Feb 2002) (<a href="http://uscode.house.gov/">41
               U.S.C. 4505</a>, <a href="http://uscode.house.gov/">10 U.S.C. 2307(f)</a>).</p>
           <p>__${this.checkclauses("52.232-30")}__ (54) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_232.html#wp1153252">52.232-30</a>,
             Installment Payments for Commercial Items (Jan 2017) (<a href="http://uscode.house.gov/">41 U.S.C.
               4505</a>, <a href="http://uscode.house.gov/">10 U.S.C. 2307(f)</a>).</p>
           <p>__${this.checkclauses("52.232-33")}__ (55) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_232.html#wp1153351">52.232-33</a>,
             Payment by Electronic Funds Transfer&mdash;System for Award Management (Jul 2013) (<a
               href="http://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title31-section3332&amp;num=0&amp;edition=prelim">31
               U.S.C. 3332</a>).</p>
           <p>__${this.checkclauses("52.232-34")}__ (56) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_232.html#wp1153375">52.232-34</a>,
             Payment by Electronic Funds Transfer&mdash;Other than System for Award Management (Jul 2013) (<a
               href="http://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title31-section3332&amp;num=0&amp;edition=prelim">31
               U.S.C. 3332</a>).</p>
           <p>__${this.checkclauses("52.232-36")}__ (57) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_232.html#wp1153445">52.232-36</a>,
             Payment by Third Party (May 2014) (<a
               href="http://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title31-section3332&amp;num=0&amp;edition=prelim">31
               U.S.C. 3332</a>).</p>
           <p>__${this.checkclauses("52.239-1")}__ (58) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_233_240.html#wp1113650">52.239-1</a>,
             Privacy or Security Safeguards (Aug 1996) (<a
               href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t05t08+2+3++%285%29%20%20AND">5
               U.S.C. 552a</a>).</p>
           <p>__${this.checkclauses("52.242-5")}__ (59) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_241_244.html#wp1128833">52.242-5</a>,
             Payments to Small Business Subcontractors (Jan 2017)(15 U.S.C. 637(d)(12)).</p>
           <p>__${this.checkclauses("52.247-64")}__ (60)(i) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_247.html#wp1156217">52.247-64</a>,
             Preference for Privately Owned U.S.-Flag Commercial Vessels (Feb 2006) (<a
               href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t45t48+351+1++%2846%29%20%20AND%20%28%2846%29%20ADJ%20USC%29%3ACITE%20%20%20%20%20%20%20%20%20">46
               U.S.C. Appx. 1241(b)</a> and <a
               href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t09t12+37+408++%2810%29%20%252">10
               U.S.C. 2631</a>).</p>
           <p>__${this.checkclauses(
             "52.247-64"
           )}__ (ii) Alternate I (Apr 2003) of <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_247.html#wp1156217">52.247-64</a>.
           </p>
           <p>__${this.checkclauses(
             "52.247-64"
           )}__ (iii) Alternate II (Feb 2006) of <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_247.html#wp1156217">52.247-64</a>.
           </p>
           <p>(c) The Contractor shall comply with the FAR clauses in this paragraph (c), applicable to commercial
             services, that the Contracting Officer has indicated as being incorporated in this contract by reference
             to implement provisions of law or Executive orders applicable to acquisitions of commercial items:</p>
           <p>[<em>Contracting Officer check as appropriate.</em>]</p>
           <p>__${this.checkclauses("52.222-17")}__ (1) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1147587">52.222-17</a>,
             Nondisplacement of Qualified Workers (May 2014)(E.O. 13495).</p>
           <p>__${this.checkclauses("52.222-41")}__ (2) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1160021">52.222-41</a>,
             Service Contract Labor Standards (Aug 2018) (<a href="http://uscode.house.gov/">41 U.S.C. chapter 67</a>).
           </p>
           <p>__${this.checkclauses("52.222-42")}__ (3) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1153423">52.222-42</a>,
             Statement of Equivalent Rates for Federal Hires (May 2014) (<a href="http://uscode.house.gov/">29 U.S.C.
               206</a> and <a href="http://uscode.house.gov/">41 U.S.C. chapter 67</a>).</p>
           <p>__${this.checkclauses("52.222-43")}__ (4) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1148260">52.222-43</a>,
             Fair Labor Standards Act and Service Contract Labor Standards-Price Adjustment (Multiple Year and Option
             Contracts) (Aug 2018) (<a href="http://uscode.house.gov/">29 U.S.C. 206</a> and <a
               href="http://uscode.house.gov/">41 U.S.C. chapter 67</a>).</p>
           <p>__${this.checkclauses("52.222-44")}__ (5) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1148274">52.222-44</a>,
             Fair Labor Standards Act and Service Contract Labor Standards&mdash;Price Adjustment (May 2014) (<a
               href="http://uscode.house.gov/">29 U.S.C. 206</a> and <a href="http://uscode.house.gov/">41 U.S.C.
               chapter 67</a>).</p>
           <p>__${this.checkclauses("52.222-51")}__ (6) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1155380">52.222-51</a>,
             Exemption from Application of the Service Contract Labor Standards to Contracts for Maintenance,
             Calibration, or Repair of Certain Equipment&mdash;Requirements (May 2014) (<a
               href="http://uscode.house.gov/">41 U.S.C. chapter 67</a>).</p>
           <p>__${this.checkclauses("52.222-53")}__ (7) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1162590">52.222-53</a>,
             Exemption from Application of the Service Contract Labor Standards to Contracts for Certain
             Services&mdash;Requirements (May 2014) (<a href="http://uscode.house.gov/">41 U.S.C. chapter 67</a>).</p>
           <p>__${this.checkclauses("52.222-55")}__ (8) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1163027">52.222-55</a>,
             Minimum Wages Under Executive Order 13658 (Dec 2015).</p>
           <p>__${this.checkclauses("52.222-62")}__ (9) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1170084">52.222-62</a>,
             Paid Sick Leave Under Executive Order 13706 (JAN 2017) (E.O. 13706).</p>
           <p>__${this.checkclauses("52.226-6")}__ (10) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1183820">52.226-6</a>,
             Promoting Excess Food Donation to Nonprofit Organizations (May 2014) (<a
               href="http://uscode.house.gov/">42 U.S.C. 1792</a>).</p>
           <p>__${this.checkclauses("52.237-11")}__ (11) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_233_240.html#wp1120023">52.237-11</a>,
             Accepting and Dispensing of $1 Coin (Sept 2008) (<a
               href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t29t32+1665+30++%2831%29%20%20AND%20%28%2831%29%20ADJ%20USC%29%3ACITE%20%20%20%20%20%20%20%20%20">31
               U.S.C. 5112(p)(1)</a>).</p>
           <p>(d) <em>Comptroller General Examination of Record</em>. The Contractor shall comply with the provisions
             of this paragraph (d) if this contract was awarded using other than sealed bid, is in excess of the
             simplified acquisition threshold, and does not contain the clause at <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_215.html#wp1144470">52.215-2</a>,
             Audit and Records&mdash;Negotiation.</p>
           <p>(1) The Comptroller General of the United States, or an authorized representative of the Comptroller
             General, shall have access to and right to examine any of the Contractor&rsquo;s directly pertinent
             records involving transactions related to this contract.</p>
           <p>(2) The Contractor shall make available at its offices at all reasonable times the records, materials,
             and other evidence for examination, audit, or reproduction, until 3 years after final payment under this
             contract or for any shorter period specified in FAR <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/Subpart%204_7.html#wp1082800">subpart
               4.7</a>, Contractor Records Retention, of the other clauses of this contract. If this contract is
             completely or partially terminated, the records relating to the work terminated shall be made available
             for 3 years after any resulting final termination settlement. Records relating to appeals under the
             disputes clause or to litigation or the settlement of claims arising under or relating to this contract
             shall be made available until such appeals, litigation, or claims are finally resolved.</p>
           <p>(3) As used in this clause, records include books, documents, accounting procedures and practices, and
             other data, regardless of type and regardless of form. This does not require the Contractor to create or
             maintain any record that the Contractor does not maintain in the ordinary course of business or pursuant
             to a provision of law.</p>
           <p>(e)(1) Notwithstanding the requirements of the clauses in paragraphs (a), (b), (c), and (d) of this
             clause, the Contractor is not required to flow down any FAR clause, other than those in this paragraph
             (e)(1) in a subcontract for commercial items. Unless otherwise indicated below, the extent of the flow
             down shall be as required by the clause&mdash;</p>
           <p>(i) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_200_206.html#wp1141983">52.203-13</a>,
             Contractor Code of Business Ethics and Conduct (Oct 2015) (<a href="http://uscode.house.gov/">41 U.S.C.
               3509</a>).</p>
           <p>(ii) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_200_206.html#wp1158787">52.203-19</a>,
             Prohibition on Requiring Certain Internal Confidentiality Agreements or Statements (Jan 2017) (section 743
             of Division E, Title VII, of the Consolidated and Further Continuing Appropriations Act, 2015 (Pub. L.
             113-235) and its successor provisions in subsequent appropriations acts (and as extended in continuing
             resolutions)).</p>
           <p>(iii) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_200_206.html#wp1159972">52.204-23</a>,
             Prohibition on Contracting for Hardware, Software, and Services Developed or Provided by Kaspersky Lab and
             Other Covered Entities (Jul 2018) (Section 1634 of Pub. L. 115-91).</p>
           <p>(iv) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_217_221.html#wp1136032">52.219-8</a>,
             Utilization of Small Business Concerns (Nov 2016) (<a href="http://uscode.house.gov/">15 U.S.C.
               637(d)(2)</a> and (3)), in all subcontracts that offer further subcontracting opportunities. If the
             subcontract (except subcontracts to small business concerns) exceeds $700,000 ($1.5 million for
             construction of any public facility), the subcontractor must include <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_217_221.html#wp1136032">52.219-8</a>
             in lower tier subcontracts that offer subcontracting opportunities.</p>
           <p>(v) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1147587">52.222-17</a>,
             Nondisplacement of Qualified Workers (May 2014) (E.O. 13495). Flow down required in accordance with
             paragraph (l) of FAR clause <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1147587">52.222-17</a>.
           </p>
           <p>(vi) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1147656">52.222-21</a>,
             Prohibition of Segregated Facilities (Apr 2015)</p>
           <p>(vii) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1147711">52.222-26</a>,
             Equal Opportunity (Sept 2016) (E.O. 11246).</p>
           <p>(viii) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1158632">52.222-35</a>,
             Equal Opportunity for Veterans (Oct 2015) (<a
               href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t37t40+200+2++%2838%29%20%20AND%20%28%2838%29%20ADJ%20USC%29%3ACITE%20%20%20%20%20%20%20%20%20">38
               U.S.C. 4212</a>).</p>
           <p>(ix) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1162802">52.222-36</a>,
             Equal Opportunity for Workers with Disabilities (Jul 2014) (<a
               href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t29t32+2+78++%2829%29%20%20AND%20%28%2829%29%20ADJ%20USC%29%3ACITE%20%20%20%20%20%20%20%20%20">29
               U.S.C. 793</a>).</p>
           <p>(x) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1148123">52.222-37</a>,
             Employment Reports on Veterans (Feb 2016) (<a
               href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t29t32+2+78++%2829%29%20%20AND%20%28%2829%29%20ADJ%20USC%29%3ACITE%20%20%20%20%20%20%20%20%20">38
               U.S.C. 4212</a>)</p>
           <p>(xi) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1160019">52.222-40</a>,
             Notification of Employee Rights Under the National Labor Relations Act (Dec 2010) (E.O. 13496). Flow down
             required in accordance with paragraph (f) of FAR clause <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1160019">52.222-40</a>.
           </p>
           <p>(xii) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1160021">52.222-41</a>,
             Service Contract Labor Standards (Aug 2018) (<a href="http://uscode.house.gov/">41 U.S.C. chapter 67</a>).
           </p>
           <p>(xiii)</p>
           <p><a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1151848">52.222-50</a>,
             Combating Trafficking in Persons (Mar 2015) (<a href="http://uscode.house.gov">22 U.S.C. chapter 78
             </a>and E.O 13627). Alternate I (Mar 2015) of <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1151848">52.222-50</a>
             (<a href="http://uscode.house.gov">22 U.S.C. chapter 78 and E.O 13627</a>).</p>
           <p>(xiv) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1155380">52.222-51</a>,
             Exemption from Application of the Service Contract Labor Standards to Contracts for Maintenance,
             Calibration, or Repair of Certain Equipment-Requirements (May 2014) (<a href="http://uscode.house.gov/">41
               U.S.C. chapter 67</a>).</p>
           <p>(xv) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1162590">52.222-53</a>,
             Exemption from Application of the Service Contract Labor Standards to Contracts for Certain
             Services-Requirements (May 2014) (<a href="http://uscode.house.gov/">41 U.S.C. chapter 67</a>).</p>
           <p>(xvi) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1156645">52.222-54</a>,
             Employment Eligibility Verification (Oct 2015) (E.O. 12989).</p>
           <p>(xvii) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1163027">52.222-55</a>,
             Minimum Wages Under Executive Order 13658 (Dec 2015).</p>
           <p>(xviii) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1170084">52.222-62</a>,
             Paid Sick Leave Under Executive Order 13706 (Jan 2017) (E.O. 13706).</p>
           <p>(xix)(A) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1192898">52.224-3</a>,
             Privacy Training (Jan 2017) (5 U.S.C. 552a).</p>
           <p>(B) Alternate I (Jan 2017) of <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1192898">52.224-3</a>.
           </p>
           <p>(xx) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1192524">52.225-26</a>,
             Contractors Performing Private Security Functions Outside the United States (Oct 2016) (Section 862, as
             amended, of the National Defense Authorization Act for Fiscal Year 2008;<a
               href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t09t12+1445+65++%2810%20U.S.C.%202302%20Note%29%20%20%20%20%20%20%20%20%20%20">
               10 U.S.C. 2302 Note)</a>.</p>
           <p>(xxi) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1183820">52.226-6</a>,
             Promoting Excess Food Donation to Nonprofit Organizations (May 2014) (<a
               href="http://uscode.house.gov/">42 U.S.C. 1792</a>). Flow down required in accordance with paragraph (e)
             of FAR clause <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1183820">52.226-6</a>.
           </p>
           <p>(xxii) <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_247.html#wp1156217">52.247-64</a>,
             Preference for Privately Owned U.S.-Flag Commercial Vessels (Feb 2006) (<a
               href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t45t48+351+1++%2846%29%20%20AND%20%28%2846%29%20ADJ%20USC%29%3ACITE%20%20%20%20%20%20%20%20%20">46
               U.S.C. Appx. 1241(b)</a> and <a
               href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t09t12+37+408++%2810%29%20%252">10
               U.S.C. 2631</a>). Flow down required in accordance with paragraph (d) of FAR clause <a
               href="https://www.acquisition.gov/sites/default/files/current/far/html/52_247.html#wp1156217">52.247-64</a>.
           </p>
           <p>(2) While not required, the Contractor may include in its subcontracts for commercial items a minimal
             number of additional clauses necessary to satisfy its contractual obligations.</p>
           <p>(End of clause)</p>
           <p>&nbsp;</p>
           <p>&nbsp;</p>
                    `;

                    
                      // console.log('found YOu',json,clasuesarray)
                      // console.log("*****find me in HTML", caluseNo + name+json.alt);
                      document.getElementById(
                        caluseNo + name + json.alt
                      ).innerHTML += json.description_html;
                      this.finilizeclausearray[name] +=
                        div.outerHTML + json.description_html;
                    } else if (json.id == "52.212-3" && json.alt == 0) {
                      let divy = `<p style="margin-top:0in;margin-right:0in;margin-bottom:12.0pt;margin-left:.8in;text-indent:-.4in;font-size:16px;font-family:&quot;Times New Roman&quot;,serif;">(2)&nbsp; &nbsp; &nbsp;The Offeror represents that--</p>
                          <p style="margin-top:0in;margin-right:0in;margin-bottom:12.0pt;margin-left:1.2in;text-indent:-.4in;font-size:16px;font-family:&quot;Times New Roman&quot;,serif;">(i)&nbsp; &nbsp; &nbsp;&nbsp;It is [ &nbsp;] is not [ &nbsp; ] a corporation that has any unpaid Federal tax liability that has been assessed, for which all judicial and administrative remedies have been exhausted or have lapsed, and that is not being paid in a timely manner pursuant to an agreement with the authority responsible for collecting the tax liability; and</p>
                          <p style="margin-top:0in;margin-right:0in;margin-bottom:12.0pt;margin-left:1.2in;text-indent:-.4in;font-size:16px;font-family:&quot;Times New Roman&quot;,serif;">(ii)&nbsp; &nbsp; &nbsp;It is [ &nbsp;] is not [ &nbsp; ] a corporation that was convicted of a felony criminal violation under a Federal law within the preceding 24 months.</p>
                          <p style="margin-top:0in;margin-right:0in;margin-bottom:12.0pt;margin-left:.4in;text-indent:-.4in;font-size:16px;font-family:&quot;Times New Roman&quot;,serif;">(r)&nbsp; &nbsp; &nbsp;&nbsp;<em>Predecessor of Offeror.</em> (Applies in all solicitations that include the provision at 52.204-16, Commercial and Government Entity Code Reporting.)</p>
                          <p style="margin-top:0in;margin-right:0in;margin-bottom:12.0pt;margin-left:.8in;text-indent:-.4in;font-size:16px;font-family:&quot;Times New Roman&quot;,serif;">(1)&nbsp; &nbsp; &nbsp;The Offeror represents that it [ &nbsp;] is or [ &nbsp;] is not a successor to a predecessor that held a Federal contract or grant within the last three years.</p>
                          <p style="margin-top:0in;margin-right:0in;margin-bottom:12.0pt;margin-left:.8in;text-indent:-.4in;font-size:16px;font-family:&quot;Times New Roman&quot;,serif;">(2)&nbsp; &nbsp; &nbsp;If the Offeror has indicated “is” in paragraph (r)(1) of this provision, enter the following information for all predecessors that held a Federal contract or grant within the last three years (if more than one predecessor, list in reverse chronological order):</p>
                          <p style="margin-top:0in;margin-right:0in;margin-bottom:12.0pt;margin-left:1.2in;text-indent:-.4in;font-size:16px;font-family:&quot;Times New Roman&quot;,serif;">Predecessor CAGE code ______(or mark “Unknown).</p>
                          <p style="margin-top:0in;margin-right:0in;margin-bottom:12.0pt;margin-left:1.2in;text-indent:-.4in;font-size:16px;font-family:&quot;Times New Roman&quot;,serif;">Predecessor legal name: _________________________.
                            <br>&nbsp;(Do not use a “doing business as” name).
                          </p>`;

                      this.clauses
                        .getClauseDesc(caluseNo, json.alt)
                        .subscribe((element) => {
                          console.log("element", element);
                          document.getElementById(
                            caluseNo + name + element.alt
                          ).innerHTML += element.description_html + divy;
                          this.finilizeclausearray[name] +=
                            div.outerHTML + element.description_html;
                        });
                    }
                  }

                  if (json.ibr == false) {
                    if (
                      json.id != "52.212-2" ||
                      (json.id == "52.212-3" && json.alt != 0) ||
                      (json.id == "52.212-5" && json.alt != 0)
                    ) {
                      // console.log('trying to find', json.id,json.alt)

                      let id = `${caluseNo}${index}${name}`;
                      let key = keyids.includes(id);
                      // console.log(keyids)

                      keyids.push(id);
                      // console.log(caluseNo,id,key)
                      let div2 = document.createElement("div");
                      div.setAttribute("id", `${caluseNo}${index}`);

                      div.innerHTML +=
                        `<br><br><div>${caluseNo}` +
                        "    " +
                        `${title} (${date})</div><br><br><div id="${caluseNo}${index}${name}">
                      (Begin Clause)<br><br></div>`;
                      div.appendChild(div2);

                      this.clauses
                        .getClauseDesc(caluseNo, json.alt)
                        .subscribe((element) => {
                          // console.log("element", element);
                          document.getElementById(id).innerHTML +=
                            element["description_html"];
                          this.finilizeclausearray[name] +=
                            div.outerHTML + element.description_html;
                        });
                    }
                  } else if (json.ibr == true) {
                    clausecountibr = clausecountibr + 1;
                    var tr = document.createElement("tr");

                    tr.appendChild(document.createElement("td"));
                    tr.appendChild(document.createElement("td"));
                    tr.appendChild(document.createElement("td"));

                    tr.cells[0].innerHTML = caluseNo;
                    tr.cells[1].innerHTML = title;
                    tr.cells[1].style.width = "500px";
                    tr.cells[1].style.paddingLeft = "100px";
                    tr.cells[1].style.textAlign = "left";
                    tr.cells[2].innerHTML = date;
                    tr.cells[2].style.paddingLeft = "100px";
                    table.appendChild(tr);
                  }
                }
              }
            });
          }
        }
      });

      clausecountibr > 0
        ? (div.innerHTML += `<div style="font-size: 12px; font-family:Arial;"><b>CLAUSES INCORPORATED BY REFERENCE</b></div> `)
        : "";
      clausecount > 0 ? div.prepend(headerdiv) : "";
      div.appendChild(table);
      this.finilizeclausearray[name] =
        '<div style="font-size: 12px; font-family:Arial;"><b>CLAUSES INCORPORATED BY REFERENCE</b></div> ' +
        table.outerHTML;
    };

    if (this.allsoldata.FORM.productKind != "half") {
      console.log("Supply" + this.allsoldata.SUPPLY.description);
      let supp =
        this.allsoldata.SUPPLY.description == undefined
          ? "<div></div>"
          : this.allsoldata.SUPPLY.description;
      printview.innerHTML +=
        '<div id="suppliesandservices" style="font-size: 16px; font-family:Arial;"><b>B. Supplies and Services</b></div>' +
        '<div class="data" style="font-size: 14px; font-family:Arial;">' +
        supp +
        "</div>" +
        "<br>";

      let sows =
        this.allsoldata.SOW.description == undefined
          ? "<div></div>"
          : this.allsoldata.SOW.description;
      printview.innerHTML +=
        '<div  id="statementofwork" style="font-size: 16px; font-family:Arial;"><b>C. Statement of Work</b></div>' +
        '<div class="data" style="font-size: 14px; font-family:Arial">' +
        sows +
        "</div>";

      let pack =
        this.allsoldata.PACKAGING.description == undefined
          ? "<div></div>"
          : this.allsoldata.PACKAGING.description;
      printview.innerHTML +=
        '<br><div  id="packingandmarking" style="font-size: 16px; font-family:Arial;"><b>D. Packaging and Marking</b></div>' +
        '<div class="data" style="font-size: 14px; font-family:Arial">' +
        pack +
        "</div>";

      if (this.allsoldata.PACKAGING.clause) {
        let count = 0;
        this.allsoldata.PACKAGING.clause.forEach((element) => {
          for (key in element) {
            element[key].length > 0 ? (count += 1) : "";
          }
        });
        count > 0
          ? clausefunction(this.allsoldata.PACKAGING.clause, "PACKAGING")
          : "";
      }

      let ins =
        this.allsoldata.INSPECTION.description == undefined
          ? "<div></div>"
          : this.allsoldata.INSPECTION.description;
      printview.innerHTML +=
        '<br><div  id="inspection" style="font-size: 16px; font-family:Arial;"><b>E. Inspection and Acceptance</b></div>' +
        '<div class="data" style="font-size: 14px; font-family:Arial">' +
        ins +
        "</div>";

      if (this.allsoldata.INSPECTION.clause) {
        let count = 0;
        this.allsoldata.INSPECTION.clause.forEach((element) => {
          for (key in element) {
            element[key].length > 0 ? (count += 1) : "";
          }
        });
        count > 0
          ? clausefunction(this.allsoldata.INSPECTION.clause, "INSPECTION")
          : "";
      }

      let del =
        this.allsoldata.DELIVERY.description == undefined
          ? "<div></div>"
          : this.allsoldata.DELIVERY.description;
      printview.innerHTML +=
        '<br><div  id="deliveries" style="font-size: 16px; font-family:Arial;"><b>F. Deliveries and Performance</b></div>' +
        '<div class="data" style="font-size: 14px; font-family:Arial">' +
        del +
        "</div>";

      if (this.allsoldata.DELIVERY.clause) {
        let count = 0;
        this.allsoldata.DELIVERY.clause.forEach((element) => {
          for (key in element) {
            element[key].length > 0 ? (count += 1) : "";
          }
        });
        count > 0
          ? clausefunction(this.allsoldata.DELIVERY.clause, "DELIVERY")
          : "";
      }

      let cont_admin =
        this.allsoldata.CONTRACT_ADMIN.description == undefined
          ? "<div></div>"
          : this.allsoldata.CONTRACT_ADMIN.description;
      printview.innerHTML +=
        '<br><div  id="contract" style="font-size: 16px; font-family:Arial;"><b>G. Contract Administration Data</b></div>' +
        '<div class="data" style="font-size: 14px; font-family:Arial">' +
        cont_admin +
        "</div>";

      if (this.allsoldata.CONTRACT_ADMIN.clause) {
        let count = 0;
        this.allsoldata.CONTRACT_ADMIN.clause.forEach((element) => {
          for (key in element) {
            element[key].length > 0 ? (count += 1) : "";
          }
        });
        count > 0
          ? clausefunction(
              this.allsoldata.CONTRACT_ADMIN.clause,
              "CONTRACT_ADMIN"
            )
          : "";
      }

      let cont =
        this.allsoldata.CONTRACT_REQ.description == undefined
          ? "<div></div>"
          : this.allsoldata.CONTRACT_REQ.description;
      printview.innerHTML +=
        '<br><div  id="specialcontract" style="font-size: 16px; font-family:Arial;"><b>H. Special Contract Requirements</b></div>' +
        '<div class="data" style="font-size: 14px; font-family:Arial">' +
        cont +
        "</div>";

      if (this.allsoldata.CONTRACT_REQ.clause) {
        let count = 0;
        this.allsoldata.CONTRACT_REQ.clause.forEach((element) => {
          for (key in element) {
            element[key].length > 0 ? (count += 1) : "";
          }
        });
        count > 0
          ? clausefunction(
              this.allsoldata.CONTRACT_REQ.clause,
              "CONTRACT_REQ"
            )
          : "";
      }

      printview.innerHTML +=
        '<br><div  id="contractclause" style="font-size: 16px; font-family:Arial;"><b>I. Contract Clauses</b></div>';

      if (this.allsoldata.CONTRACT_CLAUSE.clause) {
        let count = 0;
        this.allsoldata.CONTRACT_CLAUSE.clause.forEach((element) => {
          for (key in element) {
            element[key].length > 0 ? (count += 1) : "";
          }
        });
        count > 0
          ? clausefunction(
              this.allsoldata.CONTRACT_CLAUSE.clause,
              "CONTRACT_CLAUSE"
            )
          : "";
      }

      //Script to add attachements
      this.getAttachments("J");

      let certs =
        this.allsoldata.CERT.description == undefined
          ? "<div></div>"
          : this.allsoldata.CERT.description;
      printview.innerHTML +=
        '<br><div  id="certs" style="font-size: 16px; font-family:Arial;"><b>K. Representatons, Certs</b></div>' +
        '<div class="data" style="font-size: 14px; font-family:Arial">' +
        certs +
        "</div>";

      if (this.allsoldata.CERT.clause) {
        let count = 0;
        this.allsoldata.CERT.clause.forEach((element) => {
          for (key in element) {
            element[key].length > 0 ? (count += 1) : "";
          }
        });
        count > 0 ? clausefunction(this.allsoldata.CERT.clause, "CERT") : "";
      }

      let instruction =
        this.allsoldata.INSTRUCTION.description == undefined
          ? "<div></div>"
          : this.allsoldata.INSTRUCTION.description;
      printview.innerHTML +=
        '<br><div  id="instructions" style="font-size: 16px; font-family:Arial;"><b>L. Instructions</b></div>' +
        '<div class="data" style="font-size: 14px; font-family:Arial">' +
        instruction +
        "</div>";

      if (this.allsoldata.INSTRUCTION.clause) {
        let count = 0;
        this.allsoldata.INSTRUCTION.clause.forEach((element) => {
          for (key in element) {
            element[key].length > 0 ? (count += 1) : "";
          }
        });
        count > 0
          ? clausefunction(this.allsoldata.INSTRUCTION.clause, "INSTRUCTION")
          : "";
      }
      let evals =
        this.allsoldata.Evaluation_Criteria.mandatoryCriterias == undefined
          ? "<div></div>"
          : this.allsoldata.Evaluation_Criteria.mandatoryCriterias;
      printview.innerHTML +=
        '<br><div  id="eval" style="font-size: 16px; font-family:Arial;"><b>M. Evaluation Factors</b></div>' +
        '<div class="data" style="font-size: 14px; font-family:Arial">' +
        evals +
        "</div>" +
        "<br>";

      let volumfunction = () => {
        let volumes = [];
        volumes = this.allsoldata.Evaluation_Criteria.evaluationCriteria;
        console.log("ALL EVALUATIONS FACTORS", volumes);
        volumes.forEach((ele) => {
          let volumname = ele.volumeName;
          printview.innerHTML += `<div><h3>Volume: ${volumname}<h3></div>`;
          let factors = [];
          factors = ele.factorRows;
          factors.forEach((factor) => {
            printview.innerHTML += `<div><h3>Factor: ${factor.factorName}<h3></div>`;
            printview.innerHTML += factor.factorText;
            if (factor.factorScore == "Points") {
              printview.innerHTML += `<div><h3>Factor Score: ${factor.factorScore} | ${factor.factorPoints}<h3></div>`;
            } else {
              if (factor.factorScoreUpdate == "factorScoreUpdateNo") {
                printview.innerHTML += `<div><h3>Factor Score: <h3> Adjectival | Acceptable, Non-Acceptable</div>`;
              } else {
                printview.innerHTML += `<div><h3>Factor Score:<h3> Adjectival | Excellent, Satisfactory, Poor, etc </div>`;
              }
            }
          });
        });
      };
      this.allsoldata.Evaluation_Criteria.evaluationCriteria
        ? volumfunction()
        : "";

      if (this.allsoldata.Evaluation_Criteria.clause) {
        let count = 0;
        this.allsoldata.Evaluation_Criteria.clause.forEach((element) => {
          for (key in element) {
            element[key].length > 0 ? (count += 1) : "";
          }
        });
        count > 0
          ? clausefunction(
              this.allsoldata.Evaluation_Criteria.clause,
              "Evaluation Criteria"
            )
          : "";
      }

      
    } else {
      //functions to build stremalined solication preview
      let CONTRACT_ADMIN_desc =
        this.allsoldata.CONTRACT_ADMIN.description == undefined
          ? "<div></div>"
          : this.allsoldata.CONTRACT_ADMIN.description;

      let SOW_desc =
        this.allsoldata.SOW.description == undefined
          ? "<div></div>"
          : this.allsoldata.SOW.description;

      let DELIVERY_desc =
        this.allsoldata.DELIVERY.description == undefined
          ? "<div></div>"
          : this.allsoldata.DELIVERY.description;

      let CONTRACT_REQ_desc =
        this.allsoldata.CONTRACT_REQ.description == undefined
          ? "<div></div>"
          : this.allsoldata.CONTRACT_REQ.description;

      //Setting up the sub sections in Section B.
      printview.innerHTML += `
      <div  id="continuation" style="font-size: 16px; font-family:Arial;"><b>B. Continuation of SF1449</b></div>
      <div class="data" style="font-size: 14px; font-family:Arial;">
      <br>
      <div id="contract" style="font-size: 14px; font-family:Arial"><b>Contract Administration Data</b></div>

      ${CONTRACT_ADMIN_desc}

      <div id="statementofwork"  style="font-size: 14px; font-family:Arial"><b>Statement of Work</b></div>

      ${SOW_desc}

      <div id="deliveries" style="font-size: 14px; font-family:Arial"><b>Deliverables</b></div>

      ${DELIVERY_desc}


      <div id="specialcontract" style="font-size: 14px; font-family:Arial;"><b>Special Contract Requirements</b></div>

      ${CONTRACT_REQ_desc}
     
      </div>
      <br>
      
      `;

      //Add Contract Claues
      printview.innerHTML += `
      <div  id="contractclause" style="font-size: 16px; font-family:Arial;"><b>C. Contract Clauses</b></div>
      <div class="data" style="font-size: 14px; font-family:Arial;">`;

      if (this.allsoldata.CONTRACT_CLAUSE.clause) {
        let count = 0;
        this.allsoldata.CONTRACT_CLAUSE.clause.forEach((element) => {
          for (key in element) {
            element[key].length > 0 ? (count += 1) : "";
          }
        });
        //Script filter clauses to only show clauses with p/c values of 'C'

        let filterrequired = this.allsoldata.CONTRACT_CLAUSE.clause[0].required.filter(
          (elem) => {
            return elem["p_or_c"] == "C";
          }
        );

        let filterrequired2 = this.allsoldata.CONTRACT_CLAUSE.clause[1].applicable.filter(
          (elem) => {
            if (elem.p_or_c == "C") {
              return elem;
            }
          }
        );

        let filterrequired3 = this.allsoldata.CONTRACT_CLAUSE.clause[2].optional.filter(
          (elem) => {
            if (elem.p_or_c == "C") {
              return elem;
            }
          }
        );

        let filterrequired4 = this.allsoldata.CONTRACT_CLAUSE.clause[3].others.filter(
          (elem) => {
            if (elem.p_or_c == "C") {
              return elem;
            }
          }
        );

        let data = [
          {
            required: filterrequired,
          },
          {
            applicable: filterrequired2,
          },
          {
            optional: filterrequired3,
          },
          {
            others: filterrequired4,
          },
        ];

        count > 0 ? clausefunction(data, "CONTRACT_CLAUSE") : "";
      }

      //Script to add attachements
      this.getAttachments("D");

      //Solicitation Provisions

      let pack =
        this.allsoldata.PACKAGING.description == undefined
          ? "<div></div>"
          : this.allsoldata.PACKAGING.description;
      printview.innerHTML += `
      <br><div id="solprovisions" style="font-size: 16px; font-family:Arial;"><b>E. Solicitation Provisions</b></div>
      <div class="data" style="font-size: 14px; font-family:Arial">
      ${pack} 
      </div>`;

      if (this.allsoldata.CONTRACT_CLAUSE.clause) {
        let count = 0;
        this.allsoldata.CONTRACT_CLAUSE.clause.forEach((element) => {
          for (key in element) {
            element[key].length > 0 ? (count += 1) : "";
          }
        });
        //Script filter clauses to only show clauses with p/c values of 'C'

        let filterrequired = this.allsoldata.CONTRACT_CLAUSE.clause[0].required.filter(
          (elem) => {
            return elem["p_or_c"] == "P";
          }
        );

        let filterrequired2 = this.allsoldata.CONTRACT_CLAUSE.clause[1].applicable.filter(
          (elem) => {
            if (elem.p_or_c == "P") {
              return elem;
            }
          }
        );

        let filterrequired3 = this.allsoldata.CONTRACT_CLAUSE.clause[2].optional.filter(
          (elem) => {
            if (elem.p_or_c == "P") {
              return elem;
            }
          }
        );

        let filterrequired4 = this.allsoldata.CONTRACT_CLAUSE.clause[3].others.filter(
          (elem) => {
            if (elem.p_or_c == "P") {
              return elem;
            }
          }
        );

        let data = [
          {
            required: filterrequired,
          },
          {
            applicable: filterrequired2,
          },
          {
            optional: filterrequired3,
          },
          {
            others: filterrequired4,
          },
        ];
        count > 0 ? clausefunction(data, "Solicitation Provisions") : "";
      }
    }
  }

  printPDF() {
    window.print();
  }


  makepdf(verification) {
    //console.log("Clicked");
    if (this.status == "Published") {
      window.print();
    } else if (this.status != "Published") {
      // Update all Descriptions to contian the clause information.

      // let allkeys = Object.keys(this.finilizeclausearray);
      // allkeys.forEach(key => {
        
      //   let id = this.allsoldata[`${key.replace(/ /, "_")}`].id;
      //   console.log('KEY',key, this.allsoldata[key])
      //   let html =
      //   `${typeof this.allsoldata[key] != 'undefined' && typeof this.allsoldata[key] != undefined?this.allsoldata[key].description:''} + ${this.finilizeclausearray[key]}`
          
      //   let name = key.toLowerCase().replace("_", "-");
      //   console.log(id,name,html)

      //   this.sec.patchSections(id, name, html).subscribe(response => {});
      //   });

    
      if(this.soldata.qandaDate !='' &&this.soldata.qandaDate != undefined && this.soldata.offerDueDate !=''&& this.soldata.offerDueDate != undefined){

            this.acqservice.getsoldappids(this.solno).subscribe((response) => {
              console.log(response);
              //console.log(response.solId);
              let rightnow = $.now();
              let date = this.datepipe.transform(new Date(rightnow), "MM-dd-yyyy");
              this.soldata.startdate = date;
      
      
              let fullHTML = document.querySelector("#pdfadd").innerHTML
              var data = {
                status: "Published",
                startdate: date,
                issuededby:
                  this.allsoldata.FORM.coName +
                  "\n" +
                  this.allsoldata.FORM.coOfficeName +
                  "\n" +
                  this.allsoldata.FORM.coAddress,
                aco1: this.allsoldata.FORM.coName + "\n" + this.allsoldata.FORM.aco1,
                cori1:
                  this.allsoldata.FORM.coName + "\n" + this.allsoldata.FORM.cori1,
                awardedvendor: "",
                //awarddate: "",
                requisitionNumber: this.allsoldata.FORM.requisitionNumber,
                orderNumber: this.allsoldata.FORM.orderNumber,
                itemsTableData: this.allsoldata.FORM.itemsTableData,
                ap_no: this.getapno,
                fullHTML:fullHTML
              };
              console.log("Data to be sent to blockchain", data);
      
      
              this.acqservice.putSolData(this.solid, {status:'Published', qandaStatus: "Open"}).subscribe(response => {
                console.log('from patch to soldata',response)
      
                this.formservice.putFormData(this.formid,data).subscribe(formres=>{
      
                    this.acqservice.publishAP(this.solno).subscribe(
                      (response) => {
                        //console.log(response);
                        var data1 = {
                          ap_no: this.solno,
                          sol_no: this.solno,
                          users: [this.allsoldata.FORM.createdUsername],
                          textUser: this.username,
                          text: "published solicitation",
                          iconstyle: "fa-check-square-o",
                          message: "for Solicitation" + " " + "#" + this.solno,
                          date: new Date(),
                          type: "Published",
                        };
                        this.acqservice.postAttnotifications(data1).subscribe(Response => {
                          //console.log(Response);
                          console.log("Publsihed Solicitation Notification");
                        });
                        var dataEmail = {
                          to: [].push(this.allsoldata.FORM.commentMention[1].email),
                          subject:
                            this.usercommentsname +
                            " " +
                            "published" +
                            " " +
                            this.allsoldata.FORM.projectTitle +
                            " " +
                            "and SOL#" +
                            this.solno,
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
                            <span style="color:#2E73DC; font-weight: 600">${this.usercommentsname}</span> shared acquisition with you for <span style="color:#2E73DC; font-weight: 600">${this.allsoldata.FORM.projectTitle}</span> <span style="color:#2E73DC; font-weight: 600">SOL#${this.solno}</span> 
                            </div>
                              <a href="${this.DOMAIN_URL}/#/home/sol/${this.solno}" style="background-color:#2E73DC;border:1px solid #2E73DC;border-radius:3px;color:#ffffff;display:inline-block;font-family:sans-serif;font-size:14px;line-height:30px;text-align:center;text-decoration:none;width:150px;-webkit-text-size-adjust:none;mso-hide:all; margin-top: 20px">View Update &rarr;</a>
                              </div>
                            </div>
                          
                          </td>
                        </tr>
                      </table>
                  `,
                        };
                        this.acqservice.postEmail(dataEmail).subscribe(Response => {});
                        this.toastr.success("Solicitation Published Successfully");
                        window.print();
                        setTimeout(() => {
                          this.acqservice.preview.next(response);
                          this.router.navigate(["home/sol/", this.solno]);
                        }, 400);
      
                      },
                      error => {
                        console.warn('patching to FormService',error);
                        var data1 = { status: "Initiated" };
                        this.acqservice
                          .putSolData(this.solid, data1)
                          .subscribe((response) => {});
                        this.toastr.error(
                          "Error Publishing, Please contact Administrator",
                          error.statusCode + " " + error.message,
                          { timeOut: 2000 }
                        );
                      }
      
      
                    );
                      
                    setTimeout(() => {
                      let element: HTMLElement = document.getElementsByClassName(
                        "close"
                      )[0] as HTMLElement;
                      element.click();
                    }, 350);
                    
                });
              
              
                },error =>{
                  console.warn('Error when patching soldata',error)
                });
      
      
      
            });
          

      }else{
        this.toastr.error('Please Complete Deadlines in Section A');
        (<HTMLButtonElement>document.querySelector("#savebutton1")).click()
      }

    }





  }

  getAttachments(letter) {
    let table = document.createElement("table");
    $(table).attr("id", "attachtable");
    let header = document.createElement("h1");
    header.innerHTML += `<br><div style="font-size: 16px; font-family:Arial;"><b>${letter}. Attachments</b></div>`;
    $("#pdfadd").append(header);
    $("#pdfadd").append(table);
    this.acqservice
      .getAttachments(this.getapno, this.type)
      .subscribe((response) => {
        console.log(response);
        this.attachmentsdata = response;

        this.attachmentsdata.forEach((element) => {
          console.log("attachmentfile", element);
          let ta = document.querySelector("#attachtable");
          var tr = document.createElement("tr");

          tr.appendChild(document.createElement("td"));
          tr.appendChild(document.createElement("td"));
          tr.appendChild(document.createElement("td"));

          tr.cells[0].innerHTML = element.file_name;
          tr.cells[1].innerHTML = element.file_type;
          tr.cells[1].style.width = "500px";
          tr.cells[1].style.paddingLeft = "100px";
          tr.cells[1].style.textAlign = "left";
          ta.appendChild(tr);
        });
      });
  }

  showfile(x) {
    this.acqservice.getFile(x).subscribe((response) => {
      console.log(response);

      var buffer = new Uint8Array(response["_body"].length);
      for (var i = 0; i < response["_body"].length; i++) {
        buffer[i] = response["_body"].charCodeAt(i);
      }

      console.log(buffer);
      const contentDispositionHeader: string = response.headers["_headers"]
        .get("cache-control")
        .toString();
      const type = response.headers["_headers"].get("content-type").toString();
      console.log(type);
      const parts: string[] = contentDispositionHeader.split(";");
      const filename = parts[1].split("=")[1];
      console.log(filename);
      const blob = new Blob([response["_body"]], { type: type });

      var fileURL = URL.createObjectURL(blob);
      const reader = new FileReader();
      console.log(reader.readAsText(blob));
    });
  }

  @HostListener("window:scroll", []) onWindowScroll() {
    this.scrollFunction();
  }
  // When the user scrolls down 20px from the top of the document, show the button
  scrollFunction() {
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      if(document.getElementById("myBtn") != null ){
        document.getElementById("myBtn").style.display = "block"
      }
      
    } else {
      if( document.getElementById("myBtn") != null ){
        document.getElementById("myBtn").style.display = "none"
      }
    }
  }

  // When the user clicks on the button, scroll to the top of the document
  topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }

  checkclauses(text) {
    return this.allsectionclauses.includes(text) ? "X" : "";
  }

 
}
