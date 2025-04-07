import { Handle, Position } from "@xyflow/react";
import { useState, useEffect } from "react";
import Modal from "../Modal";
import { Duration, TimeUnit, formatDuration } from "../../utils/time";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const handleStyle = { left: 10 };

function WaitNode({
  data: { duration, setDuration },
}: {
  data: {
    duration: Duration;
    setDuration: (duration: Duration) => void;
  };
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Duration>({
    value: 1,
    unit: "hours",
  });

  // Initialize form data when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setFormData(duration);
    }
  }, [isModalOpen, duration]);

  const handleSave = () => {
    setDuration(formData);
    setIsModalOpen(false);
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setFormData((prev) => ({ ...prev, value: 0 }));
    } else {
      const numValue = parseInt(value);
      if (!isNaN(numValue) && numValue > 0) {
        setFormData((prev) => ({ ...prev, value: numValue }));
      }
    }
  };

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div
        className="flex flex-col justify-center gap-2 h-[60px] w-[200px] border border-black p-4 rounded-md bg-white cursor-pointer hover:bg-gray-50"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex flex-row justify-between w-full">
          <div>
            <div className="flex items-center gap-2 w-full">
              <Image
                src="/wait.svg"
                alt="Wait"
                width={35}
                height={35}
                className="flex-shrink-0"
              />
              <span className="font-medium flex-shrink-0">Delay:</span>
              <span className="truncate min-w-0">
                {formatDuration(duration)}
              </span>
            </div>
          </div>

          {/* <div
            className="absolute top-1 right-1"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Image
              src="/delete.svg"
              alt="delete"
              width={20}
              height={20}
              className="flex-shrink-0"
            />
          </div> */}
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
        title="Set Wait Duration"
        onSave={handleSave}
        saveButtonText="Save Duration"
      >
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="value">Duration Value:</Label>
              <Input
                id="value"
                type="text"
                value={formData.value}
                onChange={handleValueChange}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="unit">Unit:</Label>
              <select
                id="unit"
                value={formData.unit}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    unit: e.target.value as TimeUnit,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
                <option value="days">Days</option>
              </select>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default WaitNode;
