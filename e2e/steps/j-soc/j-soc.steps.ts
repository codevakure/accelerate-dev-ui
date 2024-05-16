var { Given, When, And, Then, Before } = require("cucumber");
import { AppPage } from "../app.po";
import { browser, by, element, protractor, until } from "protractor";

let app: AppPage;

Before(() => (app = new AppPage()));


Given("User is on Form Sf-30", { timeout: 2 * 20000 }, async () => {
  await app.s(2000);
});

When("User clicks on continuation of sf-30", { timeout: 2 * 20000 }, async () => {
    await app.click_id('a-part2');
    await app.s(5000);
});

When("User enters information for contract admin data", { timeout: 2 * 20000 }, async () => {
    await app.enterInput_css('#cad > div.ql-container.ql-snow > div.ql-editor.ql-blank',"Deeksha Automation Test"+ new Date());
    await app.s(2000);
});
When("User enters information for statement of work", { timeout: 2 * 20000 }, async () => {
    await app.enterInput_css('#sow > div.ql-container.ql-snow > div.ql-editor.ql-blank',"Deeksha Automation Test"+ new Date());
    await app.s(2000); 
    
});
When("User enters information for Deliverables", { timeout: 2 * 20000 }, async () => {
    await app.enterInput_css('#deliverables > div.ql-container.ql-snow > div.ql-editor.ql-blank',"Deeksha Automation Test"+ new Date());
    await app.s(1000);
});
When("User enters information for Special Contract requirements", { timeout: 2 * 20000 }, async () => {
    await app.enterInput_css('#scr > div.ql-container.ql-snow > div.ql-editor.ql-blank',"Deeksha Automation Test"+ new Date());
    await app.s(1000);
});

Then("Summary of changes will be updated", { timeout: 2 * 20000 }, async () => {
    browser.executeScript('window.scrollTo(0,0);').then(function(){
        console.log('++++++SCROLLED UP+++++');
    });
    await app.s(1000);
});
