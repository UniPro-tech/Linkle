import { NextRequest, NextResponse } from "next/server";

const postScriptUrl = process.env.NEXT_PUBLIC_IMAGE_POST_SCRIPT_URL;
const deleteScriptUrl = process.env.IMAGE_DELETE_SCRIPT_URL;

async function uploadFile(fileName: string, base64Data: string) {
  const postData = {
    filename: fileName,
    body: base64Data,
  };

  try {
    const response = await fetch(`${postScriptUrl as string}/event.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log("Response:", responseData);
  } catch (error) {
    throw new Error(error as string);
  }
}

export async function POST(request: NextRequest) {
  const json = await request.json();
  const { eventId, fileName, base64Data } = json;

  try {
    await uploadFile(eventId + "_" + fileName, base64Data);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "File uploaded but an error occurred during upload" },
      { status: 500 }
    );
  }

  const res = await fetch(`${postScriptUrl as string}/event.php?filename=${eventId}_${fileName}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  if (res.status !== 200) {
    console.log(`[error]/api/images:POST
        Code: ${res.status}
        Message: ${res.statusText}`);
    return NextResponse.json({ message: "Error uploading file" }, { status: res.status });
  }
  const { url } = await res.json();
  return NextResponse.json({ message: "File uploaded", url: url }, { status: 200 });
}

export async function GET(request: NextRequest) {
  const fileName = await request.nextUrl.searchParams.get("filename");
  const eventId = await request.nextUrl.searchParams.get("eventId");
  const res = await fetch(`${postScriptUrl as string}/event.php?filename=${eventId}_${fileName}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 120 },
  });
  const { url } = await res.json();
  return NextResponse.json({ url: url }, { status: 200 });
}

export async function DELETE(request: NextRequest) {
  const fileName = await request.nextUrl.searchParams.get("filename");
  const eventId = await request.nextUrl.searchParams.get("eventId");
  const res = await fetch(
    `${deleteScriptUrl as string}?type=event&filename=${eventId}_${fileName}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );
  if (res.status !== 200) {
    console.log(`[error]/api/images:DELETE
        Code: ${res.status}
        Message: ${res.statusText}`);
    return NextResponse.json({ message: "Error deleting file" }, { status: res.status });
  }
  return NextResponse.json({ message: "File deleted" }, { status: 200 });
}
