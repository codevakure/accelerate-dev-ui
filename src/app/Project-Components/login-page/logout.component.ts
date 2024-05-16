import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../../Services/authentication.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { environment } from "../../../environments/environment";

@Component({
  template: ''
})

export class LogoutComponent implements OnInit {
    UNITED_URL = environment.LOGOUT;
    UNITEDs_URL = environment.UNITED_ENV;
    constructor(private authService: AuthenticationService,
        private router: Router,
        private toastr: ToastrService) { 
    }

    ngOnInit(){

        //this.authService.logout();
        Cookie.deleteAll();
        setTimeout(() => this.toastr.success('Logged Out'));
        //this.router.navigate(['/login']);
      
        // var frame = document.getElementById("teneo-chat-widget");
        // frame.parentNode.removeChild(frame);
        // document.getElementById("teneo-chat-widget").contentWindow.location.reload();
        
        document.location.href = `${this.UNITED_URL}`

        setTimeout(()=>
        { document.location.href = `${this.UNITEDs_URL}/landing`
  
         }, 300);
        
 
        
        //document.location.href = '/landing'
        
    }


    

}