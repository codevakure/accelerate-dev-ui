Feature: Complete Questionnaire to create acquisition
    Complete Questionnaire to create acquisition

    Scenario: Create Product Based New requirement Acq
        Given User on program manager dashboard
        When User clicks on create new
        And User selects create new requirement and clicks next
        And User selects Products or Services and clicks next
        And User selects category of contracting and clicks next
        And User selects products and service PSC Considerations and clicks next
        And User types keywords or phrases and clicks next
        And User selects anticipated award date and clicks next
        And User selects no for unusual and compelling urgency and clicks next
        And User enters estimated budget and clicks next
        And User enters project title and clicks submit
        Then User should see options like “General”, “Statement of Work”, “Market Research”, “Funding”, “Evaluations”, “Security”, “Other Considerations”, “Attachments”, “Points of Contact”, “Resources” on the left nav
