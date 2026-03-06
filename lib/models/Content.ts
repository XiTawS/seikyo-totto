import mongoose, { Schema } from "mongoose";

export interface IContent {
  siteId: string;
  type: "auth" | "content";
  key?: string;
  contentType?: "text" | "image";
  value?: string;
  page?: string;
  username?: string;
  password?: string;
  email?: string;
  updatedAt?: Date;
}

const ContentSchema = new Schema<IContent>(
  {
    siteId: { type: String, required: true, index: true },
    type: { type: String, enum: ["auth", "content"], required: true },
    key: { type: String },
    contentType: { type: String, enum: ["text", "image"] },
    value: { type: String },
    page: { type: String },
    username: { type: String },
    password: { type: String },
    email: { type: String },
  },
  { timestamps: true, collection: "seikyo-clients" }
);

ContentSchema.index({ siteId: 1, key: 1 }, { unique: true, sparse: true });

export default mongoose.models.SeikyoContent ||
  mongoose.model("SeikyoContent", ContentSchema);
