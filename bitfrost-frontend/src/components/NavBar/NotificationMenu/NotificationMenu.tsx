import { useState } from "react";
import { Box, Card, Chip, Tooltip } from "@mui/joy";
import { Notifications } from "@mui/icons-material";
import { ClickAwayListener } from "@mui/material";

const NotificationMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const notificationCount = 5;
  return (
    <>
      <Tooltip title={"Notifications (" + notificationCount + ")"}>
        <Box
          sx={{
            position: "relative",
            display: "flex",
            cursor: "pointer",
            "> svg": {
              transition: "transform ease .3s",
              transform: "scale(1)",
            },
            ":hover": {
              "> svg": {
                transform: "scale(1.05) rotate(-10deg)",
              },
            },
          }}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen((prev) => !prev);
          }}
        >
          <Notifications />
          <Chip
            sx={{
              position: "absolute",
              transform: "scale(0.7) translate(70%, 50%)",
              bottom: 0,
              right: 0,
              userSelect: "none",
            }}
          >
            {notificationCount}
          </Chip>
        </Box>
      </Tooltip>
      <ClickAwayListener
        onClickAway={() => setIsOpen(false)}
        mouseEvent={isOpen ? "onClick" : false}
      >
        <Card
          sx={{
            position: "absolute",
            top: "calc(1.5rem + 30px)",
            width: "20vw",
            height: "40vw",
            transform: "translateX(-80%)",
            margin: "1rem auto",
            borderRadius: 5,
            border: "thin solid gray",
            p: "1rem 1.5rem",
            pointerEvents: isOpen ? "auto" : "none",
            boxShadow: "0 0 1px 1px rgba(0,0,0,0.2)",
            opacity: isOpen ? 1 : 0,
            transition: "opacity 0.2s",
          }}
        >
          Test
        </Card>
      </ClickAwayListener>
    </>
  );
};

export default NotificationMenu;
