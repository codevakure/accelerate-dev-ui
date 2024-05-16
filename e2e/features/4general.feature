Feature: Complete Project General page after creating acquisition
    Complete Project General page after creating acquisition

    Scenario: New Acquisition is created and user needs to complete information in the project general page
        Given User is on Project general page
        When User starts entering information regarding acqusition
        Then User needs to complete all the required information for CO to draft solicitation
