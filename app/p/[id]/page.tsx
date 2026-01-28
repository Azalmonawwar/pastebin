import connectToDatabase from "@/lib/db/connect";
import Paste from "@/lib/db/model/paste.model";
import { getCurrentTimeMs } from "@/lib/time";
import axios from "axios";

type DOC = {
    _id: string;
    content: string;
    createdAt: number;
    ttl_seconds?: number;
    max_views?: number;
    views: number;

};

export default async function Page({ params }: any) {
    const { id } = await params;
    console.log("Fetching paste with id:", id);
    // const doc: DOC = await fetch(`${process.env.APP_URL || "http://localhost:3000"}/api/paste/${id}`);
    const doc = await axios.get(`${process.env.APP_URL || "http://localhost:3000"}/api/paste/${id}`).then(res => res.data).catch(err => null);
    console.log(doc)
    if (!doc) return notFound();

    const now = getCurrentTimeMs();

    if (doc?.ttl_seconds) {
        const expires = doc?.createdAt + doc?.ttl_seconds * 1000;
        if (now > expires) return notFound();
    }

    if (doc?.max_views <= 0) return notFound();


    return (
        <div style={{ padding: 20, whiteSpace: "pre-wrap", fontFamily: "monospace" }}>
            {JSON.stringify(doc) || "No content available"}
        </div>
    );
}

function notFound() {
    return <h1>404 Not Found</h1>;
}
