export class formModel {
    "name": "forms";
    "base": "PersistedModel";
    "strict": false;
    "idInjection": false;
    "options": {
      "validateUpsert": true
    }
    "properties": {
      "requisitionNumber": {
        "type": "String"
      },
      "setAside": {
        "type": "string",
        "enum": [
          "Unrestricted",
          "Set Aside"
        ]
      },
      "setAsideFor": {
        "type": "object",
        "properties": {
          "percent": {
            "type": "string"
          },
          "bType": {
            "type": "boolean"
          },
            "8a":{
              "type":"boolean"
            },
            "SDVOB":{
              "type":"boolean"
            },
            "smallBusiness":{
              "type":"boolean"
            },
            "EDWOSB":{
              "type":"boolean"
            },
            "hubzoneSB":{
              "type":"boolean"
            },
            "womenSB":{
              "type":"boolean"
            }
  
          }
      },
      "paymentTerms": {
        "type": "object",
        "properties": {
          "contractingOfficer": {
            "type": "string"
          },
          "officeCode": {
            "type": "number"
          },
          "address": {
            "type": "string"
          }
        }
      },
      "contractOrder": {
        "type": "string",
        "enum": [
          "Yes",
          "No"
        ]
      },
      "method_of_solicitation": {
        "type": "string",
        "enum": [
          "RFP",
          "RFQ",
          "IFB"
        ]
      },
      "paymentsBy": {
        "type": "object",
        "properties": {
          "contractingOfficer": {
            "type": "string"
          },
          "officeCode": {
            "type": "number"
          },
          "address": {
            "type": "string"
          }
        }
      },
      "solicitationIncorporates": {
        "type": "string",
        "enum": [
          "Yes",
          "No"
        ]
      },
      "acquisitionMember": {
        "type": "object",
        "properties": {
          "Name": {
            "type": "string"
          },
          "telephone": {
            "type": "string"
          },
          "offerDueDate": {
            "type": "string",
            "format": "date",
            "pattern":"/^[0-9]{4}[\/][0-9]{2}[\/][0-9]{2}$/g"
          }
        }
      },
      "locationforServices": {
        "type": "object",
        "properties": {
          "contractingOfficer": {
            "type": "string"
          },
          "officeCode": {
            "type": "number"
          },
          "address": {
            "type": "string"
          }
        }
      },
      "to_schedule": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "item": {
              "type": "string"
            },
            "scheduleofSupplies": {
              "type": "string"
            },
            "quantity": {
              "type": "string"
            },
            "unit": {
              "type": "string"
            },
            "unitPrice": {
              "type": "string"
            },
            "amount": {
              "type": "string"
            }
          }
        }
      },
      "naicscode": {
        "type": "string"
      },
      "standard_size": {
        "type": "string"
      },
      "solicitationNumber": {
        "type": "String"
      },
      "Sections": {
        "type": "object"
      },
      "clauses": {
        "type": "object",
        "optinal": {
          "type": "array",
          "properties": {
            "clauseNo": {
              "type": "string"
            },
            "title": {
              "type": "string"
            },
            "prescription": {
              "type": "string"
            },
            "percentage": {
              "type": "string"
            },
            "ibr": {
              "type": "string"
            },
            "ucf": {
              "type": "string"
            }
          }
        },
        "required": {
          "type": "array",
          "properties": {
            "clauseNo": {
              "type": "string"
            },
            "title": {
              "type": "string"
            },
            "prescription": {
              "type": "string"
            },
            "percentage": {
              "type": "string"
            },
            "ibr": {
              "type": "string"
            },
            "ucf": {
              "type": "string"
            }
          }
        },
        "applied": {
          "type": "array",
          "properties": {
            "clauseNo": {
              "type": "string"
            },
            "title": {
              "type": "string"
            },
            "prescription": {
              "type": "string"
            },
            "percentage": {
              "type": "string"
            },
            "ibr": {
              "type": "string"
            },
            "ucf": {
              "type": "string"
            }
          }
        },
        "userDefined": {
          "type": "array",
          "properties": {
            "clauseNo": {
              "type": "string"
            },
            "title": {
              "type": "string"
            },
            "prescription": {
              "type": "string"
            },
            "percentage": {
              "type": "string"
            },
            "ibr": {
              "type": "string"
            },
            "ucf": {
              "type": "string"
            }
          }
        }
      },
      "excludeClauses" :{
        "type":"array"
      }
    }
    "validations": []
    "relations": {}
    "acls": []
    "methods": {}
  }
  