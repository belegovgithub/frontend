import {
  getLabel
  } from "egov-ui-framework/ui-config/screens/specs/utils";

  import {
    prepareFinalObject
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";   //returns action object
  import { validateFields } from "../utils";
  import { toggleSpinner , toggleSnackbar} from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { httpRequest } from "egov-ui-framework/ui-utils/api";
  import get from "lodash/get";
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  import jp from "jsonpath";
  import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
  import { convertDateToEpoch } from "egov-ui-framework/ui-config/screens/specs/utils";
  import {showHideConfirmationPopup} from "./newRegistration";
  import _ from 'lodash';
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

const checkIfFormIsValid = async (state, dispatch) => {

  let isFormValid = true;

  const newRegistration = validateFields(
    "components.div2.children.details.children.cardContent.children.registrationInfo.children.cardContent.children.registrationInfoCont.children",
    state,
    dispatch,
    "newRegistration"
  );  

  const placeOfdeath = validateFields(
    "components.div2.children.details.children.cardContent.children.placeInfo.children.cardContent.children.placeOfdeath.children",
    state,
    dispatch,
    "newRegistration"
  );  

  const childsInfo = validateFields(
    "components.div2.children.details.children.cardContent.children.deceasedInfo.children.cardContent.children.infoOfDeceased.children",
    state,
    dispatch,
    "newRegistration"
  ); 

  const fathersInfo = validateFields(
    "components.div2.children.details.children.cardContent.children.fathersInfo.children.cardContent.children.fathersInfo.children",
    state,
    dispatch,
    "newRegistration"
  ); 

  const mothersInfo = validateFields(
    "components.div2.children.details.children.cardContent.children.mothersInfo.children.cardContent.children.mothersInfo.children",
    state,
    dispatch,
    "newRegistration"
  ); 

  const permAddr = validateFields(
    "components.div2.children.details.children.cardContent.children.permAddressofParents.children.cardContent.children.permAddressofParents.children",
    state,
    dispatch,
    "newRegistration"
  ); 

  const addrTimeOfdeath = validateFields(
    "components.div2.children.details.children.cardContent.children.informantsInfo.children.cardContent.children.informantInfo.children",
    state,
    dispatch,
    "newRegistration"
  ); 

  console.log(newRegistration,permAddr,placeOfdeath,childsInfo,fathersInfo,mothersInfo,addrTimeOfdeath);

  if(!(newRegistration && permAddr && placeOfdeath &&
      childsInfo && fathersInfo && mothersInfo && addrTimeOfdeath))
  {
    isFormValid = false;
    dispatch(toggleSnackbar(
      true,
      {
        labelName: "Please fill the required fields.",
        labelKey: "ERR_SELECT_MANDATORY_FIELDS"
      },
      "info"
    ));
    return;
  }

  if(!get(state.screenConfiguration.preparedFinalObject,"bnd.death.newRegistration.firstname") &&
    !get(state.screenConfiguration.preparedFinalObject,"bnd.death.newRegistration.middlename") &&
    !get(state.screenConfiguration.preparedFinalObject,"bnd.death.newRegistration.lastname") &&
    !get(state.screenConfiguration.preparedFinalObject,"bnd.death.newRegistration.deathFatherInfo.firstname") &&
    !get(state.screenConfiguration.preparedFinalObject,"bnd.death.newRegistration.deathFatherInfo.middlename") &&
    !get(state.screenConfiguration.preparedFinalObject,"bnd.death.newRegistration.deathFatherInfo.lastname") &&
    !get(state.screenConfiguration.preparedFinalObject,"bnd.death.newRegistration.deathMotherInfo.firstname") &&
    !get(state.screenConfiguration.preparedFinalObject,"bnd.death.newRegistration.deathMotherInfo.middlename") &&
    !get(state.screenConfiguration.preparedFinalObject,"bnd.death.newRegistration.deathMotherInfo.lastname") &&
    !get(state.screenConfiguration.preparedFinalObject,"bnd.death.newRegistration.deathSpouseInfo.firstname") &&
    !get(state.screenConfiguration.preparedFinalObject,"bnd.death.newRegistration.deathSpouseInfo.middlename") &&
    !get(state.screenConfiguration.preparedFinalObject,"bnd.death.newRegistration.deathSpouseInfo.lastname"))
  {
    isFormValid = false;
    dispatch(toggleSnackbar(
      true,
      {
        labelName: "Please enter deceased's name or father's name or mother's name or spouse's name",
        labelKey: "Please enter deceased's name or father's name or mother's name or spouse's name"
      },
      "info"
    ));
    return;
  }

  if (isFormValid) {
    showHideConfirmationPopup(state,dispatch);
  } 
};

const callBackSubmit = async (state, dispatch) => {
  checkIfFormIsValid(state, dispatch);
};

export const postData = async(state,dispatch) => {
  try {
    dispatch(toggleSpinner());

    const newRegData = _.clone(get(
      state.screenConfiguration.preparedFinalObject,
      "bnd.death.newRegistration",
      []
    ),true);
    newRegData["tenantid"] = getTenantId()
    newRegData["excelrowindex"] = -1
    newRegData["counter"] = newRegData["isLegacyRecord"] ? 1 : 0;

    if(newRegData["dateofreportepoch"]!=null)
      newRegData["dateofreportepoch"] = convertDateToEpoch(newRegData["dateofreportepoch"])/1000;
    if(newRegData["dateofdeathepoch"]!=null)
      newRegData["dateofdeathepoch"] = convertDateToEpoch(newRegData["dateofdeathepoch"])/1000;
    
    let payload = {
      deathCerts: [newRegData],
    };

    payload = await httpRequest(
      "post",
      "birth-death-services/common/saveDeathImport",
      "saveDeathImport",
      [],
      payload);
  
    if (payload) {
      if(payload.errorRowMap && Object.keys(payload.errorRowMap).length > 0)
      {
        let errorString = "";
        for(var key in payload.errorRowMap)
        {
          errorString+=key+" ";
        }
        dispatch(toggleSnackbar(
          true,
          {
            labelName: "API Error",
            labelKey: errorString
          },
          "info"
        ));
      }
      else
      {
        dispatch(toggleSnackbar(
          true,
          {
            labelName: "",
            labelKey: "BND_SUCCESS"
          },
          "success"
        ));
      }
    }
    else
    {
      // dispatch(
      //   setRoute(
      //     `/lams-citizen/acknowledgement?applicationNumber=${applicationNumber}&status=${status}&purpose=${purpose}`
      //   )
      // );
    }
  } 
  catch (error) {
    console.log(error)
    dispatch(toggleSnackbar(
      true,
      {
        labelName: "API Error",
        labelKey: "LAMS_API_ERROR"
      },
      "info"
    )
  );
  }
  dispatch(toggleSpinner());
}

const getCommonApplyFooter = children => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: "apply-wizard-footer"
    },
    children
  };
};

export const footer = getCommonApplyFooter({
  resetButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      className:"submit-btn leaseApplicationSubmitButton",
      style: {
        minWidth: "180px",
        height: "48px",
        marginRight: "16px",
        borderRadius: "inherit"
      }
    },
    children: {
      previousButtonLabel: getLabel({
        labelName: "Previous Step",
        labelKey: "BND_COMMON_NEW"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => {
        location.reload();
      }
    },
    visible: (getQueryArg(window.location.href, "action")!="VIEW"),

  },
  submitButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      className:"submit-btn leaseApplicationSubmitButton",
      style: {
        minWidth: "180px",
        height: "48px",
        marginRight: "16px",
        borderRadius: "inherit"
      }
    },
    children: {
      previousButtonLabel: getLabel({
        labelName: "Previous Step",
        labelKey: "CORE_COMMON_SUBMIT"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: callBackSubmit
    },
    visible: (getQueryArg(window.location.href, "action")!="VIEW"),
  }
});