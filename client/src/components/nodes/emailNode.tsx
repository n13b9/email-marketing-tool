import { Handle, Position } from "@xyflow/react";
import { useState, useEffect } from "react";
import Modal from "../Modal";
import TemplateModal from "../DraftEmailModal";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
// import dotenv from "dotenv";

// dotenv.config();

const handleStyle = { left: 10 };

interface Template {
  name: string;
  subject: string;
  body: string;
}

function EmailNode({
  data: { subject, body, setSubject, setBody },
}: {
  data: {
    subject: string;
    body: string;
    setSubject: (subject: string) => void;
    setBody: (body: string) => void;
  };
}) {
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredNames, setFilteredNames] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);

  useEffect(() => {
    const fetchTemplates = async () => {
      if (!isSelectionModalOpen) return;

      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/email/templates`
        );
        console.log(
          "URL used:",
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/email/templates`
        );

        const data = await response.json();

        const receivedTemplates = Array.isArray(data) ? data : data.data || [];
        setTemplates(receivedTemplates);
        setFilteredNames(receivedTemplates.map((t: any) => t.name));
      } catch (error) {
        console.error("Failed to load templates:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, [isSelectionModalOpen]);

  // Filter template names
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredNames(templates.map((t) => t.name));
    } else {
      const filtered = templates
        .filter((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .map((t) => t.name);
      setFilteredNames(filtered);
    }
  }, [searchQuery, templates]);

  const handleSelectTemplate = (templateName: string) => {
    const selectedTemplate = templates.find((t) => t.name === templateName);
    if (selectedTemplate) {
      setSubject(selectedTemplate.subject);
      setBody(selectedTemplate.body);
    }
    setIsSelectionModalOpen(false);
  };

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div
        className="flex flex-col  gap-2 h-[60px] w-[200px] border border-black p-4 rounded-md bg-white cursor-pointer hover:bg-gray-50"
        onClick={() => setIsSelectionModalOpen(true)}
      >
        <div className="flex items-center gap-2 w-full">
          <Image
            src="/email.svg"
            alt="Email"
            width={35}
            height={35}
            className="flex-shrink-0"
          />
          <span className="font-medium flex-shrink-0">Email:</span>
          <span className="truncate min-w-0">{subject || "No subject"}</span>
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
        isOpen={isSelectionModalOpen}
        onClose={() => setIsSelectionModalOpen(false)}
        title="Cold Email"
      >
        <div className="space-y-4 ">
          <div className="flex justify-between items-center ">
            <div>
              <Label className="font-bold text-sm">Email Template:</Label>
            </div>
            <div>
              <Button
                onClick={() => {
                  setIsCreationModalOpen(true);
                  setIsSelectionModalOpen(false);
                }}
                className="font-bold"
              >
                <Image
                  src="/plus.svg"
                  alt="plus"
                  width={20}
                  height={20}
                  className="flex-shrink-0 filter invert"
                />
                New Template
              </Button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="flex-1 p-2 border rounded"
            />
          </div>

          {searchQuery.length > 0 && (
            <div className="border rounded max-h-60 overflow-auto">
              {isLoading ? (
                <div className="p-4 text-center">Loading templates...</div>
              ) : filteredNames.length > 0 ? (
                filteredNames.map((name, index) => (
                  <div
                    key={index}
                    className="p-3 border-b hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelectTemplate(name)}
                  >
                    {name}
                  </div>
                ))
              ) : (
                <div className="p-3 text-gray-500">No matching templates</div>
              )}
            </div>
          )}
        </div>
      </Modal>

      <TemplateModal
        isOpen={isCreationModalOpen}
        onClose={() => {
          setIsCreationModalOpen(false);
          setIsSelectionModalOpen(true);
        }}
      />
    </>
  );
}

export default EmailNode;
