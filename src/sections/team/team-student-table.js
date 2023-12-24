import PropTypes from "prop-types";
import { Avatar, Badge, Button } from "@mui/material";
import { DataGrid, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { getInitials } from "src/utils/get-initials";
import { deepOrange, deepPurple } from "@mui/material/colors";
import { useRouter } from "next/router";
import { useState } from "react";
import api from "src/utils/api";

export const TeamStudentTable = (props) => {
  const router = useRouter();
  const getTheProfile = (userId) => {
    router.push("/profile/" + userId);
  };
  const [rowSelectionModel, setRowSelectionModel] = useState([]);

  const columns = [
    // {
    //   field: "events",
    //   headerName: "",
    //   maxWidth: 40,
    //   renderCell: (params) => {
    //     return <Avatar sx={{ bgcolor: deepOrange[500] }}>{params.row.events || 0}</Avatar>;
    //   },
    // },
    {
      field: "is_in_school",
      headerName: "",
      flex: 1,
      minWidth: 60,
      maxWidth: 60,
      renderCell: (params) => {
        return (
          <Badge color="success" variant="dot" invisible={!params.row.is_in_school}>
            <Avatar
              sx={{ bgcolor: deepPurple[500] }}
              src={params.row.avatar}
              alt={getInitials(`${params.row.first_name} ${params.row.last_name}`)}
            >
              {getInitials(`${params.row.first_name} ${params.row.last_name}`)}
            </Avatar>
          </Badge>
        );
      },
    },
    {
      field: "fullName",
      headerName: "שם מלא",
      minWidth: 160,
      flex: 1,
      valueGetter: (params) => `${params.row.first_name || ""} ${params.row.last_name || ""}`,
    },
    {
      field: "building",
      headerName: "בניין",
      minWidth: 60,
      flex: 1,
      valueGetter: (params) => `${params.row.room ? params.row.room.building.buildingName : ""}`,
    },
    {
      field: "room",
      headerName: "חדר",
      minWidth: 60,
      flex: 1,
      valueGetter: (params) => `${params.row.room ? params.row.room.number : ""}`,
    },
  ];

  const updateAttendance = async (ids, isInSchool) => {
    try {
      const response = await api.post("/update-attendance/", {
        ids: ids,
        is_in_school: isInSchool,
      });

      console.log(response.data.message);
    } catch (error) {
      console.error("Error updating attendance:", error);
      // Handle error appropriately
    }
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <DataGrid
        onRowClick={(params) => getTheProfile(params.row.id)}
        rows={props.items}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 15 },
          },
          sorting: {
            sortModel: [{ field: "events", sort: "desc" }],
          },
        }}
        pageSizeOptions={[15, 30]}
        checkboxSelection
        slots={{ toolbar: GridToolbarQuickFilter }}
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setRowSelectionModel(newRowSelectionModel);
        }}
        localeText={{
          columnsPanelTextFieldLabel: "Custom Find Column",
          columnsPanelTextFieldPlaceholder: "Custom Column Title",
        }}
      />
      {rowSelectionModel.length > 0 && (
        <>
          <Button
            size="small"
            variant="contained"
            color="secondary"
            onClick={() => updateAttendance(rowSelectionModel, false)}
          >
            לא נוכחים
          </Button>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={() => updateAttendance(rowSelectionModel, true)}
          >
            נוכחים
          </Button>
        </>
      )}
    </div>
  );
};

TeamStudentTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      avatar: PropTypes.string,
      overall_score: PropTypes.number,
      team: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
      }),
      grade: PropTypes.string,
      is_in_school: PropTypes.bool,
    })
  ),
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};
