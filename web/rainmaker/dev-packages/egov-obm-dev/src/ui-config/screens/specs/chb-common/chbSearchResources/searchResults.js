import React from "react";
import {
  sortByEpoch,
  getEpochForDate,
  getTextToLocalMapping
} from "../../utils";
//import { download, downloadReceiptFromFilestoreID, downloadChallan } from "egov-common/ui-utils/commons";
import {  getLocaleLabels} from "egov-ui-framework/ui-utils/commons";
//import {downloadCert} from "../../utils"
import store from "ui-redux/store";
import {
  prepareFinalObject,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {showHideConfirmationPopup} from "./chbSearchCard";

export const searchResults = {
  uiFramework: "custom-molecules",
  componentPath: "Table",
  visible: false,
  props: {
    columns: [
      // {
      //   labelName: "Bill No.",
      //   labelKey: "ABG_COMMON_TABLE_COL_BILL_NO",
      //   options: {
      //     filter: false,
      //     customBodyRender: (value, tableMeta, updateValue) => (
      //       <a href="javascript:void(0)"
      //         onClick={() => {
      //           const receiptQueryString = [
      //             {
      //               key: 'challanNo',
      //               value: tableMeta.rowData[1]
      //             },
      //             { key: 'tenantId', value: tableMeta.rowData[10] }];
      //             downloadChallan(receiptQueryString,"download");
      //          // downloadBill(tableMeta.rowData[1], tableMeta.rowData[10], tableMeta.rowData[9],tableMeta.rowData[12]);
      //         }}
      //       >
      //         {value}
      //       </a>
      //     )
      //   }
      // },
      {
        labelName: "Id",
        labelKey: "OBM_TABLE_ID",
        options: {
          display: false,
          viewColumns  :false
        }
      },
      {
        labelName: "tenantId",
        labelKey: "TENANT_ID",
        options: {
          display: false,
          viewColumns  :false
        }
      },
      {
        labelName: "Name",
        labelKey: "CORE_COMMON_NAME"
      },
      {
        labelName: "Address",
        labelKey: "OBM_ADDRESS",
      },
      {
        labelName: "Geolocation",
        labelKey: "OBM_GEOLOCATION",
        options: {
          filter: false,
          customBodyRender: (value, tableMeta, updateValue) => (
            <a href={`https://www.google.com/maps?q=${value}`} target="_blank" >
              {getLocaleLabels("OBM_LOCATE_ON_MAP","OBM_LOCATE_ON_MAP")}
            </a>
          )
        }
      },
      // {
      //   labelName: "Price",
      //   labelKey: "OBM_PRICE",
      // },
      // {
      //   labelName: "Availability",
      //   labelKey: "OBM_AVAILABILITY"
      // },
      // {
      //   labelName: "Status",
      //   labelKey: "ABG_COMMON_TABLE_COL_STATUS",
      //   options:{
      //     filter: false,
      //     customBodyRender: value => (
      //       <span>
      //          {getLocaleLabels(value.toUpperCase(),value.toUpperCase())}
      //       </span>
      //     )
      //   }
      // },
      // {
      //   labelName: "Action",
      //   labelKey: "ABG_COMMON_TABLE_COL_ACTION",
      //   options: {
      //     filter: false,
      //     customBodyRender: (value, tableMeta) => value === "PAY" ? (tableMeta.rowData[4] > 0 ? getActionButton(value, tableMeta):(tableMeta.rowData[4] <= 0 && tableMeta.rowData[13] ? getActionButton(value, tableMeta) : "")) : getActionButton(value, tableMeta)
      //   }
      // },
      {
        labelName: "OBM_ACTION",
        labelKey: "OBM_ACTION",
        options: {
          display: true,
          viewColumns  :true,
          customBodyRender: (value, tableMeta) => getViewButton(value, tableMeta)
        }
      }
    ],
    title: {
      labelName: "Search Results for Birth",
      labelKey: "OBM_SEARCH_TABLE_HEADER"
    },
    rows : "",
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      rowsPerPageOptions: [10, 15, 20]
    },
    customSortColumn: {
      column: "Name",
      sortingFn: (data, i, sortDateOrder) => {
        const epochDates = data.reduce((acc, curr) => {
          acc.push([...curr, getEpochForDate(curr[4], "dayend")]);
          return acc;
        }, []);
        const order = sortDateOrder === "asc" ? true : false;
        const finalData = sortByEpoch(epochDates, !order).map(item => {
          item.pop();
          return item;
        });
        return { data: finalData, currentOrder: !order ? "asc" : "desc" };
      }
    }
  }
};

const getActionButton = (value, tableMeta) => {
  return (
    <a href="javascript:void(0)"
      style={{
        color: "#FE7A51",
        cursor: "pointer"
      }}
      onClick={value => {

          let tenantId = tableMeta.rowData[1];
          let id = tableMeta.rowData[0];

          store.dispatch(prepareFinalObject("chb.search.hallId", id));
          store.dispatch(prepareFinalObject("chb.search.tenantId", tenantId));

      }}
    >
      {getLocaleLabels(value,value)}
    </a>
  )
}

const getViewButton = (value, tableMeta) => {
  return (
    <a href="javascript:void(0)"
      style={{
        color: "#FE7A51",  
        cursor: "pointer"
      }}
      onClick={value => {
            let id = tableMeta.rowData[0];
            let tenantId = tableMeta.rowData[1];
            let url = `/chb-common/bookHall?tenantId=${tenantId}&hallId=${id}`; //Can be changed to viewHall also
            document.location.href = `${document.location.origin}${url}`;
      }}
    >
      {getLocaleLabels(value,value)}
    </a>
  )
}