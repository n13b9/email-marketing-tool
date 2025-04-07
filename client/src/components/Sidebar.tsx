"use client";
import React from "react";
import { useDnD } from "../context/DnDContext";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useSaveWorkflow } from "../hooks/saveWorkFlow"; // New custom hook

const Sidebar = () => {
  const [_, setType] = useDnD();
  const { saveWorkflow, isSaving } = useSaveWorkflow();

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string
  ) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const nodeTypes = [
    { type: "LeadSource", label: "Lead Source" },
    { type: "Email", label: "Cold Email" },
    { type: "Wait", label: "Delay" },
  ];

  return (
    <aside className="w-[250px] min-w-[250px] border-l border-gray-200 bg-white">
      <div className="flex flex-col gap-4 p-4">
        <div className="description text-base mb-4">
          You can drag these nodes to the pane on the right.
        </div>

        {nodeTypes.map((node) => (
          <div
            key={node.type}
            className="dndnode text-base font-medium p-2 mb-2 cursor-grab active:cursor-grabbing border border-gray-300 rounded hover:bg-gray-50"
            onDragStart={(event) => onDragStart(event, node.type)}
            draggable
          >
            {node.label}
          </div>
        ))}

        <Button
          onClick={saveWorkflow}
          disabled={isSaving}
          className="w-full px-6 py-3 text-white rounded-lg text-base font-bold h-[50px] flex items-center justify-center gap-4"
        >
          <Image
            src="/schedule.svg"
            alt="Schedule"
            width={25}
            height={25}
            className="flex-shrink-0"
          />
          {isSaving ? "Saving..." : "Save & Schedule"}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
