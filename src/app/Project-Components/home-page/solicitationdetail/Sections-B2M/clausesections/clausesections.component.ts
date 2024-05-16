import { 
  Component, 
  OnInit, 
  ViewChild, 
  Input, 
  Output, 
  OnChanges, 
  EventEmitter, 
  SimpleChanges 
} from "@angular/core"; 
import { SectionsService } from "../../../../../Services/sections.service"; 
import { ActivatedRoute, Router, ParamMap } from "@angular/router"; 
import { FormsService } from "../../../../../Services/forms.service"; 
import { DatePipe} from '@angular/common';
import { AcquisitionService } from "../../../../../Services/acquisition.service"; 
import { AuthenticationService } from "../../../../../Services/authentication.service"; 
import { acquisition } from "../../../../../Models/acquisition.model"; 
import { FormGroup, FormBuilder, Validators } from "@angular/forms"; 
import { ToastrService } from "ngx-toastr"; 
import { ClausesService } from ".././../../../../Services/clauses.service"; 
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table"; 
declare var $: any; 
 
@Component({ 
  selector: "app-clausesections", 
  templateUrl: "./clausesections.component.html", 
  styleUrls: ["./clausesections.component.css"] 
}) 
export class ClausesectionsComponent implements OnInit, OnChanges { 
  @Input() clauseInfo: string; 

  //Created by John Swann 
  sectionData1; 
  clauseData; 
  OutputDecription; 
  OutputHeader; 
  clauseDescriptionId; 
  OutputDec: boolean = true; 
  OutputHea: boolean = false; 
  clauseDesc: any; 
  formData: any; 
  title: string; 
  section: string; 
  sectionid; 
  sow_text; 
  clauseData1: any; 
  dataSource; 
  socid:string;

  specialclauses=['52.212-3','52.212-5','52.212-2']
 
  OutputDecriptionStatic; 
  OutputHeaderStatic; 
  sectionData: any; 
  sectionData2; 
  sectionForm: FormGroup; 
  canEditCode: boolean = false; 
  hideCode: boolean = true; 
  clauseData2; 
required: any; 
applicable: any; 
optional: any; 
sop:any;
   
 
  displayedColumns: string[] = ["clauseNo","title", "score","pc", "select"]; 
  searchKey: string; 
 
  show:boolean =false; 
  hideclausepreview:boolean= false; 
 
  status; 
  disable; 
  response; 
  solno; 
  hide; 
  selectedclause; 
  addedclauses: any=[];
  changedata={
  }

  allotherclauses=[];

  urlservicename
  allsectionclauses = [];
  addclauserecord=[]
  reset=[];
  resetoptional=[]
  htt;
  sec;


 
  pValue="";
  raoValue= "";
  sectionnamefull; 
  @ViewChild(MatPaginator) paginator: MatPaginator; 
  @ViewChild(MatSort) sort: MatSort; 
 
  constructor( 
    private route: ActivatedRoute, 
    private router: Router, 
    private sectionService: SectionsService, 
    private acqservice: AcquisitionService, 
    private authService: AuthenticationService, 
    private fb: FormBuilder, 
    private toastr: ToastrService, 
    private clauseService: ClausesService,
    private datepipe: DatePipe
  ) {} 
 


  solp:boolean=false;
  soltype="full"
  ngOnInit() { 
    ////console.log(this.clauseInfo); 
    
    let pathname = window.location; 
    let solnum=pathname.toString().split("sol/")[1].split('/')[0]; 
    this.urlservicename =pathname.toString().split("sol/")[1].split('/')[1]; 
    this.sec = this.urlservicename;
    console.log('URLServicename',this.urlservicename)
   
    //MAP KEY of all section names 
     
    let sectionmap = { 
      "suppliesandservices":"SUPPLY", 
      "statementofwork":"SOW", 
      "packagingandmarking":"PACKAGING", 
      "inspectionandacceptance":"INSPECTION", 
      "deliveriesandperformance":"DELIVERY", 
      "contractadmindata":"CONTRACT_ADMIN", 
      "specialcontractreq":"CONTRACT_REQ", 
      "contractclauses":"CONTRACT_CLAUSE",
      "representationandcerts":"CERT", 
      "instructions":"INSTRUCTION",
      "solprovisions":"CONTRACT_CLAUSE",
      "evluationfactors":"Evaluation_Criteria",
      "a-suppliesandservices":"SUPPLY", 
      "a-statementofwork":"SOW", 
      "a-packagingandmarking":"PACKAGING", 
      "a-inspectionandacceptance":"INSPECTION", 
      "a-deliveriesandperformance":"DELIVERY", 
      "a-contractadmindata":"CONTRACT_ADMIN", 
      "a-specialcontractreq":"CONTRACT_REQ", 
      "a-contractclauses":"CONTRACT_CLAUSE",
      "a-representationandcerts":"CERT", 
      "a-instructions":"INSTRUCTION",
      "a-solprovisions":"CONTRACT_CLAUSE",
      "a-evluationfactors":"Evaluation_Criteria" 

    } ;

    if(this.urlservicename == 'solprovisions' || this.urlservicename == 'a-solprovisions' ){
      this.solp=true
    }
    //GET Section Name 
    let sectionname = sectionmap[this.urlservicename]; 
    this.sectionnamefull = sectionname.toLowerCase().replace('_',"-"); 
    
    
    
     // Script to check if Amendment Exist
     this.acqservice.getsoldappids(solnum).subscribe(info=>{
      
      if(typeof info.amendment_no != undefined && this.urlservicename.includes('a-') == true){
        console.warn('Amendment Found')
        this.acqservice.getfullammend(info.amendment_no).subscribe(res =>{ 
          console.log('Full AmendResponse',res)
          this.changedata=res.SOC
          //If section is not added to SOC JSON then added it
          if( typeof this.changedata[`${this.urlservicename.includes('solprovisions')?'provisions':this.sectionnamefull}ClauseChanges`] == 'undefined'){
            this.changedata[`${this.urlservicename.includes('solprovisions')?'provisions':this.sectionnamefull}ClauseChanges`] = []
          }
          console.log('Full Changes',this.changedata)
          this.socid = res.SOC.id;
          this.response = res.FORM; 
          this.soltype = res.FORM.productKind;
          console.log(this.soltype,this.response); 
          if(res.FORM.status != undefined){ 
            this.status = res.FORM.status; 
          }  
          this.sectionid = res[sectionname].id; 
          console.log("section ID", this.sectionid)
          //this.addedclauses =  res[sectionname].clause.addedclauses?res[sectionname].clause.addedclauses:[]; 
          console.log('intital added clauses',this.addedclauses)
        
      
          this.acqservice.getUserprofile().subscribe(response => { 
            //Code to verify the user is the Main CO 
            let validate =(text)=>{ 
              if(text =="false"){ 
                this.disable = true; 
                ////console.log('val',this.disable) 
              }else{ 
                this.disable = this.response.pointsofContact[1] == response.pkId?false:true; 
              } 
              //  
            } 
             this.status.includes("Re-Published") == false?validate("true"):validate("false");   
          }) 
         
     
     
        });
        
      }else{
        this.acqservice.getfullsol(solnum).subscribe(res =>{ 
          console.warn('Full SOL Response',res)
          
          this.response = res.SOL; 
          this.soltype = res.SOL.productKind;
          console.log(this.soltype,this.response); 
          if(res.SOL.status != undefined){ 
            this.status = res.SOL.status; 
          }  
          this.sectionid = res[sectionname].id; 
          console.log("section ID", this.sectionid)
          //this.addedclauses =  res[sectionname].clause.addedclauses?res[sectionname].clause.addedclauses:[]; 
          console.log('intital added clauses',this.addedclauses)
        
      
          this.acqservice.getUserprofile().subscribe(response => { 
            //Code to verify the user is the Main CO 
            let validate =(text)=>{ 
              if(text =="false"){ 
                this.disable = true; 
                ////console.log('val',this.disable) 
              }else{ 
                this.disable = this.response.pointsofContact[1] == response.pkId?false:true; 
              } 
              //  
            } 
             this.status == "Initiated"?validate("true"):validate("false");   
          }) 
         
     
     
        });
      }
     })
   
    
    
    
  
 
  } 

  
  ngOnChanges() { 
    this.raoValue='';
    this.pValue='';
    this.solno = this.route.snapshot.parent.params.sid; 
   // this.ngOnInit(); 
    console.log(this.clauseInfo); 
    this.allsectionclauses=[];
    this.allotherclauses =[];
    
    
  if(this.clauseInfo != '' && this.clauseInfo != undefined && this.clauseInfo != 'undefined'){ 
    this.clauseData = this.clauseInfo; 
    console.log('***Console Log Clauses DAta JSON',this.clauseData); 
    
    try{
      if(this.clauseData[0].required != undefined){
        this.required =this.clauseData[0].required;
        this.required.forEach(elem => {
          elem.rao = "R";
           //ensure the ibr is true
          if(this.specialclauses.includes(elem.id)){
            elem.ibr = true;
          } 
          //Script to add the form to clause
          this.allsectionclauses.push(elem)
        });
      } 
  
      if(this.clauseData[1].applicable != undefined){
        this.applicable = this.clauseData[1].applicable;
        this.applicable.forEach(elem => {
          elem.rao = "A";
          //ensure the ibr is true
          if(this.specialclauses.includes(elem.id)){
            elem.ibr = true;
          }
          this.allsectionclauses.push(elem)
        });
      };
      if(this.clauseData[2].optional != undefined){
        this.optional = this.clauseData[2].optional;
        this.optional.forEach(elem => {
          elem.rao = "O";
            //ensure the ibr is true
          this.allsectionclauses.push(elem)
        });
      } 
      if(this.clauseData[3]){
        if(this.clauseData[3].others){
          this.allotherclauses = JSON.parse(JSON.stringify(this.sortnumerically(this.clauseData[3].others)))
          
          
        }
      }
    }catch(e){
      console.warn(e)
    }
      
    
    
    try{
      this.hide = (this.required == '' && this.applicable == '' && this.optional == '' && this.addedclauses == '');
      this.addedclauses = this.sortnumerically(this.allsectionclauses)
      this.reset = JSON.parse(JSON.stringify(this.allsectionclauses));
      this.reset = this.sortnumerically(this.reset)
      this.resetoptional = JSON.parse(JSON.stringify(this.optional));
      
      console.log("****ALL R/A/O Clauses*****",this.allsectionclauses);
   
      //Script to set the clause 52-212-5
      this.update522125();
      this.getClauselib(); 
    }catch(e){
      console.warn(e)
    }
 


  } 

   



  }
  
  
  //Function to sort clauses numberically
  sortnumerically(clause){
      return clause.sort(function(a,b){
        
      if(a.id != undefined && b.id != undefined ){
        let asplit = a.id.split('-');
        let bsplit = b.id.split('-');
        let na;
        let nb;
        //  console.log(a.id.length,asplit);
        
        if(parseInt(asplit[1]) < 10 && asplit[1].length <2){
          na = `${asplit[0]}-0${asplit[1]}`
          
        }else{
          na = a.id
        }
  
        if(parseInt(bsplit[1]) < 10 && bsplit[1].length <2){
          nb = `${bsplit[0]}-0${bsplit[1]} `
        }else{
          nb= b.id
        }
        
  
        na=na.replace(/\D/g,'');
        nb=nb.replace(/\D/g,'')
        // console.log(na,nb)
        a = parseInt(na);
        b = parseInt(nb);
        return a-b
      }
        
      });
    
   
   
  }
 
  update522125(){
    this.htt = `
    <p><strong>52.212-5 Contract Terms and Conditions Required To Implement Statutes or Executive
                 Orders&mdash;Commercial Items.</strong></p>
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
             <p>_${this.checkclauses('52.203-6')}_ (1) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_200_206.html#wp1137622">52.203-6</a>,
               Restrictions on Subcontractor Sales to the Government (Sept 2006), with Alternate I (Oct 1995) (<a
                 href="http://uscode.house.gov/">41 U.S.C. 4704</a> and <a href="http://uscode.house.gov/">10 U.S.C.
                 2402</a>).</p>
             <p>_${this.checkclauses('52.203-13')}_ (2) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_200_206.html#wp1141983">52.203-13</a>,
               Contractor Code of Business Ethics and Conduct (Oct 2015) (<a href="http://uscode.house.gov/">41 U.S.C.
                 3509</a>)).</p>
             <p>__${this.checkclauses('52.203-15')}__ (3) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_200_206.html#wp1144881">52.203-15</a>,
               Whistleblower Protections under the American Recovery and Reinvestment Act of 2009 (June 2010) (Section
               1553 of Pub. L. 111-5). (Applies to contracts funded by the American Recovery and Reinvestment Act of
               2009.)</p>
             <p>__${this.checkclauses('52.204-10')}__ (4) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_200_206.html#wp1141649">52.204-10</a>,
               Reporting Executive Compensation and First-Tier Subcontract Awards (Oct 2016) (Pub. L. 109-282) (<a
                 href="http://uscode.house.gov/">31 U.S.C. 6101 note</a>).</p>
             <p>____ (5) [Reserved].</p>
             <p>__${this.checkclauses('52.204-14')}__ (6) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_200_206.html#wp1151163">52.204-14</a>,
               Service Contract Reporting Requirements (Oct 2016) (Pub. L. 111-117, section 743 of Div. C).</p>
             <p>__${this.checkclauses('52.204-15')}__ (7) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_200_206.html#wp1151299">52.204-15</a>,
               Service Contract Reporting Requirements for Indefinite-Delivery Contracts (Oct 2016) (Pub. L. 111-117,
               section 743 of Div. C).</p>
             <p>__${this.checkclauses('52.209-6')}__ (8) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_207_211.html#wp1140926">52.209-6</a>,
               Protecting the Government&rsquo;s Interest When Subcontracting with Contractors Debarred, Suspended, or
               Proposed for Debarment. (Oct 2015) (31 U.S.C. 6101 note).</p>
             <p>__${this.checkclauses('52.209-9')}__ (9) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_207_211.html#wp1145644">52.209-9</a>,
               Updates of Publicly Available Information Regarding Responsibility Matters (Jul 2013) (41 U.S.C. 2313).
             </p>
             <p>____ (10) [Reserved].</p>
             <p>__${this.checkclauses('52.219-3')}__ (11)(i) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_217_221.html#wp1135955">52.219-3</a>,
               Notice of HUBZone Set-Aside or Sole-Source Award (Nov 2011) (<a
                 href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t13t16+492+90++%2815%29%20%20AND%20%28%2815%29%20ADJ%20USC%29%3ACITE%20%20%20%20%20%20%20%20%20">15
                 U.S.C. 657a</a>).</p>
             <p>__${this.checkclauses('52.219-3')}__ (ii) Alternate I (Nov 2011) of <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_217_221.html#wp1135955">52.219-3</a>.
             </p>
             <p>__${this.checkclauses('52.219-4')}__ (12)(i) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_217_221.html#wp1135970">52.219-4</a>,
               Notice of Price Evaluation Preference for HUBZone Small Business Concerns (Oct 2014) (if the offeror
               elects to waive the preference, it shall so indicate in its offer) (<a
                 href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t13t16+492+90++%2815%29%20%20AND%20%28%2815%29%20ADJ%20USC%29%3ACITE%20%20%20%20%20%20%20%20%20">15
                 U.S.C. 657a</a>).</p>
             <p>__${this.checkclauses('52.219-4')}__ (ii) Alternate I (Jan 2011) of <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_217_221.html#wp1135970">52.219-4</a>.
             </p>
             <p>____ (13) [Reserved]</p>
             <p>__${this.checkclauses('52.219-6')}__ (14)(i) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_217_221.html#wp1136004">52.219-6</a>,
               Notice of Total Small Business Set-Aside (Nov 2011) (<a
                 href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t13t16+492+90++%2815%29%20%20AND%20%28%2815%29%20ADJ%20USC%29%3ACITE%20%20%20%20%20%20%20%20%20">15
                 U.S.C. 644</a>).</p>
             <p>__${this.checkclauses('52.203-6')}__ (ii) Alternate I (Nov 2011).</p>
             <p>__${this.checkclauses('52.203-6')}__ (iii) Alternate II (Nov 2011).</p>
 
 
             <p>__${this.checkclauses('52.219-7')}__ (15)(i) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_217_221.html#wp1136017">52.219-7</a>,
               Notice of Partial Small Business Set-Aside (June 2003) (<a
                 href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t13t16+492+90++%2815%29%20%20AND%20%28%2815%29%20ADJ%20USC%29%3ACITE%20%20%20%20%20%20%20%20%20">15
                 U.S.C. 644</a>).</p>
 
 
             <p>__${this.checkclauses('52.219-7')}__ (ii) Alternate I (Oct 1995) of <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_217_221.html#wp1136017">52.219-7</a>.
             </p>
             <p>__${this.checkclauses('52.219-7')}__ (iii) Alternate II (Mar 2004) of <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_217_221.html#wp1136017">52.219-7</a>.
             </p>
 
 
             <p>__${this.checkclauses('52.219-8')}__ (16) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_217_221.html#wp1136032">52.219-8</a>,
               Utilization of Small Business Concerns (Nov 2016) (<a
                 href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t13t16+492+90++%2815%29%20%20AND%20%28%2815%29%20ADJ%20USC%29%3ACITE%20%20%20%20%20%20%20%20%20">15
                 U.S.C. 637(d)(2)</a> and (3)).</p>
 
 
             <p>__${this.checkclauses('52.219-9')}__ (17)(i) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_217_221.html#wp1136058">52.219-9</a>,
               Small Business Subcontracting Plan (Aug 2018) (<a
                 href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t13t16+492+90++%2815%29%20%20AND%20%28%2815%29%20ADJ%20USC%29%3ACITE%20%20%20%20%20%20%20%20%20">15
                 U.S.C. 637(d)(4)</a>).</p>
             <p>__${this.checkclauses('52.219-9')}__ (ii) Alternate I (Nov 2016) of <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_217_221.html#wp1136058">52.219-9</a>.
             </p>
             <p>__${this.checkclauses('52.219-9')}__ (iii) Alternate II (Nov 2016) of <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_217_221.html#wp1136058">52.219-9</a>.
             </p>
             <p>__${this.checkclauses('52.219-9')}__ (iv) Alternate III (Nov 2016) of <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_217_221.html#wp1136058">52.219-9</a>.
             </p>
             <p>__${this.checkclauses('52.219-9')}__ (v) Alternate IV (Aug 2018) of <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_217_221.html#wp1136058">52.219-9</a>.
             </p>
             <p>__${this.checkclauses('52.219-13')}__ (18) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_217_221.html#wp1136174">52.219-13</a>,
               Notice of Set-Aside of Orders (Nov 2011) (<a href="http://uscode.house.gov">15 U.S.C. 644(r)</a>).</p>
             <p>__${this.checkclauses('52.219-14')}__ (19) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_217_221.html#wp1136175">52.219-14</a>,
               Limitations on Subcontracting (Jan 2017) (<a
                 href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t13t16+492+90++%2815%29%20%20AND%20%28%2815%29%20ADJ%20USC%29%3ACITE%20%20%20%20%20%20%20%20%20">15
                 U.S.C. 637(a)(14)</a>).</p>
             <p>__${this.checkclauses('52.219-16')}__ (20) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_217_221.html#wp1136186">52.219-16</a>,
               Liquidated Damages&mdash;Subcon-tracting Plan (Jan 1999) (<a
                 href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t13t16+492+90++%2815%29%20%20AND%20%28%2815%29%20ADJ%20USC%29%3ACITE%20%20%20%20%20%20%20%20%20">15
                 U.S.C. 637(d)(4)(F)(i)</a>).</p>
             <p>__${this.checkclauses('52.219-27')}__ (21) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_217_221.html#wp1136387">52.219-27</a>,
               Notice of Service-Disabled Veteran-Owned Small Business Set-Aside (Nov 2011) (<a
                 href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t13t16+492+90++%2815%29%20%20AND%20%28%2815%29%20ADJ%20USC%29%3ACITE%20%20%20%20%20%20%20%20%20">15
                 U.S.C. 657 f</a>).</p>
             <p>__${this.checkclauses('52.219-28')}__ (22) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_217_221.html#wp1139913">52.219-28</a>,
               Post Award Small Business Program Rerepresentation (Jul 2013) (<a
                 href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t13t16+492+90++%2815%29%20%20AND%20%28%2815%29%20ADJ%20USC%29%3ACITE%20%20%20%20%20%20%20%20%20">15
                 U.S.C. 632(a)(2)</a>).</p>
             <p>__${this.checkclauses('52.219-29')}__ (23) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_217_221.html#wp1144950">52.219-29</a>,
               Notice of Set-Aside for, or Sole Source Award to, Economically Disadvantaged Women-Owned Small Business
               Concerns (Dec 2015) (<a href="http://uscode.house.gov">15 U.S.C. 637(m)</a>).</p>
             <p>__${this.checkclauses('52.219-30')}__ (24) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_217_221.html#wp1144420">52.219-30</a>,
               Notice of Set-Aside for, or Sole Source Award to, Women-Owned Small Business Concerns Eligible Under the
               Women-Owned Small Business Program (Dec 2015) (<a href="http://uscode.house.gov">15 U.S.C. 637(m)</a>).
             </p>
             <p>__${this.checkclauses('52.222-3')}__ (25) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1147479">52.222-3</a>,
               Convict Labor (June 2003) (E.O. 11755).</p>
             <p>__${this.checkclauses('52.222-19')}__ (26) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1147630">52.222-19</a>,
               Child Labor&mdash;Cooperation with Authorities and Remedies (Jan 2018) (E.O. 13126).</p>
             <p>__${this.checkclauses('52.222-21')}__ (27) <a
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
 
 
             <p>__${this.checkclauses('52.222-37')}__ (31) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1148123">52.222-37</a>,
               Employment Reports on Veterans (Feb 2016) (38 U.S.C. 4212).</p>
             <p>__${this.checkclauses('52.222-40')}__ (32) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1160019">52.222-40</a>,
               Notification of Employee Rights Under the National Labor Relations Act (Dec 2010) (E.O. 13496).</p>
             <p>__${this.checkclauses('52.222-50')}__ (33)(i) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1151848">52.222-50</a>,
               Combating Trafficking in Persons (Mar 2015) (<a href="http://uscode.house.gov/">22 U.S.C. chapter 78</a>
               and E.O. 13627).</p>
             <p>__${this.checkclauses('52.222-50')}__ (ii) Alternate I (Mar 2015) of <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1151848">52.222-50</a>
               (<a href="http://uscode.house.gov/">22 U.S.C. chapter 78</a> and E.O. 13627).</p>
             <p>__${this.checkclauses('52.222-54')}__ (34) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1156645">52.222-54</a>,
               Employment Eligibility Verification (Oct 2015). (Executive Order 12989). (Not applicable to the
               acquisition of commercially available off-the-shelf items or certain other types of commercial items as
               prescribed in <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/Subpart%2022_18.html#wp1089948">22.1803</a>.)
             </p>
             <p>__${this.checkclauses('52.223-9')}__ (35)(i) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1168892">52.223-9</a>,
               Estimate of Percentage of Recovered Material Content for EPA&ndash;Designated Items (May 2008) (<a
                 href="http://uscode.house.gov/">42 U.S.C. 6962(c)(3)(A)(ii)</a>). (Not applicable to the acquisition of
               commercially available off-the-shelf items.)</p>
             <p>__${this.checkclauses('52.223-9')}__ (ii) Alternate I (May 2008) of <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1168892">52.223-9</a>
               (<a
                 href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t41t42+250+1286++%2842%29%20%20AND%20%28%2842%29%20ADJ%20USC%29%3ACITE%20%20%20%20%20%20%20%20%20">42
                 U.S.C. 6962(i)(2)(C)</a>). (Not applicable to the acquisition of commercially available off-the-shelf
               items.)</p>
             <p>__${this.checkclauses('52.223-11')}__ (36) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1168917">52.223-11</a>,
               Ozone-Depleting Substances and High Global Warming Potential Hydrofluorocarbons (Jun 2016) (E.O. 13693).
             </p>
             <p>__${this.checkclauses('52.223-12')}__ (37) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1168928">52.223-12</a>,
               Maintenance, Service, Repair, or Disposal of Refrigeration Equipment and Air Conditioners (Jun 2016) (E.O.
               13693).</p>
             <p>__${this.checkclauses('52.223-13')}__ (38)(i) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1168933">52.223-13</a>,
               Acquisition of EPEAT&reg;-Registered Imaging Equipment (Jun 2014) (E.O.s 13423 and 13514).</p>
             <p>__${this.checkclauses('52.223-13')}__ (ii) Alternate I (Oct 2015) of <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1168933">52.223-13</a>.
             </p>
             <p>__${this.checkclauses('52.223-14')}__ (39)(i) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1194330">52.223-14</a>,
               Acquisition of EPEAT&reg;-Registered Televisions (Jun 2014) (E.O.s 13423 and 13514).</p>
             <p>__${this.checkclauses('52.203-6')}__ (ii) Alternate I (Jun 2014) of <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1194330">52.223-14</a>.
             </p>
             <p>__${this.checkclauses('52.223-15')}__ (40) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1194323">52.223-15</a>,
               Energy Efficiency in Energy-Consuming Products (Dec 2007) (<a href="http://uscode.house.gov/">42 U.S.C.
                 8259b</a>).</p>
             <p>__${this.checkclauses('52.223-16')}__ (41)(i) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1179078">52.223-16</a>,
               Acquisition of EPEAT&reg;-Registered Personal Computer Products (Oct 2015) (E.O.s 13423 and 13514).</p>
             <p>__${this.checkclauses('52.223-16')}__ (ii) Alternate I (Jun 2014) of <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1179078">52.223-16</a>.
             </p>
             <p>__${this.checkclauses('52.223-18')}__ (42) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1188603">52.223-18</a>,
               Encouraging Contractor Policies to Ban Text Messaging While Driving (Aug 2011) (E.O. 13513).</p>
             <p>__${this.checkclauses('52.223-20')}__ (43) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1189174">52.223-20</a>,
               Aerosols (Jun 2016) (E.O. 13693).</p>
             <p>__${this.checkclauses('52.223-21')}__ (44) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1197699">52.223-21</a>,
               Foams (Jun 2016) (E.O. 13693).</p>
             <p>__${this.checkclauses('52.224-3')}__ (45)(i) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1192898">52.224-3</a>,
               Privacy Training (JAN 2017) (5 U.S.C. 552a).</p>
             <p>__ (ii) Alternate I (JAN 2017) of 52.224-3.</p>
             <p>__ (46) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1192900">52.225-1</a>,
               Buy American&mdash;Supplies (May 2014) (<a href="http://uscode.house.gov/">41 U.S.C. chapter 83</a>).</p>
             <p>__${this.checkclauses('52.225-3')}__ (47)(i) <a
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
             <p>__${this.checkclauses('52.225-5')}__ (48) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1169151">52.225-5</a>,
               Trade Agreements (Aug 2018) (<a
                 href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t17t20+1727+50++%2819%29%20%20AND%20%28%2819%29%20ADJ%20USC%29%3ACITE%20%20%20%20%20%20%20%20%20">19
                 U.S.C. 2501</a>, <em>et seq</em>., <a
                 href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t17t20+1727+50++%2819%29%20%20AND%20%28%2819%29%20ADJ%20USC%29%3ACITE%20%20%20%20%20%20%20%20%20">19
                 U.S.C. 3301</a> note).</p>
             <p>__${this.checkclauses('52.225-13')}__ (49) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1169608">52.225-13</a>,
               Restrictions on Certain Foreign Purchases (June 2008) (E.O.&rsquo;s, proclamations, and statutes
               administered by the Office of Foreign Assets Control of the Department of the Treasury).</p>
             <p>__${this.checkclauses('52.225-26')}__ (50) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1192524">52.225-26</a>,
               Contractors Performing Private Security Functions Outside the United States (Oct 2016) (Section 862, as
               amended, of the National Defense Authorization Act for Fiscal Year 2008;<a
                 href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t09t12+1445+65++%2810%20U.S.C.%202302%20Note%29%20%20%20%20%20%20%20%20%20%20">
                 10 U.S.C. 2302 Note)</a>.</p>
             <p>__${this.checkclauses('52.226-4')}__ (51) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1173773">52.226-4</a>,
               Notice of Disaster or Emergency Area Set-Aside (Nov 2007) (<a
                 href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t41t42+250+1286++%2842%29%20%20AND%20%28%2842%29%20ADJ%20USC%29%3ACITE%20%20%20%20%20%20%20%20%20">42
                 U.S.C. 5150</a>).</p>
             <p>__${this.checkclauses('52.226-5')}__ (52) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1173393">52.226-5</a>,
               Restrictions on Subcontracting Outside Disaster or Emergency Area (Nov 2007) (<a
                 href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t41t42+250+1286++%2842%29%20%20AND%20%28%2842%29%20ADJ%20USC%29%3ACITE%20%20%20%20%20%20%20%20%20">42
                 U.S.C. 5150</a>).</p>
             <p>__${this.checkclauses('52.232-29')}__ (53) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_232.html#wp1153230">52.232-29</a>,
               Terms for Financing of Purchases of Commercial Items (Feb 2002) (<a href="http://uscode.house.gov/">41
                 U.S.C. 4505</a>, <a href="http://uscode.house.gov/">10 U.S.C. 2307(f)</a>).</p>
             <p>__${this.checkclauses('52.232-30')}__ (54) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_232.html#wp1153252">52.232-30</a>,
               Installment Payments for Commercial Items (Jan 2017) (<a href="http://uscode.house.gov/">41 U.S.C.
                 4505</a>, <a href="http://uscode.house.gov/">10 U.S.C. 2307(f)</a>).</p>
             <p>__${this.checkclauses('52.232-33')}__ (55) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_232.html#wp1153351">52.232-33</a>,
               Payment by Electronic Funds Transfer&mdash;System for Award Management (Jul 2013) (<a
                 href="http://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title31-section3332&amp;num=0&amp;edition=prelim">31
                 U.S.C. 3332</a>).</p>
             <p>__${this.checkclauses('52.232-34')}__ (56) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_232.html#wp1153375">52.232-34</a>,
               Payment by Electronic Funds Transfer&mdash;Other than System for Award Management (Jul 2013) (<a
                 href="http://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title31-section3332&amp;num=0&amp;edition=prelim">31
                 U.S.C. 3332</a>).</p>
             <p>__${this.checkclauses('52.232-36')}__ (57) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_232.html#wp1153445">52.232-36</a>,
               Payment by Third Party (May 2014) (<a
                 href="http://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title31-section3332&amp;num=0&amp;edition=prelim">31
                 U.S.C. 3332</a>).</p>
             <p>__${this.checkclauses('52.239-1')}__ (58) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_233_240.html#wp1113650">52.239-1</a>,
               Privacy or Security Safeguards (Aug 1996) (<a
                 href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t05t08+2+3++%285%29%20%20AND">5
                 U.S.C. 552a</a>).</p>
             <p>__${this.checkclauses('52.242-5')}__ (59) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_241_244.html#wp1128833">52.242-5</a>,
               Payments to Small Business Subcontractors (Jan 2017)(15 U.S.C. 637(d)(12)).</p>
             <p>__${this.checkclauses('52.247-64')}__ (60)(i) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_247.html#wp1156217">52.247-64</a>,
               Preference for Privately Owned U.S.-Flag Commercial Vessels (Feb 2006) (<a
                 href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t45t48+351+1++%2846%29%20%20AND%20%28%2846%29%20ADJ%20USC%29%3ACITE%20%20%20%20%20%20%20%20%20">46
                 U.S.C. Appx. 1241(b)</a> and <a
                 href="http://uscode.house.gov/uscode-cgi/fastweb.exe?getdoc+uscview+t09t12+37+408++%2810%29%20%252">10
                 U.S.C. 2631</a>).</p>
             <p>__${this.checkclauses('52.247-64')}__ (ii) Alternate I (Apr 2003) of <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_247.html#wp1156217">52.247-64</a>.
             </p>
             <p>__${this.checkclauses('52.247-64')}__ (iii) Alternate II (Feb 2006) of <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_247.html#wp1156217">52.247-64</a>.
             </p>
             <p>(c) The Contractor shall comply with the FAR clauses in this paragraph (c), applicable to commercial
               services, that the Contracting Officer has indicated as being incorporated in this contract by reference
               to implement provisions of law or Executive orders applicable to acquisitions of commercial items:</p>
             <p>[<em>Contracting Officer check as appropriate.</em>]</p>
             <p>__${this.checkclauses('52.222-17')}__ (1) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1147587">52.222-17</a>,
               Nondisplacement of Qualified Workers (May 2014)(E.O. 13495).</p>
             <p>__${this.checkclauses('52.222-41')}__ (2) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1160021">52.222-41</a>,
               Service Contract Labor Standards (Aug 2018) (<a href="http://uscode.house.gov/">41 U.S.C. chapter 67</a>).
             </p>
             <p>__${this.checkclauses('52.222-42')}__ (3) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1153423">52.222-42</a>,
               Statement of Equivalent Rates for Federal Hires (May 2014) (<a href="http://uscode.house.gov/">29 U.S.C.
                 206</a> and <a href="http://uscode.house.gov/">41 U.S.C. chapter 67</a>).</p>
             <p>__${this.checkclauses('52.222-43')}__ (4) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1148260">52.222-43</a>,
               Fair Labor Standards Act and Service Contract Labor Standards-Price Adjustment (Multiple Year and Option
               Contracts) (Aug 2018) (<a href="http://uscode.house.gov/">29 U.S.C. 206</a> and <a
                 href="http://uscode.house.gov/">41 U.S.C. chapter 67</a>).</p>
             <p>__${this.checkclauses('52.222-44')}__ (5) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1148274">52.222-44</a>,
               Fair Labor Standards Act and Service Contract Labor Standards&mdash;Price Adjustment (May 2014) (<a
                 href="http://uscode.house.gov/">29 U.S.C. 206</a> and <a href="http://uscode.house.gov/">41 U.S.C.
                 chapter 67</a>).</p>
             <p>__${this.checkclauses('52.222-51')}__ (6) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1155380">52.222-51</a>,
               Exemption from Application of the Service Contract Labor Standards to Contracts for Maintenance,
               Calibration, or Repair of Certain Equipment&mdash;Requirements (May 2014) (<a
                 href="http://uscode.house.gov/">41 U.S.C. chapter 67</a>).</p>
             <p>__${this.checkclauses('52.222-53')}__ (7) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1162590">52.222-53</a>,
               Exemption from Application of the Service Contract Labor Standards to Contracts for Certain
               Services&mdash;Requirements (May 2014) (<a href="http://uscode.house.gov/">41 U.S.C. chapter 67</a>).</p>
             <p>__${this.checkclauses('52.222-55')}__ (8) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1163027">52.222-55</a>,
               Minimum Wages Under Executive Order 13658 (Dec 2015).</p>
             <p>__${this.checkclauses('52.222-62')}__ (9) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_222.html#wp1170084">52.222-62</a>,
               Paid Sick Leave Under Executive Order 13706 (JAN 2017) (E.O. 13706).</p>
             <p>__${this.checkclauses('52.226-6')}__ (10) <a
                 href="https://www.acquisition.gov/sites/default/files/current/far/html/52_223_226.html#wp1183820">52.226-6</a>,
               Promoting Excess Food Donation to Nonprofit Organizations (May 2014) (<a
                 href="http://uscode.house.gov/">42 U.S.C. 1792</a>).</p>
             <p>__${this.checkclauses('52.237-11')}__ (11) <a
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
    `
    // console.log('*******FULLLL 52.212-5 HTML',this.htt);

    this.applicable.forEach(element => {
      if(element.id == '52.212-5'){
        if(element.alt == 0){
          element.description_html = this.htt;
        } 
      }
    });

    this.required.forEach(element => {
      if(element.id == '52.212-5'){
        if(element.alt == 0){
          element.description_html = this.htt;
        
        } 
      }
    });

      // setTimeout(() => {
      //   this.clauseupdatei();
      // }, 1500);
   


  }
 
 

   getClauselib() { 
     console.log('**Called getClauseLib')

    if( this.allotherclauses.length == 0){
      // IF the other claues are not in the section json.
       this.clauseService.getAllClauses().subscribe(response =>{
        this.allotherclauses = response;

         console.warn('unfilter get all Clauses', this.allotherclauses );
         this.allsectionclauses.forEach(item =>{
           this.allotherclauses =  this.allotherclauses.filter(clauseid=>{
             clauseid.score = 0.01;
              return clauseid.id != item.id
         })
        });

        console.log('After filter get all Clauses', this.allotherclauses );  

       if(this.sec == 'solprovisions'|| this.sec == 'a-solprovisions'){
        this.clauseData2 =  this.allotherclauses.filter(elem=>{
          return elem.p_or_c == "P"
        }) ; 
       } 

       if(this.sec != 'solprovisions' && this.sec != 'a-solprovisions'){
        this.clauseData2 =  this.allotherclauses.filter(elem=>{
          return elem.p_or_c == "C"
        }) ; 
       } 
       
      this.clauseData2 = this.allotherclauses
      console.warn('SOLDATA2',this.clauseData2)
      this.dataSource = new MatTableDataSource(this.clauseData2); 
      this.dataSource.paginator = this.paginator; 
      this.dataSource.sort = this.sort; 
      console.log("datasource",this.dataSource.data); 
      //console.log(this.clauseData2[0].description); 

      this.OutputDecriptionStatic = this.clauseData2[0]?this.clauseData2[0].description:''; 
       this.OutputHeaderStatic = this.clauseData2[0]?this.clauseData2[0].clauseNo:""; 


       })
   }
   
   else{
   // IF the other claues are  in the section json.
      
       console.log('unfilter get all Clauses', this.allotherclauses );

       this.allsectionclauses.forEach(item =>{
        this.clauseData2 =  this.allotherclauses.filter(clauseid=>{
            return clauseid.id != item.id
        })
      });

     console.log('Before Provision filter get all Clauses', this.allotherclauses );  

     if(this.sec == 'solprovisions' || this.sec == 'a-solprovisions'){
       console.log('****Filtered to Remove C Clauses')
      this.clauseData2 =  this.allotherclauses.filter(elem=>{
        return elem.p_or_c == "P"
      }) ; 
     } 

     if(this.sec != 'solprovisions' && this.sec != 'a-solprovisions'){
      console.log('****Filtered to Remove P Clauses')
      this.clauseData2 =  this.allotherclauses.filter(elem=>{
        return elem.p_or_c == "C"
      }) ; 
     } 

     console.log('After Provision Filter',this.clauseData2)

    this.dataSource = new MatTableDataSource(this.clauseData2); 
    this.dataSource.paginator = this.paginator; 
    this.dataSource.sort = this.sort; 
    console.log("datasource",this.dataSource.data); 
    ////console.log(this.clauseData2[0].description); 

    this.OutputDecriptionStatic = this.clauseData2[0]?this.clauseData2[0].description:''; 
     this.OutputHeaderStatic = this.clauseData2[0]?this.clauseData2[0].clauseNo:""; 

     }
    
      
    
    
   } 
 
   
 
 
  viewEle(selClause: any, boolean) { 
     
    //console.log(boolean); 
    this.OutputDec = false; 
    this.OutputHea = true; 
    this.OutputHeader = selClause.id; 
    this.clauseService.getClauseDesc(this.OutputHeader,selClause.alt).subscribe(response =>{
    this.OutputDecription = response.description; 
    })
    this.hideclausepreview = boolean; 
    // this.selectedclause = selClause; 
  } 
 
  getClauseNo(clause) { 
    // console.log(clause); 
    this.selectedclause = clause;

    this.clauseService.getClauseDesc(clause.id,clause.alt).subscribe(reponse => { 
      if (reponse) { 
        
        this.clauseDescriptionId = reponse;
        this.clauseDescriptionId.alt = this.selectedclause.alt
        // if(this.clauseDescriptionId == ) 
        ////console.log(this.clauseDescriptionId); 
      } else { 
        //console.log("error"); 
      } 
    }); 
  } 
 

  applyFilter(filterValue: string) { 
    this.dataSource.filter = filterValue.trim().toLowerCase(); 
  } 
 
  hideclause(text) {    
   this.show = text; 
  } 
 
  hideclausepreview_function(boolean) { 
    this.hideclausepreview = boolean; 
  } 


  multiadd(elem,event){  
    elem.ibr = false;
    elem.rao = "O";
    let deleteadded = ()=>{
      this.allsectionclauses = this.allsectionclauses.filter(element =>{
        return element.id != elem.id
      });
        this.optional = this.optional.filter(element =>{
          return element.id != elem.id
        });
        this.addclauserecord = this.addclauserecord.filter(element =>{
          return element.id != elem.id
        });
    }

    let addclause =(elem)=>{
      this.allsectionclauses.push(elem);
      this.optional.push(elem) 
      this.addclauserecord.push(elem)
      this.hide = false
    }
    event.target.checked == true?addclause(elem) :deleteadded();
    this.allsectionclauses = this.sortnumerically(this.allsectionclauses)
    if(this.allsectionclauses.length== 0){
      this.hide = true
    }
    console.log('The New addedclauses/allsection array',this.allsectionclauses);
    // this.ngOnChanges();
  };

  onAdd() { 
    
    if(this.urlservicename.includes('a-')==true){
      this.addclauserecord.forEach(c=>{
        let changehtml= `In Section <b>${this.urlservicename.includes('solprovisions')?'SOLICITATION PROVISIONS':this.sectionnamefull.replace(/-/g,' ').toUpperCase()}</b> <b>Clause ${c.id}</b> was <b>ADDED</b> `
        this.changedata[`${this.urlservicename.includes('solprovisions')?'provisions':this.sectionnamefull}ClauseChanges`].push(changehtml)
      })
    }
      console.warn('clause change',this.changedata)

    this.reset = JSON.parse(JSON.stringify(this.allsectionclauses));
    this.reset = this.sortnumerically(this.reset)
    this.resetoptional = JSON.parse(JSON.stringify(this.optional));
    this.allsectionclauses.forEach(elem=>{
      this.allotherclauses = this.allotherclauses.filter(element =>{
        return element.id != elem.id
      });
    })
    this.getClauselib();
    this.OutputDec = false; 
    this.OutputHea = true; 
   
  
     var data = {
        clause: [
        {
            required: this.required,
        },
        {
          applicable: this.applicable,
        },
        {
          optional: this.optional,
        },
        {
          others:  this.allotherclauses
        }
      ]
  }
       console.log('data to send ',data)
       
        this.sectionService.patchclauses(this.sectionid,this.sectionnamefull,data).subscribe(response =>{ 
           
            this.toastr.success(  
              "Clauses Added Successfully",  
            ) 
        }) ;

        this.clauseupdatei();
     
  } 

  resetclauses(){
    console.log('ran',this.reset,this.allsectionclauses)
    this.allsectionclauses = this.reset
    this.optional = this.resetoptional
    if(this.allsectionclauses.length== 0){
      this.hide = true
    }
  }

  //********************* */ All New Methods

  //Function to filter the clause table
  filter(type,p_c){
    console.log(type, p_c);
    this.allsectionclauses = this.reset;

    if( type != ''){

    this.allsectionclauses = this.allsectionclauses.filter( elem =>{
      return elem.rao == type
    });


   }

   if( p_c != ''){
    this.allsectionclauses = this.allsectionclauses.filter( elem =>{
      return elem['p_or_c'] == p_c
    });
   }

  }


//function to delete clause
  delete_clause(sec,clausueNo) { 
    console.log(sec,clausueNo);

    if(sec == "A"){
      this.applicable = this.applicable.filter(elem =>{
        return elem.id != clausueNo.id;
      });

      this.reset = this.reset.filter(elem =>{
        return elem.id != clausueNo.id;
      });

      this.allsectionclauses = this.allsectionclauses.filter(elem =>{
        return elem.id != clausueNo.id;
      });
    

    };


    
  if(sec == "O"){
    this.optional = this.optional.filter(elem =>{
      return elem.id != clausueNo.id;
    });

    this.reset = this.reset.filter(elem =>{
      return elem.id != clausueNo.id;
    });

    this.allsectionclauses = this.allsectionclauses.filter(elem =>{
      return elem.id != clausueNo.id;
    });

    this.addedclauses = this.addedclauses.filter(elem =>{
      return elem.id != clausueNo.id;
    });
   

  };
  //Script to Add the Clause back to the Others clauses
  this.allotherclauses.push(clausueNo)
  this.clauseData2.push(clausueNo)
  if(this.urlservicename.includes('a-') ==true){
    let changehtml= `In Section <b>${this.urlservicename.includes('solprovisions')?'SOLICITATION PROVISIONS':this.sectionnamefull.replace(/-/g,' ').toUpperCase()}</b> <b>Clause ${clausueNo.id}</b> was <b>REMOVED</b> `
    this.changedata[`${this.urlservicename.includes('solprovisions')?'provisions':this.sectionnamefull}ClauseChanges`].push(changehtml)
  }
  this.clauseupdatei();
  this.toastr.success('Clause Deleted Successfully')
  if(this.allsectionclauses.length == 0){
    this.hide = true
  }
  }


  //Script when clause 52.212-2 has been saved.
  SaveForm(item){

    if(typeof (item.var1) != 'undefined' && item.var1 != null && typeof (item.var2) != 'undefined' && item.var2 != null 
    && (typeof (item.box1) != 'undefined' && item.box1 != null && item.box1 != '' 
    || typeof (item.box2) != 'undefined' && item.box2 != null && item.box2 != '' ) ){
      item.complete = 'done'
    }else{
      item.complete = 'not done'
    }
   
    if(item.rao == "A"){
      this.applicable.forEach(element => {
        if(element.id == item.id){
          element = item
         
        }
      });
    };


    
  if(item.rao == "O"){
    this.optional.forEach(element => {
      if(element.id == item.id){
        element = item
       
      }
    });
  };
  if(item.rao == "R"){
    this.optional.forEach(element => {
      if(element.id == item.id){
        element = item
       
      }
    });
  };
    this.clauseupdatei()

  }
  
//function to update the IBR status
  Ibrupdate_clause(event,sec,clausueNo,item) { 
    // this.changedata[`${this.urlservicename.includes('solprovisions')?'provisions':this.sectionnamefull}ClauseChanges`]=[]
    let changehtml= `In Section <b>${this.urlservicename.includes('solprovisions')?'SOLICITATION PROVISIONS':this.sectionnamefull.replace(/-/g,' ').toUpperCase()}</b> <b>Clause ${item.id}</b> IBR was changed from <b>${item.ibr}</b> to `
    event.target.checked == true?item.ibr = true:item.ibr = false;
    console.log(item);

    if(sec == "A"){
      this.applicable.forEach(element => {
        if(element.id == clausueNo){
          element = item
        }
      });
    };


    
  if(sec == "O"){
    this.optional.forEach(element => {
      if(element.id == clausueNo){
        element = item
      }
    });
  };


  changehtml +=`<b>${item.ibr}</b> `;
  this.changedata[`${this.urlservicename.includes('solprovisions')?'provisions':this.sectionnamefull}ClauseChanges`].push(changehtml)
  
    this.clauseupdatei()
  } 

  
// Function to presit clause data to database
  clauseupdatei(){
    this.update522125();
    var data = {
      clause: [
      {
          required: this.required,
      },
      {
        applicable: this.applicable,
      },
      {
        optional: this.optional,
      },
      {
        others:  this.allotherclauses
      }
    ]
}

    console.log('clauseupdatei function ran', data)
    //console.log('Update Json',this.sectionid,this.sectionnamefull,data)
      this.sectionService.patchclauses(this.sectionid,this.sectionnamefull,data).subscribe(response =>{ 
        // console.log('server response',response)
      }) 

      this.patchchanges()
  }


    checkclauses(clauseNo){
      let count = 0;
      // console.log('checking for Clause',clauseNo)
         this.allsectionclauses.filter(elem =>{
           if(elem.id == clauseNo){
             count += 1;
           }
         });

         return count > 0?'X':''
    }
  

    roman(number){
      let romanstring='';
      for(var i=0 ;i<number;i++){
         romanstring = romanstring +'i';
      }
        return `(${romanstring})`;
      
    }

    specialClauseBoxSelectUpdate(box){
      console.log(box)
      if(box == "box1"){
        this.selectedclause.box2 = this.selectedclause.box1 != ''?'':
        this.selectedclause.box2
      }

      if(box == "box2"){
        this.selectedclause.box1 = this.selectedclause.box2 != ''?'':
        this.selectedclause.box1
      }
    }

    patchchanges(){
      if(this.urlservicename.includes('a-')==true){
        console.log('Patching Changes ',this.changedata)
        this.sectionService.patchSectionsChanges(this.socid,'soc', this.changedata).subscribe(response => {
          if (response) {
           console.log('Updated section')
          } else {
           // console.log("Updated Successfully");
          }
        },e=>{
          console.warn('Error Patching Changes',e)
        });
      }
        
      
     
    }
} 
 
