import { useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

import { clearAll } from "../shared/storage";

export default function ClearHistoryDialog({ open, onClose }) {
  const [clearing, setClearing] = useState(false);

  async function handleClear() {
    setClearing(true);

    try {
      await clearAll();
      onClose();
    } finally {
      setClearing(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
          This deletes every saved sentence, word, and your streak. You can't
          undo it.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} sx={{ borderRadius: 2 }}>
          Cancel
        </Button>

        <Button
          color="error"
          variant="contained"
          onClick={handleClear}
          disabled={clearing}
          sx={{ borderRadius: 2 }}
        >
          {clearing ? "Clearing..." : "Clear history"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
