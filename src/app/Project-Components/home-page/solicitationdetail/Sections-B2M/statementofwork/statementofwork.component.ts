import { Component, OnInit } from '@angular/core';
import { AcquisitionService } from "../../../../../Services/acquisition.service";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { SectionsService } from "../../../../../Services/sections.service";

@Component({
  selector: 'app-statementofwork',
  templateUrl: './statementofwork.component.html',
  styleUrls: ['./statementofwork.component.css']
})
export class StatementofworkComponent implements OnInit {

  solno;
  status;
  sol_id;
  data;
  id;
  sectionname='sow';

  hideEditor: boolean = false;
  hideDiv: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private ap: AcquisitionService,
    private sections: SectionsService
  ) {}
  disabled;
  response;
  ngOnInit() {
    this.solno = this.route.snapshot.parent.params.sid;
   // console.log(this.solno)
    this.getSectiondata();
  
   
   

  }


 
  onContentChanged(event) {
  //  console.log(event.html);
    this.sections.patchSections(this.id, this.sectionname, event.html).subscribe(response => {
      if (response) {
        setTimeout(() =>
          this.toastr.success("Error Occured", "Server Error", {
            timeOut: 2000
          })
        );
      } else {
        //console.log("Updated Successfully");
      }
    });
  }


  getSectiondata() {
    this.ap.getsoldappids(this.solno).subscribe(response => {
      this.id = response.sowid;
      
      
      this.ap.getSolicitation(response.solId).subscribe((response) => {
        this.response = response;
        this.status = response.status;
        console.log(this.status);
     
      });


      this.sections.getSections(this.id, this.sectionname).subscribe(response => {
        this.data = response.description;
        //this.data=response.description? response.description == '<div><br></div>'?'<div><h3><b>C. Statement of Work</b></h3></div><div><br></div>':response.description:'<div><h3><b>C. Statement of Work</b></h3></div><div><br></div>';
    
        this.ap.getUserprofile().subscribe(response => {
          //Code to verify the user is the Main CO
          console.log('this.response.pointsofContact',this.response.pointsofContact);
          console.log('response.pkId',response.pkId)
          if(this.status == 'Published' || this.status == 'Amendment' || this.status == 'Re-Published' ) {
            this.hideDiv = true;
          } else {
            this.hideEditor = true;
          }
            
          

        })



      });




    });
  }
}
