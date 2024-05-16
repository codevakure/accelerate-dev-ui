var { Given, When, And, Then, Before } = require("cucumber");
import { AppPage } from "../app.po";
import { browser, by, element, protractor, until } from "protractor";

let app: AppPage;

Before(() => (app = new AppPage()));

Given("User is on Project general page", { timeout: 2 * 20000 }, async () => {
  await app.s(500);
});

When("User starts entering information regarding acqusition", { timeout: 2 * 20000 }, async () => {
    
    await app.enterInput_id("statementofneed", "Automation Test"+ new Date());
    await app.s(1000);

    await app.enterInput_id("queststartDate", "10/19/2022");
    await app.s(1000);

    await app.enterInput_id("questendDate", "10/19/2023");
    await app.s(1000);

    await app.click_id("commercialYes");
    await app.s(1000);

    await app.enterInput_id("naicscode", "621491");
    await app.s(1000);
    await app.selectDropdown();
    await app.s(1000);

//  Acquisition Method and Background
    await app.click_id("headingFour");
    await app.s(1000);

    await app.enterInput_id("technicalHistory", "Automation Test"+ new Date());
    await app.s(1000);

    await app.enterInput_id("method_of_solicitation", "RFP");
    await app.s(1000);

    await app.enterInput_id("percent", "70");
    await app.s(1000);

    await app.click_css("label[for='customCheck993']");
    await app.s(1000);


    await app.click_css("label[for='customCheck16']");
    await app.s(1000);


//Contract Information
    await app.click_id("headingThree")
    await app.s(1000);

    await app.enterInput_id("contractingmethod","Sealed Bidding");
    await app.s(1000);


    await app.enterInput_id("contractType", "Fixed Price");
    await app.s(1000);
    await app.selectDropdown();
    await app.s(1000);

    await app.click_css("label[for='idiqYes']");
    await app.s(1000);

    await app.enterInput_id("contractVehicle","BPA");
    await app.s(1000);


    //Inherently Governamental
    await app.click_id("headingFive");
    await app.s(1000);

    //Supplemental Informational


    await app.click_id("headingSix");
    await app.s(1000);

    await app.click_css("label[for='organizationalConflictNo']");
    await app.s(1000);

    await app.click_css("label[for='severabilityYes']");
    await app.s(1000);

});


Then("User needs to complete all the required information for CO to draft solicitation", { timeout: 2 * 20000 }, async () => {
    await app.s(2000);
});
