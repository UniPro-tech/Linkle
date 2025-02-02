"use client";
import {
  Alert,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import "katex/dist/katex.min.css";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import Club from "@/models/Club";
import { Controller, useForm } from "react-hook-form";
import formTheme from "@/theme/form";
import { LongDescription } from "./md";
import { useSession } from "next-auth/react";

export default function ClubEdit({ id }: { id: string }) {
  const { data: session } = useSession();
  const [searchResult, setSearchResult] = useState<Club | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        setLoading(true);
        setSearchError(null);
        try {
          const apiRes = await fetch(`/api/clubs/${id}`);
          const res = await apiRes.json();
          if (!res) window.location.href = "/notfound";
          if (!session?.user?.email) window.location.href = "/forbidden";
          const owners = await (await fetch(`/api/clubs/${id}/owners`)).json();
          console.log(owners);
          const isOwn = owners.includes(session?.user?.email as string);
          if (!isOwn) window.location.href = "/forbidden";
          setSearchResult(res);
        } catch (error) {
          setSearchError("検索中にエラーが発生しました。もう一度お試しください。" + error);
        } finally {
          setLoading(false);
        }
      } else setSearchError("idが指定されていません。");
    };
    fetchData();
  }, [id]);

  interface ClubEditFormData {
    name: string;
    short_description: string | undefined;
    long_description: string | undefined;
    slack_name: string;
    slack_link: string;
    image: string | undefined;
    chutobu: boolean;
    kotobu: boolean;
    internal: boolean;
    public: boolean;
  }
  const { control, watch } = useForm<ClubEditFormData>({
    defaultValues: {
      name: searchResult?.name,
      short_description: searchResult?.short_description,
      long_description: searchResult?.long_description,
      slack_name: searchResult?.slack_name,
      slack_link: searchResult?.slack_link,
      image: searchResult?.image,
      chutobu: searchResult?.available_on ? (searchResult.available_on & 0x2) == 0x2 : false,
      kotobu: searchResult?.available_on ? (searchResult.available_on & 0x1) == 0x1 : false,
      internal: searchResult?.visible ? (searchResult?.visible & 0x1) == 0x1 : false,
      public: searchResult?.visible ? (searchResult?.visible & 0x2) == 0x2 : false,
    },
  });

  const isEnablePublic = watch("internal");

  return (
    <Stack
      spacing={1}
      justifyContent={"center"}
      alignItems={"center"}
      minHeight={"100vh"}
      py={5}
    >
      {searchError && (
        <Alert
          severity="error"
          style={{ marginTop: "20px" }}
        >
          {searchError}
        </Alert>
      )}
      {loading && <Typography>読み込み中...</Typography>}
      {searchResult && (
        <>
          <Stack
            spacing={2}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Typography variant="h3">同好会編集</Typography>
            <Typography variant="body1">ここで同好会情報の編集ができます。</Typography>
          </Stack>
          <Stack
            spacing={2}
            justifyContent={"left"}
            width={{ xs: "90%", lg: "40%" }}
          >
            <Typography variant="h4">基礎情報</Typography>
            <Divider />
            <ThemeProvider theme={formTheme}>
              <form
                action={async (data: FormData) => {
                  const slack_linkRaw = data.get("slack_link")?.toString();
                  const slack_link = slack_linkRaw?.split("/")[4];
                  const imgURL = data.get("image")
                    ? new URL(data.get("image") as string)
                    : undefined;
                  let URLres = "";
                  if (imgURL?.host == "drive.google.com" && imgURL?.pathname.startsWith("/uc")) {
                    URLres = imgURL.toString();
                  } else if (imgURL?.host == "drive.google.com") {
                    const temp1 = imgURL?.pathname.split("/")[3];
                    const temp2 = temp1?.split("?")[0];
                    URLres = `https://drive.google.com/uc?export=view&id=${temp2}`;
                  }
                  const pairoad = {
                    name: data.get("name") as string,
                    short_description: data.get("short_description") as string,
                    long_description: data.get("long_description") as string,
                    slack_name: data.get("slack_name") as string,
                    slack_link: slack_link as string,
                    image: URLres as string,
                    available_on: (data.get("chutobu") ? 0x1 : 0) | (data.get("kotobu") ? 0x2 : 0),
                    visible: (data.get("internal") ? 0x1 : 0) | (data.get("public") ? 0x2 : 0),
                  };
                  fetch(`/api/clubs/${id}`, {
                    headers: { "Content-Type": "application/json" },
                    method: "PUT",
                    body: pairoad ? JSON.stringify(pairoad) : null,
                  }).then((res) => {
                    if (res.ok) {
                      redirect(`/clubs/${id}`);
                    } else alert("変更に失敗しました。");
                  });
                }}
                className="flex flex-col space-y-2 justify-center items-left"
              >
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="同好会名"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      defaultValue={searchResult.name}
                      required
                    />
                  )}
                />
                <Controller
                  name="slack_name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Slack名"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      defaultValue={searchResult.slack_name}
                      required
                    />
                  )}
                />
                <Controller
                  name="slack_link"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Slackリンク"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      defaultValue={`https://n-highschool.slack.com/archive/${searchResult.slack_link}`}
                      required
                    />
                  )}
                />
                <Controller
                  name="short_description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="短い説明"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      defaultValue={searchResult.short_description}
                    />
                  )}
                />
                <FormHelperText>短い説明はクラブカードに表示されます。</FormHelperText>
                <Controller
                  name="image"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="画像URL"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      defaultValue={searchResult.image}
                    />
                  )}
                />
                <FormHelperText>
                  画像はクラブカードに表示されます。
                  <br />
                  GoogleDriveの共有リンクを入力してください。
                </FormHelperText>
                <Typography variant="h5">対象</Typography>
                <Controller
                  name="chutobu"
                  control={control}
                  render={({ field }) => (
                    <FormControl>
                      <FormControlLabel
                        control={
                          <Checkbox
                            {...field}
                            defaultChecked={(searchResult.available_on & 0x1) == 0x1}
                          />
                        }
                        label={<>中等部</>}
                      />
                    </FormControl>
                  )}
                />
                <Controller
                  name="kotobu"
                  control={control}
                  render={({ field }) => (
                    <FormControl>
                      <FormControlLabel
                        control={
                          <Checkbox
                            {...field}
                            defaultChecked={(searchResult?.available_on & 0x2) == 0x2}
                          />
                        }
                        label={<>高等部</>}
                      />
                    </FormControl>
                  )}
                />
                <Typography variant="h5">公開設定</Typography>
                <Controller
                  name="internal"
                  control={control}
                  render={({ field }) => (
                    <FormControl>
                      <FormControlLabel
                        control={
                          <Checkbox
                            {...field}
                            defaultChecked={
                              searchResult?.visible ? (searchResult?.visible & 0x1) == 0x1 : false
                            }
                          />
                        }
                        label={<>学内公開</>}
                      />
                    </FormControl>
                  )}
                />
                <Controller
                  name="public"
                  control={control}
                  render={({ field }) => (
                    <FormControl>
                      <FormControlLabel
                        control={
                          <Checkbox
                            {...field}
                            defaultChecked={
                              searchResult?.visible ? (searchResult?.visible & 0x2) == 0x2 : false
                            }
                            disabled={!isEnablePublic}
                          />
                        }
                        label={<>一般公開</>}
                      />
                    </FormControl>
                  )}
                />
                <Typography variant="h5">長い説明</Typography>
                <Controller
                  name="long_description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="長い説明"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      defaultValue={searchResult.long_description}
                      multiline
                      minRows={10}
                      maxRows={10}
                    />
                  )}
                />
                <FormHelperText>長い説明はクラブページに表示されます。</FormHelperText>
                <Typography variant="h6">プレビュー</Typography>
                <Divider />
                <Stack
                  spacing={2}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <LongDescription
                    description={watch("long_description") ?? searchResult?.long_description}
                  />
                </Stack>
                <Divider />
                <Button
                  variant="outlined"
                  color="primary"
                  type="submit"
                >
                  変更を保存
                </Button>
              </form>
            </ThemeProvider>
          </Stack>
          <Stack
            spacing={2}
            justifyContent={"left"}
            width={{ xs: "90%", lg: "40%" }}
          >
            <Typography variant="h4">重要操作</Typography>
            <Divider />
            <Typography variant="body1">
              これより下は破壊的なアクションです。
              <br />
              本当に実行してもよいか十分に検討したうえで実行してください。
            </Typography>
            <AlertDialog id={id} />
          </Stack>
        </>
      )}
    </Stack>
  );
}

import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export function AlertDialog({ id }: { id: string }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button
        variant="outlined"
        color="error"
        onClick={handleClickOpen}
      >
        同好会を削除する
      </Button>
      <ThemeProvider theme={formTheme}>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">本当に削除しますか？</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              この操作を実行すると元には戻すことができません。 それはLinkle管理者でも同じです。
              それでも削除しますか？
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
              autoFocus
            >
              いいえ
            </Button>
            <Button
              onClick={async () => {
                const res = await fetch(`/api/clubs/${id}`, {
                  method: "DELETE",
                });
                if (res.ok) {
                  redirect("/dashboard");
                } else alert("削除に失敗しました。");
              }}
              color="error"
            >
              はい
            </Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    </React.Fragment>
  );
}
