import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import dotenv from "dotenv";

dotenv.config();

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TemplateInsertModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [templateName, setTemplateName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInsert = async () => {
    const template = { name: templateName, subject, body };
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/email/template`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(template),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to insert template");
      }
      alert("Template inserted successfully");

      onClose();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-[9999]"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl p-8 w-[1000px] max-w-[90vw] h-[80vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Template</h2>
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Template Name"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
          />
          <Input
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <Textarea
            placeholder="Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
        <div className="mt-8 flex justify-end gap-4">
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleInsert}>Insert</Button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default TemplateInsertModal;
