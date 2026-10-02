import { useMemo, useState } from "react";
import { Box } from "@mui/material";

import useStore from "../shared/useStore";
import { computeStreak, dayKey } from "../shared/storage";

import Sentences from "./Sentences";
import WordBank from "./WordBank";
import Quiz from "./Quiz";

import AppHeader from "../components/AppHeader";
import WelcomeCard from "../components/WelcomeCard";
import StatsSection from "../components/StatsSection";
import LearningGoal from "../components/LearningGoal";
import ContentTabs from "../components/ContentTabs";
import SearchFilters from "../components/SearchFilters";
import ClearHistoryDialog from "../components/ClearHistoryDialog";

const DAILY_GOAL = 20;

function filterItems(items, fields, query, filter) {
  const q = query.trim().toLowerCase();

  return items.filter(
    (item) =>
      (filter === "all" || item.status === filter) &&
      (!q ||
        fields.some((field) => (item[field] || "").toLowerCase().includes(q))),
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
      new Set([...sentences, ...words].map((item) => item.show).filter(Boolean))
        .size,
    [sentences, words],
  );

  const today = activity[dayKey()] || 0;
  const streak = computeStreak(activity);

  const filteredSentences = filterItems(
    sentences,
    ["text", "translation", "show"],
    query,
    filter,
  );

  const filteredWords = filterItems(
    words,
    ["word", "translation", "sentence", "show"],
    query,
    filter,
  );

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
        <AppHeader onClear={() => setConfirm(true)} />

        <WelcomeCard streak={streak} />

        <StatsSection
          wordCount={words.length}
          sentenceCount={sentences.length}
          showCount={shows}
        />

        <LearningGoal today={today} goal={DAILY_GOAL} />

        <ContentTabs value={tab} onChange={setTab} />

        {tab < 2 && (
          <SearchFilters
            tab={tab}
            query={query}
            filter={filter}
            onQueryChange={setQuery}
            onFilterChange={setFilter}
          />
        )}

        <Box sx={{ mt: 3 }}>
          {tab === 0 && <Sentences items={filteredSentences} />}

          {tab === 1 && <WordBank items={filteredWords} />}

          {tab === 2 && <Quiz words={words} />}
        </Box>

        <ClearHistoryDialog open={confirm} onClose={() => setConfirm(false)} />
      </Box>
    </Box>
  );
}
