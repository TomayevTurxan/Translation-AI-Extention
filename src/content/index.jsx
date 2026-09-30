import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider, Paper, Typography } from "@mui/material";

import { darkTheme } from "../shared/theme";

import {
  startObserver,
  getCurrentSentence,
  getShow,
  getVideo,
} from "./subtitleObserver";

import WordPopup from "./WordPopup";
import Toolbar from "./Toolbar";

function App() {
  const [popup, setPopup] = useState(null);
  const [toast, setToast] = useState("");
  const [selectWordEnabled, setSelectWordEnabled] = useState(false);

  const flash = (msg) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2200);
  };

  const close = () => {
    setPopup(null);
    getVideo()?.play();
  };

  const handleToggleSelectWord = () => {
    setSelectWordEnabled((value) => !value);
  };

  useEffect(() => {
    if (!selectWordEnabled) {
      setPopup(null);
      return;
    }

    const stop = startObserver(async ({ word, sentence, show, rect }) => {
      setPopup({
        word,
        rect,
        status: "loading",
      });

      const res = await chrome.runtime.sendMessage({
        type: "TRANSLATE_AND_SAVE",
        word,
        sentence,
        show,
      });

      setPopup((current) => {
        if (!current || current.word !== word) {
          return current;
        }

        if (res?.error) {
          return {
            ...current,
            status: "error",
            error: res.error,
          };
        }

        return {
          ...current,
          status: "done",
          data: res.data,
        };
      });
    });

    return () => {
      stop();
    };
  }, [selectWordEnabled]);

  useEffect(() => {
    const onMsg = async (msg) => {
      if (msg.type !== "SAVE_CURRENT_SENTENCE") {
        return;
      }

      const sentence = getCurrentSentence();

      if (!sentence) {
        flash("No subtitle on screen");
        return;
      }

      const res = await chrome.runtime.sendMessage({
        type: "SAVE_SENTENCE",
        sentence,
        show: getShow(),
      });

      flash(
        res?.error
          ? `Could not save: ${res.error}`
          : res.saved
            ? "Sentence saved"
            : "Already saved",
      );
    };

    chrome.runtime.onMessage.addListener(onMsg);

    return () => {
      chrome.runtime.onMessage.removeListener(onMsg);
    };
  }, []);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") {
        setPopup(null);
      }
    };

    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <>
      <Toolbar
        selectWordEnabled={selectWordEnabled}
        onToggleSelectWord={handleToggleSelectWord}
      />

      {popup && <WordPopup state={popup} onClose={close} />}

      {toast && (
        <Paper
          sx={{
            position: "fixed",
            left: "50%",
            bottom: 90,
            transform: "translateX(-50%)",
            px: 2,
            py: 1,
            zIndex: 2147483647,
          }}
        >
          <Typography variant="body2">{toast}</Typography>
        </Paper>
      )}
    </>
  );
}

const host = document.createElement("div");
host.id = "subtra-root";

document.documentElement.appendChild(host);

const shadow = host.attachShadow({
  mode: "open",
});

const mount = document.createElement("div");
shadow.appendChild(mount);

const cache = createCache({
  key: "subtra",
  container: shadow,
});

createRoot(mount).render(
  <CacheProvider value={cache}>
    <ThemeProvider theme={darkTheme}>
      <App />
    </ThemeProvider>
  </CacheProvider>,
);
