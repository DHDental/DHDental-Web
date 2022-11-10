import MaterialTable from "material-table";
import moment from "moment/moment";
import React, { useState } from "react";
import tableIcons from "../../components/MaterialTableIcons";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@mui/material";
import Tab from "@material-ui/core/Tab";

const service = [
  {
    maDichVu: "123456",
    tenDichVu: "Trám Răng",
    chiPhi: "12200000",
  },
];

const revenue = [
  {
    fullName: "Lại Nguyễn Tấn Tài",
    phoneNumber: "021312334",
    dob: "2000-02-02",
    address: "Bình Dương",
    dateRecord: "2000-03-03",
  },
];

export const formatNumber = inputNumber => {
    let formetedNumber=(Number(inputNumber)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    let splitArray=formetedNumber.split('.');
    if(splitArray.length>1){
      formetedNumber=splitArray[0];
    }
    return(formetedNumber);
  };

const OwnerTest = () => {
  const [serviceData, setServiceData] = useState(service);
  const [checkUpData, setCheckUpeData] = useState(revenue);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = React.useState("1");

  const columnsService = [
    { title: "Mã Dịch Vụ", field: "maDichVu", editable: "never"  },
    { title: "Tên Dịch Vụ", field: "tenDichVu" },
    { title: "Giá", field: "chiPhi", render: (rowData) =>
    formatNumber(rowData.chiPhi) + " VND", },
  ];

  const columnsCheckUp = [
    { title: "Họ và Tên", field: "fullName" },
    { title: "Số Điện Thoại", field: "phoneNumber" },
    {
      title: "Ngày Sinh",
      field: "dob",
      type: "date",
      dateSetting: { locale: "vn-VN" },
      render: (rowData) => moment(rowData.dateOfBirth).format("DD/MM/YYYY"),
    },
    { title: "Địa Chỉ", field: "address" },
    {
      title: "Ngày Khám",
      field: "dateRecord",
      type: "date",
      dateSetting: { locale: "vn-VN" },
      render: (rowData) => moment(rowData.dateOfBirth).format("DD/MM/YYYY"),
    },
  ];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Quản Lý Dịch Vụ" value="1" />
            <Tab label="Quản Lý Lượng Người Tới Khám" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <MaterialTable
            isLoading={loading}
            title="Bảng Dịch Vụ"
            icons={tableIcons}
            columns={columnsService}
            data={serviceData}
            // actions={[
            //   {
            //     icon: RefreshIcon,
            //     tooltip: "Refresh Data",
            //     isFreeAction: true,
            //     onClick: () => fetchData(),
            //   },
            // ]}
            editable={{
              onRowAdd: (newRow) =>
                new Promise((resolve, reject) => {
                  const updateRows = [
                    ...serviceData,
                    newRow,
                    // {
                    //   ...newRow,
                    //   dateOfBirth: moment(newRow.dateOfBirth).format(
                    //     "YYYY-MM-DD"
                    //   ),
                    // },
                  ];
                  setTimeout(() => {
                    // createStaff({
                    //   ...newRow,
                    //   dateOfBirth: moment(newRow.dateOfBirth).format(
                    //     "YYYY-MM-DD"
                    //   ),
                    // });
                    setServiceData(updateRows);
                    resolve();
                  }, 2000);
                  //   console.log(newRow);
                }),

              onRowUpdate: (updateRow, oldRow) =>
                new Promise((resolve, reject) => {
                  const index = oldRow.tableData.id;
                  const updateRows = [...serviceData];
                  updateRows[index] = updateRow;
                  setTimeout(() => {
                    // updateStaff(updateRow);
                    setServiceData(updateRows);
                    resolve();
                  }, 2000);
                }),

              onRowDelete: (selectedRow) =>
                new Promise((resolve, reject) => {
                  const index = selectedRow.tableData.id;
                  const updateRows = [...serviceData];
                  updateRows.splice(index, 1);
                  setTimeout(() => {
                    setServiceData(updateRows);
                    resolve();
                  }, 2000);
                }),
            }}
            // components={{
            //     OverlayLoading: props => (<Spinner />)
            //   }}
            options={{
              sorting: true,
              search: true,
              searchFieldAlignment: "right",
              searchAutoFocus: true,
              searchFieldVariant: "standard",

              paging: true,
              pageSizeOptions: [2, 5, 10, 20, 25, 50, 100],
              pageSize: 5,
              paginationType: "stepped",
              showFirstLastPageButtons: false,
              selection: false,
              showSelectAllCheckbox: false,
              showTextRowsSelected: false,

              actionsColumnIndex: -1,
              addRowPosition: "first",

              //   filtering: true,

              rowStyle: (data, index) =>
                index % 2 === 0 ? { background: "#f5f5f5" } : null,
              headerStyle: { background: "#f44336", color: "#fff" },
            }}
            localization={{
              pagination: {
                labelRowsSelect: "Dòng",
                labelDisplayedRows: "{from}-{to} of {count}",
              },
              toolbar: {
                searchPlaceholder: "Tìm kiếm",
                nRowsSelected: "{0} Dòng(s) selected",
              },
              header: {
                actions: "",
              },
              body: {
                emptyDataSourceMessage: "Chưa có dữ liệu",
                filterRow: {
                  filterTooltip: "Filter",
                },
              },
            }}
          />
        </TabPanel>
        <TabPanel value="2">
          <MaterialTable
            isLoading={loading}
            title="Bảng Số Lượng Người Tới Khám"
            icons={tableIcons}
            columns={columnsCheckUp}
            data={checkUpData}
            // actions={[
            //   {
            //     icon: RefreshIcon,
            //     tooltip: "Refresh Data",
            //     isFreeAction: true,
            //     onClick: () => fetchData(),
            //   },
            // ]}
            // components={{
            //     OverlayLoading: props => (<Spinner />)
            //   }}
            options={{
              sorting: true,
              search: true,
              searchFieldAlignment: "right",
              searchAutoFocus: true,
              searchFieldVariant: "standard",

              paging: true,
              pageSizeOptions: [2, 5, 10, 20, 25, 50, 100],
              pageSize: 5,
              paginationType: "stepped",
              showFirstLastPageButtons: false,
              selection: false,
              showSelectAllCheckbox: false,
              showTextRowsSelected: false,

              actionsColumnIndex: -1,
              addRowPosition: "first",

              filtering: true,

              rowStyle: (data, index) =>
                index % 2 === 0 ? { background: "#f5f5f5" } : null,
              headerStyle: { background: "#f44336", color: "#fff" },
            }}
            localization={{
              pagination: {
                labelRowsSelect: "Dòng",
                labelDisplayedRows: "{from}-{to} of {count}",
              },
              toolbar: {
                searchPlaceholder: "Tìm kiếm",
                nRowsSelected: "{0} Dòng(s) selected",
              },
              header: {
                actions: "",
              },
              body: {
                emptyDataSourceMessage: "Chưa có dữ liệu",
                filterRow: {
                  filterTooltip: "Filter",
                },
              },
            }}
          />
        </TabPanel>
      </TabContext>
    </div>
  );
};

export default OwnerTest;
