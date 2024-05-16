import { Event } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { AcquisitionService } from "../../../../../Services/acquisition.service";
import {FormsService} from "../../../../../Services/forms.service"
import { AuthenticationService } from "../../../../../Services/authentication.service";
import { ToastrService } from "ngx-toastr";
import { DatePipe} from '@angular/common';
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import { Cookie } from 'ng2-cookies/ng2-cookies';
import * as jwt_decode from "jwt-decode";
import { SectionsService } from "../../../../../Services/sections.service";


@Component({
  selector: 'app-sf30',
  templateUrl: './sf30.component.html',
  styleUrls: ['./sf30.component.css']
})
export class Sf30Component implements OnInit {

  solno;
  amendmentno;
  data;
  mindate=''
  disabledate:boolean=true
  edit:boolean=false
  modal=1
  allusers=[];
  formid
  status
  socid;
 
  coName=''


  SF30 = new FormGroup(
    {
      contractid: new FormControl('N/A'),
      amendno: new FormControl(''),
      sol_no: new FormControl(''),
      requisitionNumber: new FormControl(''),
      coOfficeName: new FormControl(''),
      coPhone : new FormControl(''),
      coEmail: new FormControl(''),
      amendate : new FormControl(''),
      extensiondate : new FormControl(''),
      ammendnotes: new FormControl('')
      // ammendnotes: new FormControl({value:'',disabled:this.valid()})
    }
  )

  orginalFormData={

  }

  skipfields=['requisitionNumber']

 


  constructor(    private _formBuilder: FormBuilder,
    private ap: AcquisitionService,
    private route: ActivatedRoute,
    private form:FormsService,
    private toast:ToastrService,
    private datepipe:DatePipe,
    private sections: SectionsService) { }

  ngOnInit() {
    this.solno = this.route.snapshot.parent.params.sid;
    let formkeys = Object.keys(this.SF30.value);
    this.ap.getsoldappids(this.solno).subscribe(response => {
      this.amendmentno = response.amendment_no;
      console.log('Ammendment no',response,this.amendmentno)
      this.SF30.get('amendno').setValue(this.amendmentno)

      //Script to get orginall Soliciation information.
      //  this.form.getFormData(response.formId).subscribe(formdata =>{
      //   formkeys = Object.keys(this.SF30.value);
      //   for(let key in formdata){
      //     if(formkeys.includes(key)){
      //       this.orginalFormData[key]=formdata[key]
      //     }
      //   }

      //   console.log('**Original Data',this.orginalFormData)
      //  })

      this.ap.getAmendmentdapp(this.amendmentno).subscribe(res=>{
        console.warn('Amend data',res)
        this.formid = res.formId
        this.socid = res.socId


        this.form.getFormData(this.formid).subscribe(res=>{
          this.status = res.status;
          console.log('AMMEND FORM',res)
          this.edit = this.status == 'Re-Published'?true:false
          console.log('Amendment Status',this.status,this.edit);
          console.log(formkeys)
          for(let key in res){
            console.log(key,this.SF30.get(key))
            if(formkeys.includes(key)){
              this.SF30.get(key).setValue(res[key])
            }
          }

          this.mindate = this.datepipe.transform(new Date(),"yyyy-MM-ddThh:mm")
          console.log('Mindate',this.mindate)

          // Set the Orginal Data
          this.orginalFormData = this.SF30.value
          console.log('**Original Data',this.orginalFormData)
       })

      })
    });


   

    setTimeout(() => {
      this.ap.getContractingRole().subscribe(res=>{    
        this.allusers=res.results; 
    });
    }, 500);

    
    
  }

  valid(){
    return true
  }

  onContentChanged(e){
  console.log('noteupdated',this.SF30.value)
  
 // this.patchAmmend()

  }

  coChange(e){
    console.log('co change',e)
    this.allusers.forEach(user=>{
      if(user.pkId== e){
        this.SF30.get('coOfficeName').setValue(user.officeName)
         this.SF30.get('coPhone').setValue(user.phone)
         this.SF30.get('coEmail').setValue(user.email)
         this.coName = user.firstName != 'Not'?`${user.firstName} ${user.lastName}`:
         (user.email.split('@')[0].split('.'))[0].charAt(0).toUpperCase() +  (user.email.split('@')[0].split('.'))[0].slice(1)
         this.patchAmmend()
      }
    })
  }

  getform(e){
    // console.warn('',this.SF30.value)
    let data={}
    this.SF30.valueChanges.subscribe(value=>{
     for(let key in value){
       if(value[key] != this.orginalFormData[key] && this.orginalFormData[key] != undefined){
         console.log(key,value[key],this.orginalFormData[key])
         if(key == 'amendate'){
          data[key]=`Block 3 was updated from <b>${this.datepipe.transform(this.orginalFormData[key],"MM/dd/yyyy hh:mm a")}</b> to <b>${this.datepipe.transform(value[key],"MM/dd/yyyy hh:mm a")}</b>  `
         }else if(key == 'extensiondate'){
          data[key]=`Block 9B was updated from <b>${this.datepipe.transform(this.orginalFormData[key],"MM/dd/yyyy hh:mm a")}</b>  to <b>${this.datepipe.transform(value[key],"MM/dd/yyyy hh:mm a")}</b>  `
         }else if(key == 'ammendnotes'){
          data[key]=`Block 14 was updated`
          this.patchAmmend();
         }else{
          data[key]=`Block 9 was updated from <b>${this.orginalFormData[key]}</b> to <b>${value[key]}</b>  `
         }
         console.log('**8data',data)

         this.patchchanges(data)
         
       }
     }

     this.orginalFormData = this.SF30.value
    })
    

    this.patchAmmend()
  }

  datevalidator(g: FormGroup){
    return {'mismatch': true}
  }

  patchAmmend(){
    let d = this.SF30.value
    delete d['contractid']
    delete d['amendno']
    console.log(d);
    this.form.putFormData(this.formid,d).subscribe(res=>{
      
    },error=>{
      console.error('Patch Ammend Error',error)
    })
  }

  datepicker(){
  
    let amdate,evaldate
    if(this.SF30.get('extensiondate').value != '' && this.SF30.get('extensiondate').value != undefined){
      amdate = new Date(this.SF30.get('amendate').value)
      evaldate = new Date(this.SF30.get('extensiondate').value)
  
      let dateerror = ()=>{
        if(this.edit != true){
          this.SF30.get('extensiondate').setValue('');
          this.toast.error('Invalid Extension Date')
        }
      
      }
  
      amdate.getTime() < evaldate.getTime()?'':dateerror()
    }
   
    
  }

  patchchanges(data){
    this.sections.patchSectionsChanges(this.socid,'soc', data).subscribe(response => {
      if (response) {
       console.log('Updated section')
      } else {
       // console.log("Updated Successfully");
      }
    });
  }


}
