import {
    getCommonCard,
    getCommonContainer,
    getCommonParagraph,
    getCommonTitle,
    getDateField,
    getLabel,
    getPattern,
    getSelectField,
    getTextField
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { searchApiCall } from "./functions";
  
  const resetFields = (state, dispatch) => {
    dispatch(
      handleField(
        "ocsearch",
        "components.div.children.BPAApplication.children.cardContent.children.appBPAHomeSearchResultsContainer.children.fromDate",
        "props.value",
        ""
      )
    );
    dispatch(
      handleField(
        "ocsearch",
        "components.div.children.BPAApplication.children.cardContent.children.appBPAHomeSearchResultsContainer.children.toDate",
        "props.value",
        ""
      )
    );
    dispatch(
      handleField(
        "ocsearch",
        "components.div.children.BPAApplication.children.cardContent.children.appBPAHomeSearchResultsContainer.children.bpaNo",
        "props.value",
        ""
      )
    );
    dispatch(
      handleField(
        "ocsearch",
        "components.div.children.BPAApplication.children.cardContent.children.appBPAHomeSearchResultsContainer.children.ownerMobNo",
        "props.value",
        ""
      )
    );
    dispatch(
      handleField(
        "ocsearch",
        "components.div.children.BPAApplication.children.cardContent.children.appBPAHomeSearchResultsContainer.children.applicationType",
        "props.value",
        ""
      )
    );
    dispatch(
      handleField(
        "ocsearch",
        "components.div.children.BPAApplication.children.cardContent.children.appBPAHomeSearchResultsContainer.children.serviceType",
        "props.value",
        ""
      )
    );
  };
  
  export const OCApplication = getCommonCard({
    subHeader: getCommonTitle({
      labelName: "Search BPA Application",
      labelKey: "BPA_SEARCH_RESULTS_HEADING"
    }),
    subParagraph: getCommonParagraph({
      labelName: "Provide at least one parameter to search for an application",
      labelKey: "NOC_HOME_SEARCH_RESULTS_DESC"
    }),
    appBPAHomeSearchResultsContainer: getCommonContainer({
      bpaNo: getTextField({
        label: {
          labelName: "Application number",
          labelKey: "NOC_HOME_SEARCH_RESULTS_APP_NO_LABEL"
        },
        placeholder: {
          labelName: "Enter Application number",
          labelKey: "NOC_HOME_SEARCH_RESULTS_APP_NO_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 4
        },
        required: false,
        pattern: /^[a-zA-Z0-9-]*$/i,
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "searchScreen.applicationNos"
      }),
      ownerMobNo: getTextField({
        label: {
          labelName: "Mobile Number",
          labelKey: "NOC_HOME_SEARCH_RESULTS_OWN_MOB_LABEL"
        },
        placeholder: {
          labelName: "Enter your mobile No.",
          labelKey: "NOC_HOME_SEARCH_RESULTS_OWN_MOB_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 4
        },
        iconObj: {
          label: "+91 |",
          position: "start"
        },
        required: false,
        pattern: getPattern("MobileNo"),
        jsonPath: "searchScreen.mobileNumber",
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG"
      }),
      fromDate: getDateField({
        label: { labelName: "From Date", labelKey: "NOC_FROM_DATE_LABEL" },
        placeholder: {
          labelName: "From Date",
          labelKey: "NOC_FROM_DATE_PLACEHOLDER"
        },
        jsonPath: "searchScreen.fromDate",
        gridDefination: {
          xs: 12,
          sm: 4
        },
        pattern: getPattern("Date"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        required: false
      }),
      toDate: getDateField({
        label: { labelName: "To Date", labelKey: "NOC_TO_DATE_LABEL" },
        placeholder: {
          labelName: "To Date",
          labelKey: "NOC_TO_DATE_PLACEHOLDER"
        },
        jsonPath: "searchScreen.toDate",
        gridDefination: {
          xs: 12,
          sm: 4
        },
        pattern: getPattern("Date"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        required: false
      }),
      applicationType: getSelectField({
        label: {
          labelName: "Application Type",
          labelKey: "BPA_BASIC_DETAILS_APPLICATION_TYPE_LABEL"
        },
        placeholder: {
          labelName: "Select Application Type",
          labelKey: "BPA_BASIC_DETAILS_APPLICATION_TYPE_PLACEHOLDER"
        },
        localePrefix: {
          moduleName: "WF",
          masterName: "BPA"
        },
        props: {
           className : "tl-trade-type"
        },
        jsonPath: "searchScreen.applicationType",
        sourceJsonPath: "applyScreenMdmsData.BPA.ApplicationType",
        required: true,
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        }
      }),
      servicetype: getSelectField({
        label: {
          labelName: "Service type",
          labelKey: "BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL"
        },
        placeholder: {
          labelName: "Select service type",
          labelKey: "BPA_BASIC_DETAILS_SERVICE_TYPE_PLACEHOLDER"
        },
        localePrefix: {
          moduleName: "WF",
          masterName: "BPA"
        },
        props:{
          className:"textfield-enterable-selection"
        },
        required: true,
        jsonPath: "searchScreen.serviceType",
        sourceJsonPath: "applyScreenMdmsData.BPA.ServiceType",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        }
      }),
    }),
    button: getCommonContainer({
      buttonContainer: getCommonContainer({
        resetButton: {
          componentPath: "Button",
          gridDefination: {
            xs: 12,
            sm: 6
          },
          props: {
            variant: "outlined",
            style: {
              color: "#FE7A51",
              borderColor: "#FE7A51",
              width: "220px",
              height: "48px",
              margin: "8px",
              float: "right"
            }
          },
          children: {
            buttonLabel: getLabel({
              labelName: "Reset",
              labelKey: "NOC_HOME_SEARCH_RESET_BUTTON"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: resetFields
          }
        },
        searchButton: {
          componentPath: "Button",
          gridDefination: {
            xs: 12,
            sm: 6
          },
          props: {
            variant: "contained",
            style: {
              color: "white",
              margin: "8px",
              backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
              borderRadius: "2px",
              width: "220px",
              height: "48px"
            }
          },
          children: {
            buttonLabel: getLabel({
              labelName: "Search",
              labelKey: "NOC_HOME_SEARCH_RESULTS_BUTTON_SEARCH"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: searchApiCall
          }
        }
      })
    })
  });