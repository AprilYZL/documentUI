import React, { useEffect } from "react";

export const CustomModal = ({
  open,
  onOpenChange,
  onConfirm,
  title = "Are you sure?",
  description = "",
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  variant = "primary",
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [open, onOpenChange]);

  const getConfirmButtonStyles = () => {
    const baseStyles =
      "bg-blue-500 text-white px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    switch (variant) {
      case "danger":
        return `${baseStyles} !bg-red-600 text-white hover:bg-red-700 focus:ring-red-500`;
      case "primary":
        return `${baseStyles} !bg-blue-500 text-white hover:bg-gray-800 focus:ring-gray-500`;
      case "secondary":
        return `${baseStyles} !bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500`;
      default:
        return `${baseStyles} !bg-red-600 text-white hover:bg-red-700 focus:ring-red-500`;
    }
  };
  if (!open) return null;
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onOpenChange(false);
          }
        }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

        {/* Modal Content */}
        <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl border border-gray-200 animate-in fade-in-0 zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-6 pb-4">
            <h2 className="text-lg font-semibold text-gray-900 leading-6">
              {title}
            </h2>
            {description && (
              <p className="mt-2 text-sm text-gray-600 leading-5">
                {description}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 pt-4 bg-gray-50 rounded-b-lg">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {cancelText}
            </button>
            <button
              type="button"
              className={getConfirmButtonStyles()}
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Loading...
                </div>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
