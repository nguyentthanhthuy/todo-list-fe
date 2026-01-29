import { getValidGoogleToken } from "@/utils/googleAuth";

export async function listDriveFiles() {
  const token = await getValidGoogleToken();

  const res = await fetch("https://www.googleapis.com/drive/v3/files", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}
