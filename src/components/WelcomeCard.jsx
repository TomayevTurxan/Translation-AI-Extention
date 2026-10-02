import { Box, Card, Stack, Typography } from "@mui/material";

import LocalFireDepartment from "@mui/icons-material/LocalFireDepartment";
import cardSx from "../shared/theme";

export default function WelcomeCard({ streak }) {
  return (
    <Card
      sx={{
        ...cardSx,
        mt: 4,
        p: { xs: 2.5, md: 3.5 },
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(135deg, rgba(124,92,255,0.16), rgba(79,70,229,0.04))",
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{ xs: "flex-start", md: "center" }}
        spacing={3}
        sx={{
          position: "relative",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={800} letterSpacing="-1px">
            Keep learning.
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 540 }}>
            Every subtitle you explore becomes another step toward better
            English translation.
          </Typography>
        </Box>

        <Stack
          spacing={1}
          sx={{
            px: 2,
            borderRadius: 3,
            display: "flex",
            background: "rgba(255,255,255,0.05)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <LocalFireDepartment sx={{ color: "#ff9d42" }} />

            <Box>
              <Typography fontWeight={800}>{streak} day streak</Typography>

              <Typography variant="caption" color="text.secondary">
                Keep it going!
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Stack>
    </Card>
  );
}
