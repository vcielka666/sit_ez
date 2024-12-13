import React, { useState, useCallback, useRef, useEffect } from "react";

interface DraggableSheetProps {
  children: React.ReactNode;
  minHeight: number; // Minimum height of the sheet
  maxHeight: number; // Maximum height of the sheet
  onHeightChange?: (height: number) => void; // Notify parent about height changes
}

const DraggableSheet: React.FC<DraggableSheetProps> = ({
  children,
  minHeight,
  maxHeight,
  onHeightChange,
}) => {
  const [height, setHeight] = useState(maxHeight / 2); // Start in the middle
  const isDragging = useRef(false);

  // Notify parent of initial height on component mount
  useEffect(() => {
    if (onHeightChange) {
      onHeightChange(height); // Notify parent with the initial height
    }
  }, [height, onHeightChange]);

  const handleDrag = useCallback(
    (clientY: number) => {
      const newHeight = Math.max(minHeight, Math.min(maxHeight, window.innerHeight - clientY));
      setHeight(newHeight);
      if (onHeightChange) onHeightChange(newHeight);
    },
    [minHeight, maxHeight, onHeightChange]
  );

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging.current) return;
      handleDrag(e.clientY);
    },
    [handleDrag]
  );

  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging.current) return;
      handleDrag(e.touches[0].clientY);
    },
    [handleDrag]
  );

  const startDragging = useCallback(() => {
    isDragging.current = true;
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", stopDragging);
    document.addEventListener("touchmove", onTouchMove);
    document.addEventListener("touchend", stopDragging);
  }, [onMouseMove, onTouchMove]);

  const stopDragging = useCallback(() => {
    isDragging.current = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", stopDragging);
    document.removeEventListener("touchmove", onTouchMove);
    document.removeEventListener("touchend", stopDragging);
  }, [onMouseMove, onTouchMove]);

  return (
    <div
      className="fixed bottom-0 left-0 w-full bg-[#52208b] shadow-lg draggable-sheet"
      style={{ height, zIndex: 10 }}
    >
      <div
        className="w-full h-6 bg-[#52208b] border-b border-b-[#0000003b] cursor-row-resize flex items-center justify-center draggable-sheet-handle"
        onMouseDown={startDragging}
        onTouchStart={startDragging}
      >
        <div className="w-10 h-1 bg-gray-500 rounded"></div>
      </div>
      <div className="overflow-y-auto">{children}</div>
    </div>
  );
};

export default DraggableSheet;
