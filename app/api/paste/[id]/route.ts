import connectToDatabase from "@/lib/db/connect";
import Paste from "@/lib/db/model/paste.model";
import { getCurrentTimeMs } from "@/lib/time";

export async function GET(_: Request, { params }: any) {
  await connectToDatabase();
  const { id } = await params;
  console.log(id);
  const doc = await Paste.findOne({ _id: id });

  // if (!doc) return notFound();

  const now = getCurrentTimeMs();

  // // TTL check
  if (doc.ttl_seconds) {
    const expires = doc.createdAt + doc.ttl_seconds * 1000;
    if (now > expires) return notFound();
  }

  // View limit check
  if (doc.max_views !== null && doc.max_views <= 0) return notFound();

  // increment view
  await Paste.updateOne({ _id: id }, { $inc: { max_views: -1 } });

  return Response.json({
    content: doc?.content,
    remaining_views: doc?.max_views,
    expires_at:
      (doc.ttl_seconds &&
        new Date(doc?.createdAt + doc?.ttl_seconds * 1000).toISOString()) ||
      null,
  });
}

function notFound() {
  return Response.json({ error: "Not found" }, { status: 404 });
}
