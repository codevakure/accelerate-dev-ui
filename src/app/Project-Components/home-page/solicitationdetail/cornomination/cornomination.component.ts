import { Component, OnInit, OnChanges } from '@angular/core';
import { FormsService } from "../../../../Services/forms.service"; 
import { AcquisitionService } from "../../../../Services/acquisition.service"; 
import { CorsService } from "../../../../Services/cors.service";
import { THROW_IF_NOT_FOUND } from '@angular/core/src/di/injector';
import { DatePipe} from '@angular/common';
import { ToastrService } from "ngx-toastr"; 


@Component({
  selector: 'app-cornomination',
  templateUrl: './cornomination.component.html',
  styleUrls: ['./cornomination.component.css']
})
export class CornominationComponent implements OnInit, OnChanges {

  constructor(private acq:AcquisitionService, private Cors:CorsService,
    private forms:FormsService,private datepipe:DatePipe,private toastr:ToastrService) { }
  
  showselect:boolean = false;
  editcontent:boolean= true;
  enablesign:boolean= false;
  disableQuill:boolean=true;
  disabled:boolean = true; 

  persons=[];
  personsfull=[];
  selectednames=[];

  hidetitle= 'none';
  selected="";
  letterhead;
  orginalQuillData="";
  solnum;
  corsId;
  pointsofContacts='';
  authenticatedUser;
  usernamenot;
  mindate;
  description;
  coName

  pos = { x: 0, y: 0 };
  cors={
    selectedName:'',
    selectedNames:[],
    contractNo:'',
    signature :'',
    Acknowledgement:'',
    CORSIG:'',
    date:{
      dateSent:'',
      dateSign:''
    }
  };

  
  


  ngOnChanges(){
    console.log('changes')
    }
  

  ngOnInit() {

    //Get solication number;
    let pathname = window.location;
    this.solnum = pathname
      .toString()
      .split("sol/")[1]
      .split("/")[0];
      console.log("***SOL Number***",this.solnum);

      this.acq.getsoldappids(this.solnum).subscribe((response) => {

        this.Cors.getCORSData(response.corsId).subscribe(r=>{
          console.log('CORS ',r);
          this.description = r.data;
          this.orginalQuillData = r.data; 
    
          if(!r.selectedNames){
            r.selectedNames =[];
          }

          if(!r.CORSIG){
            r.CORSIG ='';
          }

          if(!r.date){
            r.date={
              dateSent:'',
              dateSign:''
            }
          }
           this.cors= r;
    
           
           if( this.cors.signature){
             //Script to add signature
            this.cors.signature.search("Z") > -1? document.querySelector("#write").setAttribute("d",this.cors.signature.replace(' Z M ','')): document.querySelector("#write").setAttribute("d",' Z M ') ;
           }
           if(!this.cors.signature){
             this.cors.signature = '';
           }

           if( this.cors.CORSIG){
            //Script to add PM signature
           this.cors.CORSIG.search("Z") > -1? document.querySelector("#write2").setAttribute("d",this.cors.CORSIG.replace(' Z M ','')): document.querySelector("#write2").setAttribute("d",' Z M ') ;
          }
   

          

          this.acq.getApdappids(response.ap_no).subscribe(res=>{
            console.log("AP",res)
            this.acq.getOtherConsiderations(res.considerationId).subscribe(con =>{
              console.log('considerations',con,this.cors)
              if(this.cors.selectedName == undefined){
                  this.cors.selectedName = con.proposedCOR
                   this.cors.selectedNames[0] = {name:con.proposedCOR}
              }
              // console.log('CORS JSON',this.cors)

            })
          })


        })

        

        console.log(response)
        let formid = response.formId;
        this.corsId = response.corsId;
        console.log("CORS ID",this.corsId)
        this.forms.getFormData(formid).subscribe(response=>{
          this.pointsofContacts=response.pointsofContact;
          // console.warn('Form Data',response)
          this.coName = response.coName
        });
      });



      //get all users and populate user selection boxes
      this.acq.getAllusers().subscribe(res =>{ 
        console.log('All Users',res); 
        res.results.forEach((person,index) => { 
          // console.log("test",person); 
          let email = person.email; 
          let name = email.split('@')[0].split('.')?email.split('@')[0].split('.'):email.split('@')[0]; 
          // console.log(name) 
          let firstname = name[0]?name[0].charAt(0).toUpperCase()+name[0].slice(1):name.charAt(0).toUpperCase()+name.slice(1); 
          let lastname = name[1]?name[1].charAt(0).toUpperCase()+name[1].slice(1):''; 
          console.log('PoNmae',`${firstname} ${lastname}`); 
          person.name = `${firstname} ${lastname}`; 
          //Script to load all the names into the assignlist 
        }); 
        this.persons = res.results; 
        this.personsfull = res.results; 
        // console.log('persons array',res); 
      }); 

      //Script to get current user PKId
      this.acq.getUserprofile().subscribe(response => {
        var fullName = response.email.split('@')[0].split('.');
        var firstName = fullName[0].charAt(0).toUpperCase() + fullName[0].slice(1);
        this.usernamenot = response.firstName;
        if(response.firstName == "Not"){
          this.authenticatedUser = firstName
        } else {
          this.authenticatedUser = response.firstName+" "+response.lastName
        }
        console.log('User PKID',response.pkId);
        console.log("User full name", this.authenticatedUser)
        setTimeout(() => {
          if(this.pointsofContacts[0] == response.pkId){
            console.log('**PM Login**');
          }else{
            if(this.pointsofContacts[1] == response.pkId){
              this.disabled = false
            }
          }
  
        }, 500);
        console.log()
        
      }) ;
 
      let startdate = new Date();
    
      this.mindate= this.datepipe.transform(startdate,"yyyy-MM-dd");

     
    

  }
  //hide the quilleditor toolbar after the view loads
  ngAfterViewInit(){
    (<HTMLDivElement>document.querySelector(".ql-toolbar")).style.display = this.hidetitle;
    (<HTMLDivElement>document.querySelector(".ql-toolbar")).style.border = 'none';
    (<HTMLDivElement>document.querySelector(".ql-toolbar")).style.borderBottom = '1px solid lightgray';
    
  }

 

  patchCORSData(id,json){
    this.Cors.putCORSData(id,json).subscribe(Response =>{
      console.log(Response)
    })
  }

  Updatedatabase(id,key,value){
    if(key != 'date'){
      this.cors[key]=value;
      this.patchCORSData(id,this.cors)
    }
    if(key == 'date'){
      this.cors.date.dateSent = this.datepipe.transform(new Date(),'MM-dd-yyyy hh:mm a');
      console.log('***DATE SENT***',this.cors.date.dateSent)
      let patchjson ={
        date:this.cors.date
      }
      this.patchCORSData(this.corsId,patchjson)
    }
    
   
  }


  // Show name select name selection 
  showSelect(text){
      this.showselect = true;
      this.persons = this.personsfull
      this.filterusers(text);
  }
  // Hide name select name selection 
  hideSelect(){
    this.showselect = false;
    this.persons = this.personsfull;
   
  }
  //Script to make contenteditable
  editContent(status){
    this.editcontent = status;
  }
   //Script to enable QuillEditor
  editquill(){
    this.disableQuill = false;
    (<HTMLDivElement>document.querySelector(".ql-toolbar")).style.display = 'block';
    (<HTMLDivElement>document.querySelector(".ql-editor")).style.height = '50vh';
   window.scrollTo(0,70);
  }

  //Script to disable QuillEditor
  disablequill(run,scroll){
    this.disableQuill = true;
    (<HTMLDivElement>document.querySelector(".ql-toolbar")).style.display = 'none';
    (<HTMLDivElement>document.querySelector(".ql-editor")).style.height = '100%';
   
    if(run == "reset"){
      //set the description to the state before a save
      this.description = this.orginalQuillData
    }
    if(run == 'save'){
      this.orginalQuillData = this.description;
      console.log(this.orginalQuillData);
      //presit quill editor html
      var dta ={
        data:this.description
      }
      this.patchCORSData(this.corsId,dta)
    }

    scroll == 'scroll'?window.scrollTo(0,70):'';
  }
  // Filter the users dropdown
  filterusers(text){
    this.persons = this.persons.filter(person=>{
      return person.name.toLowerCase().includes(text.toLowerCase())
    });
    console.log(this.persons)
  }

  nameselected(person) {
    console.log(person);
    (<HTMLInputElement>document.querySelector('.name')).value = person.name;
    this.cors.selectedNames[0]=person;
    this.cors.selectedName = person.name;
    
    var data ={
      selectedName:this.cors.selectedName
      ,selectedNames:this.cors.selectedNames
    }
    this.patchCORSData(this.corsId,data)
  }
  //SCript to add names to the selectednames json
  addnames(elem){
    this.cors.selectedNames.push(elem);
    console.log(this.cors.selectedNames);
    var data ={
      selectedNames:this.cors.selectedNames
    }
    this.patchCORSData(this.corsId,data)
  }

  //Script to add ContractNo
  addcontract(text){
    this.cors.contractNo = text
    var data ={
      contractNo:text
    }
    this.patchCORSData(this.corsId,data)
  }

  //remove name from selected name
  removename(elem){
    this.cors.selectedNames = this.cors.selectedNames.filter( name =>{
      return name.name != elem.name
    });
    var data ={
      selectedNames:this.cors.selectedNames
    }
    this.patchCORSData(this.corsId,data)
  }
  //Script to enable Signature
  signfunction(status){
    console.log(status)
    this.enablesign = status;
    (<HTMLDivElement>document.querySelector("#signature")).style.background = "#fefce0";
    (<HTMLDivElement>document.querySelector("#signature")).style.borderBottomWidth = "2px";
  }
  // Reset Signature
  resetsign(sign){
    console.log(sign)
    if(sign == 'CORSIG'){
      this.Updatedatabase(this.corsId,'CORSIG','')
      this.cors.date.dateSign='';
    document.querySelector("#write2").setAttribute("d",this.cors.CORSIG);
    }else{
      this.cors.signature = '';
    document.querySelector("#write").setAttribute("d",this.cors.signature);
    }
    
  }

  // new position from mouse event
  setPosition(e) {
    console.log('drawmousedown',e);
    console.log(this.pos.x, this.pos.y)
    this.pos.x = e.offsetX ;
    this.pos.y = e.offsetY;
  }




 draw(e) {
  let id = e.target.firstChild.id
   console.log(this.cors.signature)
    console.log(e);
    console.log("intial draw position",this.pos.x, this.pos.y);
    console.log("offset",e.offsetX , e.offsetY)

    let bigfunction = (event,key)=>{
       // function to allow the user to create mulitple seperate signature vectors.
    let reset = () =>{
      this.cors[key].search("Z") > -1? '' : this.cors[key] += ' Z M ';
      return
    }
    // function to allow the user to create mulitple seperate signature vectors.
    let recordsig = ()=>{
      //remove the end marker in the svg;
      this.cors[key] =this.cors[key].replace("Z",'')
      
      this.cors[key] += " " + this.pos.x +" " + this.pos.y;
      this.setPosition(event);
      
      document.querySelector(`#${id}`).setAttribute("d",this.cors[key]);
     
    }

    //Script to make sure the trackwheel button is not pressed
     event.buttons !== 1? reset():recordsig();
    }

    if(id == "write"){
      bigfunction(e,'signature')
     }

     if(id == "write2"){
      bigfunction(e,'CORSIG');
     
     }
   
   
}

captureSignDate(){
  this.cors.date.dateSign = this.datepipe.transform(new Date(),'MM-dd-yyyy');
  console.log('***DATE SENT***',this.cors.date.dateSent)
  let patchjson ={
    date:this.cors.date
  }
  this.patchCORSData(this.corsId,patchjson)
}

//Script to save signature
removestyle(){
  (<HTMLDivElement>document.querySelector("#signature")).style.background = "white";
      (<HTMLDivElement>document.querySelector("#signature")).style.borderBottomWidth = "1px"
      var data ={
        signature:this.cors.signature,
        CORSIG:this.cors.CORSIG
      }
      this.patchCORSData(this.corsId,data)
}

sendnotification(){
  //create name array with only person name for notifications
  let name = [],name2 = []

  this.cors.selectedNames.forEach((person,index) =>{
    console.log(person);
    if(this.usernamenot == "Not") {
      index!=0? name.push(person.name.split(" ")[0]):name2.push(person.name.split(" ")[0])
    } else {
      index!=0?name.push(person.name):name2.push(person.name)
    }
   
  });



console.log('*****Name JSON',name, name2)
  var notCOR = {
    ap_no: this.solnum,
    users: name,
    textUser: this.coName,
    text: `sent fully executed COR Appointment Letter to 
    ${this.cors.selectedName} for Contract# ${this.cors.contractNo}. 
    No further action required.`,
    iconstyle: "fa-user-plus",
    message: `for SOL #${this.solnum}`,
    date: new Date(),
    type: "COR"
  };

  var COR = {
    ap_no: this.solnum,
    users: name2,
    textUser: this.authenticatedUser,
    text: "invited you to the CORS Nomination ",
    iconstyle: "fa-user-plus",
    message: `for SOL #${this.solnum}`,
    date: new Date(),
    type: "COR"
  };


  


  //Send Notification to Non COR users
  if(name.length >0){
    this.acq.postAttnotifications(notCOR).subscribe(Response => {
      // this.toastr.success('COR nomination letter was successfully sent!');
      
    },error =>{
      // this.toastr.warning('Cor nomiation letter not sent!')
      console.warn('notification to non COR Not Sent',error)
    });
  }
 

   //Send Notification to the COR nominee 
  this.acq.postAttnotifications(COR).subscribe(Response => {
   this.toastr.success('COR Nomination letter was successfully sent!');
   this.Updatedatabase(this.corsId,'date','')
  },error =>{
    this.toastr.warning('Cor Nomiation letter not sent!')
    console.warn('COR Not Sent',error)
  });




  this.cors.date.dateSent = this.datepipe.transform(new Date(),'MM/dd/yyyy hh:mm a');
  console.log('***DATE SENT***',this.cors.date.dateSent)
  let patchjson ={
    date:this.cors.date
  }
  this.patchCORSData(this.corsId,patchjson)

}



}
