import {
  getCommonHeader,
  getCommonContainer,
  getLabel,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { getTenantId,getLocale } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { newCollectionFooter } from "./newCollectionResource/newCollectionFooter";
import { newCollectionConsumerDetailsCard } from "./newCollectionResource/neCollectionConsumerDetails";
import { newCollectionServiceDetailsCard } from "./newCollectionResource/newCollectionServiceDetails";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject , toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import "./index.css";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
const getData = async (action, state, dispatch) => {
  
  const tenantId = getTenantId();
  console.info("getData",tenantId);
  let requestBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "tenant",
          masterDetails: [
            {
              name: "tenants",
            },
            { name: "citymodule" },
          ],
        },
        {
          moduleName: "common-masters",
          masterDetails: [{ name: "Help" }],
        } 
      ],
    },
  };

  try {
    let payload = null;
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      requestBody
    );

    if (payload) {
      dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
      const citymodule = get(payload, "MdmsRes.tenant.citymodule");
      const liveTenants =
        citymodule && citymodule.filter((item) => item.code === "UC");
      dispatch(
        prepareFinalObject(
          "applyScreenMdmsData.tenant.citiesByModule",
          get(liveTenants[0], "tenants")
        )
      );
    }

    let helpUrl = get(payload, "MdmsRes.common-masters.Help", []).filter(
      (item) => item.code === "UC"
    );
    dispatch(prepareFinalObject("helpFileUrl", helpUrl[0].URL));

    try {
      let payload = await httpRequest(
        "post",
        "/egov-location/location/v11/boundarys/_search?hierarchyTypeCode=REVENUE&boundaryType=Locality",
        "_search",
        [{ key: "tenantId", value: `${tenantId}` }],
        {}
      );
      const mohallaData =
        payload &&
        payload.TenantBoundary[0] &&
        payload.TenantBoundary[0].boundary &&
        payload.TenantBoundary[0].boundary.reduce((result, item) => {
          result.push({
            ...item,
            name: `${tenantId
              .toUpperCase()
              .replace(/[.]/g, "_")}_REVENUE_${item.code
              .toUpperCase()
              .replace(/[._:-\s\/]/g, "_")}`,
          });
          return result;
        }, []);
      dispatch(
        prepareFinalObject("applyScreenMdmsData.tenant.localities", mohallaData)
      );

      dispatch(
        handleField(
          "newCollection",
          "components.div.children.newCollectionConsumerDetailsCard.children.cardContent.children.ucConsumerContainer.children.ConsumerLocMohalla",
          "props.suggestions",
          mohallaData
          // payload.TenantBoundary && payload.TenantBoundary[0].boundary
        )
      );
      const mohallaLocalePrefix = {
        moduleName: `${tenantId}`,
        masterName: "REVENUE",
      };

      dispatch(
        handleField(
          "newCollection",
          "components.div.children.newCollectionConsumerDetailsCard.children.cardContent.children.ucConsumerContainer.children.ConsumerLocMohalla",
          "props.localePrefix",
          mohallaLocalePrefix
        )
      );
      let challanNo = getQueryArg(window.location.href, "consumerCode");
      if (challanNo == null) {
        dispatch(
          handleField(
            "newCollection",
            "components.div.children.newCollectionServiceDetailsCard.children.cardContent.children.searchContainer.children.City",
            "props.value",
            getTenantId()
          )
        );
        dispatch(
          handleField(
            "newCollection",
            "components.div.children.newCollectionFooter.children.nextButton",
            "visible",
            true
          )
        );

      }
    } catch (e) {
      console.log(e);
      dispatch(toggleSnackbar(true, { labelName: e.message }, "error"));
    }
    //End of Mohalla data
  } catch (e) {
    console.error("Unable to fetch detail", e);
    dispatch(toggleSnackbar(true, { labelName: e.message }, "error"));
  }
};
//for up data challan
const getChallanSearchRes = async (action, state, dispatch) => {
  try {
    let challanNo = getQueryArg(window.location.href, "consumerCode");
    let tenantId = getQueryArg(window.location.href, "tenantId");
    let businessService = getQueryArg(window.location.href, "businessService");
    const searchpayload = await httpRequest(
      "post",
      `/echallan-services/eChallan/v1/_search?challanNo=${challanNo}&tenantId=${tenantId}&businessService=${businessService}`,
      "_search",
      [],
      {}
    );
    if (
      searchpayload &&
      searchpayload.challans.length >0 &&
      searchpayload.challans[0].applicationStatus === "ACTIVE"
    ) {
      const fetchbillPayload = await httpRequest(
        "post",
        `/billing-service/bill/v2/_fetchbill?consumerCode=${challanNo}&businessService=${businessService}&tenantId=${tenantId}`,
        "",
        [],
        {}
      );
      //Set the bill detail
      fetchbillPayload &&
        dispatch(
          prepareFinalObject(
            "ChallanTaxHeads",
            get(
              fetchbillPayload,
              "Bill[0].billDetails[0].billAccountDetails",
              []
            )
          )
        );
      let bService = searchpayload.challans[0].businessService;
      searchpayload.challans[0].consumerType = bService.split(".")[0];
      searchpayload.challans[0].amount = [];

      dispatch(prepareFinalObject("Challan", searchpayload.challans));
      //Update the field status
      dispatch(
        handleField(
          "newCollection",
          "components.div.children.header.children.header.children.key",
          "props.labelKey",
          "UC_EDIT_CHALLAN_HEADER"
        )
      );
      dispatch(
        handleField(
          "newCollection",
          "components.div.children.newCollectionServiceDetailsCard.children.cardContent.children.searchContainer.children.City",
          "props.value",
          tenantId
        )
      );
      dispatch(
        handleField(
          "newCollection",
          "components.div.children.newCollectionServiceDetailsCard.children.cardContent.children.searchContainer.children.serviceCategory",
          "props.disabled",
          true
        )
      );
      dispatch(
        handleField(
          "newCollection",
          "components.div.children.newCollectionServiceDetailsCard.children.cardContent.children.searchContainer.children.serviceType",
          "props.disabled",
          true
        )
      );
      dispatch(
        handleField(
          "newCollection",
          "components.div.children.newCollectionServiceDetailsCard.children.cardContent.children.searchContainer.children.toDate",
          "props.disabled",
          false
        )
      );

      let consumerDetailsDisableFldList =["ConsumerName","ConsumerMobileNo","ConsumerHouseNo","ConsumerBuilidingName","ConsumerStreetName","ConsumerLocMohalla","ConsumerPinCode"];
      consumerDetailsDisableFldList.forEach(item =>{
        console.log("consumerDetailsDisableFldList_Item ",item);
        dispatch(
          handleField(
            "newCollection",
            `components.div.children.newCollectionConsumerDetailsCard.children.cardContent.children.ucConsumerContainer.children.${item}`,
            "props.disabled",
            true
          )
        );
      });
      dispatch(
        handleField(
          "newCollection",
          "components.div.children.newCollectionFooter.children.updateChallan",
          "visible",
          true
        )
      );
      dispatch(
        handleField(
          "newCollection",
          "components.div.children.newCollectionFooter.children.cancelChallan",
          "visible",
          true
        )
      );

    } else {
      dispatch(toggleSnackbar(true,{ labelName:"Unable to find Challan Detail. Please search with valid Challan Detail"}, "error"));
    }
  } catch (e) {
    console.error("Unable to fetch detail", e);
    dispatch(toggleSnackbar(true, { labelName: e.message }, "error"));
  }
};

const newCollection = {
  uiFramework: "material-ui",
  name: "newCollection",
  beforeInitScreen: (action, state, dispatch) => {
    console.log("Before init function");
    const tenantId = getTenantId();
    const locale = getLocale() || "en_IN";
    dispatch(fetchLocalizationLabel(locale, tenantId, tenantId));
    //Flush previous data 
    dispatch(prepareFinalObject("ChallanTaxHeads",[]))
    dispatch(prepareFinalObject("Challan", []));
    getData(action, state, dispatch);
    if (getQueryArg(window.location.href, "consumerCode") != null) {
      getChallanSearchRes(action, state, dispatch);
    }

    return action;
  },

  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "newCollection",
      },
      children: {
        header: getCommonContainer({
          header: getCommonHeader({
            labelName: "New Challan",
            labelKey: "UC_COMMON_HEADER",
          }),
        }),
        buttonDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          props: {
            className: "searchreceipt-commonButton",
            style: { textAlign: "right", display: "flex" },
          },
          children: {
            searchAndPayBtn: {
              componentPath: "Button",
              props: {
                variant: "outlined",
                color: "primary",
                style: {
                  color: "primary",
                  borderRadius: "2px",
                  width: "250px",
                  height: "48px",
                  marginRight: "16px",
                },
                className: "uc-searchAndPayBtn-button",
              },
              children: {
                buttonLabel: getLabel({
                  labelName: "Search And Pay",
                  labelKey: "UC_SEARCHANDPAY_LABEL",
                }),
              },
              onClickDefination: {
                action: "condition",
                callBack: (state, dispatch) => {
                  openPayBillForm(state, dispatch);
                },
              },
            },
            searchReceiptBtn: {
              componentPath: "Button",
              //visible: enableButton,
              props: {
                variant: "outlined",
                color: "primary",
                style: {
                  color: "primary",
                  borderRadius: "2px",
                  width: "250px",
                  height: "48px",
                  marginRight: "16px",
                },
                className: "uc-search-button",
              },
              children: {
                buttonLabel: getLabel({
                  labelName: "Receipt Search",
                  labelKey: "UC_SEARCHRECEIPT_LABEL",
                }),
              },

              onClickDefination: {
                action: "condition",
                callBack: (state, dispatch) => {
                  openReceiptSearchForm(state, dispatch);
                },
              },
            },
            EditBtn: {
              componentPath: "Button",
              //visible: enableButton,
              props: {
                variant: "outlined",
                color: "primary",
                style: {
                  color: "primary",
                  borderRadius: "2px",
                  width: "250px",
                  height: "48px",
                  marginRight: "16px",
                },
                className: "uc-edit-button",
              },
              children: {
                buttonLabel: getLabel({
                  labelName: "Edit",
                  labelKey: "UC_EDIT_LABEL",
                }),
              },

              onClickDefination: {
                action: "condition",
                callBack: (state, dispatch) => {
                  openUpdateForm(state, dispatch);
                },
              },
            },
          },
        },

        newCollectionConsumerDetailsCard,
        newCollectionServiceDetailsCard,
        newCollectionFooter,
      },
    },
  },
};

export default newCollection;

//for update rediredt

const openUpdateForm = (state, dispatch) => {
  window.location.href = `/uc/newCollection?consumerCode=CH-CB-SECU-2020-001395&tenantId=${getTenantId()}&businessService=OTHFEE.DUMP_GRBG`;
};
const openReceiptSearchForm = (state, dispatch) => {
  // dispatch(prepareFinalObject("Demands", []));
  dispatch(prepareFinalObject("Challan", []));
  dispatch(prepareFinalObject("ReceiptTemp[0].Bill", []));
  const path =
    process.env.REACT_APP_SELF_RUNNING === "true"
      ? `/egov-ui-framework/uc/search`
      : `/uc/search`;
  dispatch(setRoute(path));
};

const openPayBillForm = (state, dispatch) => {
  const path = `/abg/billSearch`;
  dispatch(setRoute(path));
};
