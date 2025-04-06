// models/Workflow.js
import mongoose from "mongoose";

const nodeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    position: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
    },
    data: { type: mongoose.Schema.Types.Mixed },
  },
  { discriminatorKey: "type" }
);

// Edge Schema
const edgeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  source: { type: String, required: true },
  target: { type: String, required: true },
  type: { type: String, default: "default" },
  animated: { type: Boolean, default: false },
});

// Workflow Schema
const workflowSchema = new mongoose.Schema(
  {
    nodes: [nodeSchema],
    edges: [edgeSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Node = mongoose.model("Node", nodeSchema);

const EmailNode = Node.discriminator(
  "email",
  new mongoose.Schema({
    data: {
      email: { type: String, required: true },
      subject: { type: String, required: true },
      body: { type: String, required: true },
    },
  })
);

const WaitNode = Node.discriminator(
  "wait",
  new mongoose.Schema({
    data: {
      duration: {
        value: { type: Number, required: true },
      },
    },
  })
);

const LeadSourceNode = Node.discriminator(
  "leadSource",
  new mongoose.Schema({
    data: {
      sourceType: {
        type: String,
        required: true,
      },
      tag: {
        type: String,
        enum: ["firsttime", "followup", "successful"],
      },
      filters: mongoose.Schema.Types.Mixed,
    },
  })
);

const Workflow = mongoose.model("Workflow", workflowSchema);

export { Workflow, Node, EmailNode, WaitNode, LeadSourceNode };
