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
  Input,
  Link,
  Snackbar,
  SnackbarCloseReason,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import "katex/dist/katex.min.css";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useActionState } from "react";
import formTheme from "@/theme/form";
import { LongDescription } from "./md";
import { MuiFileInput } from "mui-file-input";
import Image from "next/image";
import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import Club from "@/models/Club";

const submitAction = async (
  state: { status: string; message: string | undefined },
  data: FormData
): Promise<{ status: string; message: string }> => {
  const slack_link = (data.get("slack_link") as string)?.split("/")[4];
  const file = data.get("file") as File;
  const imageUrl = data.get("image") as string;

  if (file?.size > 0) {
    if (file.size > 5 * 1024 * 1024) {
      return { status: "error", message: "ファイルサイズが大きすぎます。" };
    }

    // 以前の画像を削除
    if (data.get("previous_image_file")) {
      const deleteRes = await fetch(
        `/api/images?filename=${data.get("previous_image_file")}&clubId=${data.get("id")}`,
        { method: "DELETE" }
      );
      if (!deleteRes.ok) {
        return { status: "error", message: "画像の更新に失敗しました。" };
      }
    }

    const base64Data = await new Promise<string | null>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result?.toString().split(",")[1] || null);
      reader.onerror = () => reject("ファイルの読み込みに失敗しました。");
      reader.readAsDataURL(file);
    });

    if (!base64Data) {
      return { status: "error", message: "画像の変換に失敗しました。" };
    }

    const filePostApiRes = await fetch(`/api/images`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
        base64Data,
        clubId: data.get("id"),
      }),
    });

    if (!filePostApiRes.ok) {
      return { status: "error", message: "画像のアップロードに失敗しました。" };
    }

    const uploadResult = await filePostApiRes.json();
    if (!uploadResult?.url) {
      return { status: "error", message: "画像のURL取得に失敗しました。" };
    }

    const newImageUrl = `https://drive.google.com/uc?export=view&id=${
      new URL(uploadResult.url).pathname.split("/")[3].split("?")[0]
    }`;

    return updateClub(data, slack_link, newImageUrl, file.name);
  } else {
    return updateClub(data, slack_link, imageUrl, data.get("image_file") as string);
  }
};

const updateClub = async (
  data: FormData,
  slack_link: string | undefined,
  imageUrl: string | null,
  imageFileName: string
): Promise<{ status: string; message: string }> => {
  const res = await fetch(`/api/clubs/${data.get("id")}`, {
    headers: { "Content-Type": "application/json" },
    method: "PUT",
    body: JSON.stringify({
      id: data.get("id"),
      name: data.get("name"),
      short_description: data.get("short_description"),
      long_description: data.get("long_description"),
      slack_name: data.get("slack_name"),
      slack_link,
      image: imageUrl,
      image_file: imageFileName,
      available_on: (data.get("chutobu") ? 0x1 : 0) | (data.get("kotobu") ? 0x2 : 0),
      visible: (data.get("internal") ? 0x1 : 0) | (data.get("public") ? 0x2 : 0),
    }),
  });

  return res.ok
    ? { status: "success", message: "変更を保存しました。" }
    : { status: "error", message: "変更の保存に失敗しました。" };
};

export default function ClubEdit({ club }: { club: Club }) {
  const [formState, formAction, isPending] = useActionState(submitAction, {
    status: "idle",
    message: undefined,
  });

  const [isEnablePublic, setIsEnablePublic] = useState(Boolean(club?.visible & 0x1));
  const [longDescriptionState, setLongDescriptionState] = useState(club?.long_description);
  const [formStatus, setFormStatus] = useState<string | undefined>(undefined);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (formState.status === "success" || formState.status === "reflesh") {
      redirect(`/clubs/${club.id}/edit?status=success&message=${formState.message}`);
    }
    if (formState.status === "error") {
      redirect(`/clubs/${club.id}/edit?status=error&message=${formState.message}`);
    }
  }, [formState.status]);

  const handleClose = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === "clickaway") {
      return;
    }
    setFormStatus(undefined);
  };
  const handleChange = (newFile: File | null) => {
    setFile(newFile);
  };

  const params = useSearchParams();
  const status = params.get("status");
  const message = params.get("message");

  useEffect(() => {
    if (status) {
      setFormStatus(status);
    }
  }, [status]);

  return (
    <>
      {!isPending ? (
        <>
          <Stack
            spacing={1}
            justifyContent={"center"}
            alignItems={"center"}
            minHeight={"100vh"}
            py={5}
            width={"100%"}
          >
            <Snackbar
              open={formStatus === "success"}
              autoHideDuration={5000}
              onClose={handleClose}
            >
              <Alert
                severity="success"
                variant="filled"
                sx={{ width: "100%" }}
              >
                {message}
              </Alert>
            </Snackbar>
            <Snackbar
              open={formStatus === "error"}
              autoHideDuration={5000}
              onClose={handleClose}
            >
              <Alert
                severity="error"
                variant="filled"
                sx={{ width: "100%" }}
              >
                {message}
              </Alert>
            </Snackbar>
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
                  className="flex flex-col space-y-2 justify-center items-left"
                  action={formAction}
                >
                  <TextField
                    name="name"
                    label="同好会名"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    defaultValue={club.name}
                    required
                  />
                  <TextField
                    name="slack_name"
                    label="Slack名"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    defaultValue={club.slack_name}
                    required
                  />
                  <TextField
                    name="slack_link"
                    label="Slackリンク"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    defaultValue={`https://n-highschool.slack.com/archive/${club.slack_link}`}
                    required
                  />
                  <TextField
                    name="short_description"
                    label="短い説明"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    defaultValue={club.short_description}
                  />
                  <FormHelperText>短い説明はクラブカードに表示されます。</FormHelperText>
                  <MuiFileInput
                    name="file"
                    label="画像"
                    itemType="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleChange}
                    value={file}
                  />
                  {club.image && club.image_file && (
                    <>
                      <Typography variant="h5">現在の画像</Typography>
                      <Image
                        src={club.image}
                        alt="club image"
                        width={300}
                        height={0}
                      />
                      <Button
                        onClick={async () => {
                          const res = await fetch(
                            `/api/images?filename=${club.image_file}&clubId=${club.id}`,
                            {
                              method: "DELETE",
                            }
                          );
                          if (res.ok) {
                            const res = await fetch(`/api/clubs/${club.id}`, {
                              method: "PATCH",
                              body: JSON.stringify({ image: "" }),
                            });
                            if (res.ok)
                              window.location.href = `/clubs/${club.id}/edit?status=success&message=画像を削除しました。`;
                            else
                              window.location.href = `/clubs/${club.id}/edit?status=error&message=画像の削除に失敗しました。`;
                          } else
                            window.location.href = `/clubs/${club.id}/edit?status=error&message=画像の削除に失敗しました。`;
                        }}
                        color="error"
                        variant="outlined"
                      >
                        画像を削除
                      </Button>
                    </>
                  )}
                  <FormHelperText>
                    画像はクラブカードに表示されます。
                    <br />
                    5MB以下のファイルをアップロードしてください。
                  </FormHelperText>
                  <Typography variant="h5">対象</Typography>
                  <FormControl>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="chutobu"
                          defaultChecked={(club.available_on & 0x1) == 0x1}
                        />
                      }
                      label={<>中等部</>}
                    />
                  </FormControl>
                  <FormControl>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="kotobu"
                          defaultChecked={(club?.available_on & 0x2) == 0x2}
                        />
                      }
                      label={<>高等部</>}
                    />
                  </FormControl>
                  <Typography variant="h5">公開設定</Typography>
                  <FormControl>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="internal"
                          defaultChecked={club?.visible ? (club?.visible & 0x1) == 0x1 : false}
                          onChange={(e) => setIsEnablePublic(e.target.checked)}
                        />
                      }
                      label={<>学内公開</>}
                    />
                  </FormControl>

                  <FormControl>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="public"
                          defaultChecked={club?.visible ? (club?.visible & 0x2) == 0x2 : false}
                          disabled={!isEnablePublic}
                        />
                      }
                      label={<>一般公開</>}
                    />
                  </FormControl>
                  <Typography variant="h5">長い説明</Typography>
                  <TextField
                    name="long_description"
                    label="長い説明"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    defaultValue={club.long_description}
                    multiline
                    minRows={10}
                    maxRows={10}
                    onChange={(e) => setLongDescriptionState(e.target.value)}
                  />
                  <FormHelperText>
                    長い説明はクラブページに表示されます。
                    <br />
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
                    <LongDescription description={longDescriptionState} />
                  </Stack>
                  <Divider />
                  <Button
                    variant="outlined"
                    color="primary"
                    type="submit"
                  >
                    変更を保存
                  </Button>
                  <Input
                    type="hidden"
                    name="image"
                    value={club.image}
                    disableUnderline={true}
                  />
                  <Input
                    type="hidden"
                    name="previous_image_file"
                    value={club.image_file}
                    disableUnderline={true}
                  />
                  <Input
                    type="hidden"
                    name="id"
                    value={club.id}
                    disableUnderline={true}
                  />
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
              <AlertDialog id={club.id.toString()} />
            </Stack>
          </Stack>
        </>
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
