import { Card, Box, Stack, Typography, LinearProgress } from "@mui/material";
import cardSx from "../shared/theme";


export default function LearningGoal({ today, goal }) {
  const progress = Math.min(100, (today / goal) * 100);

  return (
    <Card sx={{ ...cardSx, mt: 2, p: 2.5 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        spacing={2}
      >
        <Box>
          <Typography fontWeight={700}>Today's learning goal</Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>
            Learn {goal} new words today
          </Typography>
        </Box>

        <Typography fontWeight={800} sx={{ color: "#9b87ff" }}>
          {Math.min(today, goal)} / {goal}
        </Typography>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          mt: 2,
          height: 8,
          borderRadius: 10,
          backgroundColor: "rgba(255,255,255,0.07)",

          "& .MuiLinearProgress-bar": {
            borderRadius: 10,
            background: "linear-gradient(90deg, #7c5cff, #a78bfa)",
          },
        }}
      />
    </Card>
  );
}
