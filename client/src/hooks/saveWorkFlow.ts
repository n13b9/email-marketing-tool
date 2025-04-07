// hooks/useSaveWorkflow.ts
import { useWorkflow } from "../context/WorkflowContext";
import { processWorkflow, WorkflowNode } from "../utils/workflowProcessor";
import { toast } from "sonner";
import { useState } from "react";

export const useSaveWorkflow = () => {
  const { nodes, edges } = useWorkflow();
  const [isSaving, setIsSaving] = useState(false);

  const saveWorkflow = async () => {
    setIsSaving(true);

    try {
      if (nodes.length === 0 || edges.length === 0) {
        throw new Error("Workflow cannot be empty");
      }

      const processedWorkflow = processWorkflow(nodes as WorkflowNode[], edges);
      if (processedWorkflow.scheduledEmails.length === 0) {
        throw new Error("No valid emails to send");
      }

      const workflowResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/workflows`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nodes, edges }),
        }
      );

      if (!workflowResponse.ok) {
        throw new Error("Failed to save workflow");
      }

      // Send emails in parallel
      await Promise.all(
        processedWorkflow.scheduledEmails.map(async (email) => {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/email/schedule`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                to: email.to,
                subject: email.subject,
                text: email.body,
                delayMinutes: email.delayMinutes,
              }),
            }
          );

          if (!response.ok) {
            const error = await response.json();
            throw new Error(
              error.message || `Failed to schedule email to ${email.to}`
            );
          }
          return response.json();
        })
      );

      toast.success("Workflow saved and emails scheduled successfully!");
    } catch (error: any) {
      console.error("Workflow save error:", error);
      toast.error(error.message || "Failed to save workflow");
    } finally {
      setIsSaving(false);
    }
  };

  return { saveWorkflow, isSaving };
};
