import { Button, Chip, Stack, Typography } from "@mui/material";

export default function BetaPage() {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      justifyContent="center"
      height="100vh"
      p={2}
    >
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
      >
        RC / Alpha
      </Typography>
      <Typography
        variant="body1"
        component="p"
        gutterBottom
      >
        これらはベータ版です。新機能をいち早く利用できる代わりに、動作が不安定である可能性があります。
      </Typography>
      <Typography
        variant="h4"
        component="p"
        gutterBottom
      >
        新機能
      </Typography>
      <ol>
        <Typography
          variant="body1"
          component="li"
          gutterBottom
          sx={{
            listStyleType: "number",
          }}
        >
          イベント作成機能{" "}
          <Chip
            variant="outlined"
            label="Alpha"
            size="small"
            color="error"
          />
        </Typography>
      </ol>
      <Button
        variant="outlined"
        color="primary"
        href="https://rc.linkle.nnn.uniproject.jp"
      >
        RC版へ
      </Button>
      <Button
        variant="outlined"
        color="error"
        href="https://alpha.linkle.nnn.uniproject.jp"
      >
        Alpha版へ
      </Button>
      <Button
        variant="outlined"
        color="info"
        href="https://alpha.linkle.nnn.uniproject.jp"
      >
        正規版へ
      </Button>
    </Stack>
  );
}
