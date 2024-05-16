import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import{FormsService} from '../../../../Services/forms.service';
import { AcquisitionService } from "../../../../Services/acquisition.service";
import{QandaService} from "../../../../Services/qanda.service";
import { DatePipe} from '@angular/common';
import { ToastrService } from "ngx-toastr";
declare let $: any;


@Component({
  selector: 'app-qanda',
  templateUrl: './qanda.component.html',
  styleUrls: ['./qanda.component.css']
})
export class QandaComponent implements OnInit {
  
  styleposition:string = "position:relative;float:left";
  qandaStatus;
  pageamount:number = 10;
  solid;
  fullurl;
  qandaID;
  fullresponse;
  response:any;
  date;
  formid;
  assignedco;
  userid;
  username;
  usercommentsname;
  projectTitle;
  published: boolean = false;
  counter =[];
  qandadate=``
  propsoldate=``
  assignlist={
          "names":[]
  }
  solicitationid;
  responseBoolean;
  constructor(private http: Http, 
    private formservice : FormsService, 
    private acqService:AcquisitionService, 
    private qandaService:QandaService,
    private datepipe: DatePipe, private toast:ToastrService) {

   }
  ngOnInit() {
    let pathname = window.location;
    this.solid=pathname.toString().split("sol/")[1].split('/')[0];
    this.acqService.getsoldata(this.solid).subscribe((response) => {
      console.log(response);
      this.qandaID =response.vendorQaId;
      this.formid = response.formId;
      this.solicitationid = response.solId;
      console.log("FormId",this.formid)

      this.acqService.getfullsol(this.solid).subscribe(fullSol=>{
        this.qandaStatus = fullSol.SOL.qandaStatus
        console.log('qandaStatus',this.qandaStatus)
      })


        this.formservice.getFormData(this.formid).subscribe(Response => {
          console.log('Form Data',Response);
            this.assignedco =  Response.pointsofContact[1];
            this.projectTitle=Response.projectTitle;
            this.qandadate = Response.qandaDate
            this.propsoldate = Response.offerDueDate
            console.log('ASsigned CO PKID', this.assignedco);
             let length = Response.commentMention.length;
              let col = Response.commentMention.splice(1,length);
                  col.forEach((element,index) => {
                    console.log("test",element);
                    let email = element.email;
                    let name = email.split('@')[0].replace('.'," ");
                    console.log('PoNmae',name);
                    element.name = name;
                    //Script to load all the names into the assignlist
                    this.assignlist.names.push(element);
                  });
           
              console.log("assigned list",this.assignlist);
            });
      


        setTimeout(() => {
          this.acqService.getUserprofile().subscribe(response => {
            console.log("Userprofile information",response);
            console.log( this.assignedco);
            this.userid =response.pkId;
            this.username = response.email.split('@')[0].replace('.'," ");
            var fullName = response.email.split('@')[0].split('.');
            var firstName = fullName[0].charAt(0).toUpperCase() + fullName[0].slice(1);
            var lastName = fullName[ fullName.length-1 ].charAt(0).toUpperCase() + fullName[ fullName.length-1 ].slice(1);
            if(response.firstName == "Not") {
                this.usercommentsname = firstName
            } else {
                this.usercommentsname = response.firstName
            }
            console.log('This User Name',this.username);
            
          })

          
          setTimeout(() => {
          let test = $(".row_container").length;
            let pages = test < 10? test :"10";
            this.pagesize(pages)
          }, 300);
         


        }, 800);
       
        
       


       //Script to get the soliciation Title
      //  this.acqService.getSolicitation(response.solId).subscribe(res =>{
      //   console.log('Solitation Data',res);
      //   this.projectTitle=res.projectTitle;
      // })
      let rightnow = $.now();
      this.date = this.datepipe.transform(new Date(rightnow),"MM-dd-yyyy");
    });
  
      
      //Set the Questions on Page Init
      this.qandaService.getqanda(this.solid).subscribe(res =>{
        this.response = res
        this.isallcomplete();
         //Script to filter the questions
         this.userid == this.assignedco? this.filterquestions(false,''):this.filterquestions(true,this.username);
      });



  }



///////////////////////Filter Questions JSON/////////////////////////
    filterquestions(filter,filtervalue){
      this.qandaService.getqanda(this.solid).subscribe(res =>{
        console.log('All QandA Data', res);
        
        if(filter == false){
        // this.fullresponse = res;
        }else{
          this.response = res.filter(elem=>{
            return elem.assigned == filtervalue
          })

        } 
        var pagecount = this.response.length;
        pagecount < 10? this.counter.push(pagecount):this.counter =["10","20","30","40","50"];
        //Script to click the first page selector button to only have the first 10 questions unhide.
        pagecount < 10? pagecount = pagecount: pagecount = 10;
        setTimeout(() => {
          (<HTMLSelectElement>document.getElementById("page_select_drop_down")).options[0].selected = true;
        }, 500);
        // Script to initiate the pageination function
        this.pagesize(pagecount);
        setTimeout(()=>{
          let button = document.querySelectorAll(".pnum")[0];
          (<HTMLButtonElement>button).click();
        },500);
      });


    }


    //Script hide/show the dropdown containers within each row
    // and animate the Assign buttons
  click(event) {
    console.log(event.currentTarget.id);
    // let newthis = this;
    document.getElementById("container"+event.currentTarget.id).classList.toggle("droper");
    document.getElementById("dropdown"+event.currentTarget.id).classList.toggle("drop");
  }



//Script to animate the dropdown arrow and Assign curtian
  assign(event){
    
    let elem = document.getElementById("arrow_"+event.currentTarget.id)
    elem?elem.classList.toggle("rotate"):"";
    document.getElementById("curtain_"+event.currentTarget.id).classList.toggle("showcurtain");
 
    // Script to verify if the dropdown view is open and if so, only collapse the assign curtian.
    let runner = ()=>{
      document.getElementById("container"+event.currentTarget.id.replace("assign",'')).classList.toggle("droper");
      document.getElementById("dropdown"+event.currentTarget.id.replace("assign",'')).classList.toggle("drop")
    }
    document.getElementById("dropdown"+event.currentTarget.id.replace("assign",'')).offsetHeight == 2? runner():"";
    
  }

  assigned(event,email, name,index) {
    console.log("Assigned Email", name, email);
    let value = event.currentTarget.innerHTML;
    event.currentTarget.parentNode.parentNode.classList.toggle("showcurtain");
    let questionid = event.target.attributes['data-ques-id'].nodeValue;

    this.response[index].assigned = value.toString();
    this.response[index].assignedEmail = email
   var data={
    "assigned":value.toString(),
    "assignedEmail":email

   }

    this.updateQandA(index,true,data,questionid);


    var data1 = {
      ap_no: this.solid,
      sol_no: this.solid,
      users: [name],
      textUser: this.usercommentsname,
      text: "question assigned",
      iconstyle:"fa-question-circle-o",
      message: "for Solicitation"+" "+"#"+this.solid,
      date: new Date(),
      type: "Q&A",
    }
    this.acqService.postAttnotifications(data1).subscribe(Response => {
      //console.log(Response);
      console.log("Q&A Notification Updated");
    })
    
  }

  whoisassigned(event,direction) {
    event.preventDefault;
    var id = event.currentTarget.id;
    var obj = document.getElementById(id);
    console.log(event.movementX);
    console.log(obj);
    if(obj.getAttribute("data-assigned")){
    var movement = event.movementX;
      if(direction == "in" ){
           if( movement < 9 &&  movement > -5 || movement == 0  ){
              setTimeout(() => {
                    if(obj.offsetLeft < 30){
                      let top = event.pageY -(obj.offsetTop)-195;
                      let left = 750;
                    console.log(top +" " + obj.offsetLeft +" "+  obj.offsetTop +" "+event.screenY);
                    $("#showassign").css({"top":top,"left":left});
                     $("#showassign").html(obj.getAttribute("data-assigned"));
                    $("#showassign").show();
                     }
              }, 100,function(){
              }); 
        }
       
        }else{
          $("#showassign").hide()
        }
      }

    

  }
  //Script to update the question status and capture the response.
  validateComplete(index) {
    this.response[index].status='complete'
    console.log(this.response)
    this.isallcomplete();
    this.updateQandA(index,true,this.response[index],this.response[index].id);
    
  }

  //Universal function to update the QandA database
  updateQandA(index,status,data,questionid){

    this.qandaService.patchqanda(questionid,data).subscribe(res =>{
      console.log(res);
    });
  }

  publish(){
  
    this.qandaService.getqanda(this.solid).subscribe(res =>{
       res.forEach(vendor => {
       let questionid = vendor.id;
       let publishresponse = vendor.response;


       let data={
          qandadate:this.qandadate,
          propsoldate:this.propsoldate,
          publishedresponse:publishresponse,
          status: "Closed"
       }


       this.qandaService.patchqanda(questionid,data).subscribe(res =>{
        console.log(res);
        this.toast.success('Published Successfully')
      });  

      this.qandaStatus='Closed'
      var data2 = {
        qandaStatus: "Closed",
       }
       this.acqService.putSolData(this.solicitationid, data2).subscribe(response => {
        console.log("Status Updated")
      });

      });

    })
    this.isallcomplete();
  }

  isallcomplete(){

      let len = this.response.length;
      let count = 0;
      this.response.forEach(vendor => {
        count =  vendor.status !='Open'? count +1: count;
        this.qandaStatus = vendor.status !='Open'?'':this.qandaStatus
      });
      console.log('count data', len, count)
      this.published= len == count &&  len> 0 ?true:false;
      console.log('Allow to Publish',this.published)
  



  }


  keyup(value,index) {
    this.response[index].response = value
  }

  next(event,direction) {
    if(direction == "next"){
      var nextid= parseInt(event.currentTarget.id) +1;
    }else{
      var nextid= parseInt(event.currentTarget.id) -1;
    }
    
    let nextcontainer = document.getElementById("container"+nextid);
    nextcontainer.classList.toggle("droper");
    document.getElementById("dropdown"+nextid).classList.toggle("drop");
    let top = nextcontainer.offsetTop;
    document.getElementById('question_table').scrollTop= top-175;
   

  }

  pdfsaveview(event) {    
    this.qandaService.getqanda(this.solid).subscribe(res =>{
    this.response = res;
  });   
} 
   

  pdfsave() {
    setTimeout(function(){window.print();},500);
    window.onafterprint = function (){
      $("#pdfview").html('');
      $("#closemodal").click();
    }
  }
  


  nextpage() {
    //script to get the current page indictor
    let eleDOM= document.querySelectorAll(".pnum");
    console.log(eleDOM)
    $(".pnum.hover").each(function(index){
      if($(this).css("background") == "rgb(8, 68, 164) none repeat scroll 0% 0% / auto padding-box border-box"){
        console.log(index);
        let newindex = index;
        //set Timeout to give system time to catch up
        setTimeout(()=>{
          (<HTMLElement>eleDOM[newindex+1]).click()
        },300);
      }
    });
  }

  previouspage() {
    //script to get the current page indictor
    let eleDOM= document.querySelectorAll(".pnum");
    console.log(eleDOM)
    $(".pnum.hover").each(function(index){
      if($(this).css("background") == "rgb(8, 68, 164) none repeat scroll 0% 0% / auto padding-box border-box"){
        console.log(index);
        let newindex = index;
        //set Timeout to give system time to catch up
        setTimeout(()=>{
          (<HTMLElement>eleDOM[newindex-1]).click()
        },300); 
      }
    });
    setTimeout(() => {
          this.acqService.getUserprofile().subscribe(response => {
            console.log("Userprofile information",response);
            console.log("Assigned CO ID" ,this.assignedco);
            this.userid =response.pkId;
            this.username = response.email.split('@')[0].replace('.'," ");

            let hideall = ()=>{
             let buttons = document.querySelectorAll(".assign_button ");
              buttons.forEach(button =>{
                (<HTMLButtonElement>button).style.display = "none";
                (<HTMLButtonElement>button).disabled = true;
              })

              console.log(this.username);
              let name = this.username;
              setTimeout(() => {
                $(".row_container").each(function(){
                  console.log(name)
                  let validatename = $(this).attr("data-assigned");
                  let revalidate = ()=>{
                    this.userid == this.assignedco?"":$(this).hide();
                  }
                 validatename == name?revalidate():$(this).hide();
  
                });
              }, 200);

            }

            this.userid == this.assignedco?"":hideall();
          })
        }, 500);
  }



  print() {
    window.print()
  }




  pagesize(pagequanity) {
    $(".row_container").each(function(){
      $(this).show()
    });
    this.pageamount = parseInt(pagequanity);
    let pagediv = document.getElementById("pagecount");
    pagediv.innerHTML = "";
    
    console.log(this.response);
    //Script to filter the response;
    let pages = this.response.filter(item => {
      // return item.status == "Open";
      return item;
    });
    console.log(pages)
    //Script to capture and set the amount of questions is the question json.
    document.getElementById('items_of').innerHTML = ' OF  '+pages.length+' QUESTIONS</p>';
    
    let count = pagequanity <10? 1:Math.floor(pages.length/this.pageamount)+1;

    console.log("count",count);
    for(let i = 0;i<count;i++){
      // create the page page indicator selector
      let elem = document.createElement("p") as HTMLElement;
      elem.innerHTML = String(i +1);
      elem.setAttribute("class","pnum hover");

      let scoller = this.pageamount*i;
      elem.setAttribute("scroll",String(scoller));

      elem.addEventListener('click',function(event){
        //Script to indicate page selection.
        $(".pnum").each(function(){
          $(this).css({"background":"white","color":"rgb(46, 115, 220)"})
        });
        $(this).css({"background":"rgb(8, 68, 164)","color":"white"})
        //Script to hide elemnts that are not click
        let element = (<HTMLElement>event.currentTarget);
        let scroll= element.getAttribute('scroll');
        console.log(scroll);
        
        let start = parseInt(scroll);
        let end = parseInt(scroll) +pagequanity -1;
        $(".row_container").each(function(index){
         
          // script to define the rows that should be unhide and hide
          if(index < start || index > end){
            $(this).hide()
          }else{
            $(this).show()
          }
        })
        
      });
      //Script to style the page indicator selector
      elem.style.color="#2e73dc";
      elem.style.borderRadius = "100%";
      elem.style.marginLeft = "7px";
      elem.style.marginRight = "7px";
      elem.style.fontWeight = "bold";
      elem.style.fontSize = "12px";
      elem.style.fontFamily='Arial"," SansSerif"';
      elem.style.width = "15px";
      elem.style.position = "relative";
      elem.style.cssFloat = "left "
      elem.style.textAlign = "center";
     
      pagediv.appendChild(elem);

      if( i == 0){
        elem.click()
      };
    }

 

  
   
}



}
