import React, { useState } from "react";
import { Dialog, DialogContent, DialogActions, Button, TextField, Grid } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";

export default function CarUseEditDialog({ open, handleClose, input, handleSave }) {
  const [selectedRow, setSelectedRow] = useState(input);
  console.log(selectedRow);
  //   const [startTime, setStartTime] = useState(new Date(selectedRow.start_time));
  //   const [endTime, setEndTime] = useState(new Date(selectedRow.end_time));
  //   const [startMileage, setStartMileage] = useState(selectedRow.start_mileage);
  //   const [endMileage, setEndMileage] = useState(selectedRow.end_mileage);
  //   const [area, setArea] = useState(selectedRow.area);
  //   const [destination, setDestination] = useState(selectedRow.destination);
  //   const [purpose, setPurpose] = useState(selectedRow.purpose);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        {selectedRow && (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <DateTimePicker
                label="התחלה"
                value={startTime}
                format="dd/MM/yy HH:mm"
                onChange={setStartTime}
                renderInput={(params) => <TextField {...params} dir="ltr" fullWidth />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DateTimePicker
                label="סיום"
                format="dd/MM/yy HH:mm"
                value={endTime}
                onChange={setEndTime}
                renderInput={(params) => <TextField {...params} dir="ltr" fullWidth />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="ק''מ התחלה"
                value={startMileage}
                onChange={(e) => setStartMileage(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="ק''מ בסוף"
                value={endMileage}
                onChange={(e) => setEndMileage(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="תחום"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="יעד"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="הארות"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={() => {
            if (window.confirm("Are you sure you want to save?")) {
              handleSave();
            }
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
