"use client";
import {
  Alert,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  Link,
  MenuItem,
  Select,
  Snackbar,
  SnackbarCloseReason,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import formTheme from "@/theme/form";
import { redirect } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { LongDescription } from "@/components/md";
import Club from "@/models/Club";

const submitAction = async (
  state: { status: string | undefined; message: string | undefined },
  data: FormData
): Promise<{ status: string | undefined; message: string | undefined }> => {
  const title = data.get("title");
  const description = data.get("description");
  const main_text = data.get("main_text");
  const tos = data.get("tos");
  if (!tos) {
    alert("利用規約に同意していないか、管理者でないため登録できません。");
    return {
      status: "error",
      message: "利用規約に同意していないか、管理者でないため登録できません。",
    };
  }
  if (!title || !description || !main_text) {
    alert("全ての項目を入力してください。");
    return { status: "error", message: "全ての項目を入力してください。" };
  }
  const res = await fetch(`/api/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      description,
      visible: 0,
      club: data.get("club") as string,
      main_text,
    }),
  });
  if (res.ok) {
    const id = await res.json();
    redirect(`/events/${id.id}/edit`);
  } else {
    const message = res.statusText;
    return {
      status: "error",
      message: message,
    };
  }
};

export default function CreateEvent({ ownClubs }: { ownClubs: Club[] }) {
  const [formState, formAction, isPending] = useActionState(submitAction, {
    status: undefined,
    message: undefined,
  });

  interface EventData {
    title: string;
    public: boolean;
    internal: boolean;
    description: string;
    main_text: string;
    club: number;
  }

  interface Check {
    admin: boolean;
    tos: boolean;
  }

  const { control, watch } = useForm<EventData>({
    defaultValues: {
      title: "",
      public: false,
      internal: false,
      description: "",
      main_text: "",
    },
  });

  const internal = watch("internal");

  const { control: checkControl } = useForm<Check>({
    defaultValues: {
      tos: false,
    },
  });

  const [main_text, setMain_text] = useState<string>("");

  const [formStatus, setFormStatus] = useState<string | undefined>(undefined);
  const [formMessage, setFormMessage] = useState<string | undefined>(undefined);
  useEffect(() => {
    setFormStatus(formState.status);
    setFormMessage(formState.message);
  }, [formState.status]);

  const handleClose = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === "clickaway") {
      return;
    }
    setFormStatus(undefined);
  };

  return (
    <>
      {!isPending ? (
        <Stack
          minHeight={"100vh"}
          justifyContent={"center"}
          alignItems={"center"}
          spacing={2}
          textAlign={"center"}
          px={{ xs: 2, lg: 0 }}
          py={10}
        >
          <Snackbar
            open={formStatus != undefined}
            autoHideDuration={5000}
            onClose={handleClose}
          >
            <Alert
              severity={formStatus === "success" ? "success" : "error"}
              variant="filled"
              sx={{ width: "100%" }}
            >
              {formMessage}
            </Alert>
          </Snackbar>
          <Typography variant="h3">記事を投稿</Typography>
          <Typography variant="body1">
            記事を投稿して、他のユーザーにイベント情報やお知らせを共有しましょう。
          </Typography>
          <Stack
            spacing={2}
            bgcolor={"lightgray"}
            padding={2}
            borderRadius={2}
            minWidth={{ xs: "75%", md: "50%", lg: "25%" }}
          >
            <Typography
              textAlign={"center"}
              variant="h4"
              width={"100%"}
            >
              注意事項
            </Typography>
            <ul className="list-disc p-5 text-left">
              <li>記事の投稿は、同好会の代表者または運営者のみが行うことができます。</li>
              <li>利用規約の禁止事項をもう一度よく読み、違反しないようにしてください。</li>
            </ul>
          </Stack>
          <Divider />
          <ThemeProvider theme={formTheme}>
            <Stack
              minWidth={"75%"}
              spacing={2}
              p={3}
              justifyContent={"center"}
              alignItems={"center"}
              textAlign={"left"}
            >
              <form
                action={formAction}
                className="w-full flex flex-col space-y-3"
              >
                <Typography
                  variant="h6"
                  mt={3}
                >
                  記事の情報
                </Typography>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="タイトル"
                      variant="outlined"
                      fullWidth
                      required
                    />
                  )}
                />
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="簡単な説明"
                      variant="outlined"
                      fullWidth
                      required
                    />
                  )}
                />
                <FormHelperText>20文字程度。この文はクラブカードに表示されます。</FormHelperText>
                <Controller
                  name="club"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>同好会</InputLabel>
                      <Select
                        {...field}
                        label="同好会"
                        variant="outlined"
                        fullWidth
                        required
                      >
                        {ownClubs.map((club) => (
                          <MenuItem
                            key={club.id}
                            value={club.id}
                          >
                            {club.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
                <Typography
                  variant="h6"
                  mt={3}
                >
                  公開設定
                </Typography>
                <Controller
                  name="internal"
                  control={control}
                  render={({ field }) => (
                    <FormControl>
                      <FormControlLabel
                        control={<Checkbox {...field} />}
                        label={<>学内限定</>}
                      />
                    </FormControl>
                  )}
                />
                <Controller
                  name="public"
                  control={control}
                  render={({ field }) => (
                    <FormControl disabled={!internal}>
                      <FormControlLabel
                        control={<Checkbox {...field} />}
                        label={<>一般公開</>}
                      />
                    </FormControl>
                  )}
                />
                <Typography
                  variant="h6"
                  mt={3}
                >
                  本文
                </Typography>
                <TextField
                  name="main_text"
                  label="長い説明"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  multiline
                  minRows={10}
                  maxRows={10}
                  onChange={(e) => setMain_text(e.target.value)}
                />
                <FormHelperText>
                  <Link
                    href="https://qiita.com/qurage/items/a2f3f52c60d7c64b2e08"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHubFlavorMarkdown
                  </Link>
                  に対応しています。
                </FormHelperText>
                <Typography variant="h6">プレビュー</Typography>
                <Divider />
                <Stack
                  spacing={2}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <LongDescription description={main_text} />
                </Stack>
                <Divider />
                <Controller
                  name="tos"
                  control={checkControl}
                  render={({ field }) => (
                    <FormControl error={Boolean(field.value) === false}>
                      <FormControlLabel
                        required
                        control={<Checkbox {...field} />}
                        label={
                          <>
                            <Link
                              href={"/tos"}
                              target={"_blank"}
                            >
                              利用規約
                            </Link>
                            に同意する
                          </>
                        }
                      />
                    </FormControl>
                  )}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  登録
                </Button>
              </form>
            </Stack>
          </ThemeProvider>
        </Stack>
      ) : (
        <Stack
          spacing={1}
          justifyContent={"center"}
          alignItems={"center"}
          minHeight={"100vh"}
          py={5}
          width={"100%"}
        >
          <Typography>保存中</Typography>
          <CircularProgress />
        </Stack>
      )}
    </>
  );
}
