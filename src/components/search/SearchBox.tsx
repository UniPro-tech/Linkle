"use client";

import React from "react";
import { Controller, useForm } from "react-hook-form";
import { TextField, Button, Stack, ThemeProvider, MenuItem, Select } from "@mui/material";
import { useRouter } from "next/navigation"; // Next.js のルーターを使用
import theme from "@/theme/primary";
import formTheme from "@/theme/form";

const SearchForm = ({
  query,
  queryType: queryTypeProps,
}: {
  query?: string | undefined;
  queryType?: string | undefined;
}) => {
  const { control, handleSubmit } = useForm<{ query: string }>({
    defaultValues: { query: query },
  });
  const router = useRouter();

  const onSubmit = (data: { query: string }) => {
    if (data.query.trim() !== "") {
      router.push(`/search?query=${encodeURIComponent(data.query)}&type=${queryType}`);
    }
  };

  enum QueryType {
    Club = "club",
    Event = "event",
  }

  const [queryType, setQueryType] = React.useState<QueryType>(queryTypeProps as QueryType);

  return (
    <ThemeProvider theme={theme}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ThemeProvider theme={formTheme}>
          <Stack
            direction="row"
            spacing={2}
            justifyContent={"center"}
            justifyItems={"center"}
          >
            <Select
              displayEmpty
              defaultValue={"club"}
              value={queryType}
              onChange={(e) => setQueryType(e.target.value as QueryType)}
              sx={{ minWidth: 120 }}
            >
              <MenuItem value={"club"}>同好会</MenuItem>
              <MenuItem value={"event"}>イベント</MenuItem>
            </Select>
            <Controller
              name="query"
              control={control}
              render={({ field }) => (
                <TextField
                  color="primary"
                  label={queryType === QueryType.Club ? "同好会名" : "イベント名"}
                  variant="outlined"
                  fullWidth
                  {...field}
                />
              )}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              検索
            </Button>
          </Stack>
        </ThemeProvider>
      </form>
    </ThemeProvider>
  );
};

export default SearchForm;
