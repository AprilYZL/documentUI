import React, { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { toast } from "sonner";
import { arrayMove } from "@dnd-kit/sortable";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { IconButton } from "@/components/ui/shadcn-io/icon-button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomModal } from "@/Components/CustomModal";
import { PageLimitSelect } from "@/Components/PageLimitSelect";
import { Tooltip } from "@/Components/Tooltip";
import { Trash, HandGrab } from "lucide-react";
import { deleteDocument } from "../../apis/classification";
import useDocuments from "@/hooks/useDocuments";
import {
  formatSize,
  formatDate,
  classifications,
  CLASS_COLORS,
} from "@/helpers/utils";

const ConfidenceRangeSlider = ({ value, onChange }) => {
  return (
    <div className="w-[100%] space-y-3">
      <Slider value={value} onValueChange={onChange} max={1} step={0.05} />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Min: {`${Math.ceil(value[0] * 100)}%`}</span>
        <span>Max:{`${Math.ceil(value[1] * 100)}%`}</span>
      </div>
    </div>
  );
};
export const Gallery = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("all");
  const [limit, setLimit] = useState(50);
  const [confidenceRange, setConfidenceRange] = useState([0, 1]);
  const { docs, loading, error, setDocs } = useDocuments({ page, limit });
  useEffect(() => {
    setPage(1);
  }, [limit]);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  const filtered = docs.filter(
    (d) =>
      d.originalName.toLowerCase().includes(search.toLowerCase()) &&
      (category === "all" || d.classification === category) &&
      d.confidence >= confidenceRange[0] &&
      d.confidence <= confidenceRange[1]
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = filtered.findIndex((doc) => doc.id === active.id);
      const newIndex = filtered.findIndex((doc) => doc.id === over.id);
      setDocs((docs) => arrayMove(docs, oldIndex, newIndex));
    }
  };

  if (loading)
    return (
      <div className="h-dvh flex flex-row justify-center items-center">
        <Spinner />
      </div>
    );
  const deleteInsuranceDoc = async (docId) => {
    try {
      const result = await deleteDocument(docId);
      if (result) {
        setDocs((prev) => prev.filter((doc) => doc.id !== docId));
        toast.success("Document successfully deleted!");
      } else {
        toast.error("Failed to delete document.");
      }
    } catch (error) {
      console.error("Error deleting insurance document:", error);
    }
  };
  return (
    <div className="h-dvh w-full flex flex-col justify-between items-center p-6">
      <div className="w-full">
        <h1 className="text-center py-10 text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Document Overview
        </h1>
        <div className="flex flex-col gap-2 lg:flex-row lg:justify-between w-full items-stretch mb-6">
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full lg:w-1/2 h-16 px-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300"
          />
          <div className="w-full lg:w-1/2 text-sm flex h-16 justify-center self-start items-stretch">
            <Select onValueChange={setCategory}>
              <SelectTrigger className="w-full lg:w-[220px] !h-16">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Categories</SelectItem>
                  {classifications.map((category) => (
                    <SelectItem
                      value={category.classification}
                      key={category.classification}
                    >
                      {category.classification}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full lg:w-1/2 flex flex-col justify-start items-center bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <label className="w-full text-sm font-medium text-gray-700 mb-2">
              Filter by Confidence Level:
            </label>
            <div className="!w-full">
              <ConfidenceRangeSlider
                value={confidenceRange}
                onChange={setConfidenceRange}
              />
            </div>
          </div>
        </div>

        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-5 gap-6">
            {filtered.length === 0 && <div>No documents found.</div>}
            {filtered.map((doc, index) => (
              <DraggableDoc
                key={doc.id}
                doc={doc}
                deleteInsuranceDoc={deleteInsuranceDoc}
              />
            ))}
          </div>
        </DndContext>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6 p-4 sm:p-10">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className={`
            px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:text-gray-700
            min-w-[80px] text-sm sm:text-base
            ${
              page === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "!bg-blue-400 text-white hover:bg-blue-600 active:bg-blue-700 hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
            }
          `}
        >
          Prev
        </button>

        <span className="px-4 py-2 text-gray-700 font-medium text-sm sm:text-base whitespace-nowrap">
          Page {page}
        </span>

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={docs.length < limit}
          className={`
            px-4 py-2 rounded-lg font-medium transition-all duration-200 
            min-w-[80px] text-sm sm:text-base
       ${
         docs.length < limit
           ? "bg-gray-100 text-gray-400 cursor-not-allowed"
           : "!bg-blue-400 text-white hover:bg-blue-600 active:bg-blue-700 hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
       }
          `}
        >
          Next
        </button>

        <div className="mt-2 sm:mt-0 sm:ml-4">
          <PageLimitSelect pgLimitArray={[10, 25, 50]} onSelect={setLimit} />
        </div>
      </div>
    </div>
  );
};

const DraggableDoc = ({ doc, deleteInsuranceDoc }) => {
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

  const confidenceDisplay = `${(doc.confidence * 100).toFixed(1)}%`;

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
        <div className="flex justify-between items-start gap-2">
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
        <div className="flex items-center gap-3 flex-wrap">
          <span
            className="px-3 py-1 rounded-full text-xs font-medium text-white capitalize"
            style={{
              backgroundColor: CLASS_COLORS[doc.classification] || "#9e9e9e",
            }}
          >
            {doc.classification}
          </span>
          <span className="text-xs text-gray-600 font-medium">
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
          <IconButton {...listeners} {...attributes} icon={HandGrab} />
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

export default Gallery;
