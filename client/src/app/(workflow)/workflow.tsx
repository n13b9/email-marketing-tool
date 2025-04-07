"use client";

import { useState, useCallback, useRef } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  addEdge,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import EmailNode from "../../components/nodes/emailNode";
import WaitNode from "../../components/nodes/waitNode";
import LeadSourceNode from "../../components/nodes/leadSourceNode";
import "../../app/globals.css";
import { Duration, TimeUnit } from "../../utils/time";

import Sidebar from "../../components/Sidebar";
import { DnDProvider, useDnD } from "../../context/DnDContext";
import { WorkflowProvider, useWorkflow } from "@/context/WorkflowContext";

const nodeTypes = {
  Email: EmailNode,
  Wait: WaitNode,
  LeadSource: LeadSourceNode,
};

interface EmailNodeData extends Record<string, unknown> {
  label: string;
  subject: string;
  setSubject: (subject: string) => void;
  body: string;
  setBody: (body: string) => void;
}

interface WaitNodeData extends Record<string, unknown> {
  label: string;
  duration: Duration;
  setDuration: (duration: Duration) => void;
}

interface LeadSourceNodeData extends Record<string, unknown> {
  label: string;
  email: string;
  setEmail: (email: string) => void;
}

type NodeData = EmailNodeData | WaitNodeData | LeadSourceNodeData;

function Flow() {
  const { nodes, edges, setNodes, setEdges } = useWorkflow();
  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition } = useReactFlow();
  const [type] = useDnD();

  const onConnect = useCallback(
    (connection: Connection) => {
      const edge: Edge = {
        ...connection,
        animated: true,
        id: `${edges.length}+1`,
        type: "customEdge",
      };
      setEdges([...edges, edge]);
    },
    [edges, setEdges]
  );

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const updatedNodes = applyNodeChanges(changes, nodes);
      setNodes(updatedNodes);
    },
    [nodes, setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const updatedEdges = applyEdgeChanges(changes, edges);
      setEdges(updatedEdges);
    },
    [edges, setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const getId = () => `node_${nodes.length + 1}`;

  const deleteNode = (id: any) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
  };

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const id = getId();
      let nodeData: NodeData;

      // Add specific data based on node type
      switch (type) {
        case "Email":
          nodeData = {
            label: `${type} node`,
            subject: "",
            setSubject: (subject: string) =>
              setNodes((nds) =>
                nds.map((node) =>
                  node.id === id
                    ? { ...node, data: { ...node.data, subject } }
                    : node
                )
              ),
            body: "",
            setBody: (body: string) =>
              setNodes((nds) =>
                nds.map((node) =>
                  node.id === id
                    ? { ...node, data: { ...node.data, body } }
                    : node
                )
              ),
            deleteNode: () => deleteNode(id),
          };
          break;
        case "Wait":
          nodeData = {
            label: `${type} node`,
            duration: {
              value: 1,
              unit: "hours",
            },
            setDuration: (duration: Duration) =>
              setNodes((nds) =>
                nds.map((node) =>
                  node.id === id
                    ? { ...node, data: { ...node.data, duration } }
                    : node
                )
              ),
          };
          break;
        case "LeadSource":
          nodeData = {
            label: `${type} node`,
            email: "",
            setEmail: (email: string) =>
              setNodes((nds) =>
                nds.map((node) =>
                  node.id === id
                    ? { ...node, data: { ...node.data, email } }
                    : node
                )
              ),
          };
          break;
        default:
          nodeData = {
            label: `${type} node`,
            email: "",
            setEmail: (email: string) =>
              setNodes((nds) =>
                nds.map((node) =>
                  node.id === id
                    ? { ...node, data: { ...node.data, email } }
                    : node
                )
              ),
          };
      }

      const newNode: Node = {
        id,
        type,
        position,
        data: nodeData,
      };

      setNodes([...nodes, newNode]);
    },
    [screenToFlowPosition, type, nodes, setNodes]
  );

  return (
    <div className="dndflow" style={{ height: "100%", display: "flex" }}>
      <div style={{ flex: 1, height: "100%" }}>
        <ReactFlow
          nodes={nodes}
          onNodesChange={onNodesChange}
          edges={edges}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
          defaultViewport={{ x: 0, y: 0, zoom: 0.3 }}
          minZoom={0.1}
          maxZoom={1}
        >
          <Background offset={10} gap={10} />
          <Controls />
        </ReactFlow>
      </div>
      <div>
        <Sidebar />
      </div>
    </div>
  );
}

// export default Flow;

export default () => (
  <ReactFlowProvider>
    <WorkflowProvider>
      <DnDProvider>
        <Flow />
      </DnDProvider>
    </WorkflowProvider>
  </ReactFlowProvider>
);
