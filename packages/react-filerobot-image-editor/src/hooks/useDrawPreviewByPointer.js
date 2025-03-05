/** External Dependencies */
import { useCallback, useState, useEffect, useRef } from 'react';

/** Internal Dependencies */
import getPointerOffsetPosition from 'utils/getPointerOffsetPosition';
import isFunction from 'utils/isFunction';
import useStore from './useStore';

const eventsOptions = {
  passive: true,
};

// drawInstance is the instance of the draw object (ex. new Konva.Line(attributes))
const useDrawPreviewByPointer = ({
  drawInstance,
  onPointerStart,
  onPointerMove, // means the pointer is moving while it is not held down
  onHoldPointerMove, // means the pointer is held down and moving
  onPointerLeaveCanvas,
  onPointerReleased,
  dontResetPreview = false,
}) => {
  const { previewGroup, designLayer } = useStore();
  const canvas = previewGroup?.getStage();

  const [tmpDrawAttrs, setTmpDrawAttrs] = useState(() => drawInstance?.attrs);
  const isDisabledRef = useRef(false);
  const initialAttrsRef = useRef({ ...tmpDrawAttrs });
  const attrsRef = useRef(tmpDrawAttrs);

  const setIsDisabled = useCallback((value) => {
    isDisabledRef.current = value;
  }, []);

  const updateTmpDrawAttrs = useCallback(
    (newAttrs, showPreview = true) => {
      if (showPreview) {
        canvas.setAttrs({ isDrawing: true });
      }

      setTmpDrawAttrs((latestDrawObjectAttrs = {}) => {
        const updatedAttrs = {
          ...latestDrawObjectAttrs,
          ...newAttrs,
        };

        if (drawInstance) {
          drawInstance.setAttrs(updatedAttrs);
        }

        if (showPreview && previewGroup?.children.length === 0) {
          previewGroup.add(drawInstance);
        }

        attrsRef.current = updatedAttrs;
        return updatedAttrs;
      });
    },
    [canvas, previewGroup, tmpDrawAttrs],
  );

  const resetTmpDrawInstance = useCallback(
    (resetAttrs = initialAttrsRef) => {
      canvas.setAttrs({ isDrawing: false });

      if (previewGroup?.children.length > 0) {
        previewGroup.removeChildren();
      }

      setTmpDrawAttrs(resetAttrs);
      attrsRef.current = resetAttrs;
    },
    [canvas, drawInstance, previewGroup],
  );

  const getPointerPosition = useCallback(() => {
    if (!designLayer || !previewGroup) {
      return [0, 0];
    }

    const pos = getPointerOffsetPosition(previewGroup);

    return [
      pos.offsetX - (designLayer.attrs.xPadding || 0),
      pos.offsetY - (designLayer.attrs.yPadding || 0),
    ];
  }, [designLayer]);

  const eventCallbackHandler = useCallback(
    (event, callbackFn) => {
      if (isFunction(callbackFn)) {
        const returnedAttrs = callbackFn({
          event,
          attrs: attrsRef.current,
          position: getPointerPosition(),
          setIsDisabled,
          isDisabled: isDisabledRef.current,
        });

        if (returnedAttrs) {
          updateTmpDrawAttrs(returnedAttrs);
        }
      }
    },
    [updateTmpDrawAttrs, getPointerPosition],
  );

  const handlePointerMove = useCallback(
    (event) => {
      if (isDisabledRef.current) {
        return;
      }

      eventCallbackHandler(event, onPointerMove);
    },
    [eventCallbackHandler, onPointerMove],
  );

  const handleHoldPointerMove = useCallback(
    (event) => {
      eventCallbackHandler(event, onHoldPointerMove);
    },
    [eventCallbackHandler, onHoldPointerMove],
  );

  const handlePointerUp = useCallback(
    (event) => {
      let returnedAttrs;
      if (attrsRef.current) {
        returnedAttrs = onPointerReleased({
          event,
          attrs: attrsRef.current,
          setIsDisabled,
          isDisabled: isDisabledRef.current,
        });
      }

      // Reset and cleanup
      if (!dontResetPreview) {
        resetTmpDrawInstance(returnedAttrs);
      }

      canvas.off('mousemove touchmove', handleHoldPointerMove);
      canvas.off('mouseleave touchcancel', handlePointerUp);
      document.removeEventListener('mouseup', handlePointerUp, eventsOptions);
      document.removeEventListener('touchend', handlePointerUp, eventsOptions);
      document.removeEventListener(
        'mouseleave',
        handlePointerUp,
        eventsOptions,
      );
      document.removeEventListener(
        'touchcancel',
        handlePointerUp,
        eventsOptions,
      );
    },
    [
      handleHoldPointerMove,
      onPointerReleased,
      resetTmpDrawInstance,
      dontResetPreview,
    ],
  );

  const handlePointerDown = useCallback(
    (e) => {
      if (e.target.attrs.draggable || isDisabledRef.current) {
        return;
      }

      e.evt.preventDefault();
      eventCallbackHandler(e, onPointerStart);

      canvas.on('mousemove touchmove', handleHoldPointerMove);
      canvas.on('mouseleave touchcancel', handlePointerUp);
      document.addEventListener('mouseup', handlePointerUp, eventsOptions);
      document.addEventListener('touchend', handlePointerUp, eventsOptions);
      document.addEventListener('mouseleave', handlePointerUp, eventsOptions);
      document.addEventListener('touchcancel', handlePointerUp, eventsOptions);
    },
    [
      handleHoldPointerMove,
      handlePointerUp,
      onPointerStart,
      eventCallbackHandler,
    ],
  );

  useEffect(() => {
    return () => {
      if (previewGroup) {
        previewGroup.destroyChildren();
      }
    };
  }, []);

  useEffect(() => {
    if (canvas) {
      canvas.on('mousedown touchstart', handlePointerDown);

      if (isFunction(onPointerMove)) {
        canvas.on('mousemove touchmove', handlePointerMove);
      }

      if (isFunction(onPointerLeaveCanvas)) {
        canvas.on('mouseleave touchcancel', onPointerLeaveCanvas);
      }
    }

    return () => {
      if (canvas) {
        canvas.off('mousedown touchstart', handlePointerDown);

        if (isFunction(onPointerMove)) {
          canvas.off('mousemove touchmove', handlePointerMove);
        }

        if (isFunction(onPointerLeaveCanvas)) {
          canvas.off('mouseleave touchcancel', onPointerLeaveCanvas);
        }
      }
    };
  }, [designLayer, handlePointerDown, handlePointerMove, onPointerLeaveCanvas]);

  return {
    tmpDrawAttrs,
    updateTmpDrawAttrs,
    resetTmpDrawInstance,
    isDisabled: isDisabledRef?.current,
    setIsDisabled,
  };
};

export default useDrawPreviewByPointer;
