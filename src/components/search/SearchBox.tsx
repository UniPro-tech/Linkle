"use client";

import React from "react";
import { Controller, useForm } from "react-hook-form";
import { TextField, Button, Stack, ThemeProvider } from "@mui/material";
import { useRouter } from "next/navigation"; // Next.js のルーターを使用
import theme from "@/theme/primary";
import formTheme from "@/theme/form";

const ClubSearchForm: React.FC = () => {
  const { control, handleSubmit } = useForm<{ query: string }>({
    defaultValues: { query: "" },
  });
  const router = useRouter();

  const onSubmit = (data: { query: string }) => {
    if (data.query.trim() !== "") {
      router.push(`/search?query=${encodeURIComponent(data.query)}`);
    }
  };

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
            <Controller
              name="query"
              control={control}
              render={({ field }) => (
                <TextField
                  color="primary"
                  {...field}
                  label="同好会名"
                  variant="outlined"
                  fullWidth
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

export default ClubSearchForm;
