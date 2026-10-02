import { Box, Tab, Tabs } from "@mui/material";

export default function ContentTabs({ value, onChange }) {
  return (
    <Box sx={{ mt: 5 }}>
      <Tabs
        value={value}
        onChange={(_, nextValue) => onChange(nextValue)}
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
  );
}
