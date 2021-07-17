import { convertDateToEpoch } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { prepareFinalObject, toggleSnackbar, toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { getMultiUnits, getQueryArg, orderWfProcessInstances } from "egov-ui-framework/ui-utils/commons";
import { addWflowFileUrl } from "../../ui-utils/commons"
import { getUserInfo, localStorageGet } from "egov-ui-kit/utils/localStorageUtils";
import find from "lodash/find";
import get from "lodash/get";
import orderBy from "lodash/orderBy";
import set from "lodash/set";
import React from "react";
import { connect } from "react-redux";
import { Footer } from "../../ui-molecules-local";
//import { Footer } from "egov-workflow/ui-molecules-local";
//import TaskStatusContainer from "../TaskStatusContainer";
import TaskStatusContainer from "egov-workflow/ui-containers-local/TaskStatusContainer";
import  {validateActionFormFields, validateActionFormForComments} from "../../ui-utils/commons";


const tenant = getQueryArg(window.location.href, "tenantId");

class WorkFlowContainer extends React.Component {
  state = {
    open: false,
    action: ""
  };

  componentDidUpdate = async () => {
  }

  componentWillReceiveProps(nextProps) {
  }

  componentDidMount = async () => {
    const { prepareFinalObject, toggleSnackbar } = this.props;
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    const tenantId = getQueryArg(window.location.href, "tenantId");
    const queryObject = [
      { key: "businessIds", value: applicationNumber },
      { key: "history", value: true },
      { key: "tenantId", value: tenantId }
    ];
    try {
      //tobechanged
      //const payload = {"ResponseInfo":null,"ProcessInstances":[{"id":"8f2ef016-6b23-4ab2-b459-43a088d51e44","tenantId":"pb.agra","businessService":"LAMS_NewLR_CEO_V3","businessId":"LAMS-LR-AGRA-2021-01-09-000526","action":"APPLY","moduleName":"LAMS","state":{"auditDetails":null,"uuid":"5c20de8d-67cc-403f-80f8-28ae470bca27","tenantId":"pb.agra","businessServiceId":"9c9e29ec-b6f7-4f60-b60a-51c7e71e66e2","sla":null,"state":"APPLIED","applicationStatus":"APPLIED","docUploadRequired":false,"isStartState":false,"isTerminateState":false,"isStateUpdatable":null,"actions":[{"auditDetails":null,"uuid":"89ce7d14-ecd1-4492-b5c4-048280a2e9bf","tenantId":"pb.agra","currentState":"5c20de8d-67cc-403f-80f8-28ae470bca27","action":"SENDBACK","nextState":"6f4c0a2f-9859-4563-b3b5-7e7c817c5a82","roles":["LR_APPROVER_CEO"]},{"auditDetails":null,"uuid":"4f96efac-e3ad-45e2-ab5f-b7964501eda3","tenantId":"pb.agra","currentState":"5c20de8d-67cc-403f-80f8-28ae470bca27","action":"APPROVE","nextState":"4b270402-937c-422a-ae51-bdd5bdf6b310","roles":["LR_APPROVER_CEO"]},{"auditDetails":null,"uuid":"00ee84f5-187a-4adb-a4d1-7f422bc5e8ba","tenantId":"pb.agra","currentState":"5c20de8d-67cc-403f-80f8-28ae470bca27","action":"REJECT","nextState":"cefe5b31-cb56-4aad-a014-eb528fc81cdc","roles":["LR_APPROVER_CEO"]},{"auditDetails":null,"uuid":"bf58061c-a828-4105-be47-37a6be5dad16","tenantId":"pb.agra","currentState":"5c20de8d-67cc-403f-80f8-28ae470bca27","action":"PDDE-EXAMINATION","nextState":"730c04d2-e152-4bfc-bc01-b8d266f581e5","roles":["LR_APPROVER_CEO"]},{"auditDetails":null,"uuid":"59f2d550-7c9c-4d24-b8e1-febd5863c995","tenantId":"pb.agra","currentState":"5c20de8d-67cc-403f-80f8-28ae470bca27","action":"DGDE-EXAMINATION","nextState":"bff5f407-5076-460c-9fd2-45161d89b27a","roles":["LR_APPROVER_CEO"]},{"auditDetails":null,"uuid":"ca822b73-3cee-4caf-a0e8-5881cca4f929","tenantId":"pb.agra","currentState":"5c20de8d-67cc-403f-80f8-28ae470bca27","action":"MOD-EXAMINATION","nextState":"a2a89111-327f-41fd-a817-6cd2125d9ba0","roles":["LR_APPROVER_CEO"]}]},"comment":null,"documents":[{"id":"4d93dcc1-2c0b-4a0b-85be-de0e73f4f0aa","tenantId":"pb.agra","documentType":"APPLICATION","fileStoreId":"2c4c0e92-af42-4ae4-a7f2-244648c51c35","documentUid":null,"auditDetails":{"createdBy":"cd20fb35-8cff-40ea-a1a1-3449fb24b62b","lastModifiedBy":"cd20fb35-8cff-40ea-a1a1-3449fb24b62b","createdTime":1610182391518,"lastModifiedTime":1610182391518}}],"assigner":{"id":5267,"userName":"LR_CE_AGRA","name":"LR CE AGRA","type":"EMPLOYEE","mobileNumber":"9845135122","emailId":null,"roles":[{"id":null,"name":"Employee","code":"EMPLOYEE","tenantId":"pb.agra"},{"id":null,"name":"LR Counter Employee","code":"LR_CEMP","tenantId":"pb.agra"}],"tenantId":"pb.agra","uuid":"cd20fb35-8cff-40ea-a1a1-3449fb24b62b"},"assignes":null,"nextActions":[{"auditDetails":null,"uuid":"4f96efac-e3ad-45e2-ab5f-b7964501eda3","tenantId":"pb.agra","currentState":"5c20de8d-67cc-403f-80f8-28ae470bca27","action":"APPROVE","nextState":"4b270402-937c-422a-ae51-bdd5bdf6b310","roles":["LR_APPROVER_CEO"]},{"auditDetails":null,"uuid":"59f2d550-7c9c-4d24-b8e1-febd5863c995","tenantId":"pb.agra","currentState":"5c20de8d-67cc-403f-80f8-28ae470bca27","action":"DGDE-EXAMINATION","nextState":"bff5f407-5076-460c-9fd2-45161d89b27a","roles":["LR_APPROVER_CEO"]},{"auditDetails":null,"uuid":"ca822b73-3cee-4caf-a0e8-5881cca4f929","tenantId":"pb.agra","currentState":"5c20de8d-67cc-403f-80f8-28ae470bca27","action":"MOD-EXAMINATION","nextState":"a2a89111-327f-41fd-a817-6cd2125d9ba0","roles":["LR_APPROVER_CEO"]},{"auditDetails":null,"uuid":"bf58061c-a828-4105-be47-37a6be5dad16","tenantId":"pb.agra","currentState":"5c20de8d-67cc-403f-80f8-28ae470bca27","action":"PDDE-EXAMINATION","nextState":"730c04d2-e152-4bfc-bc01-b8d266f581e5","roles":["LR_APPROVER_CEO"]},{"auditDetails":null,"uuid":"00ee84f5-187a-4adb-a4d1-7f422bc5e8ba","tenantId":"pb.agra","currentState":"5c20de8d-67cc-403f-80f8-28ae470bca27","action":"REJECT","nextState":"cefe5b31-cb56-4aad-a014-eb528fc81cdc","roles":["LR_APPROVER_CEO"]},{"auditDetails":null,"uuid":"89ce7d14-ecd1-4492-b5c4-048280a2e9bf","tenantId":"pb.agra","currentState":"5c20de8d-67cc-403f-80f8-28ae470bca27","action":"SENDBACK","nextState":"6f4c0a2f-9859-4563-b3b5-7e7c817c5a82","roles":["LR_APPROVER_CEO"]}],"stateSla":null,"businesssServiceSla":-12968696287,"previousStatus":null,"entity":null,"auditDetails":{"createdBy":"cd20fb35-8cff-40ea-a1a1-3449fb24b62b","lastModifiedBy":"cd20fb35-8cff-40ea-a1a1-3449fb24b62b","createdTime":1610182391518,"lastModifiedTime":1610182391518}}]};
      const payload = await httpRequest(
        "post",
        "egov-workflow-v2/egov-wf/process/_search",
        "",
        queryObject
      );
      
      //tobechanged  remove the below code
      // let sampleAtApprovedState = {"ResponseInfo":null,"ProcessInstances":[{"id":"20ce3f3c-ba1f-41cc-9fe2-0c535170c1a7","tenantId":"pb.agra","businessService":"LAMS_NewLR_V2","businessId":"TL-APP-AGRA-2020-10-21-004168","action":"APPLIED","moduleName":"tl-services","state":{"auditDetails":null,"uuid":"7ba8cac7-731f-4057-9757-ed336e77626c","tenantId":"pb.agra","businessServiceId":"fdb95498-99fd-43b3-9ab7-d76f6ab6a36c","sla":null,"state":"PDDEEXAMINATION","applicationStatus":"PDDEEXAMINATION","docUploadRequired":true,"isStartState":false,"isTerminateState":false,"isStateUpdatable":null,"actions":[{"auditDetails":null,"uuid":"5a7314c7-e2e0-4570-a3af-db6dc9bb9e0b","tenantId":"pb.agra","currentState":"7ba8cac7-731f-4057-9757-ed336e77626c","action":"FORWARD","nextState":"6c6b6b49-3dff-4634-9a38-7a240644aa72","roles":["TL_DOC_VERIFIER"]},{"auditDetails":null,"uuid":"82e9a8cd-928d-49ca-a31b-66b07ebbaa87","tenantId":"pb.agra","currentState":"7ba8cac7-731f-4057-9757-ed336e77626c","action":"REJECT","nextState":"3fc18d5d-7e86-4994-9ce1-9a7c2c8adcf5","roles":["TL_DOC_VERIFIER"]},{"auditDetails":null,"uuid":"5a7314c7-e2e0-4570-a3af-db6dc9bb9e0b","tenantId":"pb.agra","currentState":"7ba8cac7-731f-4057-9757-ed336e77626c","action":"FORWARD","nextState":"6c6b6b49-3dff-4634-9a38-7a240644aa72","roles":["TL_DOC_VERIFIER"]},{"auditDetails":null,"uuid":"82e9a8cd-928d-49ca-a31b-66b07ebbaa87","tenantId":"pb.agra","currentState":"7ba8cac7-731f-4057-9757-ed336e77626c","action":"REJECT","nextState":"3fc18d5d-7e86-4994-9ce1-9a7c2c8adcf5","roles":["TL_DOC_VERIFIER"]},{"auditDetails":null,"uuid":"5a7314c7-e2e0-4570-a3af-db6dc9bb9e0b","tenantId":"pb.agra","currentState":"7ba8cac7-731f-4057-9757-ed336e77626c","action":"FORWARD","nextState":"6c6b6b49-3dff-4634-9a38-7a240644aa72","roles":["TL_DOC_VERIFIER"]},{"auditDetails":null,"uuid":"82e9a8cd-928d-49ca-a31b-66b07ebbaa87","tenantId":"pb.agra","currentState":"7ba8cac7-731f-4057-9757-ed336e77626c","action":"REJECT","nextState":"3fc18d5d-7e86-4994-9ce1-9a7c2c8adcf5","roles":["TL_DOC_VERIFIER"]}]},"comment":null,"documents":[{"id":"a51e02c1-3c53-43e0-904f-9636ea37db91","tenantId":"pb.agra","documentType":"OWNERPHOTO","fileStoreId":"d6d2b299-4648-4026-be22-744d87699d9e","documentUid":null,"auditDetails":{"createdBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","lastModifiedBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","createdTime":1603267882836,"lastModifiedTime":1603267882836}},{"id":"c4ed73d8-6ca5-4f41-9305-95c749c783f5","tenantId":"pb.agra","documentType":"AADHAARCARD","fileStoreId":"29fd4384-f96d-43a8-97e0-f11995f33ad7","documentUid":null,"auditDetails":{"createdBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","lastModifiedBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","createdTime":1603267882836,"lastModifiedTime":1603267882836}},{"id":"b7169301-dfb5-4ca5-a8ba-7458297168ff","tenantId":"pb.agra","documentType":"ELECTBILL","fileStoreId":"66f21eda-782e-47dd-82f4-e9a70fe84791","documentUid":null,"auditDetails":{"createdBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","lastModifiedBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","createdTime":1603267882836,"lastModifiedTime":1603267882836}}],"assigner":{"id":486,"userName":"TL_AGRA","name":"tl all permission agra","type":"EMPLOYEE","mobileNumber":"7022225111","emailId":"","roles":[{"id":null,"name":"Employee","code":"EMPLOYEE","tenantId":"pb.agra"},{"id":null,"name":"TL Counter Employee","code":"TL_CEMP","tenantId":"pb.agra"},{"id":null,"name":"TL doc verifier","code":"TL_DOC_VERIFIER","tenantId":"pb.agra"},{"id":null,"name":"TL Approver","code":"TL_APPROVER","tenantId":"pb.agra"},{"id":null,"name":"TL Field Inspector","code":"TL_FIELD_INSPECTOR","tenantId":"pb.agra"}],"tenantId":"pb.agra","uuid":"9d39d685-edbe-45a7-8dc5-1166a4236b98"},"assignes":null,"nextActions":[{"auditDetails":null,"uuid":"82e9a8cd-928d-49ca-a31b-66b07ebbaa87","tenantId":"pb.agra","currentState":"7ba8cac7-731f-4057-9757-ed336e77626c","action":"FORWARD","nextState":"3fc18d5d-7e86-4994-9ce1-9a7c2c8adcf5","roles":["TL_DOC_VERIFIER","PDDE"]},{"auditDetails":null,"uuid":"82e9a8cd-928d-49ca-a31b-66b07ebbaa87","tenantId":"pb.agra","currentState":"7ba8cac7-731f-4057-9757-ed336e77626c","action":"APPROVE","nextState":"3fc18d5d-7e86-4994-9ce1-9a7c2c8adcf5","roles":["TL_DOC_VERIFIER","PDDE"]}],"stateSla":null,"businesssServiceSla":2505424584,"previousStatus":null,"entity":null,"auditDetails":{"createdBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","lastModifiedBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","createdTime":1603267882836,"lastModifiedTime":1603267882836}},{"id":"4bfcb3a8-1a65-4704-a52d-35f676e22b65","tenantId":"pb.agra","businessService":"LAMS_NewLR_V2","businessId":"TL-APP-AGRA-2020-10-21-004168","action":"APPROVED","moduleName":"tl-services","state":{"auditDetails":null,"uuid":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","tenantId":"pb.agra","businessServiceId":"fdb95498-99fd-43b3-9ab7-d76f6ab6a36c","sla":null,"state":"APPROVED","applicationStatus":"APPROVED","docUploadRequired":false,"isStartState":true,"isTerminateState":false,"isStateUpdatable":null,"actions":[{"auditDetails":null,"uuid":"6c2f40b9-f31e-41b6-8c47-7de5f666c1dd","tenantId":"pb.agra","currentState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","action":"APPROVE","nextState":"7ba8cac7-731f-4057-9757-ed336e77626c","roles":["CEO","DEO"]},{"auditDetails":null,"uuid":"5d09730a-b267-4577-9ebe-36bddf1b41cf","tenantId":"pb.agra","currentState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","action":"FORWARD","nextState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","roles":["CEO","DEO"]}]},"comment":null,"documents":null,"assigner":{"id":486,"userName":"TL_AGRA","name":"tl all permission agra","type":"EMPLOYEE","mobileNumber":"7022225111","emailId":"","roles":[{"id":null,"name":"Employee","code":"EMPLOYEE","tenantId":"pb.agra"},{"id":null,"name":"TL Counter Employee","code":"TL_CEMP","tenantId":"pb.agra"},{"id":null,"name":"TL doc verifier","code":"TL_DOC_VERIFIER","tenantId":"pb.agra"},{"id":null,"name":"TL Approver","code":"TL_APPROVER","tenantId":"pb.agra"},{"id":null,"name":"TL Field Inspector","code":"TL_FIELD_INSPECTOR","tenantId":"pb.agra"}],"tenantId":"pb.agra","uuid":"9d39d685-edbe-45a7-8dc5-1166a4236b98"},"assignes":null,"nextActions":null,"stateSla":null,"businesssServiceSla":2505424584,"previousStatus":null,"entity":null,"auditDetails":{"createdBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","lastModifiedBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","createdTime":1603267787589,"lastModifiedTime":1603267787589}}]};
      // let sampleAtCEODEOState = {"ResponseInfo":null,"ProcessInstances":[{"id":"4bfcb3a8-1a65-4704-a52d-35f676e22b65","tenantId":"pb.agra","businessService":"LAMS_NewLR_V2","businessId":"TL-APP-AGRA-2020-10-21-004168","action":"APPLY","moduleName":"tl-services","state":{"auditDetails":null,"uuid":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","tenantId":"pb.agra","businessServiceId":"fdb95498-99fd-43b3-9ab7-d76f6ab6a36c","sla":null,"state":"APPLIED","applicationStatus":"APPLIED","docUploadRequired":false,"isStartState":true,"isTerminateState":false,"isStateUpdatable":null,"actions":[{"auditDetails":null,"uuid":"6c2f40b9-f31e-41b6-8c47-7de5f666c1dd","tenantId":"pb.agra","currentState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","action":"APPROVE","nextState":"7ba8cac7-731f-4057-9757-ed336e77626c","roles":["CEO","DEO"]},{"auditDetails":null,"uuid":"5d09730a-b267-4577-9ebe-36bddf1b41cf","tenantId":"pb.agra","currentState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","action":"FORWARD","nextState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","roles":["CEO","DEO"]}]},"comment":null,"documents":null,"assigner":{"id":486,"userName":"TL_AGRA","name":"tl all permission agra","type":"EMPLOYEE","mobileNumber":"7022225111","emailId":"","roles":[{"id":null,"name":"Employee","code":"EMPLOYEE","tenantId":"pb.agra"},{"id":null,"name":"TL Counter Employee","code":"TL_CEMP","tenantId":"pb.agra"},{"id":null,"name":"TL doc verifier","code":"TL_DOC_VERIFIER","tenantId":"pb.agra"},{"id":null,"name":"TL Approver","code":"TL_APPROVER","tenantId":"pb.agra"},{"id":null,"name":"TL Field Inspector","code":"TL_FIELD_INSPECTOR","tenantId":"pb.agra"}],"tenantId":"pb.agra","uuid":"9d39d685-edbe-45a7-8dc5-1166a4236b98"},"assignes":null,"nextActions":[{"auditDetails":null,"uuid":"6c2f40b9-f31e-41b6-8c47-7de5f666c1dd","tenantId":"pb.agra","currentState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","action":"APPROVE","nextState":"7ba8cac7-731f-4057-9757-ed336e77626c","roles":["CEO","DEO"]},{"auditDetails":null,"uuid":"5d09730a-b267-4577-9ebe-36bddf1b41cf","tenantId":"pb.agra","currentState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","action":"FORWARD","nextState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","roles":["CEO","DEO"]}],"stateSla":null,"businesssServiceSla":2505424584,"previousStatus":null,"entity":null,"auditDetails":{"createdBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","lastModifiedBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","createdTime":1603267787589,"lastModifiedTime":1603267787589}}]};//{"ResponseInfo":null,"ProcessInstances":[{"id":"20ce3f3c-ba1f-41cc-9fe2-0c535170c1a7","tenantId":"pb.agra","businessService":"LAMS_NewLR_V2","businessId":"TL-APP-AGRA-2020-10-21-004168","action":"APPLY","moduleName":"tl-services","state":{"auditDetails":null,"uuid":"7ba8cac7-731f-4057-9757-ed336e77626c","tenantId":"pb.agra","businessServiceId":"fdb95498-99fd-43b3-9ab7-d76f6ab6a36c","sla":null,"state":"PDDEEXAMINATION","applicationStatus":"PDDEEXAMINATION","docUploadRequired":true,"isStartState":false,"isTerminateState":false,"isStateUpdatable":null,"actions":[{"auditDetails":null,"uuid":"5a7314c7-e2e0-4570-a3af-db6dc9bb9e0b","tenantId":"pb.agra","currentState":"7ba8cac7-731f-4057-9757-ed336e77626c","action":"FORWARD","nextState":"6c6b6b49-3dff-4634-9a38-7a240644aa72","roles":["TL_DOC_VERIFIER"]},{"auditDetails":null,"uuid":"82e9a8cd-928d-49ca-a31b-66b07ebbaa87","tenantId":"pb.agra","currentState":"7ba8cac7-731f-4057-9757-ed336e77626c","action":"REJECT","nextState":"3fc18d5d-7e86-4994-9ce1-9a7c2c8adcf5","roles":["TL_DOC_VERIFIER"]},{"auditDetails":null,"uuid":"5a7314c7-e2e0-4570-a3af-db6dc9bb9e0b","tenantId":"pb.agra","currentState":"7ba8cac7-731f-4057-9757-ed336e77626c","action":"FORWARD","nextState":"6c6b6b49-3dff-4634-9a38-7a240644aa72","roles":["TL_DOC_VERIFIER"]},{"auditDetails":null,"uuid":"82e9a8cd-928d-49ca-a31b-66b07ebbaa87","tenantId":"pb.agra","currentState":"7ba8cac7-731f-4057-9757-ed336e77626c","action":"REJECT","nextState":"3fc18d5d-7e86-4994-9ce1-9a7c2c8adcf5","roles":["TL_DOC_VERIFIER"]},{"auditDetails":null,"uuid":"5a7314c7-e2e0-4570-a3af-db6dc9bb9e0b","tenantId":"pb.agra","currentState":"7ba8cac7-731f-4057-9757-ed336e77626c","action":"FORWARD","nextState":"6c6b6b49-3dff-4634-9a38-7a240644aa72","roles":["TL_DOC_VERIFIER"]},{"auditDetails":null,"uuid":"82e9a8cd-928d-49ca-a31b-66b07ebbaa87","tenantId":"pb.agra","currentState":"7ba8cac7-731f-4057-9757-ed336e77626c","action":"REJECT","nextState":"3fc18d5d-7e86-4994-9ce1-9a7c2c8adcf5","roles":["TL_DOC_VERIFIER"]}]},"comment":null,"documents":[{"id":"a51e02c1-3c53-43e0-904f-9636ea37db91","tenantId":"pb.agra","documentType":"OWNERPHOTO","fileStoreId":"d6d2b299-4648-4026-be22-744d87699d9e","documentUid":null,"auditDetails":{"createdBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","lastModifiedBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","createdTime":1603267882836,"lastModifiedTime":1603267882836}},{"id":"c4ed73d8-6ca5-4f41-9305-95c749c783f5","tenantId":"pb.agra","documentType":"AADHAARCARD","fileStoreId":"29fd4384-f96d-43a8-97e0-f11995f33ad7","documentUid":null,"auditDetails":{"createdBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","lastModifiedBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","createdTime":1603267882836,"lastModifiedTime":1603267882836}},{"id":"b7169301-dfb5-4ca5-a8ba-7458297168ff","tenantId":"pb.agra","documentType":"ELECTBILL","fileStoreId":"66f21eda-782e-47dd-82f4-e9a70fe84791","documentUid":null,"auditDetails":{"createdBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","lastModifiedBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","createdTime":1603267882836,"lastModifiedTime":1603267882836}}],"assigner":{"id":486,"userName":"TL_AGRA","name":"tl all permission agra","type":"EMPLOYEE","mobileNumber":"7022225111","emailId":"","roles":[{"id":null,"name":"Employee","code":"EMPLOYEE","tenantId":"pb.agra"},{"id":null,"name":"TL Counter Employee","code":"TL_CEMP","tenantId":"pb.agra"},{"id":null,"name":"TL doc verifier","code":"TL_DOC_VERIFIER","tenantId":"pb.agra"},{"id":null,"name":"TL Approver","code":"TL_APPROVER","tenantId":"pb.agra"},{"id":null,"name":"TL Field Inspector","code":"TL_FIELD_INSPECTOR","tenantId":"pb.agra"}],"tenantId":"pb.agra","uuid":"9d39d685-edbe-45a7-8dc5-1166a4236b98"},"assignes":null,"nextActions":[{"auditDetails":null,"uuid":"82e9a8cd-928d-49ca-a31b-66b07ebbaa87","tenantId":"pb.agra","currentState":"7ba8cac7-731f-4057-9757-ed336e77626c","action":"FORWARD","nextState":"3fc18d5d-7e86-4994-9ce1-9a7c2c8adcf5","roles":["TL_DOC_VERIFIER","PDDE"]},{"auditDetails":null,"uuid":"82e9a8cd-928d-49ca-a31b-66b07ebbaa87","tenantId":"pb.agra","currentState":"7ba8cac7-731f-4057-9757-ed336e77626c","action":"APPROVE","nextState":"3fc18d5d-7e86-4994-9ce1-9a7c2c8adcf5","roles":["TL_DOC_VERIFIER","PDDE"]}],"stateSla":null,"businesssServiceSla":2505424584,"previousStatus":null,"entity":null,"auditDetails":{"createdBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","lastModifiedBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","createdTime":1603267882836,"lastModifiedTime":1603267882836}},{"id":"4bfcb3a8-1a65-4704-a52d-35f676e22b65","tenantId":"pb.agra","businessService":"LAMS_NewLR_V2","businessId":"TL-APP-AGRA-2020-10-21-004168","action":"INITIATE","moduleName":"tl-services","state":{"auditDetails":null,"uuid":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","tenantId":"pb.agra","businessServiceId":"fdb95498-99fd-43b3-9ab7-d76f6ab6a36c","sla":null,"state":"INITIATED","applicationStatus":"INITIATED","docUploadRequired":false,"isStartState":true,"isTerminateState":false,"isStateUpdatable":null,"actions":[{"auditDetails":null,"uuid":"6c2f40b9-f31e-41b6-8c47-7de5f666c1dd","tenantId":"pb.agra","currentState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","action":"APPLY","nextState":"7ba8cac7-731f-4057-9757-ed336e77626c","roles":["CITIZEN","TL_CEMP"]},{"auditDetails":null,"uuid":"5d09730a-b267-4577-9ebe-36bddf1b41cf","tenantId":"pb.agra","currentState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","action":"INITIATE","nextState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","roles":["CITIZEN","TL_CEMP"]}]},"comment":null,"documents":null,"assigner":{"id":486,"userName":"TL_AGRA","name":"tl all permission agra","type":"EMPLOYEE","mobileNumber":"7022225111","emailId":"","roles":[{"id":null,"name":"Employee","code":"EMPLOYEE","tenantId":"pb.agra"},{"id":null,"name":"TL Counter Employee","code":"TL_CEMP","tenantId":"pb.agra"},{"id":null,"name":"TL doc verifier","code":"TL_DOC_VERIFIER","tenantId":"pb.agra"},{"id":null,"name":"TL Approver","code":"TL_APPROVER","tenantId":"pb.agra"},{"id":null,"name":"TL Field Inspector","code":"TL_FIELD_INSPECTOR","tenantId":"pb.agra"}],"tenantId":"pb.agra","uuid":"9d39d685-edbe-45a7-8dc5-1166a4236b98"},"assignes":null,"nextActions":[{"auditDetails":null,"uuid":"6c2f40b9-f31e-41b6-8c47-7de5f666c1dd","tenantId":"pb.agra","currentState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","action":"APPLY","nextState":"7ba8cac7-731f-4057-9757-ed336e77626c","roles":["CITIZEN","TL_CEMP"]},{"auditDetails":null,"uuid":"5d09730a-b267-4577-9ebe-36bddf1b41cf","tenantId":"pb.agra","currentState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","action":"INITIATE","nextState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","roles":["CITIZEN","TL_CEMP"]}],"stateSla":null,"businesssServiceSla":2505424584,"previousStatus":null,"entity":null,"auditDetails":{"createdBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","lastModifiedBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","createdTime":1603267787589,"lastModifiedTime":1603267787589}}]};
      // let sampleAtPDDEState = {"ResponseInfo":null,"ProcessInstances":[{"id":"20ce3f3c-ba1f-41cc-9fe2-0c535170c1a7","tenantId":"pb.agra","businessService":"LAMS_NewLR_V2","businessId":"TL-APP-AGRA-2020-10-21-004168","action":"APPLIED","moduleName":"tl-services","state":{"auditDetails":null,"uuid":"7ba8cac7-731f-4057-9757-ed336e77626c","tenantId":"pb.agra","businessServiceId":"fdb95498-99fd-43b3-9ab7-d76f6ab6a36c","sla":null,"state":"PDDEEXAMINATION","applicationStatus":"PDDEEXAMINATION","docUploadRequired":true,"isStartState":false,"isTerminateState":false,"isStateUpdatable":null,"actions":[{"auditDetails":null,"uuid":"5a7314c7-e2e0-4570-a3af-db6dc9bb9e0b","tenantId":"pb.agra","currentState":"7ba8cac7-731f-4057-9757-ed336e77626c","action":"FORWARD","nextState":"6c6b6b49-3dff-4634-9a38-7a240644aa72","roles":["TL_DOC_VERIFIER"]},{"auditDetails":null,"uuid":"82e9a8cd-928d-49ca-a31b-66b07ebbaa87","tenantId":"pb.agra","currentState":"7ba8cac7-731f-4057-9757-ed336e77626c","action":"REJECT","nextState":"3fc18d5d-7e86-4994-9ce1-9a7c2c8adcf5","roles":["TL_DOC_VERIFIER"]},{"auditDetails":null,"uuid":"5a7314c7-e2e0-4570-a3af-db6dc9bb9e0b","tenantId":"pb.agra","currentState":"7ba8cac7-731f-4057-9757-ed336e77626c","action":"FORWARD","nextState":"6c6b6b49-3dff-4634-9a38-7a240644aa72","roles":["TL_DOC_VERIFIER"]},{"auditDetails":null,"uuid":"82e9a8cd-928d-49ca-a31b-66b07ebbaa87","tenantId":"pb.agra","currentState":"7ba8cac7-731f-4057-9757-ed336e77626c","action":"REJECT","nextState":"3fc18d5d-7e86-4994-9ce1-9a7c2c8adcf5","roles":["TL_DOC_VERIFIER"]},{"auditDetails":null,"uuid":"5a7314c7-e2e0-4570-a3af-db6dc9bb9e0b","tenantId":"pb.agra","currentState":"7ba8cac7-731f-4057-9757-ed336e77626c","action":"FORWARD","nextState":"6c6b6b49-3dff-4634-9a38-7a240644aa72","roles":["TL_DOC_VERIFIER"]},{"auditDetails":null,"uuid":"82e9a8cd-928d-49ca-a31b-66b07ebbaa87","tenantId":"pb.agra","currentState":"7ba8cac7-731f-4057-9757-ed336e77626c","action":"REJECT","nextState":"3fc18d5d-7e86-4994-9ce1-9a7c2c8adcf5","roles":["TL_DOC_VERIFIER"]}]},"comment":null,"documents":[{"id":"a51e02c1-3c53-43e0-904f-9636ea37db91","tenantId":"pb.agra","documentType":"OWNERPHOTO","fileStoreId":"d6d2b299-4648-4026-be22-744d87699d9e","documentUid":null,"auditDetails":{"createdBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","lastModifiedBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","createdTime":1603267882836,"lastModifiedTime":1603267882836}},{"id":"c4ed73d8-6ca5-4f41-9305-95c749c783f5","tenantId":"pb.agra","documentType":"AADHAARCARD","fileStoreId":"29fd4384-f96d-43a8-97e0-f11995f33ad7","documentUid":null,"auditDetails":{"createdBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","lastModifiedBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","createdTime":1603267882836,"lastModifiedTime":1603267882836}},{"id":"b7169301-dfb5-4ca5-a8ba-7458297168ff","tenantId":"pb.agra","documentType":"ELECTBILL","fileStoreId":"66f21eda-782e-47dd-82f4-e9a70fe84791","documentUid":null,"auditDetails":{"createdBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","lastModifiedBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","createdTime":1603267882836,"lastModifiedTime":1603267882836}}],"assigner":{"id":486,"userName":"TL_AGRA","name":"tl all permission agra","type":"EMPLOYEE","mobileNumber":"7022225111","emailId":"","roles":[{"id":null,"name":"Employee","code":"EMPLOYEE","tenantId":"pb.agra"},{"id":null,"name":"TL Counter Employee","code":"TL_CEMP","tenantId":"pb.agra"},{"id":null,"name":"TL doc verifier","code":"TL_DOC_VERIFIER","tenantId":"pb.agra"},{"id":null,"name":"TL Approver","code":"TL_APPROVER","tenantId":"pb.agra"},{"id":null,"name":"TL Field Inspector","code":"TL_FIELD_INSPECTOR","tenantId":"pb.agra"}],"tenantId":"pb.agra","uuid":"9d39d685-edbe-45a7-8dc5-1166a4236b98"},"assignes":null,"nextActions":[{"auditDetails":null,"uuid":"82e9a8cd-928d-49ca-a31b-66b07ebbaa87","tenantId":"pb.agra","currentState":"7ba8cac7-731f-4057-9757-ed336e77626c","action":"FORWARD","nextState":"3fc18d5d-7e86-4994-9ce1-9a7c2c8adcf5","roles":["TL_DOC_VERIFIER","PDDE"]},{"auditDetails":null,"uuid":"82e9a8cd-928d-49ca-a31b-66b07ebbaa87","tenantId":"pb.agra","currentState":"7ba8cac7-731f-4057-9757-ed336e77626c","action":"APPROVE","nextState":"3fc18d5d-7e86-4994-9ce1-9a7c2c8adcf5","roles":["TL_DOC_VERIFIER","PDDE"]},{"auditDetails":null,"uuid":"82e9a8cd-928d-49ca-a31b-66b07ebbaa87","tenantId":"pb.agra","currentState":"7ba8cac7-731f-4057-9757-ed336e77626c","action":"SENDBACK","nextState":"3fc18d5d-7e86-4994-9ce1-9a7c2c8adcf5","roles":["TL_DOC_VERIFIER","PDDE"]}],"stateSla":null,"businesssServiceSla":2505424584,"previousStatus":null,"entity":null,"auditDetails":{"createdBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","lastModifiedBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","createdTime":1603267882836,"lastModifiedTime":1603267882836}},{"id":"4bfcb3a8-1a65-4704-a52d-35f676e22b65","tenantId":"pb.agra","businessService":"LAMS_NewLR_V2","businessId":"TL-APP-AGRA-2020-10-21-004168","action":"APPLY","moduleName":"tl-services","state":{"auditDetails":null,"uuid":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","tenantId":"pb.agra","businessServiceId":"fdb95498-99fd-43b3-9ab7-d76f6ab6a36c","sla":null,"state":"APPLIED","applicationStatus":"APPLIED","docUploadRequired":false,"isStartState":true,"isTerminateState":false,"isStateUpdatable":null,"actions":[{"auditDetails":null,"uuid":"6c2f40b9-f31e-41b6-8c47-7de5f666c1dd","tenantId":"pb.agra","currentState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","action":"APPROVE","nextState":"7ba8cac7-731f-4057-9757-ed336e77626c","roles":["CEO","DEO"]},{"auditDetails":null,"uuid":"5d09730a-b267-4577-9ebe-36bddf1b41cf","tenantId":"pb.agra","currentState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","action":"FORWARD","nextState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","roles":["CEO","DEO"]}]},"comment":null,"documents":null,"assigner":{"id":486,"userName":"TL_AGRA","name":"tl all permission agra","type":"EMPLOYEE","mobileNumber":"7022225111","emailId":"","roles":[{"id":null,"name":"Employee","code":"EMPLOYEE","tenantId":"pb.agra"},{"id":null,"name":"TL Counter Employee","code":"TL_CEMP","tenantId":"pb.agra"},{"id":null,"name":"TL doc verifier","code":"TL_DOC_VERIFIER","tenantId":"pb.agra"},{"id":null,"name":"TL Approver","code":"TL_APPROVER","tenantId":"pb.agra"},{"id":null,"name":"TL Field Inspector","code":"TL_FIELD_INSPECTOR","tenantId":"pb.agra"}],"tenantId":"pb.agra","uuid":"9d39d685-edbe-45a7-8dc5-1166a4236b98"},"assignes":null,"nextActions":[{"auditDetails":null,"uuid":"6c2f40b9-f31e-41b6-8c47-7de5f666c1dd","tenantId":"pb.agra","currentState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","action":"APPROVE","nextState":"7ba8cac7-731f-4057-9757-ed336e77626c","roles":["CEO","DEO"]},{"auditDetails":null,"uuid":"5d09730a-b267-4577-9ebe-36bddf1b41cf","tenantId":"pb.agra","currentState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","action":"FORWARD","nextState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","roles":["CEO","DEO"]}],"stateSla":null,"businesssServiceSla":2505424584,"previousStatus":null,"entity":null,"auditDetails":{"createdBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","lastModifiedBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","createdTime":1603267787589,"lastModifiedTime":1603267787589}}]};
      // let sampleAtDGDEState = {"ResponseInfo":null,"ProcessInstances":[{"id":"20ce3f3c-ba1f-41cc-9fe2-0c535170c1a7","tenantId":"pb.agra","businessService":"LAMS_NewLR_V2","businessId":"TL-APP-AGRA-2020-10-21-004168","action":"APPLIED","moduleName":"tl-services","state":{"auditDetails":null,"uuid":"7ba8cac7-731f-4057-9757-ed336e77626c","tenantId":"pb.agra","businessServiceId":"fdb95498-99fd-43b3-9ab7-d76f6ab6a36c","sla":null,"state":"PDDEEXAMINATION","applicationStatus":"PDDEEXAMINATION","docUploadRequired":true,"isStartState":false,"isTerminateState":false,"isStateUpdatable":null,"actions":[{"auditDetails":null,"uuid":"5a7314c7-e2e0-4570-a3af-db6dc9bb9e0b","tenantId":"pb.agra","currentState":"7ba8cac7-731f-4057-9757-ed336e77626c","action":"FORWARD","nextState":"6c6b6b49-3dff-4634-9a38-7a240644aa72","roles":["TL_DOC_VERIFIER"]},{"auditDetails":null,"uuid":"82e9a8cd-928d-49ca-a31b-66b07ebbaa87","tenantId":"pb.agra","currentState":"7ba8cac7-731f-4057-9757-ed336e77626c","action":"REJECT","nextState":"3fc18d5d-7e86-4994-9ce1-9a7c2c8adcf5","roles":["TL_DOC_VERIFIER"]},{"auditDetails":null,"uuid":"5a7314c7-e2e0-4570-a3af-db6dc9bb9e0b","tenantId":"pb.agra","currentState":"7ba8cac7-731f-4057-9757-ed336e77626c","action":"FORWARD","nextState":"6c6b6b49-3dff-4634-9a38-7a240644aa72","roles":["TL_DOC_VERIFIER"]},{"auditDetails":null,"uuid":"82e9a8cd-928d-49ca-a31b-66b07ebbaa87","tenantId":"pb.agra","currentState":"7ba8cac7-731f-4057-9757-ed336e77626c","action":"REJECT","nextState":"3fc18d5d-7e86-4994-9ce1-9a7c2c8adcf5","roles":["TL_DOC_VERIFIER"]},{"auditDetails":null,"uuid":"5a7314c7-e2e0-4570-a3af-db6dc9bb9e0b","tenantId":"pb.agra","currentState":"7ba8cac7-731f-4057-9757-ed336e77626c","action":"FORWARD","nextState":"6c6b6b49-3dff-4634-9a38-7a240644aa72","roles":["TL_DOC_VERIFIER"]},{"auditDetails":null,"uuid":"82e9a8cd-928d-49ca-a31b-66b07ebbaa87","tenantId":"pb.agra","currentState":"7ba8cac7-731f-4057-9757-ed336e77626c","action":"REJECT","nextState":"3fc18d5d-7e86-4994-9ce1-9a7c2c8adcf5","roles":["TL_DOC_VERIFIER"]}]},"comment":null,"documents":[{"id":"a51e02c1-3c53-43e0-904f-9636ea37db91","tenantId":"pb.agra","documentType":"OWNERPHOTO","fileStoreId":"d6d2b299-4648-4026-be22-744d87699d9e","documentUid":null,"auditDetails":{"createdBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","lastModifiedBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","createdTime":1603267882836,"lastModifiedTime":1603267882836}},{"id":"c4ed73d8-6ca5-4f41-9305-95c749c783f5","tenantId":"pb.agra","documentType":"AADHAARCARD","fileStoreId":"29fd4384-f96d-43a8-97e0-f11995f33ad7","documentUid":null,"auditDetails":{"createdBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","lastModifiedBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","createdTime":1603267882836,"lastModifiedTime":1603267882836}},{"id":"b7169301-dfb5-4ca5-a8ba-7458297168ff","tenantId":"pb.agra","documentType":"ELECTBILL","fileStoreId":"66f21eda-782e-47dd-82f4-e9a70fe84791","documentUid":null,"auditDetails":{"createdBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","lastModifiedBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","createdTime":1603267882836,"lastModifiedTime":1603267882836}}],"assigner":{"id":486,"userName":"TL_AGRA","name":"tl all permission agra","type":"EMPLOYEE","mobileNumber":"7022225111","emailId":"","roles":[{"id":null,"name":"Employee","code":"EMPLOYEE","tenantId":"pb.agra"},{"id":null,"name":"TL Counter Employee","code":"TL_CEMP","tenantId":"pb.agra"},{"id":null,"name":"TL doc verifier","code":"TL_DOC_VERIFIER","tenantId":"pb.agra"},{"id":null,"name":"TL Approver","code":"TL_APPROVER","tenantId":"pb.agra"},{"id":null,"name":"TL Field Inspector","code":"TL_FIELD_INSPECTOR","tenantId":"pb.agra"}],"tenantId":"pb.agra","uuid":"9d39d685-edbe-45a7-8dc5-1166a4236b98"},"assignes":null,"nextActions":[{"auditDetails":null,"uuid":"82e9a8cd-928d-49ca-a31b-66b07ebbaa87","tenantId":"pb.agra","currentState":"7ba8cac7-731f-4057-9757-ed336e77626c","action":"FORWARD","nextState":"3fc18d5d-7e86-4994-9ce1-9a7c2c8adcf5","roles":["TL_DOC_VERIFIER","PDDE"]},{"auditDetails":null,"uuid":"82e9a8cd-928d-49ca-a31b-66b07ebbaa87","tenantId":"pb.agra","currentState":"7ba8cac7-731f-4057-9757-ed336e77626c","action":"APPROVE","nextState":"3fc18d5d-7e86-4994-9ce1-9a7c2c8adcf5","roles":["TL_DOC_VERIFIER","PDDE"]},{"auditDetails":null,"uuid":"82e9a8cd-928d-49ca-a31b-66b07ebbaa87","tenantId":"pb.agra","currentState":"7ba8cac7-731f-4057-9757-ed336e77626c","action":"SENDBACK","nextState":"3fc18d5d-7e86-4994-9ce1-9a7c2c8adcf5","roles":["TL_DOC_VERIFIER","SENDBACK"]}],"stateSla":null,"businesssServiceSla":2505424584,"previousStatus":null,"entity":null,"auditDetails":{"createdBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","lastModifiedBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","createdTime":1603267882836,"lastModifiedTime":1603267882836}},{"id":"4bfcb3a8-1a65-4704-a52d-35f676e22b65","tenantId":"pb.agra","businessService":"LAMS_NewLR_V2","businessId":"TL-APP-AGRA-2020-10-21-004168","action":"APPLY","moduleName":"tl-services","state":{"auditDetails":null,"uuid":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","tenantId":"pb.agra","businessServiceId":"fdb95498-99fd-43b3-9ab7-d76f6ab6a36c","sla":null,"state":"APPLIED","applicationStatus":"APPLIED","docUploadRequired":false,"isStartState":true,"isTerminateState":false,"isStateUpdatable":null,"actions":[{"auditDetails":null,"uuid":"6c2f40b9-f31e-41b6-8c47-7de5f666c1dd","tenantId":"pb.agra","currentState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","action":"APPROVE","nextState":"7ba8cac7-731f-4057-9757-ed336e77626c","roles":["CEO","DEO"]},{"auditDetails":null,"uuid":"5d09730a-b267-4577-9ebe-36bddf1b41cf","tenantId":"pb.agra","currentState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","action":"FORWARD","nextState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","roles":["CEO","DEO"]}]},"comment":null,"documents":null,"assigner":{"id":486,"userName":"TL_AGRA","name":"tl all permission agra","type":"EMPLOYEE","mobileNumber":"7022225111","emailId":"","roles":[{"id":null,"name":"Employee","code":"EMPLOYEE","tenantId":"pb.agra"},{"id":null,"name":"TL Counter Employee","code":"TL_CEMP","tenantId":"pb.agra"},{"id":null,"name":"TL doc verifier","code":"TL_DOC_VERIFIER","tenantId":"pb.agra"},{"id":null,"name":"TL Approver","code":"TL_APPROVER","tenantId":"pb.agra"},{"id":null,"name":"TL Field Inspector","code":"TL_FIELD_INSPECTOR","tenantId":"pb.agra"}],"tenantId":"pb.agra","uuid":"9d39d685-edbe-45a7-8dc5-1166a4236b98"},"assignes":null,"nextActions":[{"auditDetails":null,"uuid":"6c2f40b9-f31e-41b6-8c47-7de5f666c1dd","tenantId":"pb.agra","currentState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","action":"APPROVE","nextState":"7ba8cac7-731f-4057-9757-ed336e77626c","roles":["CEO","DEO"]},{"auditDetails":null,"uuid":"5d09730a-b267-4577-9ebe-36bddf1b41cf","tenantId":"pb.agra","currentState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","action":"FORWARD","nextState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","roles":["CEO","DEO"]}],"stateSla":null,"businesssServiceSla":2505424584,"previousStatus":null,"entity":null,"auditDetails":{"createdBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","lastModifiedBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","createdTime":1603267787589,"lastModifiedTime":1603267787589}},{"id":"4bfcb3a8-1a65-4704-a52d-35f676e22b65","tenantId":"pb.agra","businessService":"LAMS_NewLR_V2","businessId":"TL-APP-AGRA-2020-10-21-004168","action":"DGDEEXAMINATION","moduleName":"tl-services","state":{"auditDetails":null,"uuid":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","tenantId":"pb.agra","businessServiceId":"fdb95498-99fd-43b3-9ab7-d76f6ab6a36c","sla":null,"state":"DGDEEXAMINATION","applicationStatus":"DGDEEXAMINATION","docUploadRequired":false,"isStartState":true,"isTerminateState":false,"isStateUpdatable":null,"actions":[{"auditDetails":null,"uuid":"6c2f40b9-f31e-41b6-8c47-7de5f666c1dd","tenantId":"pb.agra","currentState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","action":"APPROVE","nextState":"7ba8cac7-731f-4057-9757-ed336e77626c","roles":["DGDE"]},{"auditDetails":null,"uuid":"5d09730a-b267-4577-9ebe-36bddf1b41cf","tenantId":"pb.agra","currentState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","action":"FORWARD","nextState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","roles":["DGDE"]},{"auditDetails":null,"uuid":"5d09730a-b267-4577-9ebe-36bddf1b41cf","tenantId":"pb.agra","currentState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","action":"SENDBACK","nextState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","roles":["DGDE"]}]},"comment":null,"documents":null,"assigner":{"id":486,"userName":"TL_AGRA","name":"tl all permission agra","type":"EMPLOYEE","mobileNumber":"7022225111","emailId":"","roles":[{"id":null,"name":"Employee","code":"EMPLOYEE","tenantId":"pb.agra"},{"id":null,"name":"TL Counter Employee","code":"TL_CEMP","tenantId":"pb.agra"},{"id":null,"name":"TL doc verifier","code":"TL_DOC_VERIFIER","tenantId":"pb.agra"},{"id":null,"name":"TL Approver","code":"TL_APPROVER","tenantId":"pb.agra"},{"id":null,"name":"TL Field Inspector","code":"TL_FIELD_INSPECTOR","tenantId":"pb.agra"}],"tenantId":"pb.agra","uuid":"9d39d685-edbe-45a7-8dc5-1166a4236b98"},"assignes":null,"nextActions":[{"auditDetails":null,"uuid":"6c2f40b9-f31e-41b6-8c47-7de5f666c1dd","tenantId":"pb.agra","currentState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","action":"APPROVE","nextState":"7ba8cac7-731f-4057-9757-ed336e77626c","roles":["DGDE"]},{"auditDetails":null,"uuid":"5d09730a-b267-4577-9ebe-36bddf1b41cf","tenantId":"pb.agra","currentState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","action":"FORWARD","nextState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","roles":["DGDE"]},{"auditDetails":null,"uuid":"5d09730a-b267-4577-9ebe-36bddf1b41cf","tenantId":"pb.agra","currentState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","action":"SENDBACK","nextState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","roles":["DGDE"]}],"stateSla":null,"businesssServiceSla":2505424584,"previousStatus":null,"entity":null,"auditDetails":{"createdBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","lastModifiedBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","createdTime":1603267787589,"lastModifiedTime":1603267787589}}]};
      // let sampleAtMODState = {"ResponseInfo":null,"ProcessInstances":[{"id":"20ce3f3c-ba1f-41cc-9fe2-0c535170c1a7","tenantId":"pb.agra","businessService":"LAMS_NewLR_V2","businessId":"TL-APP-AGRA-2020-10-21-004168","action":"APPLIED","moduleName":"tl-services","state":{"auditDetails":null,"uuid":"7ba8cac7-731f-4057-9757-ed336e77626c","tenantId":"pb.agra","businessServiceId":"fdb95498-99fd-43b3-9ab7-d76f6ab6a36c","sla":null,"state":"PDDEEXAMINATION","applicationStatus":"PDDEEXAMINATION","docUploadRequired":true,"isStartState":false,"isTerminateState":false,"isStateUpdatable":null,"actions":[{"auditDetails":null,"uuid":"5a7314c7-e2e0-4570-a3af-db6dc9bb9e0b","tenantId":"pb.agra","currentState":"7ba8cac7-731f-4057-9757-ed336e77626c","action":"FORWARD","nextState":"6c6b6b49-3dff-4634-9a38-7a240644aa72","roles":["TL_DOC_VERIFIER"]},{"auditDetails":null,"uuid":"82e9a8cd-928d-49ca-a31b-66b07ebbaa87","tenantId":"pb.agra","currentState":"7ba8cac7-731f-4057-9757-ed336e77626c","action":"REJECT","nextState":"3fc18d5d-7e86-4994-9ce1-9a7c2c8adcf5","roles":["TL_DOC_VERIFIER"]},{"auditDetails":null,"uuid":"5a7314c7-e2e0-4570-a3af-db6dc9bb9e0b","tenantId":"pb.agra","currentState":"7ba8cac7-731f-4057-9757-ed336e77626c","action":"FORWARD","nextState":"6c6b6b49-3dff-4634-9a38-7a240644aa72","roles":["TL_DOC_VERIFIER"]},{"auditDetails":null,"uuid":"82e9a8cd-928d-49ca-a31b-66b07ebbaa87","tenantId":"pb.agra","currentState":"7ba8cac7-731f-4057-9757-ed336e77626c","action":"REJECT","nextState":"3fc18d5d-7e86-4994-9ce1-9a7c2c8adcf5","roles":["TL_DOC_VERIFIER"]},{"auditDetails":null,"uuid":"5a7314c7-e2e0-4570-a3af-db6dc9bb9e0b","tenantId":"pb.agra","currentState":"7ba8cac7-731f-4057-9757-ed336e77626c","action":"FORWARD","nextState":"6c6b6b49-3dff-4634-9a38-7a240644aa72","roles":["TL_DOC_VERIFIER"]},{"auditDetails":null,"uuid":"82e9a8cd-928d-49ca-a31b-66b07ebbaa87","tenantId":"pb.agra","currentState":"7ba8cac7-731f-4057-9757-ed336e77626c","action":"REJECT","nextState":"3fc18d5d-7e86-4994-9ce1-9a7c2c8adcf5","roles":["TL_DOC_VERIFIER"]}]},"comment":null,"documents":[{"id":"a51e02c1-3c53-43e0-904f-9636ea37db91","tenantId":"pb.agra","documentType":"OWNERPHOTO","fileStoreId":"d6d2b299-4648-4026-be22-744d87699d9e","documentUid":null,"auditDetails":{"createdBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","lastModifiedBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","createdTime":1603267882836,"lastModifiedTime":1603267882836}},{"id":"c4ed73d8-6ca5-4f41-9305-95c749c783f5","tenantId":"pb.agra","documentType":"AADHAARCARD","fileStoreId":"29fd4384-f96d-43a8-97e0-f11995f33ad7","documentUid":null,"auditDetails":{"createdBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","lastModifiedBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","createdTime":1603267882836,"lastModifiedTime":1603267882836}},{"id":"b7169301-dfb5-4ca5-a8ba-7458297168ff","tenantId":"pb.agra","documentType":"ELECTBILL","fileStoreId":"66f21eda-782e-47dd-82f4-e9a70fe84791","documentUid":null,"auditDetails":{"createdBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","lastModifiedBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","createdTime":1603267882836,"lastModifiedTime":1603267882836}}],"assigner":{"id":486,"userName":"TL_AGRA","name":"tl all permission agra","type":"EMPLOYEE","mobileNumber":"7022225111","emailId":"","roles":[{"id":null,"name":"Employee","code":"EMPLOYEE","tenantId":"pb.agra"},{"id":null,"name":"TL Counter Employee","code":"TL_CEMP","tenantId":"pb.agra"},{"id":null,"name":"TL doc verifier","code":"TL_DOC_VERIFIER","tenantId":"pb.agra"},{"id":null,"name":"TL Approver","code":"TL_APPROVER","tenantId":"pb.agra"},{"id":null,"name":"TL Field Inspector","code":"TL_FIELD_INSPECTOR","tenantId":"pb.agra"}],"tenantId":"pb.agra","uuid":"9d39d685-edbe-45a7-8dc5-1166a4236b98"},"assignes":null,"nextActions":[{"auditDetails":null,"uuid":"82e9a8cd-928d-49ca-a31b-66b07ebbaa87","tenantId":"pb.agra","currentState":"7ba8cac7-731f-4057-9757-ed336e77626c","action":"FORWARD","nextState":"3fc18d5d-7e86-4994-9ce1-9a7c2c8adcf5","roles":["TL_DOC_VERIFIER","PDDE"]},{"auditDetails":null,"uuid":"82e9a8cd-928d-49ca-a31b-66b07ebbaa87","tenantId":"pb.agra","currentState":"7ba8cac7-731f-4057-9757-ed336e77626c","action":"APPROVE","nextState":"3fc18d5d-7e86-4994-9ce1-9a7c2c8adcf5","roles":["TL_DOC_VERIFIER","PDDE"]}],"stateSla":null,"businesssServiceSla":2505424584,"previousStatus":null,"entity":null,"auditDetails":{"createdBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","lastModifiedBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","createdTime":1603267882836,"lastModifiedTime":1603267882836}},{"id":"4bfcb3a8-1a65-4704-a52d-35f676e22b65","tenantId":"pb.agra","businessService":"LAMS_NewLR_V2","businessId":"TL-APP-AGRA-2020-10-21-004168","action":"APPLY","moduleName":"tl-services","state":{"auditDetails":null,"uuid":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","tenantId":"pb.agra","businessServiceId":"fdb95498-99fd-43b3-9ab7-d76f6ab6a36c","sla":null,"state":"APPLIED","applicationStatus":"APPLIED","docUploadRequired":false,"isStartState":true,"isTerminateState":false,"isStateUpdatable":null,"actions":[{"auditDetails":null,"uuid":"6c2f40b9-f31e-41b6-8c47-7de5f666c1dd","tenantId":"pb.agra","currentState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","action":"APPROVE","nextState":"7ba8cac7-731f-4057-9757-ed336e77626c","roles":["CEO","DEO"]},{"auditDetails":null,"uuid":"5d09730a-b267-4577-9ebe-36bddf1b41cf","tenantId":"pb.agra","currentState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","action":"FORWARD","nextState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","roles":["CEO","DEO"]}]},"comment":null,"documents":null,"assigner":{"id":486,"userName":"TL_AGRA","name":"tl all permission agra","type":"EMPLOYEE","mobileNumber":"7022225111","emailId":"","roles":[{"id":null,"name":"Employee","code":"EMPLOYEE","tenantId":"pb.agra"},{"id":null,"name":"TL Counter Employee","code":"TL_CEMP","tenantId":"pb.agra"},{"id":null,"name":"TL doc verifier","code":"TL_DOC_VERIFIER","tenantId":"pb.agra"},{"id":null,"name":"TL Approver","code":"TL_APPROVER","tenantId":"pb.agra"},{"id":null,"name":"TL Field Inspector","code":"TL_FIELD_INSPECTOR","tenantId":"pb.agra"}],"tenantId":"pb.agra","uuid":"9d39d685-edbe-45a7-8dc5-1166a4236b98"},"assignes":null,"nextActions":[{"auditDetails":null,"uuid":"6c2f40b9-f31e-41b6-8c47-7de5f666c1dd","tenantId":"pb.agra","currentState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","action":"APPROVE","nextState":"7ba8cac7-731f-4057-9757-ed336e77626c","roles":["CEO","DEO"]},{"auditDetails":null,"uuid":"5d09730a-b267-4577-9ebe-36bddf1b41cf","tenantId":"pb.agra","currentState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","action":"FORWARD","nextState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","roles":["CEO","DEO"]}],"stateSla":null,"businesssServiceSla":2505424584,"previousStatus":null,"entity":null,"auditDetails":{"createdBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","lastModifiedBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","createdTime":1603267787589,"lastModifiedTime":1603267787589}},{"id":"4bfcb3a8-1a65-4704-a52d-35f676e22b65","tenantId":"pb.agra","businessService":"LAMS_NewLR_V2","businessId":"TL-APP-AGRA-2020-10-21-004168","action":"DGDEEXAMINATION","moduleName":"tl-services","state":{"auditDetails":null,"uuid":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","tenantId":"pb.agra","businessServiceId":"fdb95498-99fd-43b3-9ab7-d76f6ab6a36c","sla":null,"state":"DGDEEXAMINATION","applicationStatus":"DGDEEXAMINATION","docUploadRequired":false,"isStartState":true,"isTerminateState":false,"isStateUpdatable":null,"actions":[{"auditDetails":null,"uuid":"6c2f40b9-f31e-41b6-8c47-7de5f666c1dd","tenantId":"pb.agra","currentState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","action":"APPROVE","nextState":"7ba8cac7-731f-4057-9757-ed336e77626c","roles":["DGDE"]},{"auditDetails":null,"uuid":"5d09730a-b267-4577-9ebe-36bddf1b41cf","tenantId":"pb.agra","currentState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","action":"FORWARD","nextState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","roles":["DGDE"]},{"auditDetails":null,"uuid":"5d09730a-b267-4577-9ebe-36bddf1b41cf","tenantId":"pb.agra","currentState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","action":"SENDBACK","nextState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","roles":["DGDE"]}]},"comment":null,"documents":null,"assigner":{"id":486,"userName":"TL_AGRA","name":"tl all permission agra","type":"EMPLOYEE","mobileNumber":"7022225111","emailId":"","roles":[{"id":null,"name":"Employee","code":"EMPLOYEE","tenantId":"pb.agra"},{"id":null,"name":"TL Counter Employee","code":"TL_CEMP","tenantId":"pb.agra"},{"id":null,"name":"TL doc verifier","code":"TL_DOC_VERIFIER","tenantId":"pb.agra"},{"id":null,"name":"TL Approver","code":"TL_APPROVER","tenantId":"pb.agra"},{"id":null,"name":"TL Field Inspector","code":"TL_FIELD_INSPECTOR","tenantId":"pb.agra"}],"tenantId":"pb.agra","uuid":"9d39d685-edbe-45a7-8dc5-1166a4236b98"},"assignes":null,"nextActions":[{"auditDetails":null,"uuid":"6c2f40b9-f31e-41b6-8c47-7de5f666c1dd","tenantId":"pb.agra","currentState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","action":"APPROVE","nextState":"7ba8cac7-731f-4057-9757-ed336e77626c","roles":["DGDE"]},{"auditDetails":null,"uuid":"5d09730a-b267-4577-9ebe-36bddf1b41cf","tenantId":"pb.agra","currentState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","action":"FORWARD","nextState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","roles":["DGDE"]},{"auditDetails":null,"uuid":"5d09730a-b267-4577-9ebe-36bddf1b41cf","tenantId":"pb.agra","currentState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","action":"SENDBACK","nextState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","roles":["DGDE"]}],"stateSla":null,"businesssServiceSla":2505424584,"previousStatus":null,"entity":null,"auditDetails":{"createdBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","lastModifiedBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","createdTime":1603267787589,"lastModifiedTime":1603267787589}},{"id":"4bfcb3a8-1a65-4704-a52d-35f676e22b65","tenantId":"pb.agra","businessService":"LAMS_NewLR_V2","businessId":"TL-APP-AGRA-2020-10-21-004168","action":"MODEXAMINATION","moduleName":"tl-services","state":{"auditDetails":null,"uuid":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","tenantId":"pb.agra","businessServiceId":"fdb95498-99fd-43b3-9ab7-d76f6ab6a36c","sla":null,"state":"MODEXAMINATION","applicationStatus":"MODEXAMINATION","docUploadRequired":false,"isStartState":true,"isTerminateState":false,"isStateUpdatable":null,"actions":[{"auditDetails":null,"uuid":"6c2f40b9-f31e-41b6-8c47-7de5f666c1dd","tenantId":"pb.agra","currentState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","action":"APPROVE","nextState":"7ba8cac7-731f-4057-9757-ed336e77626c","roles":["MOD"]},{"auditDetails":null,"uuid":"5d09730a-b267-4577-9ebe-36bddf1b41cf","tenantId":"pb.agra","currentState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","action":"FORWARD","nextState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","roles":["MOD"]},{"auditDetails":null,"uuid":"5d09730a-b267-4577-9ebe-36bddf1b41cf","tenantId":"pb.agra","currentState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","action":"SENDBACK","nextState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","roles":["MOD"]}]},"comment":null,"documents":null,"assigner":{"id":486,"userName":"TL_AGRA","name":"tl all permission agra","type":"EMPLOYEE","mobileNumber":"7022225111","emailId":"","roles":[{"id":null,"name":"Employee","code":"EMPLOYEE","tenantId":"pb.agra"},{"id":null,"name":"TL Counter Employee","code":"TL_CEMP","tenantId":"pb.agra"},{"id":null,"name":"TL doc verifier","code":"TL_DOC_VERIFIER","tenantId":"pb.agra"},{"id":null,"name":"TL Approver","code":"TL_APPROVER","tenantId":"pb.agra"},{"id":null,"name":"TL Field Inspector","code":"TL_FIELD_INSPECTOR","tenantId":"pb.agra"}],"tenantId":"pb.agra","uuid":"9d39d685-edbe-45a7-8dc5-1166a4236b98"},"assignes":null,"nextActions":[{"auditDetails":null,"uuid":"6c2f40b9-f31e-41b6-8c47-7de5f666c1dd","tenantId":"pb.agra","currentState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","action":"APPROVE","nextState":"7ba8cac7-731f-4057-9757-ed336e77626c","roles":["MOD"]},{"auditDetails":null,"uuid":"5d09730a-b267-4577-9ebe-36bddf1b41cf","tenantId":"pb.agra","currentState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","action":"FORWARD","nextState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","roles":["MOD"]},{"auditDetails":null,"uuid":"5d09730a-b267-4577-9ebe-36bddf1b41cf","tenantId":"pb.agra","currentState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","action":"SENDBACK","nextState":"27427134-ffef-416b-9e1b-66d4c4fa7bc1","roles":["MOD"]}],"stateSla":null,"businesssServiceSla":2505424584,"previousStatus":null,"entity":null,"auditDetails":{"createdBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","lastModifiedBy":"9d39d685-edbe-45a7-8dc5-1166a4236b98","createdTime":1603267787589,"lastModifiedTime":1603267787589}}]};
      // const testAt = getQueryArg(window.location.href, "testAt");
      // let payload = null;
      // switch(testAt)
      // {
      //   case "CEODEO": payload = sampleAtCEODEOState; break;
      //   case "PDDE": payload = sampleAtPDDEState; break;
      //   case "DGDE" : payload = sampleAtDGDEState; break;
      //   case "MOD" : payload = sampleAtMODState; break;
      //   case "approved" :  payload = sampleAtApprovedState;break;
      // }

      if (payload && payload.ProcessInstances.length > 0) {
        const processInstances = orderWfProcessInstances(
          payload.ProcessInstances
        );
        console.log("Check now",processInstances);
        addWflowFileUrl(processInstances, prepareFinalObject);
      } else {
        toggleSnackbar(
          true,
          {
            labelName: "Workflow returned empty object !",
            labelKey: "WRR_WORKFLOW_ERROR"
          },
          "error"
        );
      }
    } catch (e) {
      toggleSnackbar(
        true,
        {
          labelName: "Workflow returned empty object !",
          labelKey: "WRR_WORKFLOW_ERROR"
        },
        "error"
      );
    }
  };

  onClose = () => {
    this.setState({
      open: false
    });
  };

  getPurposeString = action => {
    switch (action) {
      case "APPLY":
        return "purpose=apply&status=success";
      case "FORWARD":
      case "RESUBMIT":
        return "purpose=forward&status=success";
      case "MARK":
        return "purpose=mark&status=success";
      case "VERIFY":
        return "purpose=verify&status=success";
      case "REJECT":
        return "purpose=reject&status=rejected";
      case "CANCEL":
        return "purpose=application&status=cancelled";
      case "APPROVE":
        return "purpose=approve&status=success";
      case "SENDBACK":
        return "purpose=sendback&status=success";
      case "REFER":
        return "purpose=refer&status=success";
      case "SENDBACKTOCITIZEN":
        return "purpose=sendbacktocitizen&status=success";
      case "SUBMIT_APPLICATION":
        return "purpose=apply&status=success";
      case "RESUBMIT_APPLICATION":
        return "purpose=forward&status=success";
      case "SEND_BACK_TO_CITIZEN":
        return "purpose=sendback&status=success";
      case "VERIFY_AND_FORWARD":
        return "purpose=forward&status=success";
      case "SEND_BACK_FOR_DOCUMENT_VERIFICATION":
      case "SEND_BACK_FOR_FIELD_INSPECTION":
        return "purpose=sendback&status=success";
      case "APPROVE_FOR_CONNECTION":
        return "purpose=approve&status=success";
      case "ACTIVATE_CONNECTION":
        return "purpose=activate&status=success";
      case "REVOCATE":
        return "purpose=application&status=revocated"
    }
  };

  paymentPage = async () => {
    alert("Redirect to payment");
  } 

  wfUpdate = async label => {
    let {
      toggleSnackbar,
      toggleSpinner,
      preparedFinalObject,
      dataPath,
      moduleName,
      updateUrl,
      beforeSubmitHook
    } = this.props;

    //Added toggleSpinner for Search
    toggleSpinner();
    const tenant = getQueryArg(window.location.href, "tenantId");
    let data = get(preparedFinalObject, dataPath, []);
    if (moduleName === "LAMS_NewLR_CEO_V3" || moduleName === "LAMS_NewLR_DEO_V3") {
      if (getQueryArg(window.location.href, "edited")) {
        const removedDocs = get(
          preparedFinalObject,
          "lamsStore.removedDocs",
          []
        );
        if (data[0] && data[0].commencementDate) {
          data[0].commencementDate = convertDateToEpoch(
            data[0].commencementDate,
            "dayend"
          );
        }
        let owners = get(data[0], "tradeLicenseDetail.owners");
        owners = (owners && this.convertOwnerDobToEpoch(owners)) || [];
        set(data[0], "tradeLicenseDetail.owners", owners);
        set(data[0], "tradeLicenseDetail.applicationDocuments", [
          ...get(data[0], "tradeLicenseDetail.applicationDocuments", []),
          ...removedDocs
        ]);

        // Accessories issue fix by Gyan
        let accessories = get(data[0], "tradeLicenseDetail.accessories");
        let tradeUnits = get(data[0], "tradeLicenseDetail.tradeUnits");
        set(
          data[0],
          "tradeLicenseDetail.tradeUnits",
          getMultiUnits(tradeUnits)
        );
        set(
          data[0],
          "tradeLicenseDetail.accessories",
          getMultiUnits(accessories)
        );
      }
      
    }
    if (dataPath === "BPA") {
      data.workflow.assignes = [];
      if (data.workflow.assignee) {
        data.workflow.assignes = data.workflow.assignee
      }
      if (data.workflow && data.workflow.varificationDocuments) {
        for (let i = 0; i < data.workflow.varificationDocuments.length; i++) {
          data.workflow.varificationDocuments[i].fileStore = data.workflow.varificationDocuments[i].fileStoreId
        }
      }
      if(get(data, "workflow.comment")) {
        data.workflow.comments = get(data, "workflow.comment");
      }
    }
    if (dataPath == 'Property') {
      if (data.workflow && data.workflow.wfDocuments) {
        data.workflow.documents = data.workflow.wfDocuments;
      }
    }

    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    if (moduleName === "NewWS1" || moduleName === "NewSW1") {
      data = data[0];
      data.assignees = [];
      if (data.assignee) {
        data.assignee.forEach(assigne => {
          data.assignees.push({
            uuid: assigne
          })
        })
      }
      data.processInstance = {
        documents: data.wfDocuments,
        assignes: data.assignees,
        comment: data.comment,
        action: data.action
      }
      data.waterSource = data.waterSource + "." + data.waterSubSource;
    }

    if (moduleName === "NewSW1") {
      dataPath = "SewerageConnection";
    }
        
    try {     
      if (beforeSubmitHook) {
        data = beforeSubmitHook(data);
      }
      const payload = await httpRequest("post", updateUrl, "", [], {
        ["booking"]: data[0]  //tobechanged to [dataPath]: data  if required
      });    
      this.setState({
        open: false
      });

      if (payload) {
        let path = "";

        if (moduleName == "PT.CREATE") {
          this.props.setRoute(`/pt-mutation/acknowledgement?${this.getPurposeString(
            label
          )}&moduleName=${moduleName}&applicationNumber=${get(payload, 'Properties[0].acknowldgementNumber', "")}&tenantId=${get(payload, 'Properties[0].tenantId', "")}`);
          return;
        }
        if (moduleName == "ASMT") {
          this.props.setRoute(`/pt-mutation/acknowledgement?${this.getPurposeString(
            label
          )}&moduleName=${moduleName}&applicationNumber=${get(payload, 'Assessments[0].assessmentNumber', "")}&tenantId=${get(payload, 'Assessments[0].tenantId', "")}`);
          return;
        }

        
        if (moduleName === "LAMS_NewLR_CEO_V3" || moduleName === "LAMS_NewLR_DEO_V3") path = "Licenses[0].licenseNumber";
        else if (moduleName === "FIRENOC") path = "FireNOCs[0].fireNOCNumber";
        else path = "Licenses[0].licenseNumber";
        const licenseNumber = get(payload, path, "");
        // window.location.href = `acknowledgement?${this.getPurposeString(
        //   label
        // )}&applicationNumber=${applicationNumber}&tenantId=${tenant}&secondNumber=${licenseNumber}&moduleName=${moduleName}`;
        this.props.setRoute(
          `/lams-common/updateAcknowledgement?${this.getPurposeString(
            label
          )}&applicationNumber=${applicationNumber}&tenantId=${tenant}&moduleName=${moduleName}`
        ); 
        if (moduleName === "NewWS1" || moduleName === "NewSW1") {
          window.location.href = `acknowledgement?${this.getPurposeString(label)}&applicationNumber=${applicationNumber}&tenantId=${tenant}`;
        }

      }
      //toggleSpinner();
    } catch (e) {
      toggleSpinner();
      if (moduleName === "BPA") {
        toggleSnackbar(
          true,
          {
            labelName: "Documents Required",
            labelKey: e.message
          },
          "error"
        );
      } else {
        toggleSnackbar(
          true,
          {
            labelName: "Please fill all the mandatory fields!",
            labelKey: e.message
          },
          "error"
        );
      }
    }
  };

  createWorkFLow = async (label, isDocRequired) => {
    //alert("Creating workflow");
    const { toggleSnackbar, dataPath, preparedFinalObject } = this.props;
    let data = {};

    if (dataPath == "BPA" || dataPath == "Assessment" || dataPath == "Property" || dataPath === "Noc") {

      data = get(preparedFinalObject, dataPath, {})
    } else {
      data = get(preparedFinalObject, dataPath, [])
      data = data[0];
    }
    //setting the action to send in RequestInfo
    let appendToPath = ""
    if (dataPath === "FireNOCs") {
      appendToPath = "fireNOCDetails."
    } else if (dataPath === "Assessment" || dataPath === "Property" || dataPath === "BPA" || dataPath === "Noc") {
      appendToPath = "workflow."
    } else {
      appendToPath = ""
    }


    set(data, `${appendToPath}action`, label);

    if (isDocRequired) {
      let documents = get(data, "wfDocuments");
      if( dataPath === "BPA") {
        documents = get(data, "workflow.varificationDocuments");
      }
      if (documents && documents.length > 0) {
        this.wfUpdate(label);
      } else {
        toggleSnackbar(
          true,
          { labelName: "Please Upload file !", labelKey: "ERR_UPLOAD_FILE" },
          "error"
        );
      }
    } else {
      const { chb } = preparedFinalObject;
      const status = chb.booking[0].status;
    
      //alert("Status checko "+status);
      switch(status){
        case "APPLIED":
        case "DOC_VERIFICATION":
        case "PENDING_APPROVAL":
          this.wfUpdate(label);
          break;
        case "PENDING_PAYMENT":
          this.paymentPage(label);
          break;
        case "CITIZEN-REVIEW":
          this.editApplication();
          break;  
        default :
          this.wfUpdate(label);
      }
    }
  };

  editApplication = () => {
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    const tenant = getQueryArg(window.location.href, "tenantId");
    this.props.setRoute(
      `/lams-common/newApplication?&applicationNumber=${applicationNumber}&tenantId=${tenant}&purpose=CITIZEN-REVIEW&action=edit`
    ); 
  }

  getRedirectUrl = (action, businessId, moduleName) => {
    const isAlreadyEdited = getQueryArg(window.location.href, "edited");
    const tenant = getQueryArg(window.location.href, "tenantId");
    const { ProcessInstances } = this.props;
    let applicationStatus;
    if (ProcessInstances && ProcessInstances.length > 0) {
      applicationStatus = get(ProcessInstances[ProcessInstances.length - 1], "state.applicationStatus");
    }
    let baseUrl = "";
    let bservice = "";
    if (moduleName === "FIRENOC") {
      baseUrl = "fire-noc";
      bservice = "FIRENOC";
    } else if (moduleName === "BPA" || moduleName === "BPA_LOW" || moduleName === "BPA_OC") {
      baseUrl = "egov-bpa";
      if (moduleName === "BPA") {
        bservice = ((applicationStatus == "PENDING_APPL_FEE") ? "BPA.NC_APP_FEE" : "BPA.NC_SAN_FEE");
      } else if (moduleName === "BPA_OC") {
        bservice = ((applicationStatus == "PENDING_APPL_FEE") ? "BPA.NC_OC_APP_FEE" : "BPA.NC_OC_SAN_FEE");
      } else {
        bservice = "BPA.LOW_RISK_PERMIT_FEE"
      }
    } else if (moduleName === "NewWS1" || moduleName === "NewSW1") {
      baseUrl = "wns"
      if (moduleName === "NewWS1") {
        bservice = "WS.ONE_TIME_FEE"
      } else {
        bservice = "SW.ONE_TIME_FEE"
      }
    } else if (moduleName === "PT") {
      bservice = "PT"
    } else if (moduleName === "PT.MUTATION") {
      bservice = "PT.MUTATION"
    } else {
      baseUrl = process.env.REACT_APP_NAME === "Citizen" ? "tradelicense-citizen" : "tradelicence";
      bservice = "TL"
    }
    const payUrl = `/egov-common/pay?consumerCode=${businessId}&tenantId=${tenant}`;

    baseUrl = "lams-common/newApplication";
    let redirectUrl = "";
    switch (action) {
      // case "PAY": return bservice ? `${payUrl}&businessService=${bservice}` : payUrl;
      // case "EDIT": return isAlreadyEdited
      //   ? `/${baseUrl}/apply?applicationNumber=${businessId}&tenantId=${tenant}&action=edit&edited=true`
      //   : `/${baseUrl}/apply?applicationNumber=${businessId}&tenantId=${tenant}&action=edit`;
      case "APPLY":
        redirectUrl =  `/${baseUrl}?applicationNumber=${businessId}&tenantId=${tenant}&action=edit&edited=true`;
    }
    return redirectUrl;
  };


  getHeaderName = action => {
    return {
      labelName: `${action} Application`,
      labelKey: `WF_${action}_APPLICATION`
    };
  };

  getEmployeeRoles = (nextAction, currentAction, moduleName) => {
    const businessServiceData = JSON.parse(
      localStorageGet("businessServiceData")
    );
    //alert("Module Name is "+moduleName);
    const data = find(businessServiceData, { businessService: moduleName });
    let roles = [];
    if (nextAction === currentAction) {
      data.states &&
        data.states.forEach(state => {
          state.actions &&
            state.actions.forEach(action => {
              roles = [...roles, ...action.roles];
            });
        });
    } else {
      const states = find(data.states, { uuid: nextAction });
      states &&
        states.actions &&
        states.actions.forEach(action => {
          roles = [...roles, ...action.roles];
        });
    }
    roles = [...new Set(roles)];
    roles.indexOf("*") > -1 && roles.splice(roles.indexOf("*"), 1);
    return roles.toString();
  };

  checkIfTerminatedState = (nextStateUUID, moduleName) => {

    try{
      //alert(nextStateUUID+" and "+ moduleName);
      const businessServiceData = JSON.parse(
        localStorageGet("businessServiceData")
      );
      const tenantId = getQueryArg(
        window.location.href,
        "tenantId"
      );

      const data = businessServiceData && businessServiceData.length > 0 ? find(businessServiceData, { businessService: moduleName, tenantId:tenantId }) : [];

      // const nextState = data && data.length > 0 find(data.states, { uuid: nextStateUUID });

      const isLastState = data ? find(data.states, { uuid: nextStateUUID }).isTerminateState : false;
      return isLastState;
    }
      catch(e){
        console.error(e);
        //location.reload();
      }
  };

  checkIfDocumentRequired = (nextStateUUID, moduleName) => {
    try
    {
      const businessServiceData = JSON.parse(
        localStorageGet("businessServiceData")
      );
      const tenantId = getQueryArg(
        window.location.href,
        "tenantId"
      );
      const data = find(businessServiceData, { businessService: moduleName, tenantId:tenantId });
      const nextState = find(data.states, { uuid: nextStateUUID });
      return nextState.docUploadRequired;
    }
    catch(e)
    {
      console.error(e);
      //location.reload();
    }
  };

  getActionIfEditable = (status, businessId, moduleName) => {
    try{
      const businessServiceData = JSON.parse(
        localStorageGet("businessServiceData")
      );
      const data = find(businessServiceData, { businessService: moduleName });
      const state = find(data.states, { applicationStatus: status });
      //console.log("data.states ",data.states, status);
      let actions = [];
      state.actions &&
        state.actions.forEach(item => {
          actions = [...actions, ...item.roles];
        });
      const userRoles = JSON.parse(getUserInfo()).roles;
      const roleIndex = userRoles.findIndex(item => {
        if (actions.indexOf(item.code) > -1) return true;
      });

      let editAction = {};
      return editAction;

      //tobechanged
      if (status === "CITIZEN-REVIEW" && state.isStateUpdatable && actions.length > 0 && roleIndex > -1) {
        editAction = {
          buttonLabel: "EDIT",
          moduleName: moduleName,
          tenantId: state.tenantId,
          isLast: true,
          buttonUrl: this.getRedirectUrl("EDIT", businessId, moduleName)
        };
      }
      return editAction;
    }
    catch(e){
      console.error(e);
      //location.reload();
    }
  };

  prepareWorkflowContract = (data, moduleName) => {
    const {
      getRedirectUrl,
      getHeaderName,
      checkIfTerminatedState,
      getActionIfEditable,
      checkIfDocumentRequired,
      getEmployeeRoles
    } = this;
    let businessService = moduleName === data[0].businessService ? moduleName : data[0].businessService;
    let businessId = get(data[data.length - 1], "businessId");
    let filteredActions = [];

    filteredActions = get(data[data.length - 1], "nextActions", []).filter(
      item => item.action != "ADHOC"
    );
    let applicationStatus = get(
      data[data.length - 1],
      "state.applicationStatus"
    );
    let actions = orderBy(filteredActions, ["action"], ["desc"]);

    actions = actions.map(item => {
      return {
        buttonLabel: item.action,
        moduleName: data[data.length - 1].businessService,
        isLast: item.action === "PAY" ? true : false,
        buttonUrl: getRedirectUrl(item.action, businessId, businessService),
        dialogHeader: getHeaderName(item.action),
        showEmployeeList: (businessService === "NewWS1" || businessService === "NewSW1") ? !checkIfTerminatedState(item.nextState, businessService) && item.action !== "SEND_BACK_TO_CITIZEN" && item.action !== "RESUBMIT_APPLICATION" : !checkIfTerminatedState(item.nextState, businessService) && item.action !== "SENDBACKTOCITIZEN",
        roles: getEmployeeRoles(item.nextState, item.currentState, businessService),
        isDocRequired: checkIfDocumentRequired(item.nextState, businessService)
      };
    });
    actions = actions.filter(item => item.buttonLabel !== 'INITIATE');
    let editAction = getActionIfEditable(
      applicationStatus,
      businessId,
      businessService
    );
    editAction.buttonLabel && actions.push(editAction);
    return actions;
  };

  convertOwnerDobToEpoch = owners => {
    let updatedOwners =
      owners &&
      owners
        .map(owner => {
          return {
            ...owner,
            dob:
              owner && owner !== null && convertDateToEpoch(owner.dob, "dayend")
          };
        })
        .filter(item => item && item !== null);
    return updatedOwners;
  };

  render() {
    const {
      ProcessInstances,
      preparedFinalObject,
      dataPath,
      //moduleName,
      screenConfiguration
    } = this.props;
    //const {workflow} = preparedFinalObject;
    //const {ProcessInstances} = workflow;
    console.log("ProcessItance is ",ProcessInstances, preparedFinalObject,screenConfiguration);

    let moduleName = get(screenConfiguration, "preparedFinalObject.chb.booking[0].workflowCode");

    const workflowContract =
      ProcessInstances &&
      ProcessInstances.length > 0 &&
      this.prepareWorkflowContract(ProcessInstances, moduleName);
    let showFooter = true;

    console.log("Hey see ",moduleName,dataPath,workflowContract, workflowContract);

    // if (moduleName === 'NewWS1' || moduleName === 'NewSW1') {
    //   showFooter = true;
    // } else if (moduleName == "PT.CREATE") {
    //   showFooter = true;
    // } else if (moduleName == "ASMT") {
    //   showFooter = true;
    // } else if (moduleName == "PT.MUTATION") {
    //   showFooter = true;
    // } else {
    //   showFooter = process.env.REACT_APP_NAME === "Citizen" ? true : true;
    // }
    // if (moduleName === 'BPA' || moduleName === 'BPA_LOW' || moduleName === 'BPA_OC') {
    //   showFooter = process.env.REACT_APP_NAME === "Citizen" ? false : true;
    // }
    //console.log(" Check the values here.",ProcessInstances[0].documents[0].title, moduleName, showFooter);
    return (
      <div>
        {ProcessInstances && ProcessInstances.length > 0 && (
          <TaskStatusContainer ProcessInstances={ProcessInstances} moduleName={moduleName}/>
        )}
        {showFooter &&
          <Footer
            handleFieldChange={prepareFinalObject}
            variant={"contained"}
            color={"primary"}
            onDialogButtonClick={this.createWorkFLow}
            contractData={workflowContract}
            dataPath={dataPath}
            moduleName={moduleName}
          />}
      </div>
    ); 
  }  
}

const doRender = ()=>{

}

const mapStateToProps = state => {
  const { screenConfiguration } = state;
  const { preparedFinalObject } = screenConfiguration;
  const { workflow } = preparedFinalObject;
  const { ProcessInstances } = workflow || [];
  return { ProcessInstances, preparedFinalObject, screenConfiguration};
};

const mapDispacthToProps = dispatch => {
  return {
    prepareFinalObject: (path, value) =>
      dispatch(prepareFinalObject(path, value)),
    toggleSnackbar: (open, message, variant) =>
      dispatch(toggleSnackbar(open, message, variant)),
    toggleSpinner: () =>
      dispatch(toggleSpinner()),
    setRoute: route => dispatch(setRoute(route))
  };
};

export default connect(
  mapStateToProps,
  mapDispacthToProps
)(WorkFlowContainer);