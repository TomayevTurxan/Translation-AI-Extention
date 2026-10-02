import { Box, Card, Stack, Typography } from "@mui/material";
import cardSx from "../shared/theme";


export default function StatCard({ icon, value, label }) {
  return (
    <Card
      sx={{
        ...cardSx,
        p: 2.5,
        flex: 1,
        minWidth: 0,
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: 2.5,
            display: "grid",
            placeItems: "center",
            background: "rgba(124,92,255,0.14)",
            color: "#9b87ff",
          }}
        >
          {icon}
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h5" fontWeight={700} sx={{ lineHeight: 1.1 }}>
            {value}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>
            {label}
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
}
