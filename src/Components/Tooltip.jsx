import React, { useState } from "react";

export const Tooltip = ({ children, text, position = "top" }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      style={{ position: "relative" }}
      className="w-full"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span
          style={{
            position: "absolute",
            [position]: "100%",
            left: position === "top" || position === "bottom" ? "50%" : undefined,
            transform:
              position === "top" || position === "bottom"
                ? "translateX(-50%)"
                : undefined,
            background: "#333",
            color: "#fff",
            padding: "6px 10px",
            borderRadius: "4px",
            whiteSpace: "nowrap",
            zIndex: 100,
            fontSize: "0.9em",
            marginTop: position === "top" ? "-36px" : undefined,
            marginBottom: position === "bottom" ? "-36px" : undefined,
            marginLeft: position === "left" ? "-110%" : undefined,
            marginRight: position === "right" ? "-110%" : undefined,
          }}
        >
          {text}
        </span>
      )}
    </div>
  );
};

export default Tooltip;