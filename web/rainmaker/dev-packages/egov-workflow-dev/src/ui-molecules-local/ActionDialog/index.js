import React from "react";
import { connect } from "react-redux";
import { Grid, Typography, Button } from "@material-ui/core";
import { Container } from "egov-ui-framework/ui-atoms";
import {
  LabelContainer,
  TextFieldContainer,
  MultiItem
} from "egov-ui-framework/ui-containers";
import { Dialog, DialogContent } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { withStyles } from "@material-ui/core/styles";
import { UploadMultipleFiles } from "egov-ui-framework/ui-molecules";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import store from "redux/store";
import "./index.css";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getQueryArg,

} from "egov-ui-framework/ui-utils/commons";
import {

  getDateField, getPattern

} from "egov-ui-framework/ui-config/screens/specs/utils";
//import { getTodaysDateInYMD } from "../../utils";
//import { getTradeResults } from "egov-workflow/ui-utils/commons";
import { getSearchResults } from "egov-tradelicence/ui-utils/commons";
import DatePicker from "material-ui/DatePicker";
import TextField from '@material-ui/core/TextField';
import get from "lodash/get";

const styles = theme => ({

  root: {
    marginTop: 24,
    width: "100%"
  }
});
let userInfo1 = localStorage.getItem("user-info");
userInfo1 = JSON.parse(userInfo1);
console.log("im in", userInfo1);
console.log("im in", userInfo1.roles[1].code);

const fieldConfig = {
  approverName: {
    label: {
      labelName: "Assignee Name",
      labelKey: "WF_ASSIGNEE_NAME_LABEL"
    },
    placeholder: {
      labelName: "Select assignee Name",
      labelKey: "WF_ASSIGNEE_NAME_PLACEHOLDER"
    },
    roleDefination: {
      rolePath: "user-info.roles",
      roles: ["TL_FIELD_INSPECTOR", "TL_DOC_VERIFIER"]
    },
  },
  comments: {
    label: {
      labelName: "Comments",
      labelKey: "WF_COMMON_COMMENTS"
    },
    placeholder: {
      labelName: "Enter Comments",
      labelKey: "WF_ADD_HOC_CHARGES_POPUP_COMMENT_LABEL"
    }
  },

  tradeSubType: {
    label: {
      labelName: "SubType",
      labelKey: "TL_NEW_TRADE_DETAILS_TRADE_SUBTYPE_LABEL"
    },
    placeholder: {
      labelName: "Enter the Trade SubType",
      labelKey: "TL_NEW_TRADE_DETAILS_TRADE_SUBTYPE_PLACEHOLDER"
    },
    roleDefination: {
      rolePath: "user-info.roles",
      roles: ["TL_FIELD_INSPECTOR", "TL_DOC_VERIFIER"]
    }
  },
  cbrnNumber: {
    label: {
      labelName: "cbrnNumber",
      labelKey: "TL_NEW_TRADE_DETAILS_CBRNUMBER_LABEL"
    },
    placeholder: {
      labelName: "Enter the cbrnNumber",
      labelKey: "TL_NEW_TRADE_DETAILS_CBRNUMBER_PLACEHOLDER"
    }

  },
  cbrnDate: {
    // getDateField({
    label: {
      labelName: "cbrnDate",
      labelKey: "TL_NEW_TRADE_DETAILS_CBRNDATE_LABEL"
    }

    //})
  }

};

class ActionDialog extends React.Component {
  state = {
    employeeList: [],
    roles: ""
  };

  getButtonLabelName = label => {
    switch (label) {
      case "FORWARD":
        return "Verify and Forward";
      case "MARK":
        return "Mark";
      case "REJECT":
        return "Reject";
      case "CANCEL":
      case "APPROVE":
        return "APPROVE";
      case "PAY":
        return "Pay";
      case "SENDBACK":
        return "Send Back";
      default:
        return label;
    }
  };

  render() {

    // console.log("im in",localStorage.getItem("user-info").roles.code); 
    let {
      open,
      onClose,
      dropDownData,
      handleFieldChange,
      onButtonClick,
      dialogData,
      dataPath,
      state
    } = this.props;
    const {
      buttonLabel,
      showEmployeeList,
      dialogHeader,
      moduleName,
      isDocRequired
    } = dialogData;
    const { getButtonLabelName } = this;
    let fullscreen = false;
    if (window.innerWidth <= 768) {
      fullscreen = true;
    }
    if (dataPath === "FireNOCs") {
      dataPath = `${dataPath}[0].fireNOCDetails`
    } else if (dataPath === "BPA") {
      dataPath = `${dataPath}`;
    } else if (dataPath === "Assessment" || dataPath === "Property") {
      dataPath = `${dataPath}.workflow`;
    } else {
      dataPath = `${dataPath}[0]`;
    }
    let assigneePath = '';
    /* The path for Assignee in Property and Assessment has latest workflow contract and it is Array of user object  */
    if (dataPath.includes("Assessment") || dataPath.includes("Property")) {
      assigneePath = `${dataPath}.assignes[0].uuid`;
    } else {
      assigneePath = `${dataPath}.assignee[0]`;
    }
    console.log("Assignee path ", assigneePath);
    let isFieldInspector = false;
    for (var i = 0; i < userInfo1.roles.length; i++) {
      if (userInfo1.roles[i].code === 'TL_APPROVER') {
        isFieldInspector = true;
      }

    }
  console.log("state>>>>",state);
  const status = get(
    state.screenConfiguration.preparedFinalObject,
    `Licenses[0].status`
  );
  console.log("status>>>",status);
    console.log("Is field inspector", isFieldInspector);
    switch (status) {
      case "APPLIED":
        return (
          <Dialog
            fullScreen={fullscreen}
            open={open}
            onClose={onClose}
            maxWidth={false}
            style={{ zIndex: 2000 }}
          >
            <DialogContent
              children={
                <Container
                  children={
                    <Grid
                      container="true"
                      spacing={12}
                      marginTop={16}
                      className="action-container"
                    >
                      <Grid
                        style={{
                          alignItems: "center",
                          display: "flex"
                        }}
                        item
                        sm={10}
                      >
                        <Typography component="h2" variant="subheading">
                          <LabelContainer {...dialogHeader} />
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        sm={2}
                        style={{
                          textAlign: "right",
                          cursor: "pointer",
                          position: "absolute",
                          right: "16px",
                          top: "16px"
                        }}
                        onClick={onClose}
                      >
                        <CloseIcon />
                      </Grid>
                      {showEmployeeList && (
                        <Grid
                          item
                          sm="12"
                          style={{
                            marginTop: 16
                          }}
                        >
                          <TextFieldContainer
                            select={true}
                            style={{ marginRight: "15px" }}
                            label={fieldConfig.approverName.label}
                            placeholder={fieldConfig.approverName.placeholder}
                            data={dropDownData}
                            optionValue="value"
                            optionLabel="label"
                            hasLocalization={false}
                            //onChange={e => this.onEmployeeClick(e)}
                            onChange={e =>
                              handleFieldChange(
                                assigneePath,
                                e.target.value
                              )
                            }
                            jsonPath={assigneePath}
                          />
                        </Grid>
                      )}
                      <Grid item sm="12">
                        <TextFieldContainer
                          InputLabelProps={{ shrink: true }}
                          label={fieldConfig.comments.label}
                          onChange={e =>
                            handleFieldChange(`${dataPath}.comment`, e.target.value)
                          }
                          jsonPath={`${dataPath}.comment`}
                          placeholder={fieldConfig.comments.placeholder}
                        />
                      </Grid>

                      <Grid item sm="12">
                        <Typography
                          component="h3"
                          variant="subheading"
                          style={{
                            color: "rgba(0, 0, 0, 0.8700000047683716)",
                            fontFamily: "Roboto",
                            fontSize: "14px",
                            fontWeight: 400,
                            lineHeight: "20px",
                            marginBottom: "8px"
                          }}
                        >
                          <div className="rainmaker-displayInline">
                            <LabelContainer
                              labelName="Supporting Documents"
                              labelKey="WF_APPROVAL_UPLOAD_HEAD"
                            />
                            {isDocRequired && (
                              <span style={{ marginLeft: 5, color: "red" }}>*</span>
                            )}
                          </div>
                        </Typography>
                        <div
                          style={{
                            color: "rgba(0, 0, 0, 0.60)",
                            fontFamily: "Roboto",
                            fontSize: "14px",
                            fontWeight: 400,
                            lineHeight: "20px"
                          }}
                        >
                          <LabelContainer
                            labelName="Only .jpg and .pdf files. 5MB max file size."
                            labelKey="WF_APPROVAL_UPLOAD_SUBHEAD"
                          />
                        </div>
                        <UploadMultipleFiles
                          maxFiles={4}
                          inputProps={{
                            accept: "image/*, .pdf, .png, .jpeg"
                          }}
                          buttonLabel={{ labelName: "UPLOAD FILES", labelKey: "TL_UPLOAD_FILES_BUTTON" }}
                          jsonPath={`${dataPath}.wfDocuments`}
                          maxFileSize={5000}
                        />
                        <Grid sm={12} style={{ textAlign: "right" }} className="bottom-button-container">
                          <Button
                            variant={"contained"}
                            color={"primary"}
                            style={{
                              minWidth: "200px",
                              height: "48px"
                            }}
                            className="bottom-button"
                            onClick={() =>
                              onButtonClick(buttonLabel, isDocRequired)
                            }
                          >
                            <LabelContainer
                              labelName={getButtonLabelName(buttonLabel)}
                              labelKey={
                                moduleName
                                  ? `WF_${moduleName.toUpperCase()}_${buttonLabel}`
                                  : ""
                              }
                            />
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  }
                />
              }
            />
          </Dialog>
        );
        break;
      case "FIELDINSPECTION":
        return (
          <Dialog
            fullScreen={fullscreen}
            open={open}
            onClose={onClose}
            maxWidth={false}
            style={{ zIndex: 2000 }}
          >
            <DialogContent
              children={
                <Container
                  children={
                    <Grid
                      container="true"
                      spacing={12}
                      marginTop={16}
                      className="action-container"
                    >
                      <Grid
                        style={{
                          alignItems: "center",
                          display: "flex"
                        }}
                        item
                        sm={10}
                      >
                        <Typography component="h2" variant="subheading">
                          <LabelContainer {...dialogHeader} />
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        sm={2}
                        style={{
                          textAlign: "right",
                          cursor: "pointer",
                          position: "absolute",
                          right: "16px",
                          top: "16px"
                        }}
                        onClick={onClose}
                      >
                        <CloseIcon />
                      </Grid>
                      {showEmployeeList && (
                        <Grid
                          item
                          sm="12"
                          style={{
                            marginTop: 16
                          }}
                        >
                          <TextFieldContainer
                            select={true}
                            style={{ marginRight: "15px" }}
                            label={fieldConfig.approverName.label}
                            placeholder={fieldConfig.approverName.placeholder}
                            data={dropDownData}
                            optionValue="value"
                            optionLabel="label"
                            hasLocalization={false}
                            //onChange={e => this.onEmployeeClick(e)}
                            onChange={e =>
                              handleFieldChange(
                                assigneePath,
                                e.target.value
                              )
                            }
                            jsonPath={assigneePath}
                          />
                        </Grid>
                      )}
                      <Grid item sm="12">
                        <TextFieldContainer
                          InputLabelProps={{ shrink: true }}
                          label={fieldConfig.comments.label}
                          onChange={e =>
                            handleFieldChange(`${dataPath}.comment`, e.target.value)
                          }
                          jsonPath={`${dataPath}.comment`}
                          placeholder={fieldConfig.comments.placeholder}
                        />
                      </Grid>
                      <Grid item sm="12">
                        <TextFieldContainer
                          InputLabelProps={{ shrink: true }}
                          label={fieldConfig.tradeSubType.label}
                          onChange={e =>
                            handleFieldChange(`${dataPath}.tradeLicenseDetail.additionalDetail.tradeSubType`, e.target.value)
                          }
                          required={true}
                          // roleDefination={{ rolePath: "user-info.roles", roles: ["TL_DOC_VERIFIER"] }} 
                          jsonPath={`${dataPath}.tradeLicenseDetail.additionalDetail.tradeSubType`}
                          placeholder={fieldConfig.tradeSubType.placeholder}

                        />
                      </Grid>





                      <Grid item sm="12">
                        <Typography
                          component="h3"
                          variant="subheading"
                          style={{
                            color: "rgba(0, 0, 0, 0.8700000047683716)",
                            fontFamily: "Roboto",
                            fontSize: "14px",
                            fontWeight: 400,
                            lineHeight: "20px",
                            marginBottom: "8px"
                          }}
                        >
                          <div className="rainmaker-displayInline">
                            <LabelContainer
                              labelName="Supporting Documents"
                              labelKey="WF_APPROVAL_UPLOAD_HEAD"
                            />
                            {isDocRequired && (
                              <span style={{ marginLeft: 5, color: "red" }}>*</span>
                            )}
                          </div>
                        </Typography>
                        <div
                          style={{
                            color: "rgba(0, 0, 0, 0.60)",
                            fontFamily: "Roboto",
                            fontSize: "14px",
                            fontWeight: 400,
                            lineHeight: "20px"
                          }}
                        >
                          <LabelContainer
                            labelName="Only .jpg and .pdf files. 5MB max file size."
                            labelKey="WF_APPROVAL_UPLOAD_SUBHEAD"
                          />
                        </div>
                        <UploadMultipleFiles
                          maxFiles={4}
                          inputProps={{
                            accept: "image/*, .pdf, .png, .jpeg"
                          }}
                          buttonLabel={{ labelName: "UPLOAD FILES", labelKey: "TL_UPLOAD_FILES_BUTTON" }}
                          jsonPath={`${dataPath}.wfDocuments`}
                          maxFileSize={5000}
                        />
                        <Grid sm={12} style={{ textAlign: "right" }} className="bottom-button-container">
                          <Button
                            variant={"contained"}
                            color={"primary"}
                            style={{
                              minWidth: "200px",
                              height: "48px"
                            }}
                            className="bottom-button"
                            onClick={() =>
                              onButtonClick(buttonLabel, isDocRequired)
                            }
                          >
                            <LabelContainer
                              labelName={getButtonLabelName(buttonLabel)}
                              labelKey={
                                moduleName
                                  ? `WF_${moduleName.toUpperCase()}_${buttonLabel}`
                                  : ""
                              }
                            />
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  }
                />
              }
            />
          </Dialog>
        );
        break;
      case "PENDINGAPPROVAL":
        return (
          <Dialog
            fullScreen={fullscreen}
            open={open}
            onClose={onClose}
            maxWidth={false}
            style={{ zIndex: 2000 }}
          >
            <DialogContent
              children={
                <Container
                  children={
                    <Grid
                      container="true"
                      spacing={12}
                      marginTop={16}
                      className="action-container"
                    >
                      <Grid
                        style={{
                          alignItems: "center",
                          display: "flex"
                        }}
                        item
                        sm={10}
                      >
                        <Typography component="h2" variant="subheading">
                          <LabelContainer {...dialogHeader} />
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        sm={2}
                        style={{
                          textAlign: "right",
                          cursor: "pointer",
                          position: "absolute",
                          right: "16px",
                          top: "16px"
                        }}
                        onClick={onClose}
                      >
                        <CloseIcon />
                      </Grid>
                      {showEmployeeList && (
                        <Grid
                          item
                          sm="12"
                          style={{
                            marginTop: 16
                          }}
                        >

                          <TextFieldContainer
                            select={true}
                            style={{ marginRight: "15px" }}
                            label={fieldConfig.approverName.label}
                            placeholder={fieldConfig.approverName.placeholder}
                            data={dropDownData}
                            optionValue="value"
                            optionLabel="label"
                            hasLocalization={false}
                            //onChange={e => this.onEmployeeClick(e)}
                            onChange={e =>
                              handleFieldChange(
                                assigneePath,
                                e.target.value
                              )
                            }
                            jsonPath={assigneePath}
                          />
                        </Grid>
                      )}
                      <Grid item sm="12">
                        <TextFieldContainer
                          InputLabelProps={{ shrink: true }}
                          label={fieldConfig.comments.label}

                          onChange={e =>
                            handleFieldChange(`${dataPath}.comment`, e.target.value)
                          }
                          jsonPath={`${dataPath}.comment`}
                          placeholder={fieldConfig.comments.placeholder}
                        />

                      </Grid>


                      <Grid item sm="12">
                        <TextFieldContainer
                          InputLabelProps={{ shrink: true }}
                          label={fieldConfig.cbrnNumber.label}
                          required={true}
                          onChange={(e, value) => {
                            let num = JSON.stringify({ 'cbrnNumber': e.target.value })
                            //console.log("num>>>>",e.target.value)
                            handleFieldChange(`${dataPath}.tradeLicenseDetail.additionalDetail.cbrnNumber`, e.target.value)
                          }
                          }
                          jsonPath={`${dataPath}.tradeLicenseDetail.additionalDetail.cbrnNumber`}
                          placeholder={fieldConfig.cbrnNumber.placeholder}
                        />
                      </Grid>
                      <Grid item sm="12">
                        <TextFieldContainer
                          id="datetime-local"
                          label={fieldConfig.cbrnDate.label}
                          //label="Date"
                          type="date"
                          required={true}
                          InputProps={{ inputProps: { max: new Date().toISOString().slice(0,10)} }}
                          //format={'DD/MM/YYYY'}
                          // formatDate={(date) => moment(date).format('DD/MM/YYYY')}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          onChange={(e, value) => {
                            // let num = JSON.stringify({ 'cbrnDate': e.target.value })
                            //let num = Date.parse(e.target.value)
                            // console.log("num>>>>", Date.parse(e.target.value))
                            //console.log("num>>>>", num.toString())

                            handleFieldChange(`${dataPath}.tradeLicenseDetail.additionalDetail.cbrnDate`, Date.parse(e.target.value))
                          }
                          }
                          jsonPath={`${dataPath}.tradeLicenseDetail.additionalDetail.cbrnDate`}

                        />
                      </Grid>

                      <Grid item sm="12">
                        <Typography
                          component="h3"
                          variant="subheading"
                          style={{
                            color: "rgba(0, 0, 0, 0.8700000047683716)",
                            fontFamily: "Roboto",
                            fontSize: "14px",
                            fontWeight: 400,
                            lineHeight: "20px",
                            marginBottom: "8px"
                          }}
                        >
                          <div className="rainmaker-displayInline">
                            <LabelContainer
                              labelName="Supporting Documents"
                              labelKey="WF_APPROVAL_UPLOAD_HEAD"
                            />
                            {isDocRequired && (
                              <span style={{ marginLeft: 5, color: "red" }}>*</span>
                            )}
                          </div>
                        </Typography>
                        <div
                          style={{
                            color: "rgba(0, 0, 0, 0.60)",
                            fontFamily: "Roboto",
                            fontSize: "14px",
                            fontWeight: 400,
                            lineHeight: "20px"
                          }}
                        >
                          <LabelContainer
                            labelName="Only .jpg and .pdf files. 5MB max file size."
                            labelKey="WF_APPROVAL_UPLOAD_SUBHEAD"
                          />
                        </div>
                        <UploadMultipleFiles
                          maxFiles={4}
                          inputProps={{
                            accept: "image/*, .pdf, .png, .jpeg"
                          }}
                          buttonLabel={{ labelName: "UPLOAD FILES", labelKey: "TL_UPLOAD_FILES_BUTTON" }}
                          jsonPath={`${dataPath}.wfDocuments`}
                          maxFileSize={5000}
                        />
                        <Grid sm={12} style={{ textAlign: "right" }} className="bottom-button-container">
                          <Button
                            variant={"contained"}
                            color={"primary"}
                            style={{
                              minWidth: "200px",
                              height: "48px"
                            }}
                            className="bottom-button"
                            onClick={() =>
                              onButtonClick(buttonLabel, isDocRequired)
                            }
                          >
                            <LabelContainer
                              labelName={getButtonLabelName(buttonLabel)}
                              labelKey={
                                moduleName
                                  ? `WF_${moduleName.toUpperCase()}_${buttonLabel}`
                                  : ""
                              }
                            />
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  }
                />
              }
            />
          </Dialog>
        );
        break;
        case "PENDINGPAYMENT":
          return (
            <Dialog
              fullScreen={fullscreen}
              open={open}
              onClose={onClose}
              maxWidth={false}
              style={{ zIndex: 2000 }}
            >
              <DialogContent
                children={
                  <Container
                    children={
                      <Grid
                        container="true"
                        spacing={12}
                        marginTop={16}
                        className="action-container"
                      >
                      
                        <Grid
                          item
                          sm={2}
                          style={{
                            textAlign: "right",
                            cursor: "pointer",
                            position: "absolute",
                            right: "16px",
                            top: "16px"
                          }}
                          onClick={onClose}
                        >
                          <CloseIcon />
                        </Grid>
                     
  
                        <Grid item sm="12">
                          
                          
                          
                          <Grid sm={12} style={{ textAlign: "right" }} className="bottom-button-container">
                            <Button
                              variant={"contained"}
                              color={"primary"}
                              style={{
                                minWidth: "200px",
                                height: "48px"
                              }}
                              className="bottom-button"
                              onClick={() =>
                                onButtonClick(buttonLabel, isDocRequired)
                              }
                            >
                              <LabelContainer
                                labelName={getButtonLabelName(buttonLabel)}
                                labelKey={
                                  moduleName
                                    ? `WF_${moduleName.toUpperCase()}_${buttonLabel}`
                                    : ""
                                }
                              />
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    }
                  />
                }
              />
            </Dialog>
          );
          break;
    }
 


  }
}
export default withStyles(styles)(ActionDialog);
