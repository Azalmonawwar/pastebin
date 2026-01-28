import mongoose from "mongoose";

export interface Paste {
  _id: string;
  content: string;
  createdAt: number;
  ttl_seconds?: number;
  max_views?: number;
}

const pasteSchema = new mongoose.Schema<Paste>({
  content: { type: String, required: true },
  createdAt: { type: Number, required: true, default: () => Date.now() },
  ttl_seconds: { type: Number, required: false },
  max_views: { type: Number, required: false },
});
const Paste = mongoose.models.Paste || mongoose.model("Paste", pasteSchema);

export default Paste;
