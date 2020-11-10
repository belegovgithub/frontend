import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import set from "lodash/set";
import jp from "jsonpath";
import { httpRequest } from "../../../../ui-utils";
import commonConfig from "config/common.js";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { getLocaleLabels, getQueryArg, getTodaysDateInYMD, getTransformedLocalStorgaeLabels, getObjectKeys, getObjectValues, } from "egov-ui-framework/ui-utils/commons";

export const workflowCode = "LAMS_NewLR_V2";

export const businessService = "LAMS";

export const loadSurveyNumbers = async (action, state, dispatch) => {
  let requestBody = {};
  let payload = null;

  const applicationType = get(state.screenConfiguration.preparedFinalObject.lamsStore.Lease[0],"applicationType");
  const category = get(state.screenConfiguration.preparedFinalObject.lamsStore.Lease[0],"category");
  const located = get(state.screenConfiguration.preparedFinalObject.lamsStore.Lease[0],"located");

  console.log("Check values now ", applicationType, category, located);

  const queryParams = [{ key: "applicationType", value: applicationType },
    { key: "category", value: category },
    { key: "located", value: located }
    ];
  
  try
  {
    payload = await httpRequest(
      "post",
      "/lams-services/v1/getLeaseDetails",
      "getLeaseDetails",
      queryParams,
      requestBody
    );
  }
  catch(e)
  {
    //toBeRemoved
    payload = {"leases":[{"leaseAsPerGLR": "Mst.Ram Dulari d/o Sital Persad 1","id":"d466202f-6426-43da-ac4a-06723665e123","surveyNo":"1234512","termNo":"1234514","area":"12344","termExpiryDate":659989800000,"annualRent":15234},{"leaseAsPerGLR": "Mst.Ram Dulari d/o Sital Persad 2","id":"d466202f-6426-43da-ac4a-06723665e123","surveyNo":"123451224","termNo":"12345214","area":"23414","termExpiryDate":659989800000,"annualRent":1234},{"leaseAsPerGLR": "Mst.Ram Dulari d/o Sital Persad 3 Test","id":"d466202f-6426-43da-ac4a-06723665e123","surveyNo":"123451342","termNo":"123451124","area":"23434","termExpiryDate":659989800000,"annualRent":12524}]};
  }
  console.log("Survey numbers recieved...",payload);
  if(payload.leases)
  {
    for (let lease of payload.leases) {
      lease.code = lease.surveyNo;
      lease.name = lease.surveyNo;
    }
    dispatch(prepareFinalObject("lamsStore.allSurveyDetails", payload.leases));
  }
}

export const getSurveyDetails = (action, state, dispatch) => {
  
  const allSurveyDetails = get(state.screenConfiguration.preparedFinalObject.lamsStore,"allSurveyDetails");
  const selectedSurveyNo = get(state.screenConfiguration.preparedFinalObject.lamsStore.Lease[0],"surveyNo"); 
  const selectedSurveyDetails = jp.query(allSurveyDetails, "$[?(@.surveyNo == "+selectedSurveyNo+")]" );
  if(selectedSurveyDetails && selectedSurveyDetails.length>0 )
    dispatch(prepareFinalObject("lamsStore.selectedSurveyDetails", selectedSurveyDetails[0]));
}

export const getMdmsData = async (action, state, dispatch) => {
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: process.env.REACT_APP_NAME === "Citizen"? getQueryArg(window.location.href, "tenantId") : state.auth.userInfo.tenantId,
        moduleDetails: [
          {
            moduleName: "TradeLicense",
            masterDetails: [
              { name: "AccessoriesCategory" },
              { name: "ApplicationType" },
              { name: "documentObj" }
            ]
          },
          {
            moduleName: "common-masters",
            masterDetails: [
              { name: "OwnerType" },
              { name: "DocumentType" },
              { name: "UOM" },
              { name: "Help" }
            ]
          },
          {
            moduleName: "tenant",
            masterDetails: [
              {
                name: "tenants"
              }
            ]
          },
          {
            moduleName: "egf-master",
            masterDetails: [{ name: "FinancialYear" }]
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
      console.log("Payload now is ",payload);
      const localities = get(
        state.screenConfiguration,
        "preparedFinalObject.applyScreenMdmsData.tenant.localities",
        []
      );
      if (localities && localities.length > 0) {
        payload.MdmsRes.tenant.localities = localities;
      }
      dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
      let financialYearData = get(
        payload,
        "MdmsRes.egf-master.FinancialYear",
        []
      ).filter(item => item.module === "TL" && item.active === true);
      set(payload, "MdmsRes.egf-master.FinancialYear", financialYearData);
      const presentTenantId = getQueryArg(window.location.href, "tenantId")?getQueryArg(window.location.href, "tenantId"):getTenantId();
      console.info("=getting my help url for tenant id TL=",presentTenantId);
      //console.info("src urls==",get(payload,"MdmsRes.common-masters.Help",[]));
        let helpUrl = get(
          payload,
          "MdmsRes.common-masters.Help",
          []
          ).filter(item =>item.code ==="TL" && item.tenant === presentTenantId);
      console.info("help url is set for TL==",helpUrl[0].URL);
      dispatch(prepareFinalObject("helpFileUrl", helpUrl[0].URL));  
    } catch (e) {
      console.log(e);
    }
  };

export const loadMdmsData = async (action, state, dispatch) => {

  let requestBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        {
          moduleName: "tenant",
          masterDetails: [
            {
              name: "tenants"
            },
            { name: "citymodule" }
          ]
        },
        {
          moduleName: "common-masters",
          masterDetails: [            
            { name: "Help" }
          ]
        }
      ]
    }
  };

  try{
    let payload = null;
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      requestBody
    );
    console.log("Mdms Data Recieved is ",payload);
    if (payload) {
      const tenants = get(payload, "MdmsRes.tenant.tenants");
      dispatch(prepareFinalObject("lamsStore.allTenants", tenants));

      dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
      const citymodule = get(payload, "MdmsRes.tenant.citymodule");
      const liveTenants = citymodule && citymodule.filter(item => item.code === "UC");
      dispatch(
        prepareFinalObject("applyScreenMdmsData.tenant.citiesByModule", get(liveTenants[0], "tenants"))
      );
    }
  }
  catch (e) {
    console.log(e);
  }
}

export const updateMdmsDropDowns = async ( state, dispatch ) => {
  const structType = get(
    state,
    "screenConfiguration.preparedFinalObject.Licenses[0].tradeLicenseDetail.structureType"
  );
  if (structType) {
    set(
      state,
      "screenConfiguration.preparedFinalObject.LicensesTemp[0].tradeLicenseDetail.structureType",
      structType.split(".")[0]
    );
    try {
      dispatch(prepareFinalObject( `DynamicMdms.common-masters.structureTypes.selectedValues[0].structureType`, structType.split(".")[0] ));
      
      dispatch(prepareFinalObject( `DynamicMdms.common-masters.structureTypes.structureSubTypeTransformed.allDropdown[0]`, getObjectValues(get( state, `screenConfiguration.preparedFinalObject.DynamicMdms.common-masters.structureTypes.structureTypesTransformed.${structType.split(".")[0]}`, [])) ));

      dispatch(prepareFinalObject( `DynamicMdms.common-masters.structureTypes.selectedValues[0].structureSubType`, structType ));
        dispatch(
          prepareFinalObject(
            "LicensesTemp[0].tradeLicenseDetail.structureType",
            structType
          )
        );
    } catch (e) {
      console.log(e);
    }    
  }
}

export const getEpochForDate = date => {
  const dateSplit = date.split("/");
  return new Date(dateSplit[2], dateSplit[1] - 1, dateSplit[0]).getTime();
};


export const sortByEpoch = (data, order) => {
  if (order) {
    return data.sort((a, b) => {
      return a[a.length - 1] - b[b.length - 1];
    });
  } else {
    return data.sort((a, b) => {
      return b[b.length - 1] - a[a.length - 1];
    });
  }
};

export const getTextToLocalMapping = label => {
  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {
    case "Application No":
      return getLocaleLabels(
        "Application No",
        "TL_COMMON_TABLE_COL_APP_NO",
        localisationLabels
      );

    case "License No":
      return getLocaleLabels(
        "License No",
        "TL_COMMON_TABLE_COL_LIC_NO",
        localisationLabels
      );

    case "Trade Name":
      return getLocaleLabels(
        "Trade Name",
        "TL_COMMON_TABLE_COL_TRD_NAME",
        localisationLabels
      );
    case "Owner Name":
      return getLocaleLabels(
        "Owner Name",
        "TL_COMMON_TABLE_COL_OWN_NAME",
        localisationLabels
      );

    case "Application Date":
      return getLocaleLabels(
        "Application Date",
        "TL_COMMON_TABLE_COL_APP_DATE",
        localisationLabels
      );

    case "Status":
      return getLocaleLabels(
        "Status",
        "TL_COMMON_TABLE_COL_STATUS",
        localisationLabels
      );
    case "INITIATED":
      return getLocaleLabels("Initiated,", "TL_INITIATED", localisationLabels);
    case "APPLIED":
      return getLocaleLabels("Applied", "TL_APPLIED", localisationLabels);
    case "PAID":
      return getLocaleLabels(
        "Paid",
        "WF_NEWTL_PENDINGAPPROVAL",
        localisationLabels
      );
    case "APPROVED":
      return getLocaleLabels("Approved", "TL_APPROVED", localisationLabels);
    case "REJECTED":
      return getLocaleLabels("Rejected", "TL_REJECTED", localisationLabels);
    case "CANCELLED":
      return getLocaleLabels("Cancelled", "TL_CANCELLED", localisationLabels);
    case "PENDINGAPPROVAL":
      return getLocaleLabels(
        "Pending for Approval",
        "WF_NEWTL_PENDINGAPPROVAL",
        localisationLabels
      );
    case "PENDINGPAYMENT":
      return getLocaleLabels(
        "Pending payment",
        "WF_NEWTL_PENDINGPAYMENT",
        localisationLabels
      );

    case "FIELDINSPECTION":
      return getLocaleLabels(
        "Pending for Field Inspection",
        "WF_NEWTL_FIELDINSPECTION",
        localisationLabels
      );

    case "Search Results for Trade License Applications":
      return getLocaleLabels(
        "",
        "TL_HOME_SEARCH_RESULTS_TABLE_HEADING",
        localisationLabels
      );

    case "MY_APPLICATIONS":
      return getLocaleLabels(
        "My Applications",
        "TL_MY_APPLICATIONS",
        localisationLabels
      );
    case "Financial Year":
      return getLocaleLabels(
        "Financial Year",
        "TL_COMMON_TABLE_COL_FIN_YEAR",
        localisationLabels
      );
    case "Application Type":
      return getLocaleLabels(
        "Application Type",
        "TL_COMMON_TABLE_COL_APP_TYPE",
        localisationLabels
      );
    case "RENEWAL":
      return getLocaleLabels(
        "Renewal",
        "TL_TYPE_RENEWAL",
        localisationLabels
      );
    case "NEW":
      return getLocaleLabels(
        "New",
        "TL_TYPE_NEW",
        localisationLabels
      );
    default:
      case "NEW":
      return getLocaleLabels(
        "New",
        "TL_TYPE_NEW",
        localisationLabels
      );
  }
};