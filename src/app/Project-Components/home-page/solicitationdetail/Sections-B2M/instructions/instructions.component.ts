import { Component, OnInit } from '@angular/core';
import { AcquisitionService } from "../../../../../Services/acquisition.service";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { SectionsService } from "../../../../../Services/sections.service";

declare var $: any;

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.css']
})
export class InstructionsComponent implements OnInit {

  solno;
  data;
  id;
  sectionname='instruction';
  clauseString = "";
  status;
  disable;
  response;
  hideEditor: boolean = false;
  hideDiv: boolean = false;
  hideclauses:boolean = false;

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private ap: AcquisitionService,
    private sections: SectionsService
  ) {}

  ngOnInit() {
    this.solno = this.route.snapshot.parent.params.sid;
  //  console.log(this.solno)
    this.getSectiondata();
  }


  onContentChanged(event) {
  //this.clauseString = event.html;
    this.sections.patchSections(this.id, this.sectionname, event.html).subscribe(response => {
      if (response) {
        setTimeout(() =>
          this.toastr.success("Error Occured", "Server Error", {
            timeOut: 2000
          })
        );
      } else {
      //  console.log("Updated Successfully");
      }
    });
  }

  getSectiondata() {
    this.ap.getsoldappids(this.solno).subscribe(response => {
      this.id = response.instructionId;
      this.ap.getSolicitation(response.solId).subscribe(response => {
        this.status = response.status;
        this.response = response;
        this.ap.getUserprofile().subscribe(response => {
          //Code to verify the user is the Main CO
          if(this.status == 'Published' || this.status == 'Amendment' || this.status == 'Re-Published' ) {
            this.hideDiv = true;
          } else {
            this.hideEditor = true;
          };

          setTimeout(() => {
            this.hideclauses = true
          }, 100);
        })

      });


              
      //console.log(this.id)
      this.sections.getSections(this.id, this.sectionname).subscribe(response => {
        console.log(response);
        this.clauseString = response.clause;
        this.data = response.description;
        //this.data=response.description? response.description == '<div><br></div>'?'<div><h3><b>L. Instructions</b></h3></div><div><br></div>':response.description:'<div><h3><b>L. Instructions</b></h3></div><div><br></div>';
      });
    });
  }

}


