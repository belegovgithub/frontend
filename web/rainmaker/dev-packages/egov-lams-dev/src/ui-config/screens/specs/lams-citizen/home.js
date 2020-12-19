import React from "react";
import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { fetchData } from "./citizenSearchResource/citizenFunctions";
import { cityPicker } from "./citypicker";
import FormIcon from "../../../../ui-atoms-local/Icons/FormIcon";
import TradeLicenseIcon from "../../../../ui-atoms-local/Icons/TradeLicenseIcon";
import HelpIcon from "../../../../ui-atoms-local/Icons/HelpIcon";
import "../utils/index.css";
import { getRequiredDocData } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
const header = getCommonHeader(
  {
    labelName: "Lams",
    labelKey: "LAMS_COMMON_LR"
  },
  {
    classes: {
      root: "common-header-cont"
    }
  }
);

const cardItems = [
  {
    label: {
      labelKey: "LAMS_APPLY_LR",
      labelName: "Apply for Lease Renewal"
    },
    icon: <TradeLicenseIcon />,
    route: "../lams-common/newApplication"
  },
  {
    label: {
      labelKey: "LAMS_MY_APPLICATIONS",
      labelName: "My Applications"
    },
    icon: <FormIcon />,
    route: "myApplications"
  },
  {
    label: {
      labelKey: "LAMS_HOW_IT_WORKS",
      labelName: "How It Works"
    },
    icon: <HelpIcon />,
    route: "how-it-works-lams"
  }


];

const tradeLicenseSearchAndResult = {
  uiFramework: "material-ui",
  name: "home",
  beforeInitScreen: (action, state, dispatch) => {
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      // props: {
      //   className: "common-div-css"
      // },
      children: {
        header: header,
        applyCard: {
          uiFramework: "custom-molecules",
          componentPath: "LandingPage",
          props: {
            items: cardItems,
            history: {}
          }
        }
        // listCard: {
        //   uiFramework: "custom-molecules-local",
        //   moduleName: "egov-tradelicence",
        //   componentPath: "HowItWorks"
        // }
      }
    },

    cityPickerDialog: {
      componentPath: "Dialog",
      props: {
        open: false,
        maxWidth: "md"
      },
      children: {
        dialogContent: {
          componentPath: "DialogContent",
          props: {
            classes: {
              root: "city-picker-dialog-style"
            }
            // style: { minHeight: "180px", minWidth: "365px" }
          },
          children: {
            popup: cityPicker
          }
        }
      }
    },
    adhocDialog: {
      uiFramework: "custom-containers",
      componentPath: "DialogContainer",
      props: {
        open: false,
        maxWidth: false,
        screenKey: "home"
      },
      children: {
        popup: {}
      }
    }
  }
};

export default tradeLicenseSearchAndResult;