/** External Dependencies */
import React, { useCallback, useRef, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Konva from 'konva';
import PropTypes from 'prop-types';

/** Internal Dependencies */
import {
  useDispatch,
  useDrawPreviewByPointer,
  useStore,
  useSetOriginalSource,
} from 'hooks';
import { TOOLS_IDS } from 'utils/constants';
import randomId from 'utils/randomId';
import { Slider } from 'components/common';
import isFunction from 'utils/isFunction';
import { HIDE_LOADER, SHOW_LOADER } from 'actions';
import getElementOffsetPosition from 'utils/getElementOffsetPosition';
import constructMaskImage from 'utils/constructMaskImage';
import {
  StyledBrushSizeWrapper,
  StyledBrushSizeLabel,
  StyledBrushCursor,
} from './ObjectRemoval.styled';

let cursorTimeout = null;
const getObjectPathPoints = ({ attrs, position }) => ({
  points: (attrs.points || []).concat(position),
});

const ObjectRemovalOptions = ({
  t,
  renderCustomOptionsChildren,
  onDrawFinish,
  minSize = 1,
  maxSize = 300,
  drawInstanceConfig = {},
}) => {
  const dispatch = useDispatch();
  const store = useStore();
  const {
    designLayer,
    config,
    zoom: { factor } = {},
    shownImageDimensions: { originalSourceInitialScale } = {},
    originalSource,
  } = store;
  const { onDrawEnd, ...toolConfig } = config[TOOLS_IDS.OBJECT_REMOVAL] || {};

  const updateOriginalSourceFns = useSetOriginalSource({
    resetOnSourceChange: false,
    keepZoomOnSourceChange: true,
  });

  const objectPathCursorRef = useRef(null);
  const [cursorData, setCursorData] = useState({
    x: 0,
    y: 0,
    display: 'none',
  });

  const canvasContainer = useMemo(
    () => designLayer?.getStage()?.getContainer(),
    [designLayer],
  );

  const onCompleteDrawing = onDrawFinish || onDrawEnd;

  const hideBrushCursor = () => {
    setCursorData((latest) => ({ ...latest, display: 'none' }));
  };

  const showBrushCursor = useCallback(({ x, y } = {}) => {
    clearTimeout(cursorTimeout);

    const newCursorData = { display: 'block' };

    if (x && y && ![x, y].includes(0)) {
      newCursorData.x = x;
      newCursorData.y = y;
    }

    setCursorData((latest) => ({ ...latest, ...newCursorData }));
  }, []);

  const handlePointerUp = ({ attrs, setIsDisabled }) => {
    if (attrs.points.length > 0) {
      dispatch({ type: SHOW_LOADER });
      setIsDisabled(true);
      hideBrushCursor();

      if (isFunction(onCompleteDrawing)) {
        Promise.resolve(
          onCompleteDrawing({
            attrs: { ...attrs },
            updateOriginalSourceFns,
            appStore: store,
            originalSource,
            // cbkFunctionName => toBlob, toImage, toDataURL, toCanvas
            getMaskedImage: (cbkFunctionName = 'toBlob') =>
              constructMaskImage(
                originalSource,
                attrs.points,
                cbkFunctionName,
                attrs,
              ),
          }),
        ).finally(() => {
          setIsDisabled(false);
          dispatch({ type: HIDE_LOADER });
          showBrushCursor();
        });
      } else {
        setIsDisabled(false);
        dispatch({ type: HIDE_LOADER });
        showBrushCursor();
      }
    }

    return { ...attrs, points: [] };
  };

  const onPointerMove = useCallback(
    ({ event }) => {
      if (!event.evt) {
        return;
      }

      const { offsetX, offsetY } = getElementOffsetPosition(
        event,
        canvasContainer,
      );

      const x =
        offsetX - parseInt(objectPathCursorRef.current.style.width, 10) / 2;
      const y =
        offsetY - parseInt(objectPathCursorRef.current.style.height, 10) / 2;

      showBrushCursor({ x, y });
    },
    [showBrushCursor],
  );

  const drawObjectOptions = useDrawPreviewByPointer({
    drawInstance: new Konva.Line({
      ...toolConfig,
      ...drawInstanceConfig,
      id: randomId(TOOLS_IDS.OBJECT_REMOVAL),
      name: TOOLS_IDS.OBJECT_REMOVAL,
      points: [],
    }),
    onPointerMove,
    onPointerStart: getObjectPathPoints,
    onHoldPointerMove: getObjectPathPoints,
    onPointerReleased: handlePointerUp,
    onPointerLeaveCanvas: hideBrushCursor,
  });
  const { tmpDrawAttrs: objectPath, updateTmpDrawAttrs: updateObjectPath } =
    drawObjectOptions;

  const changeBrushSize = (value) => {
    const newValue = +value;
    updateObjectPath(
      {
        strokeWidth: newValue,
      },
      false,
    );

    const { offsetWidth, offsetHeight } = canvasContainer;
    const x = offsetWidth / 2 - newValue / 2;
    const y = offsetHeight / 2 - newValue / 2;

    showBrushCursor({ x, y });

    cursorTimeout = setTimeout(() => {
      hideBrushCursor();
    }, 1000);
  };

  const renderOptions = () => {
    if (isFunction(renderCustomOptionsChildren)) {
      return renderCustomOptionsChildren({
        ...drawObjectOptions,
        changeBrushSize,
      });
    }

    return (
      <StyledBrushSizeWrapper
        className="FIE_object-removal-tool-options"
        data-testid="FIE_object-removal-tool-options"
      >
        <StyledBrushSizeLabel>
          {t('objectRemovalBrushSize')}
        </StyledBrushSizeLabel>
        <Slider
          data-testid="FIE_object-removal-tool-brush-size"
          annotation="px"
          min={minSize}
          max={maxSize}
          onChange={changeBrushSize}
          value={+objectPath.strokeWidth}
          width="100%"
        />
      </StyledBrushSizeWrapper>
    );
  };

  return (
    <>
      {/* We are adding it by portal inside the canvas's container to keep it on top of the canvas and avoid overflow outside the canvas
       * by using position: absolute instead of fixed */}
      {canvasContainer &&
        createPortal(
          <StyledBrushCursor
            $size={objectPath.strokeWidth}
            $color={objectPath.stroke}
            $opacity={objectPath.opacity}
            $zoom={factor * originalSourceInitialScale}
            $display={cursorData.display}
            $x={cursorData.x}
            $y={cursorData.y}
            ref={objectPathCursorRef}
            data-testid="FIE_object-removal-tool-brush-cursor"
          />,
          canvasContainer,
        )}
      {renderOptions()}
    </>
  );
};

ObjectRemovalOptions.propTypes = {
  t: PropTypes.func.isRequired,
  onDrawFinish: PropTypes.func,
  minSize: PropTypes.number,
  maxSize: PropTypes.number,
  drawInstanceConfig: PropTypes.instanceOf(Object),
  renderCustomOptionsChildren: PropTypes.func,
};

export default ObjectRemovalOptions;
