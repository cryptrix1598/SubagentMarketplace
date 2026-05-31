interface S3Config {
  endpoint: string;
  accessKey: string;
  secretKey: string;
  bucket: string;
  region: string;
  publicUrl?: string;
}

function getS3Config(): S3Config {
  return {
    endpoint: process.env["S3_ENDPOINT"] || "http://localhost:9000",
    accessKey: process.env["S3_ACCESS_KEY"] || "minioadmin",
    secretKey: process.env["S3_SECRET_KEY"] || "minioadmin",
    bucket: process.env["S3_BUCKET"] || "claude-agent-hub",
    region: process.env["S3_REGION"] || "us-east-1",
    publicUrl: process.env["S3_PUBLIC_URL"],
  };
}

async function getSignedUrl(
  key: string,
  operation: "GET" | "PUT",
  expiresIn: number = 3600,
): Promise<string> {
  const config = getS3Config();
  const url = new URL(`/${config.bucket}/${key}`, config.endpoint);

  if (operation === "PUT") {
    return url.toString();
  }

  return config.publicUrl
    ? `${config.publicUrl}/${key}`
    : url.toString();
}

export async function uploadFile(
  key: string,
  data: Buffer | Blob | string,
  contentType: string = "application/octet-stream",
): Promise<string> {
  const config = getS3Config();
  const url = new URL(`/${config.bucket}/${key}`, config.endpoint);

  try {
    const body: BodyInit = Buffer.isBuffer(data) ? new Uint8Array(data) : data;

    const response = await fetch(url.toString(), {
      method: "PUT",
      headers: {
        "Content-Type": contentType,
        Authorization: `Basic ${Buffer.from(`${config.accessKey}:${config.secretKey}`).toString("base64")}`,
      },
      body,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return config.publicUrl ? `${config.publicUrl}/${key}` : url.toString();
  } catch (error) {
    console.error("S3 upload error:", error);
    throw error;
  }
}

export async function deleteFile(key: string): Promise<boolean> {
  const config = getS3Config();
  const url = new URL(`/${config.bucket}/${key}`, config.endpoint);

  try {
    const response = await fetch(url.toString(), {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${Buffer.from(`${config.accessKey}:${config.secretKey}`).toString("base64")}`,
      },
    });

    return response.ok || response.status === 204;
  } catch (error) {
    console.error("S3 delete error:", error);
    return false;
  }
}

export function getFileUrl(key: string): string {
  const config = getS3Config();
  if (config.publicUrl) {
    return `${config.publicUrl}/${key}`;
  }
  return new URL(`/${config.bucket}/${key}`, config.endpoint).toString();
}

export function generateAgentFileKey(
  publisherId: string,
  agentSlug: string,
  version: string,
  fileName: string,
): string {
  return `agents/${publisherId}/${agentSlug}/${version}/${fileName}`;
}

export function generateScreenshotKey(
  publisherId: string,
  agentSlug: string,
  fileName: string,
): string {
  return `screenshots/${publisherId}/${agentSlug}/${fileName}`;
}

export function generateAvatarKey(userId: string, fileName: string): string {
  return `avatars/${userId}/${fileName}`;
}

export { getSignedUrl, getS3Config };
