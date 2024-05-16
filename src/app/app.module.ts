
// Module
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {DatePipe} from '@angular/common';
import { HashLocationStrategy, Location, LocationStrategy, CurrencyPipe } from '@angular/common';
import { HttpModule, BrowserXhr } from '@angular/http';
import { ToastrModule } from 'ngx-toastr';
import 'rxjs/Rx';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ChartsModule } from 'ng2-charts';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';

//Services
import { AcquisitionService } from './Services/acquisition.service';
import { AuthenticationService } from './Services/authentication.service';
import { FormsService } from './Services/forms.service';
import { ClausesService } from './Services/clauses.service';
import { SectionsService } from './Services/sections.service';
import { AuthGuard } from './Services/auth-guard.service';
import { RoleGuard } from './Services/role-guard.service';

//Components
import { AppComponent } from './app.component';
import { routingComponents } from './app-routing.module';
import { DashAcquisitionComponent } from './Project-Components/home-page/dashboard/dash-acquisition/dash-acquisition.component';
import { DashSolicitationComponent } from './Project-Components/home-page/dashboard/dash-solicitation/dash-solicitation.component';
import { DashActiveComponent } from './Project-Components/home-page/dashboard/dash-active/dash-active.component';
import { DashExpiredComponent } from './Project-Components/home-page/dashboard/dash-contracts/dash-expired.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { QuillModule } from 'ngx-quill';
//import { MaterialDesignFrameworkModule, Bootstrap4FrameworkModule } from 'angular6-json-schema-form';

import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AutocompleteModule } from 'ng2-input-autocomplete';
import { ClausesectionsComponent } from './Project-Components/home-page/solicitationdetail/Sections-B2M/clausesections/clausesections.component';
import { CommentBoxComponent } from './Project-Components/home-page/apdetail/comment-box/comment-box.component';
import { PmdashComponent } from './Project-Components/home-page/dashboard/pmdash/pmdash.component';
import { CoprofileComponent } from './Project-Components/home-page/profile/coprofile/coprofile.component';
import { PmprofileComponent } from './Project-Components/home-page/profile/pmprofile/pmprofile.component';
import { SanitizeHtmlPipe } from './sanitize-html.pipe';
import { SolCommentBoxComponent } from './Project-Components/home-page/solicitationdetail/sol-comment-box/sol-comment-box.component';
import { AllhtmlPipe } from './allhtml.pipe';
import {FormatTimePipe} from './formatTime.pipe';
import { AppreviewComponent } from './Project-Components/home-page/apdetail/appreview/appreview.component';




import { UserIdleModule } from 'angular-user-idle';











//Testing test branch

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    DashAcquisitionComponent,
    DashSolicitationComponent,
    DashActiveComponent,
    DashExpiredComponent,
    ClausesectionsComponent,
    CommentBoxComponent,
    PmdashComponent,
    CoprofileComponent,
    PmprofileComponent,
    SanitizeHtmlPipe,
    SolCommentBoxComponent,
    AllhtmlPipe,
    FormatTimePipe,
    AppreviewComponent,





  ],

  imports: [
    AutocompleteModule.forRoot(),
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatStepperModule,  
    MatButtonModule,
    NgxSpinnerModule,
    MatDatepickerModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
    }),
    PdfViewerModule,
    MatNativeDateModule,
    QuillModule.forRoot(),
    RouterModule,
    AppRoutingModule,
    NgSelectModule,
    ChartsModule,
    NgxPaginationModule,
    UserIdleModule.forRoot({idle: 780, timeout: 60, ping: 120})
  ],

  providers: [
    AcquisitionService,
    AuthenticationService,
    FormsService,
    AuthGuard,
    RoleGuard,
    SectionsService,
    ClausesService,DatePipe,
    CurrencyPipe,
    SanitizeHtmlPipe,
    Location, 
    {provide: LocationStrategy, useClass: HashLocationStrategy}
   
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }