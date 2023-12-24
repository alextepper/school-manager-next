import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Avatar, Badge, Button } from "@mui/material";
import { DataGrid, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { getInitials } from "src/utils/get-initials";
import { deepOrange, deepPurple } from "@mui/material/colors";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import api from "src/utils/api";

export const StudentTable = ({ search }) => {
  const router = useRouter();
  const getTheProfile = (userId) => {
    router.push("/profile/" + userId);
  };
  const { t } = useTranslation("common");
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
          <Badge
            color="success"
            variant="dot"
            invisible={!params.row.is_in_school}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
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
      headerName: t("Full Name"),
      minWidth: 160,
      flex: 1,
      valueGetter: (params) => `${params.row.first_name || ""} ${params.row.last_name || ""}`,
    },
    {
      field: "teams",
      headerName: t("Team"),
      minWidth: 90,
      flex: 1,
      valueGetter: (params) => `${params.row.team ? params.row.team.teamName : ""}`,
    },
    {
      field: "building",
      headerName: t("Building"),
      minWidth: 60,
      flex: 1,
      valueGetter: (params) => `${params.row.room ? params.row.room.building.buildingName : ""}`,
    },
    { field: "grade", headerName: t("Grade"), flex: 1, minWidth: 60 },
  ];
  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 15,
    page: 0,
  });
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);

  useEffect(() => {
    let active = true;
    const is_in_school = search === "attending" ? "True" : "False";
    const url = search ? `student-profiles?is_in_school=${is_in_school}&` : "student-profiles?";

    (async () => {
      setLoading(true);
      const response = await api.get(
        `${url}limit=${paginationModel.pageSize}&offset=${
          paginationModel.page * paginationModel.pageSize
        }`
      );

      if (!active) {
        return;
      }

      setRows(response.data.results);
      setRowCount(response.data.count);
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [paginationModel]);

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
        disableColumnMenu
        onRowClick={(params) => getTheProfile(params.row.id)}
        columns={columns}
        rows={rows}
        loading={loading}
        rowCount={rowCount}
        pageSizeOptions={[15, 35, 50]}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        slots={{ toolbar: GridToolbarQuickFilter }}
        checkboxSelection
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setRowSelectionModel(newRowSelectionModel);
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

StudentTable.propTypes = {
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
};
