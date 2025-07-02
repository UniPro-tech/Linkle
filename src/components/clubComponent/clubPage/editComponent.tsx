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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import "katex/dist/katex.min.css";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useActionState } from "react";
import formTheme from "@/theme/form";
import { LongDescription } from "../../md";
import { MuiFileInput } from "mui-file-input";
import Image from "next/image";
import * as React from "react";
import Club from "@/models/Club";

// --- API Actions ---
const submitAction = async (
  state: { status: string | null; message: string | null },
  data: FormData
): Promise<{ status: string | null; message: string | null }> => {
  const slack_link = (data.get("slack_link") as string)?.split("/")[4];
  const file = data.get("file") as File;
  const imageUrl = data.get("image") as string;

  if (file?.size > 0) {
    if (file.size > 100 * 1024 * 1024) {
      return { status: "error", message: "ファイルサイズが大きすぎます。" };
    }

    if (data.get("previous_image_file")) {
      const deleteRes = await fetch(
        `/api/clubs/${data.get("id")}/images?filename=${data.get("previous_image_file")}`,
        { method: "DELETE" }
      );
      if (!deleteRes.ok) {
        return { status: "error", message: "画像の更新に失敗しました。" };
      }
    }

    const imageFormData = new FormData();
    imageFormData.append("file", file);
    const filePostApiRes = await fetch(`/api/clubs/${data.get("id")}/images`, {
      method: "POST",
      body: imageFormData,
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
): Promise<{ status: string | null; message: string | null }> => {
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
      available_on: (data.get("kotobu") ? 0x1 : 0) | (data.get("chutobu") ? 0x2 : 0),
      visible: (data.get("internal") ? 0x1 : 0) | (data.get("public") ? 0x2 : 0),
    }),
  });

  return res.ok
    ? { status: "success", message: "変更を保存しました。" }
    : { status: "error", message: "変更の保存に失敗しました。" };
};

// --- Main Component ---
export default function ClubEdit({ club }: { club: Club }) {
  const [formState, formAction, isPending] = useActionState(submitAction, {
    status: null,
    message: null,
  });

  const [isEnablePublic, setIsEnablePublic] = useState(Boolean(club?.visible & 0x1));
  const [longDescriptionState, setLongDescriptionState] = useState(club?.long_description);
  const [formStatus, setFormStatus] = useState<string | undefined>(undefined);
  const [file, setFile] = useState<File | null>(null);

  const params = useSearchParams();
  const status = params.get("status");
  const message = params.get("message");

  useEffect(() => {
    if (formState.status === "success" || formState.status === "reflesh") {
      redirect(`/clubs/${club.id}/edit?status=success&message=${formState.message}`);
    }
    if (formState.status === "error") {
      redirect(`/clubs/${club.id}/edit?status=error&message=${formState.message}`);
    }
  }, [formState.status, club.id, formState.message]);

  useEffect(() => {
    if (status) setFormStatus(status);
  }, [status]);

  const handleClose = (_: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === "clickaway") return;
    setFormStatus(undefined);
  };

  const handleFileChange = (newFile: File | null) => setFile(newFile);

  return (
    <>
      {!isPending ? (
        <Stack
          spacing={1}
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          py={5}
          width="100%"
        >
          <StatusSnackbar
            status={formStatus}
            message={message}
            handleClose={handleClose}
          />
          <SectionTitle
            title="同好会編集"
            subtitle="ここで同好会情報の編集ができます。"
          />
          <Stack
            spacing={2}
            justifyContent="left"
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
                  defaultValue={
                    club.available_on & 0x2
                      ? `https://n-jr.slack.com/archive/${club.slack_link}`
                      : `https://n-highschool.slack.com/archive/${club.slack_link}`
                  }
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
                  onChange={handleFileChange}
                  value={file}
                />
                {club.image && club.image_file && <CurrentImageSection club={club} />}
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
                        name="kotobu"
                        defaultChecked={(club.available_on & 0x1) === 0x1}
                      />
                    }
                    label={<>高等部</>}
                  />
                </FormControl>
                <FormControl>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="chutobu"
                        defaultChecked={(club?.available_on & 0x2) === 0x2}
                      />
                    }
                    label={<>中等部</>}
                  />
                </FormControl>
                <Typography variant="h5">公開設定</Typography>
                <FormControl>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="internal"
                        defaultChecked={club?.visible ? (club?.visible & 0x1) === 0x1 : false}
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
                        defaultChecked={club?.visible ? (club?.visible & 0x2) === 0x2 : false}
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
                  justifyContent="center"
                  alignItems="center"
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
                  disableUnderline
                />
                <Input
                  type="hidden"
                  name="previous_image_file"
                  value={club.image_file}
                  disableUnderline
                />
                <Input
                  type="hidden"
                  name="id"
                  value={club.id}
                  disableUnderline
                />
              </form>
            </ThemeProvider>
          </Stack>
          <Stack
            spacing={2}
            justifyContent="left"
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
      ) : (
        <Stack
          spacing={1}
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          py={5}
          width="100%"
        >
          <Typography>保存中</Typography>
          <CircularProgress />
        </Stack>
      )}
    </>
  );
}

// --- Subcomponents ---
function StatusSnackbar({
  status,
  message,
  handleClose,
}: {
  status: string | undefined;
  message: string | null;
  handleClose: (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => void;
}) {
  return (
    <>
      <Snackbar
        open={status === "success"}
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
        open={status === "error"}
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
    </>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <Stack
      spacing={2}
      justifyContent="center"
      alignItems="center"
    >
      <Typography variant="h3">{title}</Typography>
      <Typography variant="body1">{subtitle}</Typography>
    </Stack>
  );
}

function CurrentImageSection({ club }: { club: Club }) {
  const handleDelete = async () => {
    const res = await fetch(`/api/clubs/${club.id}/images?filename=${club.image_file}`, {
      method: "DELETE",
    });
    if (res.ok) {
      const patchRes = await fetch(`/api/clubs/${club.id}`, {
        method: "PATCH",
        body: JSON.stringify({ image: "", image_file: "" }),
      });
      if (patchRes.ok)
        window.location.href = `/clubs/${club.id}/edit?status=success&message=画像を削除しました。`;
      else
        window.location.href = `/clubs/${club.id}/edit?status=error&message=画像の削除に失敗しました。`;
    } else {
      window.location.href = `/clubs/${club.id}/edit?status=error&message=画像の削除に失敗しました。`;
    }
  };

  // 画像エラー時NoImageにフォールバック
  const [imgSrc, setImgSrc] = React.useState(club.image || "/img/NoImage.webp");
  return (
    <>
      <Typography variant="h5">現在の画像</Typography>
      <Image
        src={imgSrc}
        alt="club image"
        width={300}
        height={180}
        style={{ objectFit: "cover", borderRadius: 8 }}
        onError={() => setImgSrc("/img/NoImage.webp")}
        placeholder="blur"
        blurDataURL="/img/NoImage.webp"
      />
      <Button
        onClick={handleDelete}
        color="error"
        variant="outlined"
      >
        画像を削除
      </Button>
    </>
  );
}

export function AlertDialog({ id }: { id: string }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDelete = async () => {
    const res = await fetch(`/api/clubs/${id}`, { method: "DELETE" });
    if (res.ok) {
      redirect("/dashboard");
    } else {
      alert("削除に失敗しました。");
    }
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
              onClick={handleDelete}
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
