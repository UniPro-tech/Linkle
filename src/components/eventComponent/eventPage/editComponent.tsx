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
import { LongDescription } from "@/components/md";
import { MuiFileInput } from "mui-file-input";
import Image from "next/image";
import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import Event from "@/models/Event";

const submitAction = async (
  state: { status: string | null; message: string | null },
  data: FormData
): Promise<{ status: string | null; message: string | null }> => {
  const file = data.get("file") as File;
  const imageUrl = data.get("image") as string;

  if (file?.size > 0) {
    if (file.size > 5 * 1024 * 1024) {
      return { status: "error", message: "ファイルサイズが大きすぎます。" };
    }

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

    const filePostApiRes = await fetch(`${process.env.NEXT_PUBLIC_IMAGE_POST_SCRIPT_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: `${data.get("id")}_${file.name}`,
        body: base64Data,
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

    return updateEvent(data, newImageUrl, file.name);
  } else {
    return updateEvent(data, imageUrl, data.get("image_file") as string);
  }
};

const updateEvent = async (
  data: FormData,
  imageUrl: string | null,
  imageFileName: string
): Promise<{ status: string; message: string }> => {
  const res = await fetch(`/api/events/${data.get("id")}`, {
    headers: { "Content-Type": "application/json" },
    method: "PUT",
    body: JSON.stringify({
      id: data.get("id"),
      author: data.get("author"),
      club: data.get("club"),
      title: data.get("title"),
      descroption: data.get("description"),
      main_text: data.get("main_text"),
      image: imageUrl,
      image_file: imageFileName,
      visible: (data.get("internal") ? 0x1 : 0) | (data.get("public") ? 0x2 : 0),
    }),
  });

  return res.ok
    ? { status: "success", message: "変更を保存しました。" }
    : { status: "error", message: "変更の保存に失敗しました。" };
};

export default function EventEdit({ event }: { event: Event }) {
  const [formState, formAction, isPending] = useActionState(submitAction, {
    status: null,
    message: null,
  });

  const [isEnablePublic, setIsEnablePublic] = useState(Boolean(event?.visible & 0x1));
  const [longDescriptionState, setLongDescriptionState] = useState(event?.main_text);
  const [formStatus, setFormStatus] = useState<string | undefined>(undefined);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (formState.status === "success" || formState.status === "reflesh") {
      redirect(`/events/${event.id}/edit?status=success&message=${formState.message}`);
    }
    if (formState.status === "error") {
      redirect(`/events/${event.id}/edit?status=error&message=${formState.message}`);
    }
  }, [formState.status]);

  const handleClose = (event: unknown, reason?: SnackbarCloseReason) => {
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
              <Typography variant="h3">記事編集</Typography>
              <Typography variant="body1">ここで記事の編集ができます。</Typography>
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
                  <Input
                    type="hidden"
                    name="author"
                    value={event.authors}
                    disableUnderline={true}
                  />
                  <Input
                    type="hidden"
                    name="club"
                    value={event.clubs}
                    disableUnderline={true}
                  />
                  <TextField
                    name="title"
                    label="タイトル"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    defaultValue={event.title}
                    required
                  />
                  <TextField
                    name="description"
                    label="短い説明"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    defaultValue={event.description}
                  />
                  <FormHelperText>短い説明はクラブカードに表示されます。</FormHelperText>
                  <MuiFileInput
                    name="file"
                    label="画像"
                    itemType="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleChange}
                    value={file}
                  />
                  {event.image && event.image_file && (
                    <>
                      <Typography variant="h5">現在の画像</Typography>
                      <Image
                        src={event.image}
                        alt="club image"
                        width={300}
                        height={0}
                      />
                      <Button
                        onClick={async () => {
                          const res = await fetch(
                            `/api/images?filename=${event.image_file}&clubId=${event.id}`,
                            {
                              method: "DELETE",
                            }
                          );
                          if (res.ok) {
                            const res = await fetch(`/api/events/${event.id}`, {
                              method: "PATCH",
                              body: JSON.stringify({ image: "" }),
                            });
                            if (res.ok)
                              window.location.href = `/events/${event.id}/edit?status=success&message=画像を削除しました。`;
                            else
                              window.location.href = `/events/${event.id}/edit?status=error&message=画像の削除に失敗しました。`;
                          } else
                            window.location.href = `/events/${event.id}/edit?status=error&message=画像の削除に失敗しました。`;
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
                  <Typography variant="h5">公開設定</Typography>
                  <FormControl>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="internal"
                          defaultChecked={event?.visible ? (event?.visible & 0x1) == 0x1 : false}
                          onChange={(e) => setIsEnablePublic(e.target.checked)}
                        />
                      }
                      label={<>学内限定公開</>}
                    />
                  </FormControl>
                  <FormControl>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="public"
                          defaultChecked={event?.visible ? (event?.visible & 0x2) == 0x2 : false}
                          disabled={!isEnablePublic}
                        />
                      }
                      label={<>一般公開</>}
                    />
                  </FormControl>
                  <Typography variant="h5">長い説明</Typography>
                  <TextField
                    name="main_text"
                    label="本文"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    defaultValue={event.main_text}
                    multiline
                    minRows={10}
                    maxRows={10}
                    onChange={(e) => setLongDescriptionState(e.target.value)}
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
                    value={event.image}
                    disableUnderline={true}
                  />
                  <Input
                    type="hidden"
                    name="previous_image_file"
                    value={event.image_file}
                    disableUnderline={true}
                  />
                  <Input
                    type="hidden"
                    name="id"
                    value={event.id}
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
              <AlertDialog id={event.id.toString()} />
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
                const res = await fetch(`/api/events/${id}`, {
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
