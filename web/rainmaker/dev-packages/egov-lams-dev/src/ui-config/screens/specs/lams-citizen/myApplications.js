import {
  getCommonHeader, 
  getCommonCard, 
  getCommonTitle ,
} from "egov-ui-framework/ui-config/screens/specs/utils";

import {
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";   //returns action object
import { toggleSpinner , toggleSnackbar} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {sampleSearchResponse} from "../lams-utils/sampleData";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { convertEpochToDate } from "egov-ui-framework/ui-config/screens/specs/utils";

const getMyLeaseApplications = async (action, state, dispatch) => {
  try{
    const queryParams = [];
    let payload = null;
      payload = await httpRequest(
        "post",
        "lams-services/v1/_search",
        "_search",
        queryParams,
        {}
      );
    return payload;
  }
  catch(e)
  {
    toggleSnackbar(
      true,
      {
        labelName: "Could not load lease Details",
        labelKey: "LAMS_API_ERROR"
      },
      "error"
    );
  }
  return null;
}

const header = getCommonHeader(
  {
    labelName: "My Applications",
    labelKey: "LAMS_MY_APPLICATIONS_HEADER"
  },
  {
    classes: {
      root: "common-header-cont"
    }
  }
);

const myApplications = {
  uiFramework: "material-ui",
  name: "myApplications",
  beforeInitScreen:(action, state, dispatch) => {

    getMyLeaseApplications().then((response)=>{
      console.log("Response is ", response);
      dispatch(prepareFinalObject("searchResults",response));

      //toberemoved
      if(!response || (response && !response.leases))
      {
        alert("No data recieved. Showing sample data. ");
        dispatch(prepareFinalObject("searchResults",sampleSearchResponse.leases));
      }
    });
    return action;

  },
  afterInitForm:(action, state, dispatch) => {
   
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css"
      },
      children: {
        details: getCommonCard(
          {
            header: getCommonTitle(
                {
                  labelName: "My Applications",
                  labelKey: "LAMS_CITIZEN_MY_APPLICATIONS"
                },
                {
                  style: {
                    marginBottom: 18
                  }
                }
              ),
              div: {
                uiFramework: "custom-atoms",
                componentPath: "Div",
                children: {
                  applicationsCard: {
                    uiFramework: "custom-molecules-local",
                    moduleName: "egov-lams",
                    componentPath: "SingleApplication",
                    visible: true,
                    props: {
                      contents: [
                        {
                          label: "LAMS_TABLE_COL_APP_NO",
                          jsonPath: "applicationNumber"
                        },
                        {
                          label: "LAMS_TABLE_COL_APP_TYPE",
                          jsonPath: "applicationType"
                        },
                        {
                          label: "LAMS_TABLE_COL_APP_DATE",
                          jsonPath: "applicationDate",
                          isDate: true,
                        },
                        {
                          label: "LAMS_TABLE_COL_SURVEYNO",
                          jsonPath: "leaseDetails.surveyNo"
                        },
                        {
                          label: "LAMS_TABLE_COL_STATUS",
                          jsonPath: "status",
                          prefix: "WF_LAMSLR_"
                        }
                      ],
                      moduleName: "LAMS",
                      homeURL: "/lams-citizen/home"
                    }
                  }
                },
              
            }
          },
          {
            style: {
              overflow: "visible"
            }
          }
        ),
      },
    },
  }
};
export default myApplications;