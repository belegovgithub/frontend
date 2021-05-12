import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import get from "lodash/get";

import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import CheckBoxContainer from "../CheckBoxContainer";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";

const styles = (theme) => ({
  textField: {
    textAlign: "right",
    maxWidth:"90%",
  },
  input: {
    padding: "10px 0px 2px 10px !important",
    textAlign: "right !important",
    "&:before": {
      border: "2px solid rgba(0, 0, 0, 0.42) !important",
      height: "40px !important",
      borderRadius: "5px !important",
      padding: "0.5rem",
      textAlign: "right",
    },
    "&:after": {
      border: "2px solid #DB6844 !important",
      height: "40px !important",
      borderRadius: "5px !important",
      padding: "0.5rem",
      textAlign: "right",
    },
  },
});

const themeStyles = (theme) => ({
  documentContainer: {
    backgroundColor: "#F2F2F2",
    padding: "16px",
    marginTop: "10px",
    marginBottom: "16px",
  },
  documentCard: {
    backgroundColor: "#F2F2F2",
    padding: "16px",
    marginTop: "10px",
    marginBottom: "16px",
  },
  documentSubCard: {
    backgroundColor: "#F2F2F2",
    padding: "16px",
    marginTop: "10px",
    marginBottom: "10px",
    border: "#d6d6d6",
    borderStyle: "solid",
    borderWidth: "1px",
  },
  documentIcon: {
    backgroundColor: "#FFFFFF",
    borderRadius: "100%",
    width: "36px",
    height: "36px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "rgba(0, 0, 0, 0.8700000047683716)",
    fontFamily: "Roboto",
    fontSize: "20px",
    fontWeight: 400,
    letterSpacing: "0.83px",
    lineHeight: "24px",
    marginTop: "20px",
  },
  documentSuccess: {
    borderRadius: "100%",
    width: "36px",
    height: "36px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#39CB74",
    color: "white",
    marginTop: "20px",
  },
  button: {
    margin: theme.spacing.unit,
    padding: "8px 38px",
  },
  input: {
    display: "none",
  },
  iconDiv: {
    display: "flex",
    alignItems: "center",
  },
  descriptionDiv: {
    alignItems: "center",
    display: "block",
    marginTop: "20px",
  },
  formControl: {
    minWidth: 250,
    padding: "0px",
  },
  fileUploadDiv: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingTop: "5px",
    "& input": {
      display: "none",
    },
  },
});

const lableStyle = {
  display: "flex",
  alignItems: "center",
};
const taxHeadsLabel = {
  display: "flex",
  alignItems: "center",
  fontWeight: 600,
};
const currentDemandLabel = {
  display: "flex",
  alignItems: "center"
};

class AdjustmentAmountContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reducedAmount: false,
      additionalAmount: true,
      reducedAmountValue: 0,
      additionalAmountValue: 0,
      data: {
        WATER_TAX: { reducedAmount: 0, additionalAmount: 0 },

        WATER_CESS: { reducedAmount: 0, additionalAmount: 0 },

        INTEREST: { reducedAmount: 0, additionalAmount: 0 },

        PENALTY: { reducedAmount: 0, additionalAmount: 0 },
      },
    };
  }

  handleAmountChange = (e, field, key) => {
    const { data, ...rest } = this.props;
    const re = /^(\d+)?([.]?\d{0,2})?$/; ///^[0-9\b]+$/;
      if (e.target.value === '' || re.test(e.target.value)) {
        const event = e.target;
        let details = { ...data }, value = event.value,
          endSplitValue = e.target.value.split('.')[1],
          initialSplitValue = e.target.value.split('.')[0];
        if (endSplitValue && endSplitValue.length > 0) {
          value = `${initialSplitValue * 1}.${endSplitValue}`;
        } else if (initialSplitValue && initialSplitValue.length > 0 && endSplitValue != "") {
          value = initialSplitValue * 1;
        } else if (endSplitValue == "") {
          value = `${initialSplitValue * 1}.`;
        }
        if (field == "reducedAmount") details[key]["reducedAmountValue"] = value;
        if (field == "additionalAmount") details[key]["additionalAmountValue"] = value;
        this.props.prepareFinalObject("fetchBillDetailsssss", details);
      }
  };
  handleCheckBoxChange = (field) => {
    const { data, ...rest } = this.props;
    let details = { ...data };
    if (field === "reducedAmount") {
      const reducedAmount = this.state.reducedAmount;
      if (reducedAmount) {
        if (typeof details == "object") {
          details = Object.values(details);
        }
        details.forEach( data => {
          if (data.additionalAmountValue) data.additionalAmountValue = 0;
        });
        this.props.prepareFinalObject("fetchBillDetailsssss", details);
        this.setState({ additionalAmount: true });
        this.props.prepareFinalObject("BILL.AMOUNTTYPE", "reducedAmount");
      }
      this.setState({ reducedAmount: !reducedAmount });
    } else if (field === "additionalAmount") {
      const additionalAmount = this.state.additionalAmount;
      if (additionalAmount) {
        if (typeof details == "object") {
          details = Object.values(details);
        }
        details.forEach( data => {
          if (data.reducedAmountValue){ data.reducedAmountValue = 0 }
        });
        this.props.prepareFinalObject("fetchBillDetailsssss", details);
        this.setState({ reducedAmount: true });
        this.props.prepareFinalObject("BILL.AMOUNTTYPE", "additionalAmount");
      }
      this.setState({ additionalAmount: !additionalAmount });
    }
  };
  getHeaderTaxCard = (card, key) => {
    const { classes, amountType, ...rest } = this.props;
    let disableValue = (amountType == "reducedAmount") ? true : false;
    return (
      <React.Fragment>
        <Grid container={true}>
          <Grid item={true} xs={3} sm={3} md={3} style={lableStyle}>
            <LabelContainer labelKey={getTransformedLocale(`BILL_${card.taxHeadCode}`)} />
          </Grid>
          <Grid item={true} xs={3} sm={3} md={3}>
            <TextField
              variant="outlined"
              name={getTransformedLocale(card.taxHeadCode)}
           
              className={classes.textField}
              value={card.demand ? card.demand : 0}
              InputProps={{
                className: classes.input,
                disabled: true
                
              }}
              inputProps={{
                style: { textAlign: "right", paddingRight: "0.5rem" , color: "black"},
              }}
            />
          </Grid>
          <Grid item={true} xs={3} sm={3} md={3}>
            <TextField
              variant="outlined"
              name={getTransformedLocale(card.taxHeadCode)}
              value={card.reducedAmountValue ? card.reducedAmountValue : 0}
              className={classes.textField}
              onChange={(event) =>
                this.handleAmountChange(event, "reducedAmount", key)
              }
              InputProps={{
                className: classes.input,
                disabled: !disableValue
              }}
              inputProps={{
                style: { textAlign: "right", paddingRight: "0.5rem" },
              }}
            />
          </Grid>
          <Grid item={true} xs={4} sm={4} md={3}>
            <TextField
              variant="outlined"
              value={card.additionalAmountValue ? card.additionalAmountValue : 0}
              className={classes.textField}
              name={getTransformedLocale(card.taxHeadCode)}
              onChange={(event) =>
                this.handleAmountChange(event, "additionalAmount", key)
              }
              InputProps={{
                className: classes.input,
                disabled: disableValue
              }}
              inputProps={{
                style: { textAlign: "right", paddingRight: "0.5rem" },
              }}
            />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  };

  render() {
    const { data, amountType, ...rest } = this.props;
    let checkedValue = (amountType == "reducedAmount") ? true : false;
    let checked=true;
    return (
      <div>
        <Grid container={true}>
          <Grid item={true} xs={3} sm={3} md={3} style={taxHeadsLabel}>
            <LabelContainer labelKey={getTransformedLocale("TAX_HEADS")} />
          </Grid>
          <Grid item={true} xs={3} sm={3} md={3} style={currentDemandLabel}>
            <LabelContainer
              labelName="Current Demand"
              labelKey={getTransformedLocale("CURRENT_DEMAND")}
            />
          </Grid>
          <Grid item={true} xs={3} sm={3} md={3}>
            <CheckBoxContainer
              labelName="Reduced Amount (Rs)"
              labelKey="BILL_REDUCED_AMOUNT_RS"
              name="reducedAmount"
              checked={!checkedValue}
              changeMethod={this.handleCheckBoxChange}
            />
          </Grid>
          <Grid item={true} xs={3} sm={3} md={3}>
            <CheckBoxContainer
              labelName="Additional Amount (Rs)"
              labelKey="BILL_ADDITIONAL_AMOUNT_RS"
              name="additionalAmount"
              checked={checkedValue}
              changeMethod={this.handleCheckBoxChange}
            />
          </Grid>
        
        </Grid>
        <div>
          {data &&
            data.length > 0 &&
            data.map((card, index) => {
              return <div>{this.getHeaderTaxCard(card, index++)}</div>;
            })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { screenConfiguration } = state;
  const { moduleName } = screenConfiguration;
  const amount = get(
    screenConfiguration.preparedFinalObject,
    "BILL.AMOUNT",
    []
  );
  const amountType = get(
    screenConfiguration.preparedFinalObject,
    "BILL.AMOUNTTYPE",
    ""
  );

  let data = get( screenConfiguration.preparedFinalObject, "fetchBillDetails", []);
  return { amount, moduleName, data, amountType };
};

const mapDispatchToProps = (dispatch) => {
  return {
    prepareFinalObject: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value)),
  };
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(AdjustmentAmountContainer)
);
