import { Stack } from "@mui/material";

import MenuBook from "@mui/icons-material/MenuBook";
import TrendingUp from "@mui/icons-material/TrendingUp";
import PlayCircle from "@mui/icons-material/PlayCircle";

import StatCard from "./StatCard";

export default function StatsSection({ wordCount, sentenceCount, showCount }) {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }}>
      <StatCard
        icon={<MenuBook fontSize="small" />}
        value={wordCount}
        label="Words learned"
      />

      <StatCard
        icon={<TrendingUp fontSize="small" />}
        value={sentenceCount}
        label="Saved sentences"
      />

      <StatCard
        icon={<PlayCircle fontSize="small" />}
        value={showCount}
        label="Shows watched"
      />
    </Stack>
  );
}
