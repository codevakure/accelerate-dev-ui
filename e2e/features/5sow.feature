Feature: Complete Statement of Work page after creating acquisition
        Complete Statement of Work page after creating acquisition

  Scenario: New Acquisition is created and user needs to complete information in the statement of work page
            Given User is on Acquisition
            When User clicks on statement of work in the left side nav
            And User sees statement of work page
            Then User starts entering information for Product or Service Descriptions and Capability or Performance 
     
