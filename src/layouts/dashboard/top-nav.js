import PropTypes from "prop-types";
import Bars3Icon from "@heroicons/react/24/solid/Bars3Icon";
import { Avatar, Box, IconButton, Link, Stack, SvgIcon, useMediaQuery } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { usePopover } from "src/hooks/use-popover";
import { AccountPopover } from "./account-popover";
import { getInitials } from "src/utils/get-initials";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

const SIDE_NAV_WIDTH = 280;
const TOP_NAV_HEIGHT = 64;

export const TopNav = (props) => {
  const [loggedUserProfile, setLoggedUserProfile] = useState({});
  const { onNavOpen } = props;
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const accountPopover = usePopover();
  const { i18n } = useTranslation();
  const router = useRouter();
  const { pathname, asPath, query } = router;

  const handleLanguageChange = (language) => {
    localStorage.setItem("language", language);
    document.dir = language === "he" ? "rtl" : "ltr";
    router.push({ pathname, query }, asPath, { locale: language });
  };

  useEffect(() => {
    const userProfile = JSON.parse(localStorage.getItem("user"))?.profile || {};
    setLoggedUserProfile(userProfile);
  }, []);

  return (
    <>
      <Box
        component="header"
        sx={{
          backdropFilter: "blur(6px)",
          backgroundColor: (theme) => alpha(theme.palette.background.default, 0.8),
          position: "sticky",
          left: {
            lg: `${SIDE_NAV_WIDTH}px`,
          },
          top: 0,
          width: {
            lg: `calc(100% - ${SIDE_NAV_WIDTH}px)`,
          },
          zIndex: (theme) => theme.zIndex.appBar,
        }}
      >
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          spacing={2}
          sx={{
            minHeight: TOP_NAV_HEIGHT,
            px: 2,
          }}
        >
          <Stack alignItems="center" direction="row" spacing={2}>
            {!lgUp && (
              <IconButton onClick={onNavOpen}>
                <SvgIcon fontSize="small">
                  <Bars3Icon />
                </SvgIcon>
              </IconButton>
            )}
          </Stack>
          <Stack alignItems="center" direction="row" spacing={2}>
            <IconButton onClick={() => handleLanguageChange("en")} aria-label="Switch to English">
              EN
            </IconButton>
            <IconButton onClick={() => handleLanguageChange("he")} aria-label="Switch to Hebrew">
              HE
            </IconButton>

            <Avatar
              onClick={accountPopover.handleOpen}
              ref={accountPopover.anchorRef}
              sx={{
                cursor: "pointer",
                height: 40,
                width: 40,
              }}
              src={loggedUserProfile.avatar}
            >
              {getInitials(loggedUserProfile.first_name + " " + loggedUserProfile.last_name)}
            </Avatar>
          </Stack>
        </Stack>
      </Box>
      <AccountPopover
        anchorEl={accountPopover.anchorRef.current}
        open={accountPopover.open}
        onClose={accountPopover.handleClose}
        user={
          <Link
            href={
              (loggedUserProfile.role == "student" ? "/profile/" : `/${loggedUserProfile.role}/`) +
              loggedUserProfile.id
            }
            underline="none"
          >
            {loggedUserProfile.first_name} {loggedUserProfile.last_name}
          </Link>
        }
      />
    </>
  );
};

TopNav.propTypes = {
  onNavOpen: PropTypes.func,
};
