import React, { useEffect, useState } from "react";
import { axiosPrivate } from "../../api/axiosInstance";
import { GET_ALL_MEDICINES } from "../../common/constants/apiConstants";
import Grid from "@mui/material/Grid";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import SearchBar from "material-ui-search-bar";
import TablePagination from "@mui/material/TablePagination";

// const useStyles = makeStyles(theme => ({
//     root:{
// `& .MuiFormControl-root`: {
//   width: '80%',
//   margin: theme.spacing(1)
// }
//     }
//   }));

const medicines = [
  // {
  //     id: "1",
  //     medicineName: "Paracetamol",
  //     medicineType: "Giảm đau",
  //     dosage: "Sáng 1 tối 1"
  // }
];

const initialValues = [
  {
    medicineId: "",
    medicineName: "",
    medicineType: "",
    operationType: "",
  },
];

const Medicine = () => {
  //   const [loading, setLoading] = useState(false);

  const [medicineData, setMedicineData] = useState(medicines);
  const [medicineFilter, setMedicineFilter] = useState(medicines);
  const [values, setvalues] = useState(initialValues);

  const [searched, setSearched] = useState("");

  const pages = [5, 10, 25, 100];
  const [page, setPage] = useState(0);
  const [pageSave, setPageSave] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  // const classes = useStyles();

  useEffect(() => {
    // setLoading(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    // setLoading(true);
    const params = {};
    const response = await axiosPrivate.post(GET_ALL_MEDICINES, params);
    // console.log(response);
    const data = [...response.data];
    setMedicineFilter(data);
    setMedicineData(data);
    // setLoading(false);
  };

  const requestSearch = (searchedVal) => {
    setPage(0);
    if (searchedVal === "") {
      setMedicineData(medicineFilter);
      setPage(pageSave);
    } else {
      const filteredRows = medicineFilter.filter((row) => {
        return `${row.medicineName} ${row.medicineType} ${row.dosage}`
          .toLowerCase()
          .includes(searchedVal.toLowerCase());
      });
      setMedicineData(filteredRows);
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

  return (
    <>
      {/* <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
    >
      <TextField label="Tên Thuốc" variant="standard" value={values.medicineName} />
      <TextField label="Loại Thuốc" variant="standard" value={values.medicineType} />
    </Box>  */}

        {/* <form>
          <Grid sx={{ flexGrow: 1 }} container>
          <Grid item xs={1}></Grid>
            <Grid item xs={5}>
              <TextField
                label="Tên Thuốc"
                variant="outlined"
                value={values.medicineName}
              />
              <TextField
                label="Loại Thuốc"
                variant="outlined"
                value={values.medicineType}
              />
            </Grid>
            <Grid item xs={5}></Grid>
            <Grid item xs={1}></Grid>
          </Grid>
        </form> */}
      {/* </Paper> */}
      <br />
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <Grid
          sx={{ flexGrow: 1 }}
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={1}></Grid>
          <Grid item xs={4}>
            <h2>Bảng Danh Sách Thuốc</h2>
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
                <TableCell align="center">Số Thứ Tự</TableCell>
                <TableCell align="right">Tên Thuốc</TableCell>
                <TableCell align="right">Loại Thuốc</TableCell>
                <TableCell align="right">Liều Dùng</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {medicineData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row.id}>
                    <TableCell align="center">
                      {medicineData.indexOf(row) + 1}
                    </TableCell>
                    <TableCell align="right">{row.medicineName}</TableCell>
                    <TableCell align="right">{row.medicineType}</TableCell>
                    <TableCell align="right">{row.dosage}</TableCell>
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
          count={medicineData.length}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
};

export default Medicine;
