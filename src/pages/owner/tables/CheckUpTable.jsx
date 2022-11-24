import React, { useState } from 'react'

const checkUp = [
    {
      fullName: "Lại Nguyễn Tấn Tài",
      phoneNumber: "021312334",
      dob: "2000-02-02",
      address: "Bình Dương",
      dateRecord: "2000-03-03",
    },
  ];

const CheckUpTable = (props) => {
  const [checkUpData, setCheckUpeData] = useState(checkUp);

    // const columnsCheckUp = [
    //     { title: "Họ và Tên", field: "fullName" },
    //     { title: "Số Điện Thoại", field: "phoneNumber" },
    //     {
    //       title: "Ngày Sinh",
    //       field: "dob",
    //       type: "date",
    //       dateSetting: { locale: "vn-VN" },
    //       render: (rowData) => moment(rowData.dateOfBirth).format("DD/MM/YYYY"),
    //     },
    //     { title: "Địa Chỉ", field: "address" },
    //     {
    //       title: "Ngày Khám",
    //       field: "dateRecord",
    //       type: "date",
    //       dateSetting: { locale: "vn-VN" },
    //       render: (rowData) => moment(rowData.dateOfBirth).format("DD/MM/YYYY"),
    //     },
    //   ];

  return (
    <>
    <h1>Bảng Số Lượng Người Tới Khám</h1>
      {/* <MaterialTable
            isLoading={loading}
            title="Bảng Số Lượng Người Tới Khám"
            // icons={tableIcons}
            columns={columnsCheckUp}
            data={checkUpData}
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
          /> */}
    </>
  )
}

export default CheckUpTable
