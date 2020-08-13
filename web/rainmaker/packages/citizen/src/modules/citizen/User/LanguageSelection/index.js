import React, { Component } from "react";
import { connect } from "react-redux";
import { Banner } from "modules/common";
import { LanguageSelectionForm } from "modules/common";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import { getLocale } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import {DisclaimerInformation} from "modules/common";

class LanguageSelection extends Component {
  state = {
    value: getLocale(),
  };

  onClick = (value) => {
    this.setState({ value });
    this.props.fetchLocalizationLabel(value);
  };

  onLanguageSelect = () => {
    this.props.history.push("/user/register");
  };

  render() {
    const { value } = this.state;
    const { onLanguageSelect, onClick } = this;
    const { bannerUrl, logoUrl, languages } = this.props;
    return (
      <div>
       <Banner className="language-selection" bannerUrl={bannerUrl} logoUrl={logoUrl}>
        <div>
           <LanguageSelectionForm items={languages} value={value} onLanguageSelect={onLanguageSelect} onClick={onClick} />
        </div>
       </Banner>
       <div>
        <DisclaimerInformation/>
       </div>
      </div>     
    );
  }
}

const mapStateToProps = ({ common }) => {
  const { stateInfoById } = common;
  let bannerUrl = get(stateInfoById, "0.bannerUrl");
  let logoUrl = get(stateInfoById, "0.logoUrl");
  let languages = get(stateInfoById, "0.languages", []);
  return { bannerUrl, logoUrl, languages };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchLocalizationLabel: (locale) => dispatch(fetchLocalizationLabel(locale)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LanguageSelection);
