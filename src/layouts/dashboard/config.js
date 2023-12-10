import ChartBarIcon from "@heroicons/react/24/solid/ChartBarIcon";
import CogIcon from "@heroicons/react/24/solid/CogIcon";
import LockClosedIcon from "@heroicons/react/24/solid/LockClosedIcon";
import ShoppingBagIcon from "@heroicons/react/24/solid/ShoppingBagIcon";
import UserPlusIcon from "@heroicons/react/24/solid/UserPlusIcon";
import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";
import { SvgIcon } from "@mui/material";
import EngineeringIcon from "@mui/icons-material/Engineering";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import FeedIcon from "@mui/icons-material/Feed";
import { useTranslation } from "react-i18next";

export const useSidebarItems = () => {
  const { t } = useTranslation();

  const items = [
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
    //   title: "Feed",
    //   path: "/feed",
    //   icon: (
    //     <SvgIcon fontSize="small">
    //       <FeedIcon />
    //     </SvgIcon>
    //   ),
    // },
    {
      title: t("Students"),
      path: "/students",
      icon: (
        <SvgIcon fontSize="small">
          <UsersIcon />
        </SvgIcon>
      ),
    },
    {
      title: t("Attending"),
      path: "/attending",
      icon: (
        <SvgIcon fontSize="small">
          <UserPlusIcon />
        </SvgIcon>
      ),
    },
    {
      title: t("Teams"),
      path: "/teams",
      icon: (
        <SvgIcon fontSize="small">
          <Diversity3Icon />
        </SvgIcon>
      ),
    },

    {
      title: t("Staff"),
      path: "/staff",
      icon: (
        <SvgIcon fontSize="small">
          <EngineeringIcon />
        </SvgIcon>
      ),
    },
    // {
    //   title: "Activities",
    //   path: "/activities",
    //   icon: (
    //     <SvgIcon fontSize="small">
    //       <EngineeringIcon />
    //     </SvgIcon>
    //   ),
    // },

    {
      title: t("Settings"),
      path: "/settings",
      icon: (
        <SvgIcon fontSize="small">
          <CogIcon />
        </SvgIcon>
      ),
    },
    {
      title: t("Error"),
      path: "/404",
      icon: (
        <SvgIcon fontSize="small">
          <XCircleIcon />
        </SvgIcon>
      ),
    },
  ];
  return items;
};
