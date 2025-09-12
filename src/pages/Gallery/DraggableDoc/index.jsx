import { useState } from "react";
import { IconButton } from "@/Components/ui/shadcn-io/icon-button";
import { CustomModal } from "@/Components/CustomModal";
import { Tooltip } from "@/Components/Tooltip";
import { Trash, HandGrab } from "lucide-react";
import {
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import {
  formatSize,
  formatDate,
  CLASS_COLORS,
} from "@/helpers/utils";

export const DraggableDoc = ({ doc, deleteInsuranceDoc }) => {
  const { setNodeRef, listeners, attributes, isDragging, transform } =
    useDraggable({
      id: doc.id,
    });

  const [open, setOpen] = useState(false);
  const { setNodeRef: setDropRef, isOver } = useDroppable({ id: doc.id });

  const handleConfirmDelete = () => {
    deleteInsuranceDoc(doc.id);
    setOpen(false);
  };

  const confidenceDisplay = `${(doc.confidence * 100).toFixed(0)}%`;

  const containerClasses = `
    relative flex flex-col gap-3 p-4 rounded-xl bg-gray-50 
    border-2 transition-all duration-200 ease-in-out
    shadow-sm hover:shadow-md
    ${
      isDragging
        ? "opacity-50 bg-gray-100 shadow-lg cursor-grabbing"
        : "cursor-grab"
    }
    ${isOver ? "border-blue-500 bg-blue-50" : "border-gray-200"}
  `;

  return (
    <>
      <div
        ref={(node) => {
          setNodeRef(node);
          setDropRef(node);
        }}
        className={containerClasses}
        style={{
          transform: transform
            ? `translateX(${transform.x}px) translateY(${transform.y}px)`
            : undefined,
        }}
      >
        <div className="flex justify-between items-center gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Tooltip text={doc.originalName}>
              <div
                className="font-semibold w-[100%-30px] text-sm text-gray-900 truncate flex-1"
                title={doc.originalName}
              >
                {doc.originalName}
              </div>
            </Tooltip>
          </div>

          <div className="flex gap-1">
            <IconButton
              icon={Trash}
              onClick={(e) => {
                e.stopPropagation();
                setOpen(true);
              }}
            />
          </div>
        </div>

        {/* Classification and confidence */}
        <div className="flex items-center gap-3 flex-nowrap justify-between">
          <span
            className="px-3 py-1 rounded-full text-sm font-medium text-white capitalize"
            style={{
              backgroundColor: CLASS_COLORS[doc.classification] || "#9e9e9e",
            }}
          >
            {doc.classification}
          </span>
          <span className="text-sm text-gray-600 font-medium ">
            {confidenceDisplay} confidence
          </span>
        </div>

        {/* File metadata */}
        <div className="flex flex-row justify-between items-center">
          <div className="flex justify-start items-center text-xs">
            <span className="font-medium text-gray-700">Size:</span>
            <span className="text-gray-500">{formatSize(doc.size)}</span>
          </div>

          <div className="flex justify-start items-center text-xs">
            <span className="font-medium text-gray-700">Uploaded:</span>
            <span className="text-gray-500">{formatDate(doc.createdAt)}</span>
          </div>
          {/* <IconButton {...listeners} {...attributes} icon={HandGrab} /> */}
        </div>
      </div>
      <CustomModal
        open={open}
        onOpenChange={setOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Document"
        description={`Are you sure you want to delete "${doc.originalName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="primary"
      />
    </>
  );
};

export default DraggableDoc