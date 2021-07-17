import {getCommonCardWithHeader,getLabel} from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject,  handleScreenConfigurationFieldChange as handleField} 
  from "egov-ui-framework/ui-redux/screen-configuration/actions";   //returns action object
import { getCommonCard, getCommonContainer, getCommonHeader, getCommonParagraph, getCommonTitle, getStepperObject, getBreak } from "egov-ui-framework/ui-config/screens/specs/utils";
//import { getLocaleLabelsforTL } from "../../../../ui-utils/commons";
import {chbSearchCard} from "./chbSearchBookingResources/chbSearchCard";
import {searchResults} from "./chbSearchBookingResources/searchResults";
import {loadMdmsData} from "./../utils";
import {get,set} from "lodash";
import jp from "jsonpath";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";

const header = getCommonHeader({
  labelName: "Search Hall",
  labelKey: "OBM_SEARCH_BOOKINGS"
});

const searchBooking = {
  uiFramework: "material-ui",
  name: "searchBooking",
  beforeInitScreen:(action, state, dispatch) => {
  
    loadMdmsData(action, state, dispatch).then((response) => {
      const tenants = get(response, "MdmsRes.tenant.tenants");
      //Requires City Module Updations of MDMS? tobechanged
      let jpFilter = "$[?(@.code != 'pb')]";
      let onlyCBs = jp.query(tenants, jpFilter);
      if(!(process.env.REACT_APP_NAME === "Citizen"))
      {
        let tenantId = getTenantId();
        let currentCbFilter = "$[?(@.code == '"+tenantId+"')]";
        onlyCBs = jp.query(onlyCBs, currentCbFilter );
      } 
      onlyCBs.sort((a, b) => (a.code > b.code) ? 1 : -1)
      dispatch(prepareFinalObject("chb.allTenants", onlyCBs));
    });
    return action;

  },
  components:{
  div: {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      className: "common-div-css",
      id: "bndBirthSearch"
    },
    children: {
      headerDiv: {
        uiFramework: "custom-atoms",
        componentPath: "Container",
        children: {
          header: {
            gridDefination: {
              xs: 12,
              sm: 6
            },
            ...header
          },
          howitWorksButton:{
            componentPath:"Button",
            gridDefination: {
              xs: 12,
              sm: 6,
              align: "right"
            },
            visible:process.env.REACT_APP_NAME === "Citizen" ? true : false,
            props:{
              //variant: "outlined",
              color:"primary",                 
                style:{
                minWidth:"180px",
                height:"48px",
                marginRight:"45",
                borderRadius: "inherit"
              }
            },
            onClickDefination: {
              action: "page_change",
              path:`/chb-common/how-it-works-chb`
            },
            children:{
              helpButtonIcon:{
                uiFramework:"custom-atoms",
                componentPath:"Icon",
                props:{
                  iconName:"help-circle"
                }
              },
              helpButtonLabel:getLabel({
                labelName:"How it Works",
                labelKey:"COMMON_HOW_IT_WORKS"
              }),
            },        
           }, 
        }
      },
      chbSearchCard,
      breakAfterSearch: getBreak(),
      searchResults
    }
  }
}
}

export default searchBooking;