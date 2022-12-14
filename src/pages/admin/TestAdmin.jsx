import React, { useEffect, useState } from "react";
import moment from "moment/moment";
import Grid from "@mui/material/Grid";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import RefreshIcon from "@mui/icons-material/Refresh";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { axiosPrivate } from "../../api/axiosInstance";
import {
  BAN_OR_ACTIVE_ACCOUNT_ADMIN,
  CRUD_ACCOUNT_ADMIN,
  GET_ALL_USER_ADMIN,
} from "../../common/constants/apiConstants";
import { formatYearMonthDate } from "../../common/utils/formatDate";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";
import RemoveCircleRoundedIcon from "@mui/icons-material/RemoveCircleRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import CloseIcon from '@mui/icons-material/Close';

const user = [];

const initialValues = {
  lastName: "",
  middleName: "",
  firstName: "",
  phoneNumber: "",
  dob: null,
  address: "",
  role: "",
};

const TestAdmin = () => {
  const [staff, setStaff] = useState(user);
  const [staffFilter, setStaffFilter] = useState(user);
  const [values, setvalues] = useState(initialValues);

  const pages = [5, 10, 25, 100];
  const [page, setPage] = useState(0);
  const [pageSave, setPageSave] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);

  const [isloading, setIsLoading] = useState(false);
  const [isAddNew, setIsAddNew] = useState(false);
  const [isUpdateRow, setIsUpdateRow] = useState(false);

  const [textSnackbar, setTextSnackbar] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);

  const [isDisabled, setIsDisabled] = useState(false);

  const [selectDob, setSelectDob] = useState(null);
  const [selectRole, setSelectRole] = useState("");

  const [rowSelectStaff, setRowSelectStaff] = useState(null);
  const [searchedVal, setSearchedVal] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  // useEffect(() => {
  //   if (roleStaff === "All") {
  //     setStaff(staffFilter);
  //   } else {
  //     setStaff(staffFilter.filter((data) => data.roleName === roleStaff));
  //   }
  // }, [roleStaff, staffFilter]);

  // const filterData = async () => {
  //   const params = {};
  //   const response = await axiosPrivate.post(GET_ALL_USER_ADMIN, params);
  //   console.log(response);
  //   const data = [...response.data];
  //   const staffData = data.filter((data) => {
  //     return data.roleName !== "End User";
  //   });
  //   const filterData = data.filter((data) => {
  //     return data.roleName === roleStaff;
  //   });
  //   setStaffFilter(staffData);
  //   setStaff(filterData);
  // };

  const fetchData = async () => {
    setIsLoading(true);
    const params = {};
    try {
      const response = await axiosPrivate.post(GET_ALL_USER_ADMIN, params);
      const data = [...response.data];
      const staffData = data.filter((data) => {
        return data.roleName !== "End User";
      });
      setStaffFilter(staffData);
      setStaff(staffData);
      setIsLoading(false);
    } catch (error) {
      setTextSnackbar("???? x??y ra l???i");
      setOpenSnackbar(true);
      setIsLoading(false);
    }
  };

  const createStaff = async (newRow, dob, selectRole) => {
    // setIsLoading(true);
    const params = {
      lastName: newRow.lastName,
      middleName: newRow.middleName,
      firstName: newRow.firstName,
      phoneNumber: newRow.phoneNumber,
      dob: formatYearMonthDate(dayjs(dob, "DD/MM/YYYY")),
      address: newRow.address,
      role: selectRole,
      operationType: "C",
    };
    try {
      await axiosPrivate.post(CRUD_ACCOUNT_ADMIN, params);
      setvalues(initialValues);
      setSelectDob(null);
      setSelectRole("");
      setIsAddNew(false);

      setIsDisabled(false);

      fetchData();
    } catch (error) {
      setTextSnackbar("???? x??y ra l???i");
      setOpenSnackbar(true);
      setIsLoading(false);
    }
  };

  const updateStaff = async (newRow, dob, selectRole) => {
    const params = {
      lastName: newRow.lastName,
      middleName: newRow.middleName,
      firstName: newRow.firstName,
      phoneNumber: newRow.userName,
      dob:
        formatYearMonthDate(dayjs(dob, "DD/MM/YYYY")) === "Invalid Date"
          ? dob
          : formatYearMonthDate(dayjs(dob, "DD/MM/YYYY")),
      address: newRow.address,
      role: selectRole,
      operationType: "U",
    };
    try {
      await axiosPrivate.post(CRUD_ACCOUNT_ADMIN, params);
      setvalues(initialValues);
      setSelectDob(null);
      setSelectRole("");
      setIsUpdateRow(false);

      setIsDisabled(false);
      fetchData();
    } catch (error) {
      setTextSnackbar("???? x??y ra l???i");
      setOpenSnackbar(true);
      setIsLoading(false);
    }
  };

  const banStaff = async (newRow) => {
    setIsLoading(true);
    const params = {
      userName: newRow.userName,
    };
    try {
      await axiosPrivate.post(BAN_OR_ACTIVE_ACCOUNT_ADMIN, params);

      fetchData();
    } catch (error) {
      setTextSnackbar("???? x??y ra l???i");
      setOpenSnackbar(true);
      setIsLoading(false);
    }
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      values.lastName === "" ||
      values.middleName === "" ||
      values.firstName === "" ||
      values.address === "" ||
      values.phoneNumber === "" ||
      selectRole === "" ||
      selectDob === null
    ) {
      setTextSnackbar("L???i: Kh??ng ???????c ????? tr???ng");
      setOpenSnackbar(true);
    } else {
      isAddNew === true
        ? createStaff(values, selectDob, selectRole)
        : updateStaff(values, selectDob, selectRole);
    }
  };

  const handleUpdate = (row) => {
    setIsUpdateRow(true);
    setIsAddNew(false);
    setvalues(row);
    setSelectRole(row.roleName);
    setSelectDob(row.dateOfBirth);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setvalues({ ...values, [name]: value });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleAcceptDialog = () => {
    banStaff(rowSelectStaff);
    setRowSelectStaff(null);
    setOpenDialog(false);
  };

  const handleCloseDialog = () => {
    setRowSelectStaff(null);
    setOpenDialog(false);
  };

  return (
    <>
      {isAddNew === true || isUpdateRow === true ? (
        <Box>
          <Grid container justifyContent="center">
            <Card sx={{ width: "100%" }}>
              <CardHeader
                title="Th??ng tin Nh??n Vi??n"
                titleTypographyProps={{
                  align: "center",
                  fontWeight: "bold",
                }}
                subheader={isAddNew === true ? "Th??m m???i" : "C???p nh???t"}
                subheaderTypographyProps={{
                  align: "center",
                }}
              />
              <CardContent sx={{ marginBottom: "2%" }}>
                <Box
                  component="form"
                  sx={{
                    display: "column",
                  }}
                  onSubmit={handleSubmit}
                >
                  <Grid container spacing={2}>
                    <Grid item>
                      <TextField
                        id="lastName"
                        name="lastName"
                        sx={{ width: "290px" }}
                        variant="standard"
                        label="H??? T??n"
                        value={values.lastName}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        id="middleName"
                        name="middleName"
                        sx={{ width: "290px" }}
                        variant="standard"
                        label="T??n ?????m"
                        value={values.middleName}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        id="firstName"
                        name="firstName"
                        sx={{ width: "290px" }}
                        variant="standard"
                        label="T??n"
                        value={values.firstName}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>
                  <br />
                  <Grid container direction="column" spacing={2}>
                    <Grid item>
                      <TextField
                        id="phoneNumber"
                        name="phoneNumber"
                        fullWidth
                        variant="standard"
                        label="S??? ??i???n tho???i"
                        value={values.phoneNumber}
                        onChange={handleChange}
                        disabled={isUpdateRow === true ? true : false}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        id="address"
                        name="address"
                        fullWidth
                        variant="standard"
                        label="?????a Ch???"
                        value={values.address}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item>
                      <DatePicker
                        label="Ng??y Sinh"
                        inputFormat="DD/MM/YYYY"
                        placeholder="DD/MM/YYYY"
                        value={selectDob}
                        onChange={(newValue) => {
                          setSelectDob(newValue);
                        }}
                        renderInput={(params) => (
                          <TextField fullWidth variant="standard" {...params} />
                        )}
                      />
                    </Grid>
                    <Grid item>
                      <FormControl variant="standard" fullWidth>
                        <InputLabel id="roleChoose">Ch???n Quy???n H???ng</InputLabel>
                        <Select
                          disabled={isUpdateRow === true ? true : false}
                          labelId="roleChoose"
                          id="selectRole"
                          fullWidth
                          value={selectRole}
                          onChange={(e) => setSelectRole(e.target.value)}
                          label="Quy???n"
                        >
                          <MenuItem value={"Staff"} style={{ width: "100%" }}>
                            Nh??n Vi??n
                          </MenuItem>
                          <MenuItem value={"Dentist"} style={{ width: "100%" }}>
                            Nha S??
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <br />
                    <Grid item>
                      <Button
                        variant="contained"
                        fullWidth
                        type="submit"
                        sx={{ height: "35px" }}
                      >
                        {isAddNew === true
                          ? "Th??m Nh??n Vi??n"
                          : "C???p Nh???t Nh??n Vi??n"}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Box>
      ) : (
        <></>
      )}
      <br />
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <Grid
          sx={{ flexGrow: 1 }}
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <Grid item xs={1}></Grid>
          <Grid item xs={5}>
            <h2>B???ng T??i Kho???n Nh??n S???</h2>
          </Grid>
          <Grid item xs={7}>
            <TextField
              sx={{ width: "100%" }}
              label="T??m Ki???m"
              variant="outlined"
              onChange={(e) => setSearchedVal(e.target.value)}
            />
          </Grid>
          <Grid item xs={3}>
            <IconButton color="info" onClick={() => fetchData()}>
              <RefreshIcon />
            </IconButton>
            <IconButton
              size="large"
              disabled={isDisabled}
              color="warning"
              onClick={() => {
                setIsDisabled(true);

                setIsAddNew(true);
                setIsUpdateRow(false);

                setvalues(initialValues);
                setSelectDob(null);
                setSelectRole("");
              }}
            >
              <AddCircleOutlineOutlinedIcon />
            </IconButton>
            <IconButton
              size="large"
              disabled={!isDisabled}
              color="error"
              onClick={() => {
                setvalues(initialValues);
                setSelectDob(null);
                setSelectRole("");

                setIsAddNew(false);
                setIsUpdateRow(false);

                setIsDisabled(false);
              }}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
          {/* <Grid item xs={2}>
            <Button
              variant="contained"
              sx={{ width: "100%", height: "35px" }}
              disabled={isDisabled}
              onClick={() => {
                setIsDisabled(true);

                setIsAddNew(true);
                setIsUpdateRow(false);

                setvalues(initialValues);
                setSelectDob(null);
                setSelectRole("");
              }}
            >
              Th??m nh??n vi??n
            </Button>
          </Grid> */}
          {/* <Grid item xs={1}>
            <Button
              variant="contained"
              sx={{ width: "50%", height: "35px" }}
              disabled={!isDisabled}
              onClick={() => {
                setvalues(initialValues);
                setSelectDob(null);
                setSelectRole("");

                setIsAddNew(false);
                setIsUpdateRow(false);

                setIsDisabled(false);
              }}
            >
              H???y
            </Button>
          </Grid> */}
        </Grid>
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              {isloading === true || staff.length === 0 ? (
                <TableRow>
                  <TableCell></TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell align="center">STT</TableCell>
                  <TableCell align="right">H???</TableCell>
                  <TableCell align="right">T??n ?????m</TableCell>
                  <TableCell align="right">T??n</TableCell>
                  <TableCell align="right">S??? ??i???n tho???i</TableCell>
                  <TableCell align="right">?????a ch???</TableCell>
                  <TableCell align="right">Ng??y sinh</TableCell>
                  <TableCell align="right">Quy???n</TableCell>
                  <TableCell align="center">Tr???ng th??i</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              )}
            </TableHead>
            <TableBody>
              {isloading === true ? (
                <TableRow>
                  <TableCell
                    sx={{ width: "100%", height: "100%" }}
                    align="center"
                  >
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : staff.length === 0 ? (
                <TableRow>
                  <TableCell
                    sx={{ width: "100%", height: "100%" }}
                    align="center"
                  >
                    Kh??ng C?? D??? Li???u
                  </TableCell>
                </TableRow>
              ) : (
                staff
                  .filter(
                    (row) =>
                      !searchedVal.length ||
                      `${row.lastName} ${row.middleName} ${row.firstName} ${row.userName} ${row.address} ${row.status}`
                        .toString()
                        .toLowerCase()
                        .includes(searchedVal.toString().toLowerCase())
                  )
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
                      <TableCell align="right">
                        {moment(row.dateOfBirth).format("DD/MM/YYYY")}
                      </TableCell>
                      <TableCell align="right">
                        {row.roleName === "Dentist" ? "Nha s??" : "Nh??n vi??n"}
                      </TableCell>
                      <TableCell align="center">
                        {row.status === "Active" ? (
                          <Chip label="Active" color="success" />
                        ) : (
                          <Chip label="Inactive" color="error" />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {/* <Button
                          variant="contained"
                          sx={{ width: "100%", height: "35px" }}
                          disabled={isDisabled}
                          onClick={() => {
                            setIsDisabled(true);
                            handleUpdate(row);
                          }}
                        >
                          C???p Nh???t
                        </Button> */}
                        <IconButton
                          color="info"
                          disabled={isDisabled}
                          onClick={() => {
                            setIsDisabled(true);
                            handleUpdate(row);
                          }}
                        >
                          <EditRoundedIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color={row.status === "Active" ? "error" : "success"}
                          disabled={isDisabled}
                          onClick={() => {
                            setRowSelectStaff(row);
                            handleClickOpenDialog();
                          }}
                        >
                          {row.status === "Active" ? (
                            <RemoveCircleOutlineRoundedIcon />
                          ) : (
                            <RemoveCircleRoundedIcon />
                          )}
                        </IconButton>
                        {/* <Button
                          variant="contained"
                          sx={{ width: "180px", height: "35px" }}
                          disabled={isDisabled}
                          onClick={() => {
                            setRowSelectStaff(row);
                            handleClickOpenDialog();
                          }}
                        >
                          {row.status === "Active"
                            ? "Kh??a T??i Kho???n"
                            : "G??? Kh??a T??i Kho???n"}
                        </Button> */}
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                {isloading === true ? (
                  <></>
                ) : (
                  <TablePagination
                    rowsPerPageOptions={[
                      5,
                      10,
                      25,
                      100,
                      { label: "T???t c???", value: -1 },
                    ]}
                    count={staff.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    labelRowsPerPage="S??? h??ng tr??n m???t trang"
                    showFirstButton
                    showLastButton
                    labelDisplayedRows={({ from, to, count, page }) =>
                      `${from}???${to} c???a ${
                        count !== -1 ? count : `nhi???u h??n ${to}`
                      } | Trang ${page}`
                    }
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                )}
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Paper>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert variant="outlined" severity="error" sx={{ width: "100%" }}>
          {textSnackbar}
        </Alert>
      </Snackbar>
      <Dialog
        open={openDialog}
        keepMounted
        onClose={handleCloseDialog}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"L??u ??!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            B???n c?? x??c nh???n mu???n ti???p t???c
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>H???y</Button>
          <Button onClick={handleAcceptDialog}>X??c Nh???n</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TestAdmin;
