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
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import api from "src/utils/api";
import Head from "next/head";
import { Box, Container, Stack } from "@mui/system";

import { DataGrid } from "@mui/x-data-grid";
import { DateTimePicker } from "@mui/x-date-pickers";

// ...

// ...

const Page = () => {
  const loggedUserProfile = JSON.parse(localStorage.getItem("user")).profile;
  const [carUses, setCarUses] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [staff, setStaff] = useState([]);
  const [rowForChange, setRowForChange] = useState({});
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newCarUse, setNewCarUse] = useState({
    start_time: new Date(),
    end_time: new Date(),
    // start_mileage: "",
    // end_mileage: "",
    area: "",
    destination: "",
    // purpose: "",
    user: loggedUserProfile.id, // replace with actual logged user profile id
    car: 1,
  });

  useEffect(() => {
    const fetchCarUses = async () => {
      try {
        const response = await api.get("/car-use/list/");
        const sortedResults = response.data.results.sort(
          (a, b) => new Date(b.start_time) - new Date(a.start_time)
        );
        setCarUses(sortedResults);
      } catch (error) {
        console.error("Failed to fetch car uses", error);
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
    fetchCarUses();
  }, []);

  const handleClickOpen = (params) => {
    setSelectedRow(params.row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    try {
      const response = await api.patch(`car-use/update/${selectedRow.id}/`, rowForChange);

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update the carUses state with the updated row
      setCarUses((prevCarUses) =>
        prevCarUses.map((carUse) =>
          carUse.id === selectedRow.id ? { ...carUse, ...rowForChange } : carUse
        )
      );

      // Close the dialog
      setOpen(false);
    } catch (error) {
      console.error("There was a problem with the axios operation:", error);
    }
  };

  const handleCreateOpen = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateClose = () => {
    setCreateDialogOpen(false);
  };

  const handleCreate = async () => {
    try {
      const response = await api.post("car-use/create/", newCarUse);

      console.log(response.data);
      // You can update the state or do anything with the returned data here
      setCarUses((prevCarUses) => [response.data, ...prevCarUses]);
      handleCreateClose();
    } catch (error) {
      console.error("There was a problem with the axios operation: ", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete?")) {
      try {
        await api.delete(`car-use/update/${selectedRow.id}/`);
        setCarUses(carUses.filter((item) => item.id !== selectedRow.id));
        handleClose();
      } catch (error) {
        console.error("Failed to delete car use", error);
      }
    }
  };

  const columns = [
    {
      field: "user",
      headerName: "משתמש",
      minWidth: 100,
      flex: 1,
      valueGetter: (params) => {
        const user = staff.find((staffMember) => staffMember.id === params.row.user);
        return user ? `${user.first_name} ${user.last_name}` : "";
      },
    },
    {
      field: "date",
      headerName: "תאריך",
      minWidth: 80,
      flex: 1,
      valueGetter: (params) => {
        const date = new Date(params.row.start_time);
        const formatter = new Intl.DateTimeFormat("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        });
        return formatter.format(date);
      },
    },
    {
      field: "start_time",
      headerName: "התחלה",
      minWidth: 60,
      flex: 1,
      valueGetter: (params) => {
        const date = new Date(params.row.start_time);
        const formatter = new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        return formatter.format(date);
      },
    },
    {
      field: "end_time",
      headerName: "סיום",
      minWidth: 60,
      flex: 1,
      valueGetter: (params) => {
        const date = new Date(params.row.end_time);
        const formatter = new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        return formatter.format(date);
      },
    },

    // { field: "start_mileage", headerName: "Start Mileage", minWidth: 100 },
    // { field: "end_mileage", headerName: "End Mileage", minWidth: 100 },
    { field: "area", headerName: "תחום", minWidth: 100, flex: 1 },
    { field: "destination", headerName: "יעד", minWidth: 100, flex: 1 },
    // { field: "purpose", headerName: "Purpose", minWidth: 200 },
  ];

  // ...

  return (
    // ...
    <>
      <Head>
        <title>רכב כפר | RKZ</title>
      </Head>
      <Box>
        <Container maxWidth="xl" sx={{ px: { xs: 0.5, sm: 3 } }}>
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack direction="row" textAlign="center" spacing={1}>
                <Typography variant="h4">נסיעות ברכב</Typography>
                <IconButton color="primary" onClick={handleCreateOpen}>
                  <AddCircleOutlineIcon />
                </IconButton>
              </Stack>
            </Stack>
            <DataGrid
              disableColumnMenu
              rows={carUses}
              columns={columns}
              pageSize={5}
              pagination
              onRowClick={handleClickOpen}
              slotProps={{
                GridToolbarQuickFilter: { placeholder: "ltr" },
                pagination: {
                  labelRowsPerPage: "שורות בעמוד:",
                  sx: { direction: "ltr" },
                },
              }}
              initialState={{ sortModel: [{ field: "date", sort: "asc" }] }}
            />
            <Dialog open={open} onClose={handleClose}>
              <DialogContent>
                {/* Render the fields of the selected row here */}
                {selectedRow && (
                  <Grid container spacing={2}>
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
                        value={new Date(rowForChange.start_time || selectedRow.start_time)}
                        format="dd/MM/yy HH:mm"
                        onChange={(date) => setRowForChange({ ...rowForChange, start_time: date })}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                        maxDateTime={rowForChange.start_time}
                        sx={{ direction: "ltr" }}
                        slotProps={{ popper: { sx: { direction: "ltr" } } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <DateTimePicker
                        ampm={false}
                        label="סיום"
                        format="dd/MM/yy HH:mm"
                        value={new Date(rowForChange.end_time || selectedRow.end_time)}
                        onChange={(date) => setRowForChange({ ...rowForChange, end_time: date })}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                        sx={{ direction: "ltr" }}
                        slotProps={{ popper: { sx: { direction: "ltr" } } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="ק''מ התחלה"
                        defaultValue={rowForChange.start_mileage || selectedRow.start_mileage}
                        onChange={(e) =>
                          setRowForChange({ ...rowForChange, start_mileage: e.target.value })
                        }
                        fullWidth
                      />{" "}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="ק''מ בסוף"
                        defaultValue={rowForChange.end_mileage || selectedRow.end_mileage}
                        onChange={(e) =>
                          setRowForChange({ ...rowForChange, end_mileage: e.target.value })
                        }
                        fullWidth
                      />{" "}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="תחום"
                        defaultValue={rowForChange.area || selectedRow.area}
                        onChange={(e) => setRowForChange({ ...rowForChange, area: e.target.value })}
                        fullWidth
                      />{" "}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="יעד"
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
                        defaultValue={rowForChange.purpose || selectedRow.purpose}
                        onChange={(e) =>
                          setRowForChange({ ...rowForChange, purpose: e.target.value })
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
                  {/* <Grid item xs={12}>
                <TextField label="User" defaultValue={selectedRow.user} fullWidth />
              </Grid> */}
                  {/* <Grid item xs={12}>
                <TextField label="Date" defaultValue={selectedRow.date} fullWidth />
              </Grid> */}
                  <Grid item xs={12} sm={6}>
                    <DateTimePicker
                      sx={{ direction: "ltr" }}
                      ampm={false}
                      label="התחלה"
                      value={newCarUse.start_time}
                      format="dd/MM/yy HH:mm"
                      onChange={(date) => setNewCarUse({ ...newCarUse, start_time: date })}
                      slotProps={{ popper: { sx: { direction: "ltr" } } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DateTimePicker
                      sx={{ direction: "ltr" }}
                      ampm={false}
                      label="סיום"
                      value={newCarUse.end_time}
                      format="dd/MM/yy HH:mm"
                      onChange={(date) => setNewCarUse({ ...newCarUse, end_time: date })}
                      minDateTime={newCarUse.start_time}
                      slotProps={{ popper: { sx: { direction: "ltr" } } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="ק''מ התחלה"
                      value={newCarUse.start_mileage}
                      onChange={(e) =>
                        setNewCarUse({ ...newCarUse, start_mileage: e.target.value })
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="ק''מ בסוף"
                      value={newCarUse.end_mileage}
                      onChange={(e) => setNewCarUse({ ...newCarUse, end_mileage: e.target.value })}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      label={!newCarUse.area ? "תחום" : "תחום"}
                      value={newCarUse.area}
                      onChange={(e) => setNewCarUse({ ...newCarUse, area: e.target.value })}
                      fullWidth
                      error={!newCarUse.area}
                    >
                      <MenuItem value="הדרכה">הדרכה</MenuItem>
                      <MenuItem value="רפואה">רפואה</MenuItem>
                      <MenuItem value="סוציאלי">שרות סוציאלי</MenuItem>
                      <MenuItem value="אחר">אחר</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="יעד"
                      value={newCarUse.destination}
                      onChange={(e) => setNewCarUse({ ...newCarUse, destination: e.target.value })}
                      error={!newCarUse.destination}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="הארות"
                      value={newCarUse.purpose}
                      onChange={(e) => setNewCarUse({ ...newCarUse, purpose: e.target.value })}
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
