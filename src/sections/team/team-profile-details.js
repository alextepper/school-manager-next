import { useEffect, useMemo, useState } from "react";
import { Card, CardHeader } from "@mui/material";
import { TeamStudentTable } from "./team-student-table";

export const TeamProfileDetails = (team) => {
  const [data, setData] = useState([]); // State for storing fetched data

  useEffect(() => {
    setData(team.team.students); // Set fetched data to state
  }, []);

  return (
    <Card>
      <CardHeader title="חניכים" />

      <TeamStudentTable items={data} />
    </Card>
  );
};
