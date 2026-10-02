import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { generateQuiz } from "../shared/ai";
import { applyReview } from "../shared/srs";
import { bump, updateWord } from "../shared/storage";
import Empty from "./Empty";

export default function Quiz({ words }) {
  const [phase, setPhase] = useState("idle");
  const [qs, setQs] = useState([]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [err, setErr] = useState("");

  if (!words.length)
    return (
      <Empty
        icon="🧠"
        title="No words to practice yet"
        hint="Save a few words while watching, then come back for a quiz."
      />
    );

  const start = async () => {
    setPhase("loading");
    setErr("");
    try {
      const pool = [...words]
        .sort((a, b) => a.nextReview - b.nextReview)
        .slice(0, 10); // most due first
      const quiz = await generateQuiz(
        pool.map(({ id, word, translation, sentence }) => ({
          id,
          word,
          translation,
          sentence,
        })),
      );
      setQs(quiz);
      setI(0);
      setScore(0);
      setPicked(null);
      setPhase("play");
    } catch (e) {
      setErr(`Could not create the quiz: ${e.message}. Try again.`);
      setPhase("idle");
    }
  };

  const answer = async (opt) => {
    if (picked) return;
    const q = qs[i];
    const ok = opt === q.answer;
    setPicked(opt);
    if (ok) setScore((s) => s + 1);
    const w = words.find((x) => x.id === q.id);
    if (w) {
      await updateWord(w.id, applyReview(w, ok));
      await bump();
    }
  };

  const next = () => {
    if (i + 1 >= qs.length) return setPhase("done");
    setI(i + 1);
    setPicked(null);
  };

  if (phase === "idle" || phase === "loading")
    return (
      <Stack alignItems="center" spacing={2} sx={{ py: 8 }}>
        {err && <Alert severity="error">{err}</Alert>}
        <Typography color="text.secondary">
          Practice up to 10 of your saved words.
        </Typography>
        <Button
          variant="contained"
          onClick={start}
          disabled={phase === "loading"}
          startIcon={phase === "loading" && <CircularProgress size={16} />}
        >
          {phase === "loading" ? "Creating quiz..." : "Start quiz"}
        </Button>
      </Stack>
    );

  if (phase === "done")
    return (
      <Stack alignItems="center" spacing={2} sx={{ py: 8 }}>
        <Typography variant="h4" fontWeight={600}>
          {score}/{qs.length}
        </Typography>
        <Typography color="text.secondary">
          Correct answers. Words you missed will come back sooner.
        </Typography>
        <Button variant="contained" onClick={start}>
          Start another quiz
        </Button>
      </Stack>
    );

  const q = qs[i];
  return (
    <Box sx={{ maxWidth: 560, mx: "auto" }}>
      <LinearProgress
        variant="determinate"
        value={(i / qs.length) * 100}
        sx={{ mb: 3, borderRadius: 1 }}
      />
      <Typography variant="caption" color="text.secondary">
        Question {i + 1} of {qs.length}
      </Typography>
      <Typography variant="h6" sx={{ my: 2 }}>
        {q.prompt}
      </Typography>
      <Stack spacing={1}>
        {q.options.map((opt) => {
          const isAnswer = picked && opt === q.answer;
          const isWrong = picked === opt && opt !== q.answer;
          return (
            <Button
              key={opt}
              variant="outlined"
              onClick={() => answer(opt)}
              color={isAnswer ? "success" : isWrong ? "error" : "inherit"}
              sx={{ justifyContent: "flex-start", py: 1.25 }}
            >
              {opt}
            </Button>
          );
        })}
      </Stack>
      {picked && (
        <Stack spacing={2} sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {q.explanation}
          </Typography>
          <Button variant="contained" onClick={next}>
            {i + 1 >= qs.length ? "See result" : "Next question"}
          </Button>
        </Stack>
      )}
    </Box>
  );
}
