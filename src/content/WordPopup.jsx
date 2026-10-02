import {
  Paper,
  Typography,
  IconButton,
  Stack,
  Chip,
  CircularProgress,
  Box,
  Divider,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

const W = Math.min(320, window.innerWidth - 24);

export default function WordPopup({ state, onClose }) {
  const { word, rect, status, data, error } = state;

  const left = Math.max(
    12,
    Math.min(rect.left + rect.width / 2 - W / 2, window.innerWidth - W - 12),
  );

  const bottom = window.innerHeight - rect.top + 12;

  return (
    <Paper
      elevation={0}
      sx={{
        position: "fixed",
        left,
        bottom,
        width: W,
        boxSizing: "border-box",
        p: 2.25,
        zIndex: 2147483647,

        background: "#171923",
        color: "#F5F3FF",

        border: "1px solid #343044",
        borderRadius: "18px",

        boxShadow: "0 16px 50px rgba(0,0,0,0.38)",

        fontFamily: "Inter, sans-serif",

        animation: "popupIn 180ms ease-out",

        "@keyframes popupIn": {
          from: {
            opacity: 0,
            transform: "translateY(8px) scale(0.98)",
          },
          to: {
            opacity: 1,
            transform: "translateY(0) scale(1)",
          },
        },
      }}
    >
      {/* Header */}
      <Stack
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{
            fontSize: 23,
            fontWeight: 750,
            letterSpacing: "-0.6px",
            color: "#F5F3FF",
          }}
        >
          {word}
        </Typography>

        <IconButton
          size="small"
          onClick={onClose}
          aria-label="Close"
          sx={{
            color: "#9895A8",
            background: "#252432",
            width: 30,
            height: 30,
            "&:hover": {
              background: "#393449",
              color: "#FFFFFF",
            },
          }}
        >
          <CloseIcon sx={{ fontSize: 17 }} />
        </IconButton>
      </Stack>

      {/* Loading */}
      {status === "loading" && (
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.2}
          sx={{ mt: 2.5, mb: 1 }}
        >
          <CircularProgress size={17} thickness={5} sx={{ color: "#A78BFA" }} />

          <Typography sx={{ color: "#A8A4B8", fontSize: 13 }}>
            Translating with AI...
          </Typography>
        </Stack>
      )}

      {/* Error */}
      {status === "error" && (
        <Box
          sx={{
            mt: 2,
            p: 1.5,
            borderRadius: 2,
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <Typography
            sx={{
              color: "#FCA5A5",
              fontSize: 13,
              lineHeight: 1.6,
              overflowWrap: "anywhere",
            }}
          >
            Translation failed: {error}
          </Typography>

          <Typography sx={{ color: "#A8A4B8", fontSize: 12, mt: 0.5 }}>
            Close and try again.
          </Typography>
        </Box>
      )}

      {/* Translation */}
      {status === "done" && (
        <Box sx={{ mt: 1.5 }}>
          {data.part_of_speech && (
            <Chip
              label={data.part_of_speech}
              size="small"
              sx={{
                height: 23,
                background: "rgba(167,139,250,0.13)",
                color: "#C4B5FD",
                border: "1px solid rgba(167,139,250,0.2)",
                fontSize: 11,
                fontWeight: 600,
                textTransform: "capitalize",
                "& .MuiChip-label": {
                  px: 1.1,
                },
              }}
            />
          )}

          <Typography
            sx={{
              mt: 1,
              fontSize: 27,
              fontWeight: 750,
              letterSpacing: "-0.7px",
              lineHeight: 1.25,
              color: "#C4B5FD",
              overflowWrap: "anywhere",
            }}
          >
            {data.translation_az}
          </Typography>

          {data.example_en && (
            <Box
              sx={{
                mt: 2,
                p: 1.5,
                borderRadius: "12px",
                background: "#22212D",
                border: "1px solid #343044",
              }}
            >
              <Typography
                sx={{
                  color: "#9691A8",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "1px",
                  mb: 1,
                }}
              >
                EXAMPLE
              </Typography>

              <Typography
                sx={{
                  color: "#F1EFF8",
                  fontSize: 13,
                  lineHeight: 1.6,
                }}
              >
                {data.example_en}
              </Typography>

              {data.example_az && (
                <Typography
                  sx={{
                    color: "#B9A5F8",
                    fontSize: 13,
                    lineHeight: 1.6,
                    mt: 0.5,
                  }}
                >
                  {data.example_az}
                </Typography>
              )}
            </Box>
          )}

          <Divider
            sx={{
              my: 1.7,
              borderColor: "#343044",
            }}
          />

          {/* Saved status */}
          <Stack direction="row" alignItems="center" spacing={0.8}>
            <CheckCircleRoundedIcon
              sx={{
                color: "#4ADE80",
                fontSize: 16,
              }}
            />

            <Typography
              sx={{
                color: "#4ADE80",
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              Saved to your word bank
            </Typography>
          </Stack>
        </Box>
      )}
    </Paper>
  );
}
