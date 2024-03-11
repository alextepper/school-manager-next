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

const Page = () => {
  const loggedUserProfile = JSON.parse(localStorage.getItem("user")).profile;
  const [appointments, setAppointments] = useState([]);
  const [futureAppointments, setFutureAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [staff, setStaff] = useState([]);
  const [rowForChange, setRowForChange] = useState({});
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    time: new Date(),
    student: "",
    staff: "",
    destination: "",
    comments: "",
    complete: false,
  });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get("/appointments/");
        const sortedResults = response.data.results.sort(
          (a, b) => new Date(b.time) - new Date(a.time)
        );
        setAppointments(sortedResults);
      } catch (error) {
        console.error("Failed to fetch appointments", error);
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
    fetchAppointments();
  }, []);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const future = appointments.filter((appointment) => new Date(appointment.time) >= today);
    const past = appointments.filter((appointment) => new Date(appointment.time) < today);

    setFutureAppointments(future);
    setPastAppointments(past);
  }, [appointments]);

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
      const response = await api.patch(`appointments/${selectedRow.id}/`, rowForChange);

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update the appointments state with the updated row
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === selectedRow.id ? { ...appointment, ...rowForChange } : appointment
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
      const response = await api.post("appointments/", newAppointment);

      console.log(response.data);
      // You can update the state or do anything with the returned data here
      setAppointments((prevAppointments) => [response.data, ...prevAppointments]);
      handleCreateClose();
    } catch (error) {
      console.error("There was a problem with the axios operation: ", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete?")) {
      try {
        await api.delete(`appointments/${selectedRow.id}/`);
        setAppointments(appointments.filter((item) => item.id !== selectedRow.id));
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
      headerName: "",
      flex: 1,
      maxWidth: 50,

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
        const date = new Date(params.row.time);
        const dayFormatter = new Intl.DateTimeFormat("he-IL", { day: "2-digit" });
        const monthFormatter = new Intl.DateTimeFormat("he-IL", { month: "2-digit" });
        const yearFormatter = new Intl.DateTimeFormat("he-IL", { year: "2-digit" });
        const weekdayFormatter = new Intl.DateTimeFormat("he-IL", { weekday: "narrow" });
        const formattedDay = dayFormatter.format(date);
        const formattedMonth = monthFormatter.format(date);
        const formattedYear = yearFormatter.format(date);
        const formattedWeekday = weekdayFormatter.format(date);
        return `${formattedDay}/${formattedMonth}/${formattedYear}(${formattedWeekday})`;
      },
    },
    {
      field: "time",
      headerName: "התחלה",
      sortable: false,
      minWidth: 60,
      flex: 1,
      valueGetter: (params) => {
        const date = new Date(params.row.time);
        const formatter = new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        return formatter.format(date);
      },
    },
    { field: "student", headerName: "חניך", minWidth: 100, sortable: false, flex: 1 },
    { field: "destination", headerName: "כתובת", minWidth: 100, sortable: false, flex: 1 },
  ];

  return (
    <>
      <Head>
        <title> תורים למרפאה | RKZ</title>
      </Head>
      <Box>
        <Container maxWidth="xl" sx={{ px: { xs: 0.5, sm: 3 } }}>
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack direction="row" textAlign="center" spacing={1}>
                <Typography variant="h4"> תורים למרפאה </Typography>
                <IconButton color="primary" onClick={handleCreateOpen}>
                  <AddCircleOutlineIcon />
                </IconButton>
              </Stack>
            </Stack>
            <Card sx={{ px: 0.5 }}>
              <DataGrid
                disableColumnMenu
                rows={futureAppointments}
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
                  rows={pastAppointments}
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
                        label="צוות"
                        value={rowForChange.staff || selectedRow.staff}
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
                        label="תלמיד"
                        value={rowForChange.student || selectedRow.student}
                        onChange={(e) =>
                          setNewAppointment({ ...rowForChange, student: e.target.value })
                        }
                        fullWidth
                      />
                    </Grid>
                    {/* <Grid item xs={12}>
                <TextField label="Date" defaultValue={selectedRow.date} fullWidth />
              </Grid> */}
                    <Grid item xs={12} sm={6}>
                      <DateTimePicker
                        ampm={false}
                        label="התחלה"
                        value={new Date(rowForChange.time || selectedRow.time)}
                        format="dd/MM/yy HH:mm"
                        onChange={(date) => setRowForChange({ ...rowForChange, time: date })}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                        maxDateTime={rowForChange.time}
                        sx={{ direction: "ltr", width: "100%" }}
                        slotProps={{
                          layout: { sx: { direction: "ltr" } },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="כתובת"
                        defaultValue={rowForChange.destination || selectedRow.destination}
                        onChange={(e) =>
                          setRowForChange({ ...rowForChange, destination: e.target.value })
                        }
                        fullWidth
                      />{" "}
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="הארות"
                        defaultValue={rowForChange.comments || selectedRow.comments}
                        onChange={(e) =>
                          setRowForChange({ ...rowForChange, comments: e.target.value })
                        }
                        fullWidth
                      />{" "}
                    </Grid>
                  </Grid>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>ביטול</Button>
                <Button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to save?")) {
                      handleSave();
                    }
                  }}
                >
                  שמירה
                </Button>
                <Button variant="contained" color="secondary" onClick={handleDelete}>
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
                      label="צוות"
                      value={newAppointment.staff || ""}
                      onChange={(e) =>
                        setNewAppointment({ ...newAppointment, staff: e.target.value })
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
                      label="תלמיד"
                      value={newAppointment.student}
                      onChange={(e) =>
                        setNewAppointment({ ...newAppointment, student: e.target.value })
                      }
                      fullWidth
                    />
                  </Grid>
                  {/* <Grid item xs={12}>
                <TextField label="User" defaultValue={selectedRow.user} fullWidth />
              </Grid> */}
                  {/* <Grid item xs={12}>
                <TextField label="Date" defaultValue={selectedRow.date} fullWidth />
              </Grid> */}
                  <Grid item xs={12} sm={6}>
                    <DateTimePicker
                      ampm={false}
                      label="התחלה"
                      value={newAppointment.time}
                      format="dd/MM/yy HH:mm"
                      onChange={(date) => setNewAppointment({ ...newAppointment, time: date })}
                      sx={{ direction: "ltr", width: "100%" }}
                      slotProps={{
                        layout: { sx: { direction: "ltr" } },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="יעד"
                      value={newAppointment.destination}
                      onChange={(e) =>
                        setNewAppointment({ ...newAppointment, destination: e.target.value })
                      }
                      error={!newAppointment.destination}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="הארות"
                      value={newAppointment.comments}
                      onChange={(e) =>
                        setNewAppointment({ ...newAppointment, comments: e.target.value })
                      }
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCreateClose}>ביטול</Button>
                <Button onClick={handleCreate}>שמירה</Button>
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
