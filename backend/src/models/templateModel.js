import mongoose from "mongoose";

const templateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
  },
  { discriminatorKey: "type" }
);

const Template = mongoose.model("Template", templateSchema);

export default Template;
