var { Given, When, And, Then, Before } = require("cucumber");
import { AppPage } from "../app.po";
import { browser, by, element, protractor, until } from "protractor";

let app: AppPage;

Before(() => (app = new AppPage()));

Given("User on program manager dashboard", { timeout: 2 * 20000 }, async () => {
  await app.s(500);
});

When("User clicks on create new", { timeout: 2 * 20000 }, async () => {
    await app.click_id("createnew");
    await app.s(1000);
});

When("User selects create new requirement and clicks next", { timeout: 2 * 20000 }, async () => {
    await app.click_id("newreq");
    await app.s(1500);
    await app.click_id("btnNext1");
    await app.s(1500);
});

When("User selects Products or Services and clicks next", { timeout: 2 * 20000 }, async () => {
    await app.enterInput_id("productService", "Products");
    await app.s(1500);
    await app.selectDropdown();
    await app.s(1500);
    await app.click_id("btnNext2");
    await app.s(1500);

});

When("User selects category of contracting and clicks next", { timeout: 2 * 20000 }, async () => {
    await app.enterInput_id("categoryManagement", "Medical");
    await app.s(1500);
    await app.selectDropdown();
    await app.s(1500);
    await app.click_id("btnNext3");
    await app.s(1500);

});



When("User selects products and service PSC Considerations and clicks next", { timeout: 2 * 20000 }, async () => {
    await app.enterInput_id("catalogue", "N065");
    await app.s(1500);
    await app.selectDropdown();
    await app.s(1500);
    await app.click_id("btnNext4");
    await app.s(1500);
});


When("User types keywords or phrases and clicks next", { timeout: 2 * 20000 }, async () => {
    await app.enterInput_id("similarNumber", "Server");
    await app.s(1500);
    await app.click_id("btnNext5");
    await app.s(1500);
});


When("User selects anticipated award date and clicks next", { timeout: 2 * 20000 }, async () => {
    await app.enterInput_id("anticipatedPop", "10/19/2022");
    await app.s(1500);
    await app.click_id("next");
    await app.s(1500);
});


When("User selects no for unusual and compelling urgency and clicks next", { timeout: 2 * 20000 }, async () => {
    await app.click_id("test2");
    await app.s(1500);
    await app.click_id("btnNext7");
    await app.s(1500);
});

When("User enters estimated budget and clicks next", { timeout: 2 * 20000 }, async () => {
    await app.enterInput_id("estimatedbudgett", "57000");
    await app.s(1500);
    await app.click_id("btnNext8");
    await app.s(1500);
});


When("User enters project title and clicks submit", { timeout: 2 * 20000 }, async () => {
    await app.enterInput_id("projecttitle", "Deeksha Automation Test"+ new Date());
    await app.s(1500);
    await app.click_id("submit");
    await app.s(1500);
});

Then("User should see options like “General”, “Statement of Work”, “Market Research”, “Funding”, “Evaluations”, “Security”, “Other Considerations”, “Attachments”, “Points of Contact”, “Resources” on the left nav", { timeout: 2 * 20000 }, async () => {
    await app.s(8000);
});
