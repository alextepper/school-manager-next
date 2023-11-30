import PropTypes from "prop-types";
import { Avatar, Badge, FormControlLabel, Switch } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getInitials } from "src/utils/get-initials";
import { deepOrange, deepPurple } from "@mui/material/colors";
import { useRouter } from "next/router";
import { StyledBadge } from "src/utils/styledBadge";

export const StaffTable = (props) => {
  const router = useRouter();
  const getThePage = (url) => {
    router.push(url);
  };

  const columns = [
    {
      field: "is_on_shift",
      headerName: "",
      flex: 1,
      minWidth: 60,
      maxWidth: 60,
      renderCell: (params) => {
        return (
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
            invisible={!params.row.is_on_shift}
          >
            <Avatar
              sx={{ bgcolor: deepPurple[500] }}
              src={params.row.avatar}
              alt={getInitials(`${params.row.first_name} ${params.row.last_name}`)}
            >
              {getInitials(`${params.row.first_name} ${params.row.last_name}`)}
            </Avatar>
          </StyledBadge>
        );
      },
    },

    {
      field: "fullName",
      headerName: "Full name",
      minWidth: 160,
      flex: 1,
      valueGetter: (params) => `${params.row.first_name || ""} ${params.row.last_name || ""}`,
    },
    {
      field: "teams",
      headerName: "Team",
      minWidth: 90,
      flex: 1,
      valueGetter: (params) => params.row.team.map((team) => `${team ? team.teamName : ""}`),
    },
  ];

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <DataGrid
        disableColumnMenu
        onRowClick={(params) => getThePage("/staff/" + params.row.id)}
        rows={props.items}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 15 },
          },
          sorting: {
            sortModel: [{ field: "is_on_shift", sort: "desc" }],
          },
        }}
        pageSizeOptions={[5, 10, 15]}
        checkboxSelection
      />
    </div>
  );
};

StaffTable.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      avatar: PropTypes.string,
      is_on_shift: PropTypes.bool,
    })
  ),
};
