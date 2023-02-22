import { NextApiRequest, NextApiResponse } from "next";
import { parseForm, FormidableError } from "@/lib/parse-form";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    message: string | null;
    error: string | null;
  }>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({
      message: null,
      error: "Method Not Allowed",
    });
    return;
  }
  // Just after the "Method Not Allowed" code
  try {
    const { fields, files } = await parseForm(req);

    const file = files.media;
    console.log(file)

    res.status(200).json({
      message: "File uploaded successfully",
      error: null,
    });
  } catch (e) {
    if (e instanceof FormidableError) {
      res.status(e.httpCode || 400).json({ message: null, error: e.message });
    } else {
      console.error(e);
      res.status(500).json({ message: null, error: "Internal Server Error" });
    }
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};