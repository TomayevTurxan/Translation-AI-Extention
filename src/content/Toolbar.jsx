import { useEffect, useState } from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";

import TouchAppRoundedIcon from "@mui/icons-material/TouchAppRounded";

function getPlayer() {
  return document.querySelector("#movie_player");
}

function getPlayerRect() {
  return getPlayer()?.getBoundingClientRect() ?? null;
}

function isPlayerVisible(rect) {
  if (!rect) {
    return false;
  }

  if (rect.width < 250 || rect.height < 150) {
    return false;
  }

  if (
    rect.bottom <= 0 ||
    rect.top >= window.innerHeight ||
    rect.right <= 0 ||
    rect.left >= window.innerWidth
  ) {
    return false;
  }

  const visibleTop = Math.max(0, rect.top);
  const visibleBottom = Math.min(window.innerHeight, rect.bottom);

  const visibleHeight = Math.max(0, visibleBottom - visibleTop);

  return visibleHeight >= Math.min(150, rect.height * 0.25);
}

export default function Toolbar({ selectWordEnabled, onToggleSelectWord }) {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    let raf = null;

    const updatePosition = () => {
      if (raf) {
        cancelAnimationFrame(raf);
      }

      raf = requestAnimationFrame(() => {
        const rect = getPlayerRect();

        if (!isPlayerVisible(rect)) {
          setPosition(null);
          return;
        }

        const toolbarWidth = 54;
        const toolbarHeight = 108;
        const rightGap = 14;

        const left = Math.max(
          8,
          Math.min(
            rect.right - toolbarWidth - rightGap,
            window.innerWidth - toolbarWidth - 8,
          ),
        );

        let top = rect.top + (rect.height - toolbarHeight) / 2;

        top = Math.max(
          8,
          Math.min(top, window.innerHeight - toolbarHeight - 8),
        );

        setPosition({
          left,
          top,
        });
      });
    };

    updatePosition();

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    const interval = window.setInterval(updatePosition, 400);

    let observer = null;
    const player = getPlayer();

    if (player) {
      observer = new IntersectionObserver(() => updatePosition(), {
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      });

      observer.observe(player);
    }

    return () => {
      window.removeEventListener("resize", updatePosition);

      window.removeEventListener("scroll", updatePosition, true);

      window.clearInterval(interval);

      observer?.disconnect();

      if (raf) {
        cancelAnimationFrame(raf);
      }
    };
  }, []);

  if (!position) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "fixed",
        left: position.left,
        top: position.top,

        width: 54,
        p: 0.75,

        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,

        zIndex: 2147483647,

        borderRadius: "16px",

        background:
          "linear-gradient(180deg, rgba(20,20,25,0.96), rgba(13,13,17,0.96))",

        border: "1px solid rgba(255,255,255,0.12)",

        boxShadow:
          "0 18px 45px rgba(0,0,0,0.45), 0 0 0 1px rgba(167,139,250,0.04)",

        backdropFilter: "blur(14px)",

        boxSizing: "border-box",
        userSelect: "none",
        pointerEvents: "auto",
      }}
    >
      <Tooltip
        title={selectWordEnabled ? "Select word ON" : "Select word OFF"}
        placement="left"
        arrow
        slotProps={{
          popper: {
            disablePortal: true,
            modifiers: [

                { name: "preventOverflow", options: { padding: 0 } },
            ],
          },
          tooltip: {
            sx: {
              bgcolor: "#1c1c24",
              color: "#fff",
              fontSize: 14,
              whiteSpace: "nowrap",
              border: "1px solid rgba(255,255,255,0.12)",
            },
          },
          arrow: { sx: { color: "#1c1c24" } },
        }}
      >
        <IconButton
          onClick={onToggleSelectWord}
          size="small"
          aria-label="Toggle select word"
          sx={{
            width: 40,
            height: 40,
            borderRadius: "11px",

            color: selectWordEnabled ? "#C4B5FD" : "#AAA7B5",

            background: selectWordEnabled
              ? "rgba(139,92,246,0.14)"
              : "rgba(255,255,255,0.035)",

            border: selectWordEnabled
              ? "1px solid rgba(139,92,246,0.48)"
              : "1px solid rgba(255,255,255,0.09)",

            transition: "all 160ms ease",

            "&:hover": {
              color: "#DDD6FE",
              background: "rgba(139,92,246,0.18)",
              borderColor: "rgba(139,92,246,0.6)",
            },
          }}
        >
          <TouchAppRoundedIcon sx={{ fontSize: 22 }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
