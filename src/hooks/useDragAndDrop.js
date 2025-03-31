import { useState, useCallback, useRef } from 'react';

export const useDragAndDrop = (onDrop) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      dragCounter.current = 0;

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        onDrop(e.dataTransfer.files);
      }
    },
    [onDrop]
  );

  return {
    isDragging,
    dragProps: {
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
    },
  };
};

export const useDraggable = (onDragEnd) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragRef = useRef(null);
  const initialPosition = useRef({ x: 0, y: 0 });
  const currentPosition = useRef({ x: 0, y: 0 });

  const handleDragStart = useCallback((e) => {
    if (e.type === 'touchstart') {
      initialPosition.current = {
        x: e.touches[0].clientX - currentPosition.current.x,
        y: e.touches[0].clientY - currentPosition.current.y,
      };
    } else {
      initialPosition.current = {
        x: e.clientX - currentPosition.current.x,
        y: e.clientY - currentPosition.current.y,
      };
    }

    if (dragRef.current) {
      setIsDragging(true);
    }
  }, []);

  const handleDrag = useCallback((e) => {
    if (!isDragging) return;

    e.preventDefault();

    if (e.type === 'touchmove') {
      currentPosition.current = {
        x: e.touches[0].clientX - initialPosition.current.x,
        y: e.touches[0].clientY - initialPosition.current.y,
      };
    } else {
      currentPosition.current = {
        x: e.clientX - initialPosition.current.x,
        y: e.clientY - initialPosition.current.y,
      };
    }

    setPosition(currentPosition.current);
  }, [isDragging]);

  const handleDragEnd = useCallback(
    (e) => {
      setIsDragging(false);
      if (onDragEnd) {
        onDragEnd(currentPosition.current);
      }
    },
    [onDragEnd]
  );

  useEffect(() => {
    const element = dragRef.current;
    if (!element) return;

    element.addEventListener('mousedown', handleDragStart);
    element.addEventListener('touchstart', handleDragStart);

    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('touchmove', handleDrag);

    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchend', handleDragEnd);

    return () => {
      element.removeEventListener('mousedown', handleDragStart);
      element.removeEventListener('touchstart', handleDragStart);

      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('touchmove', handleDrag);

      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchend', handleDragEnd);
    };
  }, [handleDragStart, handleDrag, handleDragEnd]);

  return {
    dragRef,
    isDragging,
    position,
  };
};

export const useDroppable = (onDrop) => {
  const [isOver, setIsOver] = useState(false);
  const dropRef = useRef(null);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsOver(false);

      if (onDrop) {
        onDrop(e);
      }
    },
    [onDrop]
  );

  useEffect(() => {
    const element = dropRef.current;
    if (!element) return;

    element.addEventListener('dragenter', handleDragEnter);
    element.addEventListener('dragleave', handleDragLeave);
    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('drop', handleDrop);

    return () => {
      element.removeEventListener('dragenter', handleDragEnter);
      element.removeEventListener('dragleave', handleDragLeave);
      element.removeEventListener('dragover', handleDragOver);
      element.removeEventListener('drop', handleDrop);
    };
  }, [handleDragEnter, handleDragLeave, handleDragOver, handleDrop]);

  return {
    dropRef,
    isOver,
  };
}; 