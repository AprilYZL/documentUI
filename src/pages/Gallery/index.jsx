import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { toast } from "sonner";
import { arrayMove } from "@dnd-kit/sortable";
import { Spinner } from "@/Components/ui/shadcn-io/spinner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";

import { deleteDocument } from "@/apis/deleteDocument";
import useDocuments from "@/hooks/useDocuments";
import DraggableDoc from "./DraggableDoc";
import RangeSlider from "@/Components/RangeSlider";
import { classifications } from "@/helpers/utils";
import PaginationCombo from "@/Components/PaginationCombo";

export const Gallery = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("all");
  const [limit, setLimitState] = useState(() => {
    const stored = localStorage.getItem("gallery-limit");
    return stored ? Number(stored) : 50;
  });
  const [confidenceRange, setConfidenceRange] = useState([0, 1]);
  const { docs, loading, error, setDocs } = useDocuments({ page, limit });

  useEffect(() => {
    localStorage.setItem("gallery-limit", limit);
  }, [limit]);

  const setLimit = (newLimit) => {
    setLimitState(newLimit);
    setPage(1);
    setCategory('all')
  };

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  useEffect(()=>{
    setCategory('all')
  },[page])

  const filtered = useMemo(
    () =>
      docs.filter(
        (d) =>
          d.originalName.toLowerCase().includes(search.toLowerCase()) &&
          (category === "all" || d.classification === category) &&
          d.confidence >= confidenceRange[0] &&
          d.confidence <= confidenceRange[1]
      ),
    [docs, search, category, confidenceRange]
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
    <div className="min-h-screen w-full flex flex-col p-6">
      {/* Header/Filter Component */}
      <div className="flex-shrink-0 w-full">
        <button
          onClick={() => navigate("/")}
          className={`
            px-4 py-2 rounded-lg font-medium transition-all duration-200 
            min-w-[80px] text-sm sm:text-base
          bg-blue-400 hover:bg-blue-600 text-white hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0
          `}
        >
          Go to Home
        </button>
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
          <div className="w-full lg:w-1/2 text-sm flex h-16 justify-center self-start items-stretch shadow-lg rounded-lg">
            <Select onValueChange={setCategory}>
              <SelectTrigger className="w-full !h-16">
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
              <RangeSlider
                value={confidenceRange}
                onChange={setConfidenceRange}
              />
            </div>
          </div>
        </div>
      </div>
        {/* Each Doc Card TODO:implement drag & drop */}
      <div className="flex-1 min-h-100 w-full">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="h-full">
            {filtered.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500 text-lg">No documents found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-5 gap-6">
                {filtered.map((doc, index) => (
                  <DraggableDoc
                    key={doc.id}
                    doc={doc}
                    deleteInsuranceDoc={deleteInsuranceDoc}
                  />
                ))}
              </div>
            )}
          </div>
        </DndContext>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 w-full mt-6">
        <PaginationCombo
          setPage={setPage}
          setLimit={setLimit}
          page={page}
          limit={limit}
          itemsOnCurrentPage={docs.length}
        />
      </div>
    </div>
  );
};

export default Gallery;