import { Workflow } from "../models/workflowModel.js";

// saving workflow
export const saveWorkflow = async (req, res) => {
  try {
    const { nodes, edges } = req.body;

    const workflow = new Workflow({
      nodes,
      edges,
    });

    await workflow.save();

    res.status(201).json({
      success: true,
      data: workflow,
    });
  } catch (error) {
    console.error("Error saving workflow:", error);
    res.status(500).json({
      success: false,
      error: "Error saving workflow",
    });
  }
};

export const getWorkflows = async (req, res) => {
  try {
    const workflows = await Workflow.find();
    res.status(200).json({
      success: true,
      data: workflows,
    });
  } catch (error) {
    console.error("Error fetching workflows:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching workflows",
    });
  }
};
