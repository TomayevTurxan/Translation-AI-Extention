import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  LinearProgress,
  Stack,
  Tab,
  Tabs,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";

import Search from "@mui/icons-material/Search";
import AutoAwesome from "@mui/icons-material/AutoAwesome";
import MenuBook from "@mui/icons-material/MenuBook";
import LocalFireDepartment from "@mui/icons-material/LocalFireDepartment";
import PlayCircle from "@mui/icons-material/PlayCircle";
import Delete from "@mui/icons-material/Delete";
import TrendingUp from "@mui/icons-material/TrendingUp";

import useStore from "../shared/useStore";
import { clearAll, computeStreak, dayKey } from "../shared/storage";

import Sentences from "./Sentences";
import WordBank from "./WordBank";
import Quiz from "./Quiz";

const DAILY_GOAL = 20;

const cardSx = {
  border: "1px solid",
  borderColor: "rgba(255,255,255,0.08)",
  borderRadius: 4,
  background: "rgba(255,255,255,0.035)",
  boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
};

function StatCard({ icon, value, label }) {
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

export default function App() {
  const { words, sentences, activity } = useStore();

  const [tab, setTab] = useState(0);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [confirm, setConfirm] = useState(false);

  const shows = useMemo(
    () =>
      new Set([...sentences, ...words].map((x) => x.show).filter(Boolean)).size,
    [sentences, words],
  );

  const today = activity[dayKey()] || 0;
  const streak = computeStreak(activity);

  const q = query.trim().toLowerCase();

  const match = (item, fields) =>
    (filter === "all" || item.status === filter) &&
    (!q || fields.some((f) => (item[f] || "").toLowerCase().includes(q)));

  const fSentences = sentences.filter((s) =>
    match(s, ["text", "translation", "show"]),
  );

  const fWords = words.filter((w) =>
    match(w, ["word", "translation", "sentence", "show"]),
  );

  const progress = Math.min(100, (today / DAILY_GOAL) * 100);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 10% 0%, rgba(124,92,255,0.10), transparent 30%), #0b0b10",
        color: "text.primary",
      }}
    >
      <Box
        sx={{
          maxWidth: 1180,
          mx: "auto",
          px: { xs: 2, md: 4 },
          py: { xs: 3, md: 5 },
        }}
      >
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
            variant="d"
            startIcon={<Delete />}
            onClick={() => setConfirm(true)}
            sx={{
              borderRadius: 2.5,
              textTransform: "none",
              px: 2,
            }}
          >
            Clear history
          </Button>
        </Stack>

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
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
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

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mt: 2 }}
        >
          <StatCard
            icon={<MenuBook fontSize="small" />}
            value={words.length}
            label="Words learned"
          />

          <StatCard
            icon={<TrendingUp fontSize="small" />}
            value={sentences.length}
            label="Saved sentences"
          />

          <StatCard
            icon={<PlayCircle fontSize="small" />}
            value={shows}
            label="Shows watched"
          />
        </Stack>

        <Card
          sx={{
            ...cardSx,
            mt: 2,
            p: 2.5,
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            spacing={2}
          >
            <Box>
              <Typography fontWeight={700}>Today's learning goal</Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.4 }}
              >
                Learn {DAILY_GOAL} new words today
              </Typography>
            </Box>

            <Typography fontWeight={800} sx={{ color: "#9b87ff" }}>
              {Math.min(today, DAILY_GOAL)} / {DAILY_GOAL}
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

        <Box sx={{ mt: 5 }}>
          <Tabs
            value={tab}
            onChange={(_, value) => setTab(value)}
            variant="scrollable"
            scrollButtons={false}
            sx={{
              minHeight: 48,
              "& .MuiTabs-indicator": {
                height: 3,
                borderRadius: 3,
                background: "linear-gradient(90deg, #7c5cff, #a78bfa)",
              },
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                minHeight: 48,
                color: "text.secondary",
              },
              "& .Mui-selected": {
                color: "#fff !important",
              },
            }}
          >
            <Tab label="Sentences & Shows" />
            <Tab label="Word Bank" />
            <Tab label="Quiz" />
          </Tabs>
        </Box>

        {tab < 2 && (
          <Card
            sx={{
              ...cardSx,
              mt: 3,
              p: 2,
            }}
          >
            <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
              <TextField
                fullWidth
                size="small"
                placeholder={
                  tab === 0 ? "Search sentences or shows..." : "Search words..."
                }
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  "& .MuidInput-root": {
                    borderRadius: 2.5,
                  },
                }}
              />

              <ToggleButtonGroup
                exclusive
                size="small"
                value={filter}
                onChange={(_, value) => value && setFilter(value)}
                sx={{
                  "& .MuiToggleButton-root": {
                    textTransform: "capitalize",
                    px: 2,
                    borderColor: "rgba(255,255,255,0.08)",
                  },
                  "& .Mui-selected": {
                    background: "rgba(124,92,255,0.16) !important",
                    color: "#a78bfa !important",
                  },
                }}
              >
                {["all", "new", "learning", "mastered"].map((f) => (
                  <ToggleButton key={f} value={f}>
                    {f}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Stack>
          </Card>
        )}

        <Box sx={{ mt: 3 }}>
          {tab === 0 && <Sentences items={fSentences} />}

          {tab === 1 && <WordBank items={fWords} />}

          {tab === 2 && <Quiz words={words} />}
        </Box>

        <Dialog
          open={confirm}
          onClose={() => setConfirm(false)}
          PaperProps={{
            sx: {
              borderRadius: 4,
              background: "#15151c",
              border: "1px solid rgba(255,255,255,0.08)",
            },
          }}
        >
          <DialogTitle fontWeight={700}>Clear all history?</DialogTitle>

          <DialogContent>
            <Typography variant="body2" color="text.secondary">
              This deletes every saved sentence, word, and your streak. You
              can't undo it.
            </Typography>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setConfirm(false)} sx={{ borderRadius: 2 }}>
              Cancel
            </Button>

            <Button
              color="error"
              variant="contained"
              onClick={async () => {
                await clearAll();
                setConfirm(false);
              }}
              sx={{ borderRadius: 2 }}
            >
              Clear history
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
