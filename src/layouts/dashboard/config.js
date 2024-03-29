import ChartBarIcon from "@heroicons/react/24/solid/ChartBarIcon";
import CogIcon from "@heroicons/react/24/solid/CogIcon";
import HomeIcon from "@mui/icons-material/Home";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import UserPlusIcon from "@heroicons/react/24/solid/UserPlusIcon";
import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";
import { SvgIcon } from "@mui/material";
import EngineeringIcon from "@mui/icons-material/Engineering";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import FeedIcon from "@mui/icons-material/Feed";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import { useTranslation } from "react-i18next";
import { MedicalServices } from "@mui/icons-material";
import HandymanIcon from "@mui/icons-material/Handyman";

export const useSidebarItems = () => {
  const { t } = useTranslation();
  const loggedUserProfile = JSON.parse(localStorage.getItem("user")).profile;

  let items = [
    // {
    //   title: "Overview",
    //   path: "/",
    //   icon: (
    //     <SvgIcon fontSize="small">
    //       <ChartBarIcon />
    //     </SvgIcon>
    //   ),
    // },
    // {
    //   title: "חדשות",
    //   path: "/feed",
    //   icon: (
    //     <SvgIcon fontSize="small">
    //       <FeedIcon />
    //     </SvgIcon>
    //   ),
    // },
    // {
    //   // title: t("Students"),
    //   title: "חניכים",
    //   path: "/students",
    //   icon: (
    //     <SvgIcon fontSize="small">
    //       <UsersIcon />
    //     </SvgIcon>
    //   ),
    // },
    // {
    //   // title: t("Attending"),
    //   title: "נוכחים בכפר",
    //   path: "/attending",
    //   icon: (
    //     <SvgIcon fontSize="small">
    //       <UserPlusIcon />
    //     </SvgIcon>
    //   ),
    // },
    // {
    //   // title: t("Attending"),
    //   title: "חסרים",
    //   path: "/absent",
    //   icon: (
    //     <SvgIcon fontSize="small">
    //       <PersonRemoveIcon />
    //     </SvgIcon>
    //   ),
    // },
    // {
    //   // title: t("Teams"),
    //   title: "קבוצות",
    //   path: "/teams",
    //   icon: (
    //     <SvgIcon fontSize="small">
    //       <Diversity3Icon />
    //     </SvgIcon>
    //   ),
    // },
    {
      // title: t("Teams"),
      title: "רכב כפר",
      path: "/car",
      icon: (
        <SvgIcon fontSize="small">
          <DirectionsCarIcon />
        </SvgIcon>
      ),
    },
    {
      // title: t("Teams"),
      title: "תורים למרפאה",
      path: "/appointments",
      icon: (
        <SvgIcon fontSize="small">
          <MedicalServicesIcon />
        </SvgIcon>
      ),
    },
    {
      // title: t("Teams"),
      title: "דיווח ליקויים",
      path: "/reports",
      icon: (
        <SvgIcon fontSize="small">
          <HandymanIcon />
        </SvgIcon>
      ),
    },
    // {
    //   // title: t("Teams"),
    //   title: "מבנים",
    //   path: "/buildings",
    //   icon: (
    //     <SvgIcon fontSize="small">
    //       <HomeIcon />
    //     </SvgIcon>
    //   ),
    // },
    {
      // title: t("Staff"),
      title: "צוות",
      path: "/staff",
      icon: (
        <SvgIcon fontSize="small">
          <EngineeringIcon />
        </SvgIcon>
      ),
    },
    // {
    //   title: "חוגים/פרויקטים",
    //   path: "/activities",
    //   icon: (
    //     <SvgIcon fontSize="small">
    //       <EngineeringIcon />
    //     </SvgIcon>
    //   ),
    // },

    {
      // title: t("Settings"),
      title: "הגדרות",
      path: "/settings",
      icon: (
        <SvgIcon fontSize="small">
          <CogIcon />
        </SvgIcon>
      ),
    },
    // {
    //   title: t("Error"),
    //   path: "/404",
    //   icon: (
    //     <SvgIcon fontSize="small">
    //       <XCircleIcon />
    //     </SvgIcon>
    //   ),
    // },
  ];

  if (loggedUserProfile.role === "student") {
    items = items.filter(
      (item) =>
        item.path !== "/settings" &&
        item.path !== "/attending" &&
        item.path !== "/absent" &&
        item.path !== "/car"
    );
  }
  return items;
};
