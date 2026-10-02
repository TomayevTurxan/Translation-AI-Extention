import { Box, Button, Stack, Typography } from "@mui/material";

import AutoAwesome from "@mui/icons-material/AutoAwesome";
import Delete from "@mui/icons-material/Delete";

export default function AppHeader({ onClear }) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      alignItems={{ xs: "flex-start", sm: "center" }}
      sx={{ justifyContent: "space-between" }}
      spacing={2}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: 3,
            display: "grid",
            placeItems: "center",
            background: "linear-gradient(135deg, #7c5cff, #4f46e5)",
            boxShadow: "0 10px 30px rgba(124,92,255,0.3)",
          }}
        >
          <AutoAwesome />
        </Box>

        <Box>
          <Typography variant="h5" fontWeight={800} letterSpacing="-0.5px">
            Translation AI
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Your personal English translation space
          </Typography>
        </Box>
      </Stack>

      <Button
        color="error"
        variant="outlined"
        startIcon={<Delete />}
        onClick={onClear}
        sx={{
          borderRadius: 2.5,
          textTransform: "none",
          px: 2,
        }}
      >
        Clear history
      </Button>
    </Stack>
  );
}
