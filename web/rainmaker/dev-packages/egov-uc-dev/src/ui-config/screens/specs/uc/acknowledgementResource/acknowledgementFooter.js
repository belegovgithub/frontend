import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { generateReciept } from "../../utils/recieptPdf";
import { ifUserRoleExists } from "../../utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { prepareFinalObject,toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getCommonPayUrl } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import "../../../../../index.css";

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
export const getRedirectionURL = () => {
  const redirectionURL = ifUserRoleExists("CITIZEN") ? "/inbox" : "/uc/newCollection" ;

  return redirectionURL;
};
export const acknowledgementSuccesFooter = getCommonApplyFooter({
  goToHomeButton: {
    componentPath: "Button",
    props: {
      // variant: "contained",
      // color: "primary",
      variant: "outlined",
      color: "primary",
      className:"gen-challan-btn"
      // style: {
      //   minWidth: "200px",
      //   height: "48px",
      //   marginRight: "16px"
      // }
    },
    children: {
      downloadReceiptButtonLabel: getLabel({
        labelName: "Go To Home",
        labelKey: "UC_BUTTON_GO_TO_HOME"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => {
        goToHome(state, dispatch);
      }
    }
  },
  printMiniChallanButton: {
    componentPath: "Button",
    props: {
        variant: "contained",
        color: "primary",
        // className: "apply-wizard-footer-right-button",
        className:"gen-challan-btn"

        // disabled: true
    },
    children: {
        printFormButtonLabel: getLabel({
            labelName: "PRINT MINI CHALLAN",
            labelKey: "COMMON_PRINT_MINI_CHALLAN"
        })
    },
    onClickDefination: {
        action: "condition",
        callBack: () => {
            const ReceiptDataTemp = get(
                state.screenConfiguration.preparedFinalObject,
                "Challan"
              );
              
              const todayDate = new Date();
              const challanDateFormatted = todayDate.toString;           
              const fromPeriod = getDateFromEpoch(ReceiptDataTemp.taxPeriodFrom);
              const toPeriod = getDateFromEpoch(ReceiptDataTemp.taxPeriodTo);
              const consumerName = ReceiptDataTemp.consumerName;
              let id = getQueryArg(window.location.href, "tenantId"); 
              if(id != null){
               id =  id.split(".")[1];
               localizedULBName =  id[0].toUpperCase() + id.slice(1);
                
              }
              var collectorName = ""; 
              if (window.isEmployee()) {
                var empInfo = JSON.parse(localStorage.getItem("Employee.user-info"));
                collectorName = empInfo.name;
              }
              const businessService = getQueryArg(window.location.href,"serviceCategory");
              const totalAmt = ReceiptDataTemp.amount.reduce(function(total, arr) { 
                // return the sum with previous value
                return total + arr.amount;
              
                // set initial value as 0
              },0);

              var UCminiChallanData = {
                ulbType: localizedULBName,
                receiptNumber: getQueryArg(window.location.href, "challanNumber"),
                tenantid: getQueryArg(window.location.href, "tenantId"),
                consumerName: consumerName,
                receiptDate: receiptDateFormatted,
                businessService: businessService,
                fromPeriod: fromPeriod,
                toPeriod: toPeriod,
                receiptAmount: totalAmt,
                challanDate:challanDateFormatted,
                collectorName:collectorName
              };  
              UCminiChallanBuilder(UCminiChallanData);
        }
    },
    visible: JSON.parse(window.localStorage.getItem('isPOSmachine')) 
  },
    payButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      className:"gen-challan-btn"
      // style: {
      //   minWidth: "200px",
      //   height: "48px",
      //   marginRight: "16px"
      // }
    },
    children: {
        payButtonLabel: getLabel({
        labelName: "PROCEED TO PAYMENT",
        labelKey: "UC_BUTTON_PAY"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => {
      
     
    const challanNo = getQueryArg(window.location.href, "challanNumber");
    const tenantId = getQueryArg(window.location.href, "tenantId");
    const businessService = getQueryArg(window.location.href,"serviceCategory");
    console.info("businessService=",businessService,"tenantId=",tenantId,"challanNo=",challanNo);
      if(businessService !=null && tenantId !=null && challanNo !=null ){
        getCommonPayUrl(dispatch, challanNo, tenantId, businessService);
      }    
      
      else{
        
        dispatch(setRoute(`/uc/newCollection`));
      }
      
      }
    }
  }
});
export const acknowledgementFailureFooter = getCommonApplyFooter({
  nextButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "16px"
      },
      className:"gen-challan-btn"
    },
    children: {
      goToHomeButtonLabel: getLabel({
        labelName: "Go To Home",
        labelKey: "UC_BUTTON_GO_TO_HOME"
      })
    },
    onClickDefination: {
      action: "page_change",
      path: `${getRedirectionURL()}`
    }
  }
});

const viewReceipt = (state, dispatch) => {
  generateReciept(state, dispatch);
};

const goToHome = (state, dispatch) => { 
  dispatch(prepareFinalObject("Challan", []));
  dispatch(setRoute(`${getRedirectionURL()}`));
};

const UCminiChallanBuilder=(h)=> {
  var NEXTLINE = "&&";
  challanString = "     " + h["ulbType"];
  challanString = challanString + NEXTLINE + "        Collection Receipt" + NEXTLINE;
  challanString = challanString + "******************************************" + NEXTLINE; // challanString = challanString + " PTR UID       : " + h["propertyId"] + NEXTLINE;

  challanString = challanString + " Receipt No    : " + h["receiptNumber"] + NEXTLINE;
  challanString = challanString + " Receipt Date  : " + h["receiptDate"] + NEXTLINE;
  challanString = challanString + " Consumer Name : " + h["consumerName"] + NEXTLINE; // challanString = challanString + " Financial Year: " + h["financialYear"] + NEXTLINE;
  // challanString = challanString + " Owner Name    : " + h["ownerName"] + NEXTLINE;
  // challanString = challanString + " Mobile Number : " + h["mobileNumber"] + NEXTLINE;
  // challanString = challanString + " Property Type : " + h["propertyType"] + NEXTLINE;
  // challanString = challanString + " Plot Size     : " + h["plotSize"] + " sq. yards" + NEXTLINE;

  challanString = challanString + " Category      : " + h["businessService"] + NEXTLINE;
  challanString = challanString + " From Period   : " + h["fromPeriod"] + NEXTLINE;
  challanString = challanString + " To Period     : " + h["toPeriod"] + NEXTLINE;
  challanString = challanString + " Paid Amount   : Rs." + h["receiptAmount"] + NEXTLINE;
  challanString = challanString + " Payment Mode  : " + h["paymentMode"] + NEXTLINE;
  challanString = challanString + " Collector Name: " + h["collectorName"] + NEXTLINE;
  challanString = challanString + "******************************************" + NEXTLINE; //console.log(challanString.replace(/&&/g, "\n"));

  return "egov://print/" + challanString;
};