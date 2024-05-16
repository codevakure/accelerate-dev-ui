import { Component, OnInit } from '@angular/core';
import { AcquisitionService } from "../../../../../Services/acquisition.service";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { SectionsService } from "../../../../../Services/sections.service";
import {FormsService} from "../../../../../Services/forms.service"


@Component({
  selector: 'app-a-sumofchanges',
  templateUrl: './a-sumofchanges.component.html',
  styleUrls: ['./a-sumofchanges.component.css']
})
export class ASumofchangesComponent implements OnInit {

  constructor( private route: ActivatedRoute,
    private toastr: ToastrService,
    private ap: AcquisitionService,
    private sections: SectionsService,
    private form:FormsService) { }

  solno;
  status;
  sol_id;
  data;
  id;
  sectionname='soc';
  socid;
  allformchanges=[]
  allclauseschanges=[]
  manualchanges=[]
  hideEditor: boolean = false;
  response
  


  ngOnInit() {
    this.solno = this.route.snapshot.parent.params.sid;
    // console.log(this.solno)
     this.getSectiondata();
  }

  patchchanges(data){
    console.log('***********data sent to Changes',data)
    this.sections.patchSectionsChanges(this.socid, 'soc', data).subscribe(response => {
      if (response) {
        setTimeout(() =>
          this.toastr.success("Added Change", "Server Error", {
            timeOut: 2000
          })
        );
      } else {
       // console.log("Updated Successfully");
      }
    });
  }

  getSectiondata() {
    this.ap.getsoldappids(this.solno).subscribe(response => {
      console.log("Sol-dapp ids",response);
      this.ap.getAmendmentdapp(response.amendment_no).subscribe(amres => {
        console.log("Amendment D-app response", amres);


        this.id = amres.sowid;
        this.socid = amres.socId;
        this.form.getFormData(response.formId).subscribe(res=>{
          console.log('Amend form Data',res)
          this.response = res;
          this.status = res.status;

          this.ap.getUserprofile().subscribe(response => {
            //Code to verify the user is the Main CO
            console.log('this.response.pointsofContact',this.response.pointsofContact);
            console.log('response.pkId',response.pkId)
            if(this.status != 'Re-Published' ) {
              this.hideEditor = true;
            }
  
          })
          
       })
        
        this.sections
          .getSections(this.socid, 'soc')
          .subscribe((response5) => {
            console.log('***SummaryofChangesData',response5)
            console.warn(typeof response5.continuationofsf30Changes)
  
            if( response5.manualchanges == undefined){
             this.manualchanges = [];
            }else{
              this.manualchanges = response5.manualchanges
            }
            console.warn('this.changes',this.manualchanges)
            let keys = Object.keys(response5)
            keys.forEach(key=>{
              console.log(typeof response5[key] )
              if(key != 'id'){
                if(typeof response5[key] === 'string'){
                  this.allformchanges.push(response5[key])
                }else{
                  if(key != 'description' && key != 'manualchanges'){
                  response5[key].forEach(element => {
                    this.allclauseschanges.push(element)
                  });
                }
                }
              }
              
               
            })
            console.log('formchanges',this.allformchanges)
            // this.allformchanges = response5.description;
            //this.data=response.description? response.description == '<div><br></div>'?'<div><h3><b>C. Statement of Work</b></h3></div><div><br></div>':response.description:'<div><h3><b>C. Statement of Work</b></h3></div><div><br></div>';
          });
  
  
      })
     


    });
  }


  onContentChanged() {
    //this.clauseString = event.html;
    this.manualchanges.push(this.data);
    console.log('EditorChanges',this.manualchanges);
    let data={
      manualchanges:this.manualchanges
    }


      this.sections.patchSectionsChanges(this.socid,'soc', data).subscribe(response => {
        if (response) {
          setTimeout(() =>
            this.toastr.success("Added Change", "Server Error", {
              timeOut: 2000
            })
          );
          this.data = ''
        } else {
         // console.log("Updated Successfully");
        }
      });
    }

}
