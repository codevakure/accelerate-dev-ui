Feature: Publish solicitation
    Publish solicitation after adding deadlines in form SF-1449

    Scenario: New Acquisition is created and user needs to complete deadlines infomration in the from SF-1449 page
        Given User is on SF-1449
        When User clicks on Preview Icon on the top
        Then User clicks on Export-Print
        # And User clicks publish
        # Then The solicitation is published by CO and it takes you to the form SF-1449
