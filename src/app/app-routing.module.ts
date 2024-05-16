import { NgModule } from "@angular/core";
import { LoginPageComponent } from "./Project-Components/login-page/login-page.component";
import { HomePageComponent } from "./Project-Components/home-page/home-page.component";
import { DashboardComponent } from "./Project-Components/home-page/dashboard/dashboard.component";

import { RegisterComponent } from "./Project-Components/register/register.component";
import { SolicitationdetailComponent } from "./Project-Components/home-page/solicitationdetail/solicitationdetail.component";
import { CodeValidateComponent } from "./Project-Components/register/code-validate/code-validate.component";
import { FormdetailComponent } from "./Project-Components/home-page/solicitationdetail/formdetail/formdetail.component";
import { AuthGuard } from "./Services/auth-guard.service";
import { RoleGuard } from "./Services/role-guard.service";
import { LogoutComponent } from "./Project-Components/login-page/logout.component";
import { ProfileComponent } from "./Project-Components/home-page/profile/profile.component";

import { PmacquisitionsComponent } from "./Project-Components/home-page/Acquisitions/pmacquisitions.component";
import { ApdetailComponent } from "./Project-Components/home-page/apdetail/apdetail.component";
import { GeneralComponent } from "./Project-Components/home-page/apdetail/general/general.component";
import { SowComponent } from "./Project-Components/home-page/apdetail/sow/sow.component";
import { PreviewComponent } from "./Project-Components/home-page/solicitationdetail/preview/preview.component";
import { IgceComponent } from "./Project-Components/home-page/apdetail/igce/igce.component";
import { ReqformComponent } from "./Project-Components/home-page/apdetail/reqform/reqform.component";

import { QandaComponent } from "./Project-Components/home-page/solicitationdetail/qanda/qanda.component";
import { ProposalevaluationComponent } from "./Project-Components/home-page/solicitationdetail/proposalevaluation/proposalevaluation.component";
import { CornominationComponent } from "./Project-Components/home-page/solicitationdetail/cornomination/cornomination.component";
import { EvaluationsComponent } from "./Project-Components/home-page/apdetail/evaluations/evaluations.component";
import { AttachmentsComponent } from "./Project-Components/home-page/apdetail/attachments/attachments.component";

import { TradeoffsComponent } from "./Project-Components/home-page/apdetail/tradeoffs/tradeoffs.component";
import { EstimateComponent } from "./Project-Components/home-page/apdetail/estimate/estimate.component";
import { CompetetionComponent } from "./Project-Components/home-page/apdetail/competetion/competetion.component";
import { CompatibilityComponent } from "./Project-Components/home-page/apdetail/compatibility/compatibility.component";
import { ConstraintsComponent } from "./Project-Components/home-page/apdetail/constraints/constraints.component";

import { Section508Component } from "./Project-Components/home-page/apdetail/section508/section508.component";
import { SecurityComponent } from "./Project-Components/home-page/apdetail/security/security.component";
import { OtherConsiderationsComponent } from "./Project-Components/home-page/apdetail/other-considerations/other-considerations.component";
import { PocComponent } from "./Project-Components/home-page/apdetail/poc/poc.component";
import { ResourcesComponent } from "./Project-Components/home-page/apdetail/resources/resources.component";

import { Routes, RouterModule } from "@angular/router";
import{AppreviewComponent} from './Project-Components/home-page/apdetail/appreview/appreview.component'

/*Sections B-M*/

import { SuppliesandservicesComponent } from "./Project-Components/home-page/solicitationdetail/Sections-B2M/suppliesandservices/suppliesandservices.component";
import { StatementofworkComponent } from "./Project-Components/home-page/solicitationdetail/Sections-B2M/statementofwork/statementofwork.component";
import { PackagingandmarketingComponent } from "./Project-Components/home-page/solicitationdetail/Sections-B2M/packagingandmarketing/packagingandmarketing.component";
import { InspectionandacceptanceComponent } from "./Project-Components/home-page/solicitationdetail/Sections-B2M/inspectionandacceptance/inspectionandacceptance.component";
import { DeleveriesandperformanceComponent } from "./Project-Components/home-page/solicitationdetail/Sections-B2M/deleveriesandperformance/deleveriesandperformance.component";
import { ContractadmindataComponent } from "./Project-Components/home-page/solicitationdetail/Sections-B2M/contractadmindata/contractadmindata.component";
import { SpecialcontractreqComponent } from "./Project-Components/home-page/solicitationdetail/Sections-B2M/specialcontractreq/specialcontractreq.component";
import { ContractComponent } from "./Project-Components/home-page/solicitationdetail/Sections-B2M/contract/contract.component";
import { AttachmentsinfoComponent } from "./Project-Components/home-page/solicitationdetail/Sections-B2M/attachmentsinfo/attachmentsinfo.component";
import { RepresentationcertsComponent } from "./Project-Components/home-page/solicitationdetail/Sections-B2M/representationcerts/representationcerts.component";
import { InstructionsComponent } from "./Project-Components/home-page/solicitationdetail/Sections-B2M/instructions/instructions.component";
import { EvaluationfactorsComponent } from "./Project-Components/home-page/solicitationdetail/Sections-B2M/evaluationfactors/evaluationfactors.component";

import { PmsolComponent } from "./Project-Components/home-page/Solicitations/pmsol.component";
import { SolprovisionsComponent } from './Project-Components/home-page/solicitationdetail/Sections-B2M/solprovisions/solprovisions.component';
import { EvaluatevendorComponent } from "./Project-Components/home-page/solicitationdetail/proposalevaluation/evaluatevendor/evaluatevendor.component";
import { ProposalevalhomeComponent } from "./Project-Components/home-page/solicitationdetail/proposalevaluation/proposalevalhome/proposalevalhome.component";
import { MarketresearchComponent } from "./Project-Components/home-page/apdetail/marketresearch/marketresearch.component";
import { ContractGenerationComponent } from "./Project-Components/home-page/solicitationdetail/contract-generation/contract-generation.component";
import { Sf1449part2Component } from './Project-Components/home-page/solicitationdetail/Sections-B2M/sf1449part2/sf1449part2.component';

//Contract Detail Components
import { ContractdetailComponent } from "./Project-Components/home-page/contractdetail/contractdetail.component";
import { ContactAdminComponent } from "./Project-Components/home-page/contractdetail/contact-admin/contact-admin.component";
import { ModifyContractComponent } from "./Project-Components/home-page/contractdetail/modify-contract/modify-contract.component";
import { CloseOutComponent } from "./Project-Components/home-page/contractdetail/close-out/close-out.component";
import { ContractFileComponent } from "./Project-Components/home-page/contractdetail/contract-file/contract-file.component";
import { ContractPreviewComponent } from "./Project-Components/home-page/contractdetail/contract-preview/contract-preview.component";
import { ContractsdisplayComponent } from "./Project-Components/home-page/contractsdisplay/contractsdisplay.component";
import { VendorresponseComponent } from "./Project-Components/home-page/solicitationdetail/proposalevaluation/vendorresponse/vendorresponse.component";
import { VendorresevalComponent } from "./Project-Components/home-page/solicitationdetail/proposalevaluation/vendorreseval/vendorreseval.component";

//Amendment Components
import { Sf30Component } from './Project-Components/home-page/solicitationdetail/amendment/sf30/sf30.component';
import { Sf30previewComponent } from './Project-Components/home-page/solicitationdetail/amendment/sf30preview/sf30preview.component';
import { AAttachmentComponent } from './Project-Components/home-page/solicitationdetail/amendment/a-attachment/a-attachment.component';
import { AContractComponent } from './Project-Components/home-page/solicitationdetail/amendment/a-contract/a-contract.component';
import { AContractadmindataComponent } from './Project-Components/home-page/solicitationdetail/amendment/a-contractadmindata/a-contractadmindata.component';
import { ADeliveriesandperformancesComponent } from './Project-Components/home-page/solicitationdetail/amendment/a-deliveriesandperformances/a-deliveriesandperformances.component';
import { AEvaluationfactorsComponent } from './Project-Components/home-page/solicitationdetail/amendment/a-evaluationfactors/a-evaluationfactors.component';
import { AInspectionComponent } from './Project-Components/home-page/solicitationdetail/amendment/a-inspection/a-inspection.component';
import { AInstructionsComponent } from './Project-Components/home-page/solicitationdetail/amendment/a-instructions/a-instructions.component';
import { APackagingComponent } from './Project-Components/home-page/solicitationdetail/amendment/a-packaging/a-packaging.component';
import { ACertsComponent } from './Project-Components/home-page/solicitationdetail/amendment/a-certs/a-certs.component';
import { ASolprovComponent } from './Project-Components/home-page/solicitationdetail/amendment/a-solprov/a-solprov.component';
import { ASpecialcontractreqComponent } from './Project-Components/home-page/solicitationdetail/amendment/a-specialcontractreq/a-specialcontractreq.component';
import { ASowComponent } from './Project-Components/home-page/solicitationdetail/amendment/a-sow/a-sow.component';
import { ASuppliesandservicesComponent } from './Project-Components/home-page/solicitationdetail/amendment/a-suppliesandservices/a-suppliesandservices.component';
import { ASumofchangesComponent } from './Project-Components/home-page/solicitationdetail/amendment/a-sumofchanges/a-sumofchanges.component';
import { ASf30part2Component } from './Project-Components/home-page/solicitationdetail/amendment/a-sf30part2/a-sf30part2.component';

// Add routes to this array //
var routes: Routes = [
  //{ path: 'login', component: LoginPageComponent },
  { path: "register", component: RegisterComponent },
  { path: "validate", component: CodeValidateComponent },
  {
    path: "home",
    component: HomePageComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: "always",
    children: [
      { path: "", canActivate: [AuthGuard], component: DashboardComponent },

      {
        path: "acquisitions",
        canActivate: [AuthGuard],
        component: PmacquisitionsComponent
      },
      {
        path: "solicitations",
        canActivate: [AuthGuard],
        component: PmsolComponent
      },
      {
        path: "contracts",
        canActivate: [AuthGuard],
        component: ContractsdisplayComponent
      },
      {
        path: "profile",
        canActivate: [AuthGuard],
        component: ProfileComponent
      },
      {
        path: "sol/:sid",
        component: SolicitationdetailComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: "",
            canActivate: [AuthGuard],
            component: FormdetailComponent,
            pathMatch: "full"
          },
          // Sections B to M
          {
            path: "suppliesandservices",
            canActivate: [AuthGuard],
            component: SuppliesandservicesComponent
          },
          {
            path: "part2",
            canActivate: [AuthGuard],
            component: Sf1449part2Component
          },
          {
            path: "solprovisions",
            canActivate: [AuthGuard],
            component: SolprovisionsComponent
          },
          {
            path: "statementofwork",
            canActivate: [AuthGuard],
            component: StatementofworkComponent
          },
          {
            path: "packagingandmarking",
            canActivate: [AuthGuard],
            component: PackagingandmarketingComponent
          },
          {
            path: "inspectionandacceptance",
            canActivate: [AuthGuard],
            component: InspectionandacceptanceComponent
          },
          {
            path: "deliveriesandperformance",
            canActivate: [AuthGuard],
            component: DeleveriesandperformanceComponent
          },
          {
            path: "contractadmindata",
            canActivate: [AuthGuard],
            component: ContractadmindataComponent
          },
          {
            path: "specialcontractreq",
            canActivate: [AuthGuard],
            component: SpecialcontractreqComponent
          },
          {
            path: "contractclauses",
            canActivate: [AuthGuard],
            component: ContractComponent
          },
          {
            path: "attachmentsinfo",
            canActivate: [AuthGuard],
            component: AttachmentsinfoComponent
          },
          {
            path: "representationandcerts",
            canActivate: [AuthGuard],
            component: RepresentationcertsComponent
          },
          {
            path: "instructions",
            canActivate: [AuthGuard],
            component: InstructionsComponent
          },
          {
            path: "evluationfactors",
            canActivate: [AuthGuard],
            component: EvaluationfactorsComponent
          },

          {
            path: "preview",
            canActivate: [AuthGuard],
            component: PreviewComponent
          },
          {
            path: "qanda",
            canActivate: [AuthGuard],
            component: QandaComponent
          },
          {
            path: "cor",
            canActivate: [AuthGuard],
            component: CornominationComponent
          },
          {
            path: "contract",
            canActivate: [AuthGuard],
            component: ContractGenerationComponent
          },


          // Amendment Routes

          {
            path: "sf30",
            canActivate: [AuthGuard],
            component: Sf30Component
          },

          {
            path: "sf30Preview",
            canActivate: [AuthGuard],
            component: Sf30previewComponent
          },



          {
            path: "a-suppliesandservices",
            canActivate: [AuthGuard],
            component: ASuppliesandservicesComponent
          },
          {
            path: "a-part2",
            canActivate: [AuthGuard],
            component: ASf30part2Component
          },
          {
            path: "a-solprovisions",
            canActivate: [AuthGuard],
            component: ASolprovComponent
          },
          {
            path: "a-statementofwork",
            canActivate: [AuthGuard],
            component: ASowComponent
          },
          {
            path: "a-packagingandmarking",
            canActivate: [AuthGuard],
            component: APackagingComponent
          },
          {
            path: "a-inspectionandacceptance",
            canActivate: [AuthGuard],
            component: AInspectionComponent
          },
          {
            path: "a-deliveriesandperformance",
            canActivate: [AuthGuard],
            component: ADeliveriesandperformancesComponent
          },
          {
            path: "a-contractadmindata",
            canActivate: [AuthGuard],
            component: AContractadmindataComponent
          },
          {
            path: "a-specialcontractreq",
            canActivate: [AuthGuard],
            component: ASpecialcontractreqComponent
          },
          {
            path: "a-soc",
            canActivate: [AuthGuard],
            component: ASumofchangesComponent
          },
          {
            path: "a-contractclauses",
            canActivate: [AuthGuard],
            component: AContractComponent
          },
          {
            path: "a-attachmentsinfo",
            canActivate: [AuthGuard],
            component: AAttachmentComponent
          },
          {
            path: "a-representationandcerts",
            canActivate: [AuthGuard],
            component: ACertsComponent
          },
          {
            path: "a-instructions",
            canActivate: [AuthGuard],
            component: AInstructionsComponent
          },
          {
            path: "a-evluationfactors",
            canActivate: [AuthGuard],
            component: AEvaluationfactorsComponent
          },


          //
          {
            path: "proposalevaluation",
            canActivate: [AuthGuard],
            component: ProposalevaluationComponent,
            children: [
              {
                path: "",
                canActivate: [AuthGuard],
                component: ProposalevalhomeComponent
              },
              {
                path: ":vendorName",
                canActivate: [AuthGuard],
                component: VendorresponseComponent
              },
              // {
              //   path: ":vendorName",
              //   canActivate: [AuthGuard],
              //   component: EvaluatevendorComponent
              // },
              {
                path: ":vendorName/:volumeIndex",
                canActivate: [AuthGuard],
                component: VendorresevalComponent
              }
            ]
          }
        ]
      },
      {
        path: "contracts/:contractid",
        component: ContractdetailComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: "",
            canActivate: [AuthGuard],
            component: ContractPreviewComponent
          },
          {
            path: "contractadmin",
            canActivate: [AuthGuard],
            component: ContactAdminComponent
          },
          {
            path: "modifycontract",
            canActivate: [AuthGuard],
            component: ModifyContractComponent
          },
          {
            path: "closeout",
            canActivate: [AuthGuard],
            component: CloseOutComponent
          },
          {
            path: "contractfile",
            canActivate: [AuthGuard],
            component: ContractFileComponent
          }
        ]
      },

      {
        path: ":apid",
        component: ApdetailComponent,
        // canActivate: [RoleGuard],
        canActivate: [AuthGuard],
        children: [
          { path: "", canActivate: [AuthGuard], component: GeneralComponent },
          {
            path:"preview",
            canActivate:[AuthGuard],
            component: AppreviewComponent
          },
         
          {
            path: "market_research",
            canActivate: [AuthGuard],
            component: MarketresearchComponent
          },

          { path: "sow", canActivate: [AuthGuard], component: SowComponent },
          { path: "section508", canActivate: [AuthGuard], component: Section508Component },
          { path: "igce", canActivate: [AuthGuard], component: IgceComponent },
          {
            path: "igceDescription",
            canActivate: [AuthGuard],
            component: TradeoffsComponent
          },
          {
            path: "estimate",
            canActivate: [AuthGuard],
            component: EstimateComponent
          },
          {
            path: "competition",
            canActivate: [AuthGuard],
            component: CompetetionComponent
          },
          {
            path: "compatibility",
            canActivate: [AuthGuard],
            component: CompatibilityComponent
          },
          {
            path: "constraints",
            canActivate: [AuthGuard],
            component: ConstraintsComponent
          },
          { path: "security", canActivate: [AuthGuard], component: SecurityComponent },
          { path: "other", canActivate: [AuthGuard], component: OtherConsiderationsComponent },
          { path: "poc", canActivate: [AuthGuard], component: PocComponent },
          { path: "resources", canActivate: [AuthGuard], component: ResourcesComponent },
          {
            path: "evaluations",
            canActivate: [AuthGuard],
            component: EvaluationsComponent
          },
          {
            path: "attachments",
            canActivate: [AuthGuard],
            component: AttachmentsComponent
          },
          {
            path: "reqform",
            canActivate: [AuthGuard],
            component: ReqformComponent
          }
        ]
      }
    ]
  },
 
  { path: "logout", component: LogoutComponent },
  { path: "**", redirectTo: "home", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

/* By importing this routingComponets into the appmodule there is no need
   to import the components seperately. Everytime we create a new route 
   we just need to add the Component to the export routingComponents */

export const routingComponents = [
  LoginPageComponent,
  HomePageComponent,

  DashboardComponent,
  PmsolComponent,

  RegisterComponent,
  SolicitationdetailComponent,
  CodeValidateComponent,
  FormdetailComponent,
  LogoutComponent,
  ProfileComponent,
  PmacquisitionsComponent,
  ApdetailComponent,
  GeneralComponent,
  SowComponent,
  PreviewComponent,
  IgceComponent,
  ReqformComponent,
  EvaluationsComponent,
  QandaComponent,
  ProposalevaluationComponent,
  CornominationComponent,
  AttachmentsComponent,
  TradeoffsComponent,
  EstimateComponent,
  CompetetionComponent,
  CompatibilityComponent,
  ConstraintsComponent,

  SuppliesandservicesComponent,
  StatementofworkComponent,
  PackagingandmarketingComponent,
  InspectionandacceptanceComponent,
  DeleveriesandperformanceComponent,
  ContractadmindataComponent,
  SpecialcontractreqComponent,
  ContractComponent,
  RepresentationcertsComponent,
  InstructionsComponent,
  EvaluationfactorsComponent,
  AttachmentsinfoComponent,
  EvaluatevendorComponent,
  VendorresponseComponent,
  ProposalevalhomeComponent,
  VendorresevalComponent,
  //VendorresponseContainerComponent,
  MarketresearchComponent,
  ContractGenerationComponent,
  ContractdetailComponent,
  ContactAdminComponent,
  ModifyContractComponent,
  CloseOutComponent,
  ContractFileComponent,
  ContractPreviewComponent,
  ContractsdisplayComponent,
  Section508Component,
  SecurityComponent,
  OtherConsiderationsComponent,
  PocComponent,
  ResourcesComponent,
  SolprovisionsComponent,
  Sf1449part2Component,
  Sf30Component,
  Sf30previewComponent,
  AAttachmentComponent,
  AContractComponent,
  AContractadmindataComponent,
  ADeliveriesandperformancesComponent,
  AEvaluationfactorsComponent,
  AInspectionComponent,
  AInstructionsComponent,
  APackagingComponent,
  ACertsComponent,
  ASolprovComponent,
  ASpecialcontractreqComponent,
  ASowComponent,
  ASuppliesandservicesComponent,
  ASumofchangesComponent,
  ASf30part2Component,

];
