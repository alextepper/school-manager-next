import PropTypes from "prop-types";
import {
  Box,
  Card,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Avatar,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { getInitials } from "src/utils/get-initials";
import React, { useState, useEffect, useMemo } from "react";

export const StudentTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
  } = props;

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "none" });

  const getSortedItems = (items, sortConfig) => {
    const sortedItems = [...items];
    if (sortConfig.key !== null) {
      sortedItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortedItems;
  };

  const sortedItems = useMemo(() => {
    return getSortedItems(items, sortConfig);
  }, [items, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell onClick={() => requestSort("first_name")}>Name</TableCell>
                <TableCell onClick={() => requestSort("team")}>Team</TableCell>
                <TableCell onClick={() => requestSort("grade")}>Grade</TableCell>
                <TableCell onClick={() => requestSort("is_in_school")}>In School</TableCell>
                <TableCell onClick={() => requestSort("overall_score")}>Overall Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedItems.map((student) => (
                <TableRow hover key={student.id}>
                  <TableCell>
                    <Stack alignItems="center" direction="row" spacing={2}>
                      <Avatar
                        src={student.avatar}
                        alt={getInitials(`${student.first_name} ${student.last_name}`)}
                      >
                        {getInitials(`${student.first_name} ${student.last_name}`)}
                      </Avatar>
                      <Typography variant="subtitle2">
                        {student.first_name} {student.last_name}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{student.team?.name}</TableCell>
                  <TableCell>{student.grade}</TableCell>
                  <TableCell>{student.is_in_school ? "Yes" : "No"}</TableCell>
                  <TableCell>{student.overall_score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 15, 25]}
      />
    </Card>
  );
};

StudentTable.propTypes = {
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
