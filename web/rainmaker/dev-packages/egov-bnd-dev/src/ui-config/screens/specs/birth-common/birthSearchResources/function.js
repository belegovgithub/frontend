import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import { searchForBirth } from "../../../../../ui-utils/commons";
import { genderValues } from "../../../../../ui-utils/constants";
import { validateFields } from "../../utils";
import { convertEpochToDate } from "../../utils/index";


export const searchApiCall = async (state, dispatch) => {

  showHideTable(false, dispatch);

  let queryParams = [
    //{ key: "limit", value: "10" }
  ];

  let tenantId = get(state.screenConfiguration.preparedFinalObject,"bnd.birth.tenantId");
  if(tenantId)
    queryParams.push({ key: "tenantId",value: tenantId});

  let dateOfBirth = get(state.screenConfiguration.preparedFinalObject,"bnd.birth.dob");
  if(dateOfBirth)
    queryParams.push({ key: "dateOfBirth",value: dateOfBirth});

  let gender = get(state.screenConfiguration.preparedFinalObject,"bnd.birth.gender");
  if(gender)
    queryParams.push({ key: "gender",value: gender});

  let registrationNo = get(state.screenConfiguration.preparedFinalObject,"bnd.birth.registrationNo");
  if(registrationNo)
    queryParams.push({ key: "registrationNo",value: registrationNo});

  let hospitalName = get(state.screenConfiguration.preparedFinalObject,"bnd.birth.hosptialId");
  if(hospitalName)
    queryParams.push({ key: "hospitalName",value: hospitalName});

  let mothersName = get(state.screenConfiguration.preparedFinalObject,"bnd.birth.mothersName");
  if(mothersName)
    queryParams.push({ key: "motherName",value: mothersName});

  let fathersName = get(state.screenConfiguration.preparedFinalObject,"bnd.birth.fathersName");
  if(fathersName)
    queryParams.push({ key: "fatherName",value: fathersName});

  let searchSet1Visible = get(
    state.screenConfiguration,
    "screenConfig.getCertificate.components.div.children.birthSearchCard.children.cardContent.children.searchContainer1.visible",
    {}
  );

  const isSearchSet1Valid = validateFields(
    "components.div.children.birthSearchCard.children.cardContent.children.searchContainer1.children.details.children",
    state,
    dispatch,
    "getCertificate"
  );
  const isSearchSet2Valid = validateFields(
    "components.div.children.birthSearchCard.children.cardContent.children.searchContainer2.children.details.children",
    state,
    dispatch,
    "getCertificate"
  );
  const isSearchSetCommonValid = validateFields(
    "components.div.children.birthSearchCard.children.cardContent.children.searchContainerCommon.children",
    state,
    dispatch,
    "getCertificate"
  );

  if (!isSearchSetCommonValid) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill the required fields to search.",
          labelKey: "BND_COMMON_REQ_FIELDS_ERR"
        },
        "warning"
      )
    );
    return;
  }

  if(!registrationNo && !hospitalName && !mothersName && !fathersName)
  {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill enter atleast one attribute in the non mandatory list",
          labelKey: "BND_COMMON_REQ_FIELDS_ERR2"
        },
        "warning"
      )
    );
    return;
  }

  const responseFromAPI = await searchForBirth(dispatch, queryParams)
  const births = (responseFromAPI && responseFromAPI.birthCerts) || [{"id":"1","dateofbirth":1614241552,"firstname":"san","gender":"1","registrationno":"2021-1","counter":0,"birthFatherInfo":{"firstname":"abc"},"birthMotherInfo":{"firstname":"abc1"},"tenantid":"pb.agra"},{"id":"2","dateofbirth":1614241552,"firstname":"san1","gender":"1","registrationno":"2021-2","counter":0,"birthFatherInfo":{"firstname":"abcd"},"birthMotherInfo":{"firstname":"abcd1"},"tenantid":"pb.agra"}];

  const birthTableData = births.map(item => {
    return {
      id: get(item, "id"),
      registrationNo: get(item, "registrationno"),
      nameOfChild: get(item, "firstname"),
      dateOfbirth: get(item, "dateofbirth"),
      gender:  getGenderValue(get(item, "gender")),
      mothersName: get(item, "birthMotherInfo.firstname"),
      fathersName: get(item, "birthFatherInfo.firstname"),
      action: getActionItem(get(item, "counter")),
      tenantId: get(item, "tenantid"),
      payRequired: get(item, "payRequired")
    };
  });
  dispatch(
    prepareFinalObject("bnd.birth.birthSearchResponse", births)
  );

  // const uiConfigs = get(state.screenConfiguration.preparedFinalObject, "searchScreenMdmsData.common-masters.uiCommonPay");
  // const configObject = uiConfigs.filter(item => item.code === searchScreenObject.businesService);
    
  try {
    let data = birthTableData.map(item => ({
      ['BND_COMMON_TABLE_ID']: item.id || "-",
      ['BND_COMMON_TABLE_REGNO']: item.registrationNo || "-",
      ["BND_COMMON_NAME"]: item.nameOfChild || "-",
      ['BND_BIRTH_DATE']: convertEpochToDate(item.dateOfbirth),
      ['BND_COMMON_GENDER']: item.gender || "-",
      ['BND_COMMON_MOTHERSNAME']: item.mothersName || "-",
      ['BND_COMMON_FATHERSNAME']: item.fathersName || "-",
      ['BND_COMMON_TABLE_ACTION']: item.action || "-",
      ["BUSINESS_SERVICE"]: "BIRTH_CERT_FEE",
      ["TENANT_ID"]: item.tenantId,
      //["PAYREQUIRED"]: item.payRequired,
      // ["BILL_ID"]: item.billId,
      // ["BILL_SEARCH_URL"]: searchScreenObject.url,
      // ["ADVANCE_PAYMENT"]: isAdvancePayment
    }));
    dispatch(
      handleField(
        "getCertificate",
        "components.div.children.searchResults",
        "props.data",
        data
      )
    );
    dispatch(
      handleField(
        "getCertificate",
        "components.div.children.searchResults",
        "props.tableData",
        birthTableData
      )
    );
    dispatch(
      handleField(
        "getCertificate",
        "components.div.children.searchResults",
        "props.rows",
        birthTableData.length
      )
    );

    showHideTable(true, dispatch);
  } catch (error) {
    dispatch(toggleSnackbar(true, error.message, "error"));
    console.log(error);
  }
}

const showHideTable = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "getCertificate",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};

const getActionItem = (counter) => {
  if(counter < 1)
    return "FREE_DOWNLOAD";
  else
    return "PAY_AND_DOWNLOAD";
}

const getGenderValue = (genderCode) => {
  return genderValues[genderCode];
}