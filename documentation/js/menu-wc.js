'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">hhs_pacd-frontend-phase2 documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-41afa213679518ed424386ffd04e2add"' : 'data-target="#xs-components-links-module-AppModule-41afa213679518ed424386ffd04e2add"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-41afa213679518ed424386ffd04e2add"' :
                                            'id="xs-components-links-module-AppModule-41afa213679518ed424386ffd04e2add"' }>
                                            <li class="link">
                                                <a href="components/ApdetailComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ApdetailComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AttachmentsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AttachmentsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AttachmentsinfoComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AttachmentsinfoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ClausesectionsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ClausesectionsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CloseOutComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CloseOutComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CodeValidateComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CodeValidateComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CommentBoxComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CommentBoxComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CompatibilityComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CompatibilityComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CompetetionComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CompetetionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConstraintsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ConstraintsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ContactAdminComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ContactAdminComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ContractComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ContractComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ContractFileComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ContractFileComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ContractGenerationComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ContractGenerationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ContractPreviewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ContractPreviewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ContractadmindataComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ContractadmindataComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ContractdetailComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ContractdetailComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ContractsdisplayComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ContractsdisplayComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CoprofileComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CoprofileComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CornominationComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CornominationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DashAcquisitionComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DashAcquisitionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DashActiveComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DashActiveComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DashExpiredComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DashExpiredComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DashSolicitationComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DashSolicitationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DashboardComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DashboardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DeleveriesandperformanceComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DeleveriesandperformanceComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EstimateComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EstimateComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EvaluatevendorComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EvaluatevendorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EvaluationfactorsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EvaluationfactorsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EvaluationsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EvaluationsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FormdetailComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FormdetailComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GeneralComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">GeneralComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HomePageComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HomePageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/IgceComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">IgceComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/InspectionandacceptanceComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">InspectionandacceptanceComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/InstructionsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">InstructionsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoginPageComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LoginPageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LogoutComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LogoutComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MarketresearchComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MarketresearchComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ModifyContractComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ModifyContractComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PackagingandmarketingComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PackagingandmarketingComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PmacquisitionsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PmacquisitionsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PmdashComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PmdashComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PmprofileComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PmprofileComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PmsolComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PmsolComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PreviewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PreviewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProfileComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProfileComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProposalevalhomeComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProposalevalhomeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProposalevaluationComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProposalevaluationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/QandaComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">QandaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegisterComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RegisterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RepresentationcertsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RepresentationcertsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ReqformComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ReqformComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SolCommentBoxComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SolCommentBoxComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SolicitationdetailComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SolicitationdetailComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SowComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SowComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SpecialcontractreqComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SpecialcontractreqComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StatementofworkComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StatementofworkComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SuppliesandservicesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SuppliesandservicesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TradeoffsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TradeoffsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VendorresevalComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">VendorresevalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VendorresponseComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">VendorresponseComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-41afa213679518ed424386ffd04e2add"' : 'data-target="#xs-injectables-links-module-AppModule-41afa213679518ed424386ffd04e2add"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-41afa213679518ed424386ffd04e2add"' :
                                        'id="xs-injectables-links-module-AppModule-41afa213679518ed424386ffd04e2add"' }>
                                        <li class="link">
                                            <a href="injectables/AcquisitionService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AcquisitionService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AuthenticationService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AuthenticationService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ClausesService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ClausesService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/FormsService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>FormsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SectionsService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>SectionsService</a>
                                        </li>
                                    </ul>
                                </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-AppModule-41afa213679518ed424386ffd04e2add"' : 'data-target="#xs-pipes-links-module-AppModule-41afa213679518ed424386ffd04e2add"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-AppModule-41afa213679518ed424386ffd04e2add"' :
                                            'id="xs-pipes-links-module-AppModule-41afa213679518ed424386ffd04e2add"' }>
                                            <li class="link">
                                                <a href="pipes/AllhtmlPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AllhtmlPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/SanitizeHtmlPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SanitizeHtmlPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link">AppRoutingModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/acquisition.html" data-type="entity-link">acquisition</a>
                            </li>
                            <li class="link">
                                <a href="classes/AppPage.html" data-type="entity-link">AppPage</a>
                            </li>
                            <li class="link">
                                <a href="classes/AppPage-1.html" data-type="entity-link">AppPage</a>
                            </li>
                            <li class="link">
                                <a href="classes/AppPage-2.html" data-type="entity-link">AppPage</a>
                            </li>
                            <li class="link">
                                <a href="classes/AppPage-3.html" data-type="entity-link">AppPage</a>
                            </li>
                            <li class="link">
                                <a href="classes/AppPage-4.html" data-type="entity-link">AppPage</a>
                            </li>
                            <li class="link">
                                <a href="classes/AppPage-5.html" data-type="entity-link">AppPage</a>
                            </li>
                            <li class="link">
                                <a href="classes/AppPage-6.html" data-type="entity-link">AppPage</a>
                            </li>
                            <li class="link">
                                <a href="classes/attributeSchema.html" data-type="entity-link">attributeSchema</a>
                            </li>
                            <li class="link">
                                <a href="classes/cognitoattr.html" data-type="entity-link">cognitoattr</a>
                            </li>
                            <li class="link">
                                <a href="classes/formModel.html" data-type="entity-link">formModel</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AcquisitionService.html" data-type="entity-link">AcquisitionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthenticationService.html" data-type="entity-link">AuthenticationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ClausesService.html" data-type="entity-link">ClausesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ContractService.html" data-type="entity-link">ContractService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CorsService.html" data-type="entity-link">CorsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FormsService.html" data-type="entity-link">FormsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/QandaService.html" data-type="entity-link">QandaService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SectionsService.html" data-type="entity-link">SectionsService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link">AuthGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/RoleGuard.html" data-type="entity-link">RoleGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});