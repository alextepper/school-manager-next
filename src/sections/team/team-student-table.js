import PropTypes from "prop-types";
import { Avatar, Badge } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getInitials } from "src/utils/get-initials";
import { deepOrange, deepPurple } from "@mui/material/colors";
import { useRouter } from "next/router";

export const TeamStudentTable = (props) => {
  const router = useRouter();
  const getTheProfile = (userId) => {
    router.push("/profile/" + userId);
  };

  const columns = [
    {
      field: "overall_score",
      headerName: "",
      maxWidth: 40,
      renderCell: (params) => {
        return <Avatar sx={{ bgcolor: deepOrange[500] }}>{params.row.overall_score || 0}</Avatar>;
      },
    },
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
      headerName: "Full name",
      minWidth: 160,
      flex: 1,
      valueGetter: (params) => `${params.row.first_name || ""} ${params.row.last_name || ""}`,
    },
  ];

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
            sortModel: [{ field: "overall_score", sort: "desc" }],
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
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
