import { getCommonCard, getCommonContainer, getCommonHeader, getCommonSubHeader,
   getLabel, getPattern, getTextField,getSelectField, getDateField,getBreak, getDivider } from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { searchApiCall } from "./function";
import { ifUserRoleExists } from "../../utils";
import "./index.css"
import { getTodaysDateInYMD } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import {loadHospitals} from "./../../utils"

// const tenantId = process.env.REACT_APP_NAME === "Employee" ?  getTenantId() : JSON.parse(getUserInfo()).permanentCity;
// console.log("tenantId--- ", tenantId);
const resetFields = (state, dispatch) => {
  const tenantId = process.env.REACT_APP_NAME === "Employee" ? getTenantId() : JSON.parse(getUserInfo()).permanentCity;
  dispatch(
    handleField(
      "billSearch",
      "components.div.children.billSearchCard.children.cardContent.children.searchContainer.children.ulb",
      "props.value",
      tenantId
    )
  );
  dispatch(
    handleField(
      "billSearch",
      "components.div.children.billSearchCard.children.cardContent.children.searchContainer.children.consumerCode",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "billSearch",
      "components.div.children.billSearchCard.children.cardContent.children.searchContainer.children.billNumber",
      "props.value",
      ""
    )
  );
  //Added by vidya to get mobile number
  if(ifUserRoleExists("CITIZEN")){
    const userName = JSON.parse(getUserInfo()).userName;
    dispatch(
      prepareFinalObject("searchScreen.mobileNumber", userName)
    );
  } else{
    dispatch(
      handleField(
        "billSearch",
        "components.div.children.billSearchCard.children.cardContent.children.searchContainer.children.mobileNo",
        "props.value",
        ""
      )
    );
  }  
  
  dispatch(
    handleField(
      "billSearch",
      "components.div.children.billSearchCard.children.cardContent.children.searchContainer.children.serviceCategory",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "billSearch",
      "components.div.children.billSearchCard.children.cardContent.children.searchContainer.children.serviceCategory",
      "props.error",
      false
    )
  );
  dispatch(
    handleField(
      "billSearch",
      "components.div.children.billSearchCard.children.cardContent.children.searchContainer.children.serviceCategory",
      "props.helperText",
      ""
    )
  );
  dispatch(prepareFinalObject("searchScreen", { tenantId: tenantId ,businesService:""}));
};

const cbChanged = (action, state, dispatch) => {

  loadHospitals(action, state, dispatch);

}

const setVisibilityOptionsSet1 = (state, dispatch, visible) => {
  dispatch(
    handleField(
      "getCertificate",
      "components.div.children.birthSearchCard.children.cardContent.children.searchContainer1",
      "visible",
      visible
    )
  );
}
  
const setVisibilityOptionsSet2 = (state, dispatch, visible) => {
  dispatch(
    handleField(
      "getCertificate",
      "components.div.children.birthSearchCard.children.cardContent.children.searchContainer2",
      "visible",
      visible
    )
  );
}

export const searchSetCommon = getCommonContainer({
  dob: getDateField({
    label: { labelName: "DOB", labelKey: "BND_BIRTH_DOB" },
    placeholder: {
      labelName: "Date of Birth",
      labelKey: "BND_BIRTH_DOB_PLACEHOLDER"
    },
    jsonPath: "bnd.birth.dob",
    gridDefination: {
      xs: 12,
      sm: 4
    },
    pattern: getPattern("Date"),
    errorMessage: "ERR_INVALID_DATE",
    required: true,
    props: {
      inputProps: {
        max: getTodaysDateInYMD()
      }
    }
  }),
  gender: getSelectField({
    label: {
      labelName: "Select Gender",
      labelKey: "BND_GENDER"
    },
    placeholder: {
      labelName: "Select Gender",
      labelKey: "BND_GENDER_PLACEHOLDER"
    },
    required: true,
    localePrefix: {
      moduleName: "BND",
      masterName: "GENDER"
    },
    data: [
      {
        code: "M",
        label: "MALE"
      },
      {
        code: "F",
        label: "FEMALE"
      },
      {
        code: "T",
        label: "TRANSGENDER"
      }
    ],
    props:{
      disabled: false,
    },
    gridDefination: {
      xs: 12,
      sm: 4
    },
    jsonPath: "bnd.birth.gender",
    autoSelect: true,
    visible: true,
    beforeFieldChange: (action, state, dispatch) => {
    
    },
    afterFieldChange: (action, state, dispatch) => {
    
    },
  })
});

export const searchSet1 = getCommonContainer({
  registrationNo: getTextField({
    label: {
      labelName: "Registration No",
      labelKey: "BND_REG_NO_LABEL"
    },
    placeholder: {
      labelName: "Registration No",
      labelKey: "BND_REG_NO_PLACEHOLDER"
    },
    required:true,
    visible: true,
    jsonPath: "bnd.birth.registrationNo",
    gridDefination: {
      xs: 12,
      sm: 4
    }
  }),
  clickHereLink: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-bnd",
    componentPath: "LinkButton",
    props: { 
      url: "teat" ,
      labelKey:"BND_DONT_KNOW_REGNO_MSG",
      onClickDefination: {
        callBack: (state, dispatch) => {
          setVisibilityOptionsSet1(state,dispatch,false);
          setVisibilityOptionsSet2(state,dispatch,true);
        }
      },
    },
    gridDefination: { xs: 12, sm: 4, md: 4 }
  },
});

export const searchSet2 = getCommonContainer({
  cantonmentSelect: {
    uiFramework: "custom-containers",
      //moduleName: "egov-lams",
      componentPath: "AutosuggestContainer",
      jsonPath: "bnd.birth.tenantId",
      sourceJsonPath: "bnd.allTenants",
      visible:true,
      autoSelect:true,
      props:{
        autoSelect:true,
        //isClearable:true,
        className: "autocomplete-dropdown",
        suggestions: [],
        disabled:false,//getQueryArg(window.location.href, "action") === "EDITRENEWAL"? true:false,
        label: {
          labelName: "Select Cantonment",
          labelKey: "BND_APPL_CANT"
        },
        placeholder: {
          labelName: "Select Cantonment",
          labelKey: "BND_APPL_CANT_PLACEHOLDER"
        },
        localePrefix: {
          moduleName: "TENANT",
          masterName: "TENANTS"
        },
        labelsFromLocalisation: true,
        required: true,
        jsonPath: "bnd.birth.tenantId",
        sourceJsonPath: "bnd.allTenants",
        inputLabelProps: {
          shrink: true
        },
        onClickHandler: (action, state, dispatch) => {
          //console.log(action,state, dispatch );
        },
      },
      gridDefination: {
        xs: 12,
        sm: 4
      },
      required: true,
      beforeFieldChange: (action, state, dispatch) => {

      },
      afterFieldChange: (action, state, dispatch) => {
        cbChanged(action, state, dispatch);
      },
  },
  hospital: {
    uiFramework: "custom-containers",
      //moduleName: "egov-lams",
      componentPath: "AutosuggestContainer",
      jsonPath: "bnd.birth.hosptialId",
      sourceJsonPath: "bnd.allHospitals",
      visible:true,
      autoSelect:true,
      props:{
        autoSelect:true,
        //isClearable:true,
        className: "autocomplete-dropdown",
        suggestions: [],
        disabled:false,//getQueryArg(window.location.href, "action") === "EDITRENEWAL"? true:false,
        label: {
          labelName: "Select Hospital",
          labelKey: "BND_APPL_HOSP"
        },
        placeholder: {
          labelName: "Select Hospital",
          labelKey: "BND_APPL_HOSP_PLACEHOLDER"
        },
        localePrefix: {
          moduleName: "TENANT",
          masterName: "TENANTS"
        },
        labelsFromLocalisation: true,
        required: true,
        jsonPath: "bnd.birth.hosptialId",
        sourceJsonPath: "bnd.allHospitals",
        inputLabelProps: {
          shrink: true
        },
        onClickHandler: (action, state, dispatch) => {
          //console.log(action,state, dispatch );
        },
      },
      gridDefination: {
        xs: 12,
        sm: 4
      },
      required: true,
      beforeFieldChange: (action, state, dispatch) => {

      },
      afterFieldChange: (action, state, dispatch) => {

      },
  },
  fathersName: getTextField({
    label: {
      labelName: "Father's Name",
      labelKey: "BND_FATHERS_NAME_LABEL"
    },
    placeholder: {
      labelName: "Father's Name",
      labelKey: "BND_FATHERS_NAME_PLACEHOLDER"
    },
    required:true,
    visible: true,
    jsonPath: "bnd.birth.fathersName",
    gridDefination: {
      xs: 12,
      sm: 4
    }
  }),
  mothersName: getTextField({
    label: {
      labelName: "Mother's Name",
      labelKey: "BND_MOTHERS_NAME_LABEL"
    },
    placeholder: {
      labelName: "Mother's Name",
      labelKey: "BND_MOTHERS_NAME_PLACEHOLDER"
    },
    required:true,
    visible: true,
    jsonPath: "bnd.birth.mothersName",
    gridDefination: {
      xs: 12,
      sm: 4
    }
  }),
  clickHereLink: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-bnd",
    componentPath: "LinkButton",
    props: { 
      url: "teat" ,
      labelKey:"BND_DONT_KNOW_DETAILS_MSG",
      onClickDefination: {
        callBack: (state, dispatch) => {
          setVisibilityOptionsSet1(state,dispatch,true);
          setVisibilityOptionsSet2(state,dispatch,false);
        }
      },
    },
    gridDefination: { xs: 12, sm: 4, md: 4 }
  },
});

export const buttonContainer = getCommonContainer({
  firstCont: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    gridDefination: {
      xs: 12,
      sm: 3
    }
  },
  searchButton: {
    componentPath: "Button",
    gridDefination: {
      xs: 12,
      sm: 3
      // align: "center"
    },
    props: {
      variant: "contained",
      style: {
        color: "white",
        backgroundColor: "#696969",
        borderRadius: "2px",
        width: window.innerWidth > 480 ? "80%" : "100%",
        height: "48px"
      }
    },
    children: {
      buttonLabel: getLabel({
        labelName: "SEARCH",
        labelKey: "BND_SEARCH_BUTTON"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => {
        searchApiCall(state, dispatch);
      }
    }
  },
  resetButton: {
    componentPath: "Button",
    gridDefination: {
      xs: 12,
      sm: 3
      // align: "center"
    },
    props: {
      variant: "outlined",
      style: {
        color: "#FE7A51",
        // backgroundColor: "#FE7A51",
        border: "#FE7A51 solid 1px",
        borderRadius: "2px",
        width: window.innerWidth > 480 ? "80%" : "100%",
        height: "48px"
      }
    },
    children: {
      buttonLabel: getLabel({
        labelName: "RESET",
        labelKey: "BND_RESET_BUTTON"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: resetFields
    }
  },    

  lastCont: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    gridDefination: {
      xs: 12,
      sm: 3
    }
  }
});

export const birthSearchCard = getCommonCard({
  header: getCommonHeader({
    labelName: "Search Bill",
    labelKey: "BND_BIRTH_SEARCH"
  }),
  // subheader: getCommonSubHeader({
  //   labelName: "Provide at least one parameter to search for an application",
  //   labelKey: "ABG_SEARCH_BILL_COMMON_SUB_HEADER"
  // }),
  searchContainerCommon: searchSetCommon,
  //break1: getBreak(),
  divider1: getDivider(),
  searchContainer1:{
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
    },
    children: {
      details:  searchSet1
    },
    visible: true,
  },
  searchContainer2:{
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
    },
    children: {
      details: searchSet2
    },
    visible: false,
  },
  buttonContainer: buttonContainer
});
