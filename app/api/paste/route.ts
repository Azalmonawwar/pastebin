import connectToDatabase from "@/lib/db/connect";
import Paste from "@/lib/db/model/paste.model";
import { validateCreate } from "@/lib/validate";

export async function POST(req: Request) {
  const body = await req.json();
  const err = validateCreate(body);
  if (err) return Response.json({ error: err }, { status: 400 });

  await connectToDatabase();
  const id = crypto.randomUUID();

  const doc = {
    content: body.content,
    createdAt: Date.now(),
    ttl_seconds: body.ttl_seconds,
    max_views: body.max_views,
  };

  const paste = await Paste.create(doc);
  if (!paste) {
    return Response.json({ error: "Failed to create paste." }, { status: 500 });
  }

  const base = process.env.APP_URL || "http://localhost:3000";

  return Response.json({
    id: paste._id,
    url: `${base}/p/${paste._id}`,
  });
}
