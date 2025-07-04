import { NextRequest, NextResponse } from "next/server";

const uploadScriptUrl = process.env.IMAGE_UPLOAD_SCRIPT_URL!;
const deleteScriptUrl = process.env.IMAGE_DELETE_SCRIPT_URL!;

async function uploadFile(fileName: string, base64Data: string) {
  const postData = {
    filename: fileName,
    body: base64Data,
    type: "club",
  };

  try {
    const response = await fetch(uploadScriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    throw new Error(String(error));
  }
}

function getClubFileName(clubId: string, fileName: string) {
  return `${clubId}_${fileName}`;
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const data = await request.formData();
  const file = data.get("file") as File;
  const clubId = (await params).id;

  if (!file) {
    return NextResponse.json({ message: "File is required" }, { status: 400 });
  }

  try {
    const buffer = await file.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString("base64");
    const clubFileName = getClubFileName(clubId, file.name);
    await uploadFile(clubFileName, base64Data);

    const res = await fetch(`${uploadScriptUrl}?filename=${clubFileName}&type=club`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`[error]/api/images:POST\nCode: ${res.status}\nMessage: ${res.statusText}`);
      return NextResponse.json({ message: "Error uploading file" }, { status: res.status });
    }

    const { url } = await res.json();
    return NextResponse.json({ message: "File uploaded", url }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "File uploaded but an error occurred during upload" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const clubId = (await params).id;
  const fileName = request.nextUrl.searchParams.get("filename");
  if (!fileName) {
    return NextResponse.json({ message: "File name is required" }, { status: 400 });
  }
  const clubFileName = getClubFileName(clubId, fileName);

  const res = await fetch(`${uploadScriptUrl}?filename=${clubFileName}&type=club`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    next: { revalidate: 120 }, // Cache for 2 minutes
  });

  if (!res.ok) {
    return NextResponse.json({ message: "Error fetching file" }, { status: res.status });
  }

  const { url } = await res.json();
  return NextResponse.json({ url }, { status: 200 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const fileName = request.nextUrl.searchParams.get("filename");
  const clubId = (await params).id;
  if (!fileName || !clubId) {
    return NextResponse.json({ message: "filename and clubId are required" }, { status: 400 });
  }
  const clubFileName = getClubFileName(clubId, fileName);

  const res = await fetch(`${deleteScriptUrl}?type=club&filename=${clubFileName}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error(`[error]/api/images:DELETE\nCode: ${res.status}\nMessage: ${res.statusText}`);
    return NextResponse.json({ message: "Error deleting file" }, { status: res.status });
  }
  return NextResponse.json({ message: "File deleted" }, { status: 200 });
}
