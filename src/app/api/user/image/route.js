import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const data = await req.formData();
    const file = data.get("profile");
    const byteData = await file.arrayBuffer();
    const Bucket = "airambulance";
    const Body = Buffer.from(byteData);
    const lastDot = file.name.lastIndexOf(".");
    const file_name = file.name.slice(0,lastDot);
    const extension = file.name.slice(lastDot + 1);
    const Key = `${file_name}_${new Date().getTime()}.${extension}`;
    const s3 = new S3Client();
    await s3.send(new PutObjectCommand({ Bucket, Key, Body }));
    const imageUrl = `https://s3.${process.env.AWS_REGION}.amazonaws.com/${Bucket}/${Key}`;
    return NextResponse.json({
      success: true,
      secureUrl: imageUrl,
    });
  } catch (error) {
    console.error("s3 upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
};
