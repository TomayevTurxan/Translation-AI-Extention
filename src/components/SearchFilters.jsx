import {
  Card,
  InputAdornment,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

import Search from "@mui/icons-material/Search";
import cardSx from "../shared/theme";


const statuses = ["all", "new", "learning", "mastered"];

export default function SearchFilters({
  tab,
  query,
  filter,
  onQueryChange,
  onFilterChange,
}) {
  return (
    <Card sx={{ ...cardSx, mt: 3, p: 2 }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
        <TextField
          fullWidth
          size="small"
          placeholder={
            tab === 0 ? "Search sentences or shows..." : "Search words..."
          }
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
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
            "& .MuiInputBase-root": {
              borderRadius: 2.5,
            },
          }}
        />

        <ToggleButtonGroup
          exclusive
          size="small"
          value={filter}
          onChange={(_, next) => next && onFilterChange(next)}
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
          {statuses.map((status) => (
            <ToggleButton key={status} value={status}>
              {status}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>
    </Card>
  );
}
