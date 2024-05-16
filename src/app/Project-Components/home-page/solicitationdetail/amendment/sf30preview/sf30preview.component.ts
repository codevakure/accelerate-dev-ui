import { Event } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { AcquisitionService } from "../../../../../Services/acquisition.service";
import {FormsService} from "../../../../../Services/forms.service"
import { ClausesService } from "../../../../../Services/clauses.service";
import { AuthenticationService } from "../../../../../Services/authentication.service";
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import { Cookie } from 'ng2-cookies/ng2-cookies';
import * as jwt_decode from "jwt-decode";
import * as $ from "jquery";


@Component({
  selector: 'app-sf30preview',
  templateUrl: './sf30preview.component.html',
  styleUrls: ['./sf30preview.component.css']
})
export class Sf30previewComponent implements OnInit {

  solno;
  amendmentno;
  issudedby
  finilizeclausearray = {};
  allsectionclauses = [];
  allsoldata
  attachmentsdata
  type = "Attachments";
  username
  formid

  edit:boolean=true

  columnsToDisplay = [
    "item",
    "schedule",
    "quanity",
    "unit",
    "unitprice",
    "amount",
  ];

  specialclauses = ["52.212-3", "52.212-5", "52.212-2"];

  SF30 = new FormGroup(
    {
      contractid: new FormControl(''),
      sol_no: new FormControl(''),
      requisitionNumber: new FormControl(''),
      coOfficeName: new FormControl(''),
      coPhone : new FormControl(''),
      coEmail: new FormControl(''),
      amendate : new FormControl(''),
      extensiondate : new FormControl('',Validators.required),
      ammendnotes: new FormControl(''),
      isnotextended: new FormControl(false),
      isextended: new FormControl(false),


    } 
  )

  constructor(    private _formBuilder: FormBuilder,
    private ap: AcquisitionService,
    private route: ActivatedRoute,
    private form:FormsService,
    private clauses: ClausesService) { }

  ngOnInit() {
    this.solno = this.route.snapshot.parent.params.sid;
    this.ap.getsoldappids(this.solno).subscribe(response => {
      this.amendmentno = response.amendment_no;
      console.log("Amedment Number", this.amendmentno);
      this.SF30.get('contractid').setValue(this.amendmentno)
      this.ap.getfullammend(this.amendmentno).subscribe(res=>{
        console.log('*****FULL Ammendment RESPONSE****',res)
        this.createform(res)
      },error=>{
        console.warn('Error for full Ammendment',error)
      })

      this.ap.getAmendmentdapp(this.amendmentno).subscribe(res=>{
        this.formid = res.formId
        this.form.getFormData(this.formid).subscribe(res=>{
          console.log('admend form',res);
          this.edit = res.status == "Re-Published" ? true : false;
          console.warn('Edit Boolean',this.edit)
          let formkeys = Object.keys(this.SF30.value);
          console.log(formkeys)
          for(let key in res){
            if(formkeys.includes(key)){
              this.SF30.get(key).setValue(res[key])
            }
          }
          this.issudedby= `
          ${res.coName} 
          \n
          ${res.coOfficeName}

          `
          if(this.SF30.get('extensiondate').value != ''){
            this.SF30.get('isextended').setValue(true)
          }else{
            this.SF30.get('isnotextended').setValue(true)
          }

       })

      })
    })

    this.ap.getUserprofile().subscribe((response) => {
      this.username = response.pkId;
    });
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

    //   console.log(this.allsoldata);
    let form = this.allsoldata.FORM;
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

    if (form.productKind != "half") {
      console.log("Supply" + this.allsoldata.SUPPLY.description);
      let supp =
        this.allsoldata.SUPPLY.description == undefined
          ? "<div></div>"
          : this.allsoldata.SUPPLY.description;
      printview.innerHTML +=
        '<div style="font-size: 16px; font-family:Arial;"><b>B. Supplies and Services</b></div>' +
        '<div class="data" style="font-size: 14px; font-family:Arial;">' +
        supp +
        "</div>" +
        "<br>";

      let sows =
        this.allsoldata.SOW.description == undefined
          ? "<div></div>"
          : this.allsoldata.SOW.description;
      printview.innerHTML +=
        '<div style="font-size: 16px; font-family:Arial;"><b>C. Statement of Work</b></div>' +
        '<div class="data" style="font-size: 14px; font-family:Arial">' +
        sows +
        "</div>";

      let pack =
        this.allsoldata.PACKAGING.description == undefined
          ? "<div></div>"
          : this.allsoldata.PACKAGING.description;
      printview.innerHTML +=
        '<br><div style="font-size: 16px; font-family:Arial;"><b>D. Packaging and Marking</b></div>' +
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
        '<br><div style="font-size: 16px; font-family:Arial;"><b>E. Inspection and Acceptance</b></div>' +
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
        '<br><div style="font-size: 16px; font-family:Arial;"><b>F. Deliveries and Performance</b></div>' +
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
        '<br><div style="font-size: 16px; font-family:Arial;"><b>G. Contract Administration Data</b></div>' +
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
        '<br><div style="font-size: 16px; font-family:Arial;"><b>H. Special Contract Requirements</b></div>' +
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
        '<br><div style="font-size: 16px; font-family:Arial;"><b>I. Contract Clauses</b></div>';

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
        '<br><div style="font-size: 16px; font-family:Arial;"><b>K. Representatons, Certs</b></div>' +
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
        '<br><div style="font-size: 16px; font-family:Arial;"><b>L. Instructions</b></div>' +
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
        '<br><div style="font-size: 16px; font-family:Arial;"><b>M. Evaluation Factors</b></div>' +
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
      <div style="font-size: 16px; font-family:Arial;"><b>B. Continuation of SF1449</b></div>
      <div class="data" style="font-size: 14px; font-family:Arial;">
      <br>
      <div style="font-size: 14px; font-family:Arial"><b>Contract Administration Data</b></div>

      ${CONTRACT_ADMIN_desc}

      <div style="font-size: 14px; font-family:Arial"><b>Statement of Work</b></div>

      ${SOW_desc}

      <div style="font-size: 14px; font-family:Arial"><b>Deliverables</b></div>

      ${DELIVERY_desc}


      <div style="font-size: 14px; font-family:Arial;"><b>Special Contract Requirements</b></div>

      ${CONTRACT_REQ_desc}
     
      </div>
      <br>
      
      `;

      //Add Contract Claues
      printview.innerHTML += `
      <div style="font-size: 16px; font-family:Arial;"><b>C. Contract Clauses</b></div>
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
      printview.innerHTML += `<br><div style="font-size: 16px; font-family:Arial;"><b>E. Solicitation Provisions</b></div>
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

  checkclauses(text) {
    return this.allsectionclauses.includes(text) ? "X" : "";
  }

  getAttachments(letter) {
    let table = document.createElement("table");
    $(table).attr("id", "attachtable");
    let header = document.createElement("h1");
    header.innerHTML += `<br><div style="font-size: 16px; font-family:Arial;"><b>${letter}. Attachments</b></div>`;
    $("#pdfadd").append(header);
    $("#pdfadd").append(table);
    this.ap
      .getAttachments(this.amendmentno, this.type)
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

  makepdf(e){

    let data = this.allsoldata.FORM
    data.status = 'Re-Published'
    console.log('Amendment DAta', data)

    this.form.putFormData(this.formid,data).subscribe(res=>{
      console.log('*****Saved Data to Amendment Form****',res)

      //Publish Amendment
      this.ap.publishAmend(this.amendmentno).subscribe(res=>{
        console.log('Ammendment Published')
        //Script to make the print functionality avaliable immediatley
        
        this.edit = true
      },error=>{
        console.warn('Amendment Publish Error',error)
      })
    },error=>{
      console.error('Patch Ammend Error',error)
    })

  }

  printPDF() {
    window.print();
  }

}
