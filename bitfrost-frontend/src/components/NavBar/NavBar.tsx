import { Box, Divider, Typography } from "@mui/joy";
import icon from "@/assets/icon.png";
import { matchPath, useLocation, useNavigate } from "react-router";
import type { SxProps } from "@mui/joy/styles/types";
import { AccountCircle } from "@mui/icons-material";
import NotificationMenu from "@/components/NavBar/NotificationMenu/NotificationMenu.tsx";

const links = [
  {
    label: "Projects",
    href: "/",
    paths: ["/projects/:projectTag"],
  },
  {
    label: "Catalogue",
    href: "/catalogue",
    paths: ["/catalogue/*"],
  },
];

const CustomLink = (props: {
  children: React.ReactNode;
  href: string;
  disableAnimation?: boolean;
  sx?: SxProps;
  paths?: string[];
}) => {
  const currentLocation = useLocation();
  const navigate = useNavigate();
  const isActive =
    matchPath(currentLocation.pathname, props.href) ||
    (props.paths ?? []).reduce(
      (acc, current) =>
        acc ||
        Boolean(
          matchPath(
            {
              path: current,
            },
            currentLocation.pathname,
          ),
        ),
      false,
    );

  return (
    <Typography
      key={props.href}
      onClick={(e) => {
        e.preventDefault();
        navigate(props.href);
      }}
      sx={{
        position: "relative",
        opacity: 0.9,
        cursor: "pointer",
        transition: "opacity ease .3s",
        ":before": props.disableAnimation
          ? {}
          : {
              content: "''",
              width: "100%",
              opacity: isActive ? 1 : 0,
              height: "2px",
              background:
                "var(--joy-palette-text-secondary, var(--joy-palette-neutral-700, #32383E))",
              display: "block",
              position: "absolute",
              bottom: 0,
              transition: "opacity ease .3s",
            },
        ":hover": props.disableAnimation
          ? {}
          : {
              opacity: 1,
              ":before": {
                opacity: 1,
              },
            },
        ...props.sx,
      }}
    >
      {props.children}
    </Typography>
  );
};

const Links = () => {
  return (
    <Box sx={{ display: "flex", gap: "2rem" }}>
      {links.map((link) => (
        <CustomLink href={link.href} paths={link.paths} key={link.href}>
          {link.label}
        </CustomLink>
      ))}
    </Box>
  );
};

const NavBar = () => {
  return (
    <Box
      sx={{
        width: "calc(100% - 3.4rem)",
        position: "relative",
        left: "50%",
        transform: "translateX(-50%)",
        mt: "1rem",
        padding: ".7rem 1.7rem",
        borderRadius: 20,
        border: "1px solid rgba(0, 0, 0, 0.4)",
        boxShadow: "rgba(0, 0, 0, 0.4) 0px 0px 2px",
        display: "flex",
        alignItems: "center",
        gap: "2rem",
      }}
    >
      <CustomLink
        href={"/"}
        disableAnimation
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <img src={icon} style={{ height: "1.2rem" }} alt={"Bitfrost Logo"} />
        <Typography
          sx={{
            fontSize: "1.1rem",
          }}
        >
          Bitfrőst
        </Typography>
      </CustomLink>
      <Divider orientation={"vertical"} sx={{ width: "thin" }} />
      <Links />
      <Box
        sx={{
          ml: "auto",
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
        }}
      >
        <NotificationMenu />
        <AccountCircle />
      </Box>
    </Box>
  );
};

export default NavBar;
