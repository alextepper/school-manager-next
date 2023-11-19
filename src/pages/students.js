import { useEffect, useState } from "react";
import Head from "next/head";
import { Box, Card, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { CustomersSearch } from "src/sections/customer/customers-search";
import axios from "axios";
import { StudentTable } from "src/sections/student/student-table";

const Page = () => {
  const [data, setData] = useState([]); // State for storing fetched data

  useEffect(() => {
    const fetchStudentList = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/student-profiles`);
        setData(response.data); // Set fetched data to state
      } catch (err) {
        console.error("Error fetching student profiles:", err);
        // Handle error appropriately
      }
    };

    fetchStudentList();
  }, []);

  return (
    <>
      <Head>
        <title>Students | Devias Kit</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Students</Typography>
                {/* <Stack alignItems="center" direction="row" spacing={1}>
                  <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowUpOnSquareIcon />
                      </SvgIcon>
                    }
                  >
                    Import
                  </Button>
                  <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowDownOnSquareIcon />
                      </SvgIcon>
                    }
                  >
                    Export
                  </Button>
                </Stack> */}
              </Stack>
              {/* <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                >
                  Add
                </Button>
              </div> */}
            </Stack>
            <CustomersSearch />
            <Card>
              <StudentTable items={data} />
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
