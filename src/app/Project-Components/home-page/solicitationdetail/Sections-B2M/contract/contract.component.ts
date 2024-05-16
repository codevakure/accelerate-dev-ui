import { Component, OnInit } from '@angular/core';
import { AcquisitionService } from "../../../../../Services/acquisition.service";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { SectionsService } from "../../../../../Services/sections.service";

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.css']
})
export class ContractComponent implements OnInit {


  solno;
  status;
  data;
  id;
  sectionname='contract-clause';
  clauseString ;
  disabled;
  response;

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private ap: AcquisitionService,
    private sections: SectionsService
  ) { }

  ngOnInit() {
    this.solno = this.route.snapshot.parent.params.sid;
    console.log(this.solno)
    this.getSectiondata();
  }


  getSectiondata() {
    this.ap.getsoldappids(this.solno).subscribe(response => {
      // console.log(response);
      this.id = response.contractClauseId;

      this.ap.getSolicitation(response.solId).subscribe(response => {
        this.status = response.status;
        this.response = response;
        

      });




      this.sections.getSections(this.id, this.sectionname).subscribe(response => {
       //Script to filter the Contract clauses depending on the Sol type.
    //    if(this.response.productKind =='half'){
    //     this.clauseString = response.clause;

        
    //     let filterrequired = this.clauseString[0].required.filter((elem)=>{
    //       return elem['p_or_c'] == 'C'
    //   })
    

    // let filterrequired2 = this.clauseString[1].applicable.filter((elem)=>{
    //   if(elem.p_or_c == 'C'){
    //     return elem
    //   } 
    // });

    // let filterrequired3 = this.clauseString[2].optional.filter((elem)=>{
    //   if(elem.p_or_c == 'C'){
    //     return elem
    //   } 
    // });

    
    // let filterrequired4 = this.clauseString[4].sop.filter((elem)=>{
    //   if(elem.p_or_c == 'C'){
    //     return elem
    //   } 
    // });

    // let filterrequired5 = this.clauseString[3].others.filter((elem)=>{
    //   if(elem.p_or_c == 'C'){
    //     return elem
    //   } 
    // });

    // this.clauseString[0].required = filterrequired;
    // this.clauseString[1].applicable = filterrequired2;
    // this.clauseString[2].optional = filterrequired3;
    // this.clauseString[4].sop = filterrequired4;
    // this.clauseString[3].others = filterrequired5;

    // }else{
      this.clauseString = response.clause;
    // }


        this.data = response.description;
      });
    });
  }
}
