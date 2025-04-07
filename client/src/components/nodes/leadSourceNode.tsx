import { Handle, Position } from "@xyflow/react";
import { useState, useEffect } from "react";
import Modal from "../Modal";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const handleStyle = { left: 10 };

function LeadSourceNode({
  data: { email, setEmail },
}: {
  data: {
    email: string;
    setEmail: (email: string) => void;
  };
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
  });

  // Initialize form data when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setFormData({
        email,
      });
    }
  }, [isModalOpen, email]);

  const handleSave = () => {
    setEmail(formData.email);
    setIsModalOpen(false);
  };

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div
        className="flex flex-col justify-center gap-2 h-[60px] w-[250px] border border-black p-4 rounded-md bg-white cursor-pointer hover:bg-gray-50"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex items-center gap-2 w-full">
          <Image
            src="/source.svg"
            alt="Source"
            width={40}
            height={40}
            className="flex-shrink-0"
          />
          <span className="font-medium flex-shrink-0">Lead Source:</span>
          <span className="truncate min-w-0">{email || "Click to edit"}</span>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        style={handleStyle}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Lead Email"
        onSave={handleSave}
        saveButtonText="Save Details"
      >
        <div className="flex flex-col gap-4">
          <div>
            <Label
              htmlFor="email"
              // className="block text-sm font-medium text-gray-700 mb-1"
            >
              Lead Email:
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              // className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter lead email"
            />
          </div>
        </div>
      </Modal>
    </>
  );
}

export default LeadSourceNode;
