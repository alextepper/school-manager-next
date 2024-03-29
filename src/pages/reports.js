import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  IconButton,
  MenuItem,
  Avatar,
  Card,
  CardHeader,
  Collapse,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import api from "src/utils/api";
import Head from "next/head";
import { Box, Container, Stack } from "@mui/system";

import { DataGrid, GridExpandMoreIcon } from "@mui/x-data-grid";
import { DateTimePicker, MobileDateTimePicker } from "@mui/x-date-pickers";
import { deepPurple } from "@mui/material/colors";
import { getInitials } from "src/utils/get-initials";
import CheckIcon from "@mui/icons-material/Check";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

const Page = () => {
  const loggedUserProfile = JSON.parse(localStorage.getItem("user")).profile;
  const [reports, setReports] = useState([]);
  const [futureReports, setFutureReports] = useState([]);
  const [pastReports, setPastReports] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [staff, setStaff] = useState([]);
  const [rowForChange, setRowForChange] = useState({});
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [newReport, setNewReport] = useState({
    room: "",
    building: "",
    staff: loggedUserProfile.id,
    comments: "",
    complete: false,
  });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get("/fault-reports/");
        const sortedResults = response.data.results.sort(
          (a, b) => new Date(b.time) - new Date(a.time)
        );
        setReports(sortedResults);
      } catch (error) {
        console.error("Failed to fetch reports", error);
      }
    };
    const fetchStaff = async () => {
      try {
        const response = await api.get("/profiles/staff/");
        setStaff(response.data.results);
      } catch (error) {
        console.error("Failed to fetch staff", error);
      }
    };

    fetchStaff();
    fetchReports();
  }, []);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const future = reports.filter(
      (report) => new Date(report.date_of_creation) >= today || report.complete === false
    );
    const past = reports.filter((report) => new Date(report.date_of_creation) < today);

    setFutureReports(future);
    setPastReports(past);
  }, [reports]);

  const handleClickOpen = (params) => {
    setSelectedRow(params.row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setRowForChange([]);
  };

  const handleSave = async () => {
    try {
      const response = await api.patch(`fault-reports/${selectedRow.id}/`, rowForChange);

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update the reports state with the updated row
      setReports((prevReports) =>
        prevReports.map((report) =>
          report.id === selectedRow.id ? { ...report, ...rowForChange } : report
        )
      );

      // Close the dialog
      setOpen(false);
      setRowForChange([]);
    } catch (error) {
      console.error("There was a problem with the axios operation:", error);
    }
  };

  const handleCreateOpen = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateClose = () => {
    setCreateDialogOpen(false);
    setRowForChange([]);
  };

  const handleCreate = async () => {
    try {
      const response = await api.post("fault-reports/", newReport);

      console.log(response.data);
      // You can update the state or do anything with the returned data here
      setReports((prevReports) => [response.data, ...prevReports]);
      handleCreateClose();
    } catch (error) {
      console.error("There was a problem with the axios operation: ", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete?")) {
      try {
        await api.delete(`fault-reports/${selectedRow.id}/`);
        setReports(reports.filter((item) => item.id !== selectedRow.id));
        handleClose();
      } catch (error) {
        console.error("Failed to delete car use", error);
      }
    }
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleStaffChange = (event) => {
    setStaff(event.target.value);
  };

  const columns = [
    // {
    //   field: "user",
    //   headerName: "",
    //   flex: 1,
    //   maxWidth: 40,

    //   renderCell: (params) => {
    //     const user = staff.find((staffMember) => staffMember.id === params.row.user);
    //     return (
    //       <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
    //         <Avatar
    //           sx={{ bgcolor: deepPurple[500] }}
    //           src={user ? user.avatar : ""}
    //           alt={getInitials(`${user.first_name} ${user.last_name}`)}
    //         >
    //           {getInitials(`${user.first_name} ${user.last_name}`)}
    //         </Avatar>
    //         <Typography variant="body2" align="center">
    //           {user ? user.first_name : ""}
    //         </Typography>
    //       </Box>
    //     );
    //   },
    // },
    {
      field: "user",
      headerName: "מדווח",
      flex: 1,
      maxWidth: 60,
      sortable: false,

      renderCell: (params) => {
        const user = staff.find((staffMember) => staffMember.id === params.row.staff);
        if (!user) {
          return (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Avatar sx={{ bgcolor: deepPurple[500], mb: -0.5 }} />
            </Box>
          );
        }
        return (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Avatar
              sx={{ bgcolor: deepPurple[500], mb: -0.5 }}
              src={user.avatar}
              alt={getInitials(`${user.first_name} ${user.last_name}`)}
            >
              {getInitials(`${user.first_name} ${user.last_name}`)}
            </Avatar>
            <Typography variant="caption" align="center">
              {user.first_name}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "date",
      headerName: "תאריך",
      sortable: false,
      minWidth: 80,
      flex: 1,
      renderCell: (params) => {
        const date = new Date(params.row.date_of_creation);
        const dayFormatter = new Intl.DateTimeFormat("he-IL", { day: "2-digit" });
        const monthFormatter = new Intl.DateTimeFormat("he-IL", { month: "2-digit" });
        const yearFormatter = new Intl.DateTimeFormat("he-IL", { year: "2-digit" });
        // const weekdayFormatter = new Intl.DateTimeFormat("he-IL", { weekday: "narrow" });
        const formattedDay = dayFormatter.format(date);
        const formattedMonth = monthFormatter.format(date);
        const formattedYear = yearFormatter.format(date);
        // const formattedWeekday = weekdayFormatter.format(date);
        return `${formattedDay}/${formattedMonth}/${formattedYear}`;
      },
    },
    // {
    //   field: "time",
    //   headerName: "התחלה",
    //   sortable: false,
    //   minWidth: 60,
    //   flex: 1,
    //   valueGetter: (params) => {
    //     const date = new Date(params.row.date_of_creation);
    //     const formatter = new Intl.DateTimeFormat("en-GB", {
    //       hour: "2-digit",
    //       minute: "2-digit",
    //       hour12: false,
    //     });
    //     return formatter.format(date);
    //   },
    // },
    // { field: "student", headerName: "חניך", minWidth: 100, sortable: false, flex: 1 },
    // { field: "destination", headerName: "כתובת", minWidth: 100, sortable: false, flex: 1 },

    { field: "building", headerName: "מבנה", sortable: false, flex: 1 },
    { field: "room", headerName: "חדר", sortable: false, flex: 1 },
    { field: "comments", headerName: "הערות", minWidth: 100, sortable: false, flex: 2 },

    {
      field: "complete",
      headerName: "בוצע",
      sortable: false,
      flex: 0.3,
      renderCell: (params) =>
        params.value ? (
          <CheckIcon style={{ color: "green" }} />
        ) : (
          <HourglassEmptyIcon style={{ color: "red" }} />
        ),
    },
  ];

  return (
    <>
      <Head>
        <title> דיווח ליקויים | RKZ</title>
      </Head>
      <Box>
        <Container maxWidth="xl" sx={{ px: { xs: 0.5, sm: 3 } }}>
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack direction="row" textAlign="center" spacing={1}>
                <Typography variant="h4"> דיווח ליקויים </Typography>
                <IconButton color="primary" onClick={handleCreateOpen}>
                  <AddCircleOutlineIcon />
                </IconButton>
              </Stack>
            </Stack>
            <Card sx={{ px: 0.5 }}>
              <DataGrid
                disableColumnMenu
                rows={futureReports}
                columns={columns}
                rowHeight={70}
                pageSize={5}
                pagination
                onRowClick={handleClickOpen}
                sx={{
                  ".MuiDataGrid-cell": {
                    px: "2px !important",
                    fontSize: "1.1em",
                  },
                  ".MuiDataGrid-columnHeader": {
                    px: "2px !important",
                    fontSize: "1.1em",
                  },
                }}
                slotProps={{
                  ColumnHeader: { sx: { p: "0px !impornant" } },

                  GridToolbarQuickFilter: { placeholder: "ltr" },
                  pagination: {
                    labelRowsPerPage: "שורות בעמוד:",
                    sx: { direction: "ltr" },
                  },
                }}
                initialState={{
                  pagination: { paginationModel: { pageSize: 10 } },
                }}
                pageSizeOptions={[5, 10, 25]}
                // initialState={{ sortModel: [{ field: "date", sort: "asc" }] }}
              />
            </Card>

            <Card sx={{ px: 0.5 }}>
              <CardHeader
                sx={{ p: 1 }}
                title="היסטוריה"
                onClick={handleExpandClick}
                action={
                  <IconButton
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                  >
                    <GridExpandMoreIcon />
                  </IconButton>
                }
              />
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <DataGrid
                  disableColumnMenu
                  rows={pastReports}
                  columns={columns}
                  rowHeight={70}
                  pageSize={5}
                  pagination
                  onRowClick={handleClickOpen}
                  sx={{
                    ".MuiDataGrid-cell": {
                      px: "2px !important",
                      fontSize: "1.1em",
                    },
                    ".MuiDataGrid-columnHeader": {
                      px: "2px !important",
                      fontSize: "1.1em",
                    },
                  }}
                  slotProps={{
                    ColumnHeader: { sx: { p: "0px !impornant" } },

                    GridToolbarQuickFilter: { placeholder: "ltr" },
                    pagination: {
                      labelRowsPerPage: "שורות בעמוד:",
                      sx: { direction: "ltr" },
                    },
                  }}
                  initialState={{
                    pagination: { paginationModel: { pageSize: 25 } },
                  }}
                  pageSizeOptions={[5, 10, 25]}
                  // initialState={{ sortModel: [{ field: "date", sort: "asc" }] }}
                />
              </Collapse>
            </Card>

            <Dialog open={open} onClose={handleClose}>
              <DialogContent>
                {selectedRow && (
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        select
                        label="מדווח"
                        value={rowForChange.staff || selectedRow.staff || ""}
                        onChange={(e) =>
                          setRowForChange({ ...rowForChange, staff: e.target.value })
                        }
                        fullWidth
                      >
                        {staff.map((staffMember) => (
                          <MenuItem key={staffMember.id} value={staffMember.id}>
                            <Avatar
                              src={staffMember.avatar}
                              alt={`${staffMember.first_name} ${staffMember.last_name}`}
                              sx={{ ml: 1 }}
                            />
                            {staffMember.first_name} {staffMember.last_name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="בניין"
                        value={rowForChange.building || selectedRow.building}
                        onChange={(e) =>
                          setRowForChange({ ...rowForChange, building: e.target.value })
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="חדר"
                        value={rowForChange.room || selectedRow.room}
                        onChange={(e) => setRowForChange({ ...rowForChange, room: e.target.value })}
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="הערות"
                        value={rowForChange.comments || selectedRow.comments}
                        onChange={(e) =>
                          setRowForChange({ ...rowForChange, comments: e.target.value })
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={rowForChange.complete || selectedRow.complete}
                            onChange={(e) => {
                              setRowForChange({ ...rowForChange, complete: e.target.checked });
                              setSelectedRow({ ...selectedRow, complete: e.target.checked });
                            }}
                          />
                        }
                        label="בוצע"
                      />
                    </Grid>
                  </Grid>
                )}
              </DialogContent>
              <DialogActions>
                <Button variant="outlined" color="error" onClick={handleClose}>
                  ביטול
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    if (window.confirm("רוצה לשמור?")) {
                      handleSave();
                    }
                  }}
                >
                  שמירה
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    if (window.confirm("רוצה למחוק?")) {
                      handleDelete();
                    }
                  }}
                >
                  מחק
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog open={createDialogOpen} onClose={handleCreateClose}>
              <DialogContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      select
                      label="מדווח"
                      value={newReport.staff || ""}
                      onChange={(e) => setNewReport({ ...newReport, staff: e.target.value })}
                      fullWidth
                    >
                      {staff.map((staffMember) => (
                        <MenuItem key={staffMember.id} value={staffMember.id}>
                          <Avatar
                            src={staffMember.avatar}
                            alt={`${staffMember.first_name} ${staffMember.last_name}`}
                            sx={{ ml: 1 }}
                          />
                          {staffMember.first_name} {staffMember.last_name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="בניין"
                      value={newReport.building}
                      onChange={(e) => setNewReport({ ...newReport, building: e.target.value })}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="חדר"
                      value={newReport.room}
                      onChange={(e) => setNewReport({ ...newReport, room: e.target.value })}
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="הערות"
                      value={newReport.comments}
                      onChange={(e) => setNewReport({ ...newReport, comments: e.target.value })}
                      fullWidth
                    />
                  </Grid>
                  {/* <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={newReport.complete}
                          onChange={(e) =>
                            setNewReport({ ...newReport, complete: e.target.checked })
                          }
                        />
                      }
                      label="Complete"
                    />
                  </Grid> */}
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button variant="contained" color="error" onClick={handleCreateClose}>
                  ביטול
                </Button>
                <Button sx={{ mx: 1 }} variant="contained" onClick={handleCreate}>
                  שמירה
                </Button>
              </DialogActions>
            </Dialog>
          </Stack>
        </Container>
      </Box>
    </>
    // ...
  );
};
Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
