import React, { useEffect, useState } from "react";
import moment from "moment/moment";
import { axiosPrivate } from "../../../api/axiosInstance";
import {
  CRUD_ACCOUNT_ADMIN,
  GET_ALL_USER_ADMIN,
} from "../../../common/constants/apiConstants";
import Grid from "@mui/material/Grid";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import SearchBar from "material-ui-search-bar";
import TablePagination from "@mui/material/TablePagination";

const user = [];

// const Transition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });

const StaffTable = (props) => {
  const [staff, setStaff] = useState(user);
  // const [open, setOpen] = React.useState(false);
  // const [updateRow, setUpdateRow] = React.useState(null);
  // const [oldRow, setOldRow] = React.useState(null);
  const [staffFilter, setStaffFilter] = useState(user);
  const [roleStaff, setRoleStaff] = React.useState("All");
  const [searched, setSearched] = useState("");

  const pages = [5, 10, 25, 100];
  const [page, setPage] = useState(0);
  const [pageSave, setPageSave] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);

  // const columnsStaff = [
  //   { title: "Họ", field: "lastName" },
  //   { title: "Tên đệm", field: "middleName" },
  //   { title: "Tên", field: "firstName" },
  //   { title: "Số điện thoại", field: "userName", editable: "onAdd" },
  //   { title: "Địa chỉ", field: "address" },
  //   {
  //     title: "Ngày sinh",
  //     field: "dateOfBirth",
  //     type: "date",
  //     dateSetting: { locale: "vn-VN" },
  //     render: (rowData) => moment(rowData.dateOfBirth).format("DD/MM/YYYY"),
  //   },
  //   {
  //     title: "Quyền",
  //     field: "roleName",
  //     editable: "onAdd",
  //     filterPlaceholder: "Select",
  //     lookup: {
  //       Dentist: "Nha sĩ",
  //       Staff: "Nhân viên",
  //     },
  //   },
  // ];

  useEffect(() => {
    setStaffFilter(props.staff);
    setStaff(props.staff);
  }, [props.staff]);

  // useEffect(() => {
  //   if (roleStaff === "All") {
  //     setStaff(staffFilter);
  //   } else {
  //     setStaff(staffFilter.filter((data) => data.roleName === roleStaff));
  //   }
  // }, [roleStaff, staffFilter]);

  
  const filterData = async () => {
    const params = {};
    const response = await axiosPrivate.post(GET_ALL_USER_ADMIN, params);
    console.log(response);
    const data = [...response.data];
    const staffData = data.filter((data) => {
      return data.roleName !== "End User";
    });
    const filterData = data.filter((data) => {
      return data.roleName === roleStaff;
    });
    setStaffFilter(staffData);
    setStaff(filterData);
  };

  const fetchData = async () => {
    const params = {};
    const response = await axiosPrivate.post(GET_ALL_USER_ADMIN, params);
    console.log(response);
    const data = [...response.data];
    const staffData = data.filter((data) => {
      return data.roleName !== "End User";
    });
    setStaffFilter(staffData);
    setStaff(staffData);
  };

  const createStaff = async (newRow) => {
    const params = {
      lastName: newRow.lastName,
      middleName: newRow.middleName,
      firstName: newRow.firstName,
      phoneNumber: newRow.userName,
      dob: newRow.dateOfBirth,
      address: newRow.address,
      role: newRow.roleName,
      operationType: "C",
    };
    await axiosPrivate.post(CRUD_ACCOUNT_ADMIN, params);
  };

  const updateStaff = async (newRow) => {
    const params = {
      lastName: newRow.lastName,
      middleName: newRow.middleName,
      firstName: newRow.firstName,
      phoneNumber: newRow.userName,
      dob: newRow.dateOfBirth,
      address: newRow.address,
      role: newRow.roleName,
      operationType: "U",
    };
    await axiosPrivate.post(CRUD_ACCOUNT_ADMIN, params);
  };

  const requestSearch = (searchedVal) => {
    setPage(0);
    if (searchedVal === "") {
      setStaff(staffFilter);
      setPage(pageSave);
    } else {
      const filteredRows = staffFilter.filter((row) => {
        return `${row.lastName.toLowerCase()} ${row.middleName.toLowerCase()} ${row.firstName.toLowerCase()}`
          .includes(searchedVal.toLowerCase());
      });
      setStaff(filteredRows);
    }
  };

  const cancelSearch = () => {
    setSearched("");
    requestSearch(searched);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setPageSave(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setPageSave(0);
  };

  // const handleClickOpen = () => {
  //   setLoading(true);
  //   setOpen(true);
  // };

  // const handleClose = () => {
  //   setLoading(false);
  //   setOpen(false);
  // };

  // const handleAccept = () => {
  //   const index = oldRow.tableData.id;
  //   const updateRows = [...staff];
  //   updateRows[index] = updateRow;
  //   updateStaff(updateRow);
  //   if (roleStaff !== "All") {
  //     filterData();
  //   } else {
  //     setStaffFilter(updateRows);
  //     setStaff(updateRows);
  //     setLoading(false);
  //   }
  //   setUpdateRow(null);
  //   setOldRow(null);
  //   setOpen(false);
  // };

  return (
    <>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <Grid sx={{ flexGrow: 1 }} container direction="row" justifyContent="center" alignItems="center">
          <Grid item xs={1}></Grid>
          <Grid item xs={5}>
            <h2>Bảng Tài Khoản Nhân Sự</h2>
          </Grid>
          <Grid item xs={8}>
            <SearchBar
              value={searched}
              onChange={(searchVal) => requestSearch(searchVal)}
              onCancelSearch={() => cancelSearch()}
            />
          </Grid>
        </Grid>

        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">STT</TableCell>
                <TableCell align="right">Họ</TableCell>
                <TableCell align="right">Tên đệm</TableCell>
                <TableCell align="right">Tên</TableCell>
                <TableCell align="right">Số điện thoại</TableCell>
                <TableCell align="right">Địa chỉ</TableCell>
                <TableCell align="right">Ngày sinh</TableCell>
                <TableCell align="right">Quyền</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {staff
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row.userName}>
                    <TableCell align="center">
                      {staff.indexOf(row) + 1}
                    </TableCell>
                    <TableCell align="right">{row.lastName}</TableCell>
                    <TableCell align="right">{row.middleName}</TableCell>
                    <TableCell align="right">{row.firstName}</TableCell>
                    <TableCell align="right">{row.userName}</TableCell>
                    <TableCell align="right">{row.address}</TableCell>
                    <TableCell align="right">{moment(row.dateOfBirth).format("DD/MM/YYYY")}</TableCell>
                    <TableCell align="right">{row.roleName}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={pages}
          component="div"
          page={page}
          rowsPerPage={rowsPerPage}
          count={staff.length}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
};

export default StaffTable;
