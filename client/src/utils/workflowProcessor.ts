import { Node, Edge } from "@xyflow/react";
import { Duration, calculateExactMinutes } from "./time";

export interface WorkflowNode extends Node {
  type: string;
  data: {
    label: string;
    duration?: Duration;
    subject?: string;
    body?: string;
    email?: string;
  };
}

export interface ScheduledEmail {
  to: string;
  subject: string;
  body: string;
  delayMinutes: number;
}

export interface ProcessedWorkflow {
  scheduledEmails: ScheduledEmail[];
}

export function processWorkflow(
  nodes: WorkflowNode[],
  edges: Edge[]
): ProcessedWorkflow {
  if (nodes.length === 0 || edges.length === 0) {
    return { scheduledEmails: [] };
  }

  const scheduledEmails: ScheduledEmail[] = [];
  const nodeDelays = new Map<string, number>();

  console.log("Processing workflow with nodes:", nodes);
  console.log("Edges:", edges);

  // Helper function to get all parent nodes of a given node
  function getParentNodes(nodeId: string): string[] {
    const parents = edges
      .filter((edge) => edge.target === nodeId)
      .map((edge) => edge.source);
    console.log(`Parent nodes for ${nodeId}:`, parents);
    return parents;
  }

  // Helper function to get all child nodes of a given node
  function getChildNodes(nodeId: string): string[] {
    const children = edges
      .filter((edge) => edge.source === nodeId)
      .map((edge) => edge.target);
    console.log(`Child nodes for ${nodeId}:`, children);
    return children;
  }

  // Helper function to calculate delay for a node
  function calculateNodeDelay(nodeId: string): number {
    if (nodeDelays.has(nodeId)) {
      return nodeDelays.get(nodeId)!;
    }

    const currentNode = nodes.find((n) => n.id === nodeId);
    const parentNodes = getParentNodes(nodeId);

    let delay = 0;

    // If this is a Wait node, add its duration
    if (currentNode?.type === "Wait" && currentNode.data.duration) {
      delay = calculateExactMinutes(currentNode.data.duration);
      console.log(`Node ${nodeId} is Wait node with delay: ${delay}`);
    }

    if (parentNodes.length === 0) {
      return delay;
    }

    // Get the maximum delay from all parent nodes and add current delay
    const parentDelays = parentNodes.map((parentId) => {
      const parentDelay = calculateNodeDelay(parentId);
      return parentDelay;
    });

    const maxDelay = Math.max(delay, ...parentDelays);
    const totalDelay = Math.max(delay, maxDelay);
    console.log(
      `Total delay for node ${nodeId}: ${totalDelay} minutes (current: ${delay}, parent max: ${maxDelay})`
    );
    nodeDelays.set(nodeId, totalDelay);
    return totalDelay;
  }

  // Find all email nodes and process their workflows
  nodes.forEach((node) => {
    if (node.type === "Email") {
      console.log("Processing email node:", node);
      const emailNode = node;

      // Get all child nodes to find Wait nodes
      const childNodes = getChildNodes(node.id);
      console.log("Child nodes of email node:", childNodes);
      let totalDelay = 0;

      // Calculate delay from child Wait nodes
      for (const childId of childNodes) {
        const childNode = nodes.find((n) => n.id === childId);
        console.log("Checking child node:", childNode);
        if (childNode?.type === "Wait" && childNode.data.duration) {
          const waitDelay = calculateNodeDelay(childId); // Use calculateNodeDelay instead of direct calculation
          totalDelay = waitDelay; // Use the total delay from the Wait node
          console.log(
            `Adding delay from Wait node ${childId}: ${waitDelay} minutes, total: ${totalDelay}`
          );
        }
      }

      // Find all connected LeadSource nodes by traversing up
      const leadSourceNodes: WorkflowNode[] = [];
      const findLeadSources = (
        nodeId: string,
        visited = new Set<string>()
      ): void => {
        if (visited.has(nodeId)) return;
        visited.add(nodeId);

        const parentIds = getParentNodes(nodeId);
        console.log(
          `Looking for LeadSource in parents of ${nodeId}:`,
          parentIds
        );

        for (const parentId of parentIds) {
          const parentNode = nodes.find((n) => n.id === parentId);
          console.log(`Checking parent node ${parentId}:`, parentNode);

          if (parentNode?.type === "LeadSource") {
            leadSourceNodes.push(parentNode);
            console.log("Found LeadSource node:", parentNode);
          } else {
            // Continue searching in parent nodes
            findLeadSources(parentId, visited);
          }
        }
      };

      // Start the search from the email node
      findLeadSources(node.id);
      console.log("All found LeadSource nodes:", leadSourceNodes);

      if (
        leadSourceNodes.length > 0 &&
        emailNode.data.subject &&
        emailNode.data.body
      ) {
        // Process each LeadSource node
        leadSourceNodes.forEach((leadSourceNode) => {
          // Split email addresses if there are multiple
          const emailAddresses =
            leadSourceNode.data.email
              ?.split(",")
              .map((email) => email.trim())
              .filter((email) => email.length > 0) || [];

          console.log("Processing email addresses for LeadSource:", {
            nodeId: leadSourceNode.id,
            emailAddresses,
          });

          // Create a scheduled email for each email address
          emailAddresses.forEach((email) => {
            if (emailNode.data.subject && emailNode.data.body) {
              console.log("Creating scheduled email with:", {
                to: email,
                subject: emailNode.data.subject,
                body: emailNode.data.body,
                delayMinutes: totalDelay,
              });
              scheduledEmails.push({
                to: email,
                subject: emailNode.data.subject,
                body: emailNode.data.body,
                delayMinutes: totalDelay,
              });
            }
          });
        });
      } else {
        console.log("Missing required data:", {
          hasLeadSources: leadSourceNodes.length > 0,
          hasSubject: !!emailNode.data.subject,
          hasBody: !!emailNode.data.body,
          childNodes,
          edges,
        });
      }
    }
  });

  console.log("Final scheduled emails:", scheduledEmails);
  return { scheduledEmails };
}

// Helper function to get the next execution time for a scheduled email
export function getNextExecutionTime(delayMinutes: number): Date {
  const now = new Date();
  now.setMinutes(now.getMinutes() + delayMinutes);
  return now;
}
