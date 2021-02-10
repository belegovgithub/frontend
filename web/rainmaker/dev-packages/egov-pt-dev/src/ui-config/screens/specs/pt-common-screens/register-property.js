
import commonConfig from "config/common.js";
import {
  getCommonContainer,
  getCommonHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject, handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import uniqBy from "lodash/uniqBy"
import set from "lodash/set";
import { httpRequest } from "../../../../ui-utils";
import { getBoundaryData } from "../../../../ui-utils/commons";
import { footer } from "./applyResource/footer";
import { propertyAssemblyDetails, renderAreaData, renderNoOfFlatsData, renderNoOfFloorData, rendersubUsageType } from "./applyResourceMutation/propertyAssemblyDetails";
import { propertyLocationDetails } from "./applyResourceMutation/propertyLocationDetails";
import { propertyOwnershipDetails } from './applyResourceMutation/propertyOwnershipDetails';
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";


export const header = getCommonContainer({
  header: getCommonHeader({
    labelKey: "PT_COMMON_REGISTER_NEW_PROPERTY"
  }),
});


export const formwizardFirstStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form1"
  },
  children: {
    propertyAssemblyDetails,
    propertyLocationDetails,
    propertyOwnershipDetails
  }
};
const getMDMSPropertyData = async (dispatch) => {
  const mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        {
          moduleName: "PropertyTax",
          masterDetails: [
            { name: "PropertyType" },
            { name: "UsageCategory" },
            { name: "UsageCategoryMajor" },
            { name: "UsageCategoryMinor" },
            { name: "UsageCategorySubMinor" },
            {name: "PropertyLocation"},
            { name: "PTWorkflow" }
          ]
        }
      ],

    }
  }
  try {
    let payload = null;
    payload = await httpRequest("post", "/egov-mdms-service/v1/_search", "_search", [], mdmsBody);
    let PropertyType = []; let UsageType = [];
    payload.MdmsRes.PropertyTax.PropertyType.filter(item => {
      if (item.name != "Built Up") {
        PropertyType.push({
          name: item.name,
          code: item.code,
          isActive: item.active
        })
      }

    })
    payload.MdmsRes.PropertyTax.PropertyType = PropertyType;

    payload.MdmsRes.PropertyTax.UsageCategory.forEach(item => {
      if (item.code.split(".").length <= 2 && item.code != "NONRESIDENTIAL") {
        UsageType.push({
          active: item.active,
          name: item.name,
          code: item.code,
          fromFY: item.fromFY
        })
      }
    })
    payload.MdmsRes.PropertyTax.UsageType = UsageType;
    let array1 = [];
    let array2 = [];
    payload.MdmsRes.PropertyTax.UsageCategory.forEach(item => {
      let itemCode = item.code.split(".");
      const codeLength = itemCode.length;
      if (codeLength > 3) {
        array1.push(item);
      } else if (codeLength === 3) {
        array2.push(item);
      }
    })
    array1.forEach(item => {
      array2 = array2.filter(item1 => {
        return (!(item.code.includes(item1.code)));
      })
    });
    array1 = array2.concat(array1);

    payload.MdmsRes.PropertyTax.subUsageType = array1;

    dispatch(prepareFinalObject("searchScreenMdmsData", payload.MdmsRes));
    let ptWorkflowDetails = get(payload, "MdmsRes.PropertyTax.PTWorkflow", []);
    ptWorkflowDetails.forEach(data => {
      if(data.enable) {
        if((data.businessService).includes("WNS")){
          dispatch(handleField('register-property', "components.div.children.footer.children.payButton","visible", false));
          dispatch(handleField('register-property', "components.div.children.footer.children.nextButton","visible", true));
          dispatch(prepareFinalObject("isFromWNS", true));
        } else {
          dispatch(handleField('register-property', "components.div.children.footer.children.payButton","visible", true));
          dispatch(handleField('register-property', "components.div.children.footer.children.nextButton","visible", false));
          dispatch(prepareFinalObject("isFromWNS", false));
        }
      }
    })
  } catch (e) {
    console.log(e);
  }
};


const getMdmsData = async (action, state, dispatch) => {
  let tenantId = process.env.REACT_APP_NAME === "Employee" ? getTenantId() : JSON.parse(getUserInfo()).permanentCity;
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "common-masters",
          masterDetails: [{ name: "OwnerType" }, { name: "OwnerShipCategory" }]
        },
        {
          moduleName: "egov-location",
          masterDetails: [
            {
              name: "TenantBoundary"
            }
          ]
        },
        {
          moduleName: "tenant",
          masterDetails: [
            {
              name: "tenants"
            }, { name: "citymodule" }
          ]
        }
      ]
    }
  };
  try {
    let payload = null;
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );

    let OwnerShipCategory = get(
      payload,
      "MdmsRes.common-masters.OwnerShipCategory"
    )
    let institutions = []
    OwnerShipCategory = OwnerShipCategory.map(category => {
      if (category.code.includes("INDIVIDUAL")) {
        return category.code;
      }
      else {
        let code = category.code.split(".");
        institutions.push({ code: code[1], parent: code[0], active: true });
        return code[0];
      }
    });
    OwnerShipCategory = OwnerShipCategory.filter((v, i, a) => a.indexOf(v) === i)
    OwnerShipCategory = OwnerShipCategory.map(val => { return { code: val, active: true } });

    payload.MdmsRes['common-masters'].Institutions = institutions;
    payload.MdmsRes['common-masters'].OwnerShipCategory = OwnerShipCategory;
    const localities = get(
      state.screenConfiguration,
      "preparedFinalObject.applyScreenMdmsData.tenant.localities",
      []
    );
    if (localities && localities.length > 0) {
      payload.MdmsRes.tenant.localities = localities;
    }

    let tenantsWS =
    payload &&
    payload.MdmsRes &&
    payload.MdmsRes.tenant.citymodule.find(item => {
      if (item.code === "WS") return true;
    });
    let tenantsSW =
    payload &&
    payload.MdmsRes &&
    payload.MdmsRes.tenant.citymodule.find(item => {
      if (item.code === "SW") return true;
    });

    let tenantsList = [...tenantsWS.tenants,...tenantsSW.tenants];
    tenantsList = uniqBy(tenantsList, "code");
    console.log("tenantsList==",tenantsList);
    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
    dispatch(prepareFinalObject("applyScreenMdmsData.common-masters.citiesByModule.wns", tenantsList));

    payload.MdmsRes.tenant.tenants = payload.MdmsRes.tenant.citymodule[1].tenants;
    dispatch(prepareFinalObject("applyScreenMdmsData.tenant", payload.MdmsRes.tenant));
  } catch (e) {
    console.log(e);
  }
};

const setPropertyDetails = async (action, state, dispatch) => {
  const propertyId = getQueryArg(window.location.href, "propertyId");
  const tenantId = getQueryArg(window.location.href, "tenantId");
  if(propertyId){
    const response = await httpRequest(
      "post",
      "/property-services/property/_search",
      "",
      [{
        key: "tenantId",
        value: tenantId
      },
      {
        key: "propertyIds",
        value: propertyId
      }]
    );
    dispatch(prepareFinalObject("Property", get(response, "Properties[0]")));
    loadWorkflowDataForUpdate(dispatch);
  }
  const ownerDetails = get(state.screenConfiguration,
  "preparedFinalObject.Property.ownershipCategory",
  []
);
if (ownerDetails.includes("SINGLEOWNER")) {
  set(
    action.screenConfig,
    "components.div.children.formwizardFirstStep.children.propertyOwnershipDetails.children.cardContent.children.applicantTypeContainer.children.singleApplicantContainer.props.style",
    { }
  );
  set(
    action.screenConfig,
    "components.div.children.formwizardFirstStep.children.propertyOwnershipDetails.children.cardContent.children.applicantTypeContainer.children.multipleApplicantContainer.props.style",
    { display: "none"}
  );
  set(
    action.screenConfig,
    "components.div.children.formwizardFirstStep.children.propertyOwnershipDetails.children.cardContent.children.applicantTypeContainer.children.institutionContainer.props.style",
    { display: "none"}
  );
}
else if(ownerDetails.includes("INSTITUTIONAL")){
  set(
    action.screenConfig,
    "components.div.children.formwizardFirstStep.children.propertyOwnershipDetails.children.cardContent.children.applicantTypeContainer.children.singleApplicantContainer.props.style",
    {display: "none" }
  );
  set(
    action.screenConfig,
    "components.div.children.formwizardFirstStep.children.propertyOwnershipDetails.children.cardContent.children.applicantTypeContainer.children.multipleApplicantContainer.props.style",
    { display: "none"}
  );
  set(
    action.screenConfig,
    "components.div.children.formwizardFirstStep.children.propertyOwnershipDetails.children.cardContent.children.applicantTypeContainer.children.institutionContainer.props.style",
    { }
  );

}
else if(ownerDetails.includes("MULTIPLEOWNERS")){
  set(
    action.screenConfig,
    "components.div.children.formwizardFirstStep.children.propertyOwnershipDetails.children.cardContent.children.applicantTypeContainer.children.singleApplicantContainer.props.style",
    { display: "none"}
  );
  set(
    action.screenConfig,
    "components.div.children.formwizardFirstStep.children.propertyOwnershipDetails.children.cardContent.children.applicantTypeContainer.children.multipleApplicantContainer.props.style",
    { }
  );
  set(
    action.screenConfig,
    "components.div.children.formwizardFirstStep.children.propertyOwnershipDetails.children.cardContent.children.applicantTypeContainer.children.institutionContainer.props.style",
    { display: "none"}
  );
}
  

let usageType = get(
  state.screenConfiguration.preparedFinalObject,
  "Property.usageCategory"
);
let subUsageType = get(
  state.screenConfiguration.preparedFinalObject,
  "Property.units[0].usageCategory"
);

if (usageType) {
  rendersubUsageType(usageType, action.value, dispatch, state);
  renderNoOfFloorData(usageType, action.value, dispatch, state);
  renderNoOfFlatsData(usageType, action.value, dispatch, state);
  renderAreaData(usageType, action.value, dispatch, state);
  if(subUsageType)
  set(state.screenConfiguration.preparedFinalObject,"Property.subUsageCategory", subUsageType);
}
if(getQueryArg(window.location.href, "purpose") === "update") {
  set(
    action.screenConfig,
    "components.div.children.formwizardFirstStep.children.propertyOwnershipDetails.children.cardContent.children.applicantTypeContainer.children.applicantTypeSelection.children.applicantType.props.disabled",
    true
  );

  set(
    action.screenConfig,
    "components.div.children.formwizardFirstStep.children.propertyOwnershipDetails.children.cardContent.children.applicantTypeContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.hasAddItem",
    false
  );
}
}

const loadWorkflowDataForUpdate = async (dispatch) => {
  
    const mdmsBody = {
      MdmsCriteria: {
        tenantId: commonConfig.tenantId,
        moduleDetails: [
          {
            moduleName: "PropertyTax",
            masterDetails: [
              { name: "PTWorkflow" }
            ]
          }
        ],
  
      }
    }
    try {
      let payload = null;
      payload = await httpRequest("post", "/egov-mdms-service/v1/_search", "_search", [], mdmsBody);
  
     // dispatch(prepareFinalObject("searchScreenMdmsData", payload.MdmsRes));
      let ptWorkflowDetails = get(payload, "MdmsRes.PropertyTax.PTWorkflow", []);

    ptWorkflowDetails.forEach(data => {
      if(data.enable) {
        let workFlow = {
          tenantId : getQueryArg(window.location.href, "tenantId"),
          businessService : data.businessService,
          businessId : getQueryArg(window.location.href, "propertyId"),
          action : "OPEN",
          moduleName : "PT",
          state : null,
          comment : null,
          documents : null,
          assignes : null
        };
        dispatch(prepareFinalObject("isWorkflowDetails", workFlow, null));
      }
    })
  } catch (e) {
    console.log(e);
  }
};
const getFirstListFromDotSeparated = list => {
  list = list.map(item => {
    if (item.active) {
      return item.code.split(".")[0];
    }
  });
  list = [...new Set(list)].map(item => {
    return { code: item };
  });
  return list;
};
export const getData = async (action, state, dispatch) => {
  await getMdmsData(action, state, dispatch);
}

const screenConfig = {
  uiFramework: "material-ui",
  name: "register-property",
  beforeInitScreen: (action, state, dispatch) => {
    getMDMSPropertyData(dispatch);
    dispatch(
      prepareFinalObject(
        "Property",
        {}
      )
    );

    //Set Module Name
    set(state, "screenConfiguration.moduleName", "egov-pt");

    getData(action, state, dispatch).then(responseAction => {
      let tenantId = process.env.REACT_APP_NAME === "Employee" ? getTenantId() : JSON.parse(getUserInfo()).permanentCity;

      const queryObj = [{ key: "tenantId", value: tenantId }];
      getBoundaryData(action, state, dispatch, queryObj);
      if (tenantId) {
        dispatch(prepareFinalObject("searchScreen", { tenantId: tenantId }));
        const ulbComponentJsonPath = "components.div.children.formwizardFirstStep.children.propertyLocationDetails.children.cardContent.children.propertyLocationDetailsContainer.children.city";
        const disableUlb = process.env.REACT_APP_NAME === "Citizen" ? false : true;
        dispatch(
          handleField(
            "register-property",
            ulbComponentJsonPath,
            "props.value",
            tenantId
          )
        );
        dispatch(
          handleField(
            "register-property",
            ulbComponentJsonPath,
            "props.disabled",
            disableUlb
          )
        );
        dispatch(prepareFinalObject("Property.address.city", tenantId));
 
      }
      const mohallaLocalePrefix = {
        moduleName: tenantId,
        masterName: "REVENUE"
      };
      set(
        action.screenConfig,
        "components.div.children.formwizardFirstStep.children.propertyLocationDetails.children.cardContent.children.propertyLocationDetailsContainer.children.localityOrMohalla.props.localePrefix",
        mohallaLocalePrefix
      );
    });

    // Set MDMS Data
    getMdmsData(action, state, dispatch).then(() => {
      let ownershipCategory = get(
        state,
        "screenConfiguration.preparedFinalObject.applyScreenMdmsData.common-masters.OwnerShipCategory",
        []
      );
      //  ownershipCategory = getFirstListFromDotSeparated(ownershipCategory);
      dispatch(
        prepareFinalObject(
          "OwnershipCategory",
          ownershipCategory
        )
      );
      setPropertyDetails(action, state, dispatch);
    });
    
   
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 10
              },
              ...header
            }
          }
        },
        formwizardFirstStep,
        footer
      }
    },
    adhocDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-pt",
      componentPath: "SuccessPTPopupContainer",
      props: {
        open: false,
        maxWidth: "md",
        screenKey: "register-property"
      }
    }
  }
};

export default screenConfig;
