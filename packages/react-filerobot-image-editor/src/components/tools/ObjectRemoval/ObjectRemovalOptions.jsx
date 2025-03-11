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
import { Button, Label, Switcher } from '@scaleflex/ui/core';
import {
  StyledBrushSizeWrapper,
  StyledBrushSizeLabel,
  StyledBrushCursor,
  StyledBrushModeWrapper,
} from './ObjectRemoval.styled';

let cursorTimeout = null;
const getObjectPathPoints = ({ attrs, position, strokeWidth }) => ({
  points: (attrs.points || []).concat(position),
  strokeWidth: strokeWidth || attrs.strokeWidth,
});

const MASK_STROKE = '#ffffff';
const UNMASK_STROKE = '#000000';

const switcherProps = {
  id: 'FIE_object-removal-tool-brush-mode-toggle',
};
const DEFAULT_OPACITY = 0.65;

const getDrawInstance = ({ toolConfig, drawInstanceConfig, isHighlightMode }) =>
  new Konva.Line({
    ...toolConfig,
    ...drawInstanceConfig,
    id: randomId(TOOLS_IDS.OBJECT_REMOVAL),
    name: TOOLS_IDS.OBJECT_REMOVAL,
    points: [],
    stroke: isHighlightMode ? MASK_STROKE : UNMASK_STROKE,
    opacity: !isHighlightMode ? 1 : toolConfig?.opacity || DEFAULT_OPACITY,
    globalCompositeOperation: isHighlightMode
      ? 'source-over'
      : 'destination-out',
    listening: false,
  });

const ObjectRemovalOptions = ({
  t,
  renderCustomOptionsChildren,
  onSubmitDraw,
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
  const { onSubmitDraw: onSubmitDrawConfig, ...toolConfig } =
    config[TOOLS_IDS.OBJECT_REMOVAL] || {};
  const [isHighlightMode, setIsHighlightMode] = useState(true);
  const [objectPathsAttrs, setObjectPathsAttrs] = useState([]);
  const [brushSize, setBrushSize] = useState(toolConfig.strokeWidth || minSize);

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

  const onSubmitCbk = onSubmitDraw || onSubmitDrawConfig;

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

  const handlePointerUp = ({ attrs }) => {
    if (attrs.points.length > 0) {
      setObjectPathsAttrs((latest) => [...latest, attrs]);
    }
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
    createNewDrawInstance: (newProps) =>
      getDrawInstance({
        toolConfig,
        drawInstanceConfig: { ...drawInstanceConfig, ...newProps },
        isHighlightMode,
      }),
    onPointerMove,
    onPointerStart: (args) =>
      getObjectPathPoints({ ...args, strokeWidth: brushSize }),
    onHoldPointerMove: getObjectPathPoints,
    onPointerReleased: handlePointerUp,
    onPointerLeaveCanvas: hideBrushCursor,
    dontResetPreview: true,
  });

  const {
    tmpDrawAttrs: objectPath,
    setIsDisabled,
    resetTmpDrawInstance,
  } = drawObjectOptions;

  const changeBrushSize = (value) => {
    const newValue = +value;
    setBrushSize(newValue);

    const { offsetWidth, offsetHeight } = canvasContainer;
    const x = offsetWidth / 2 - newValue / 2;
    const y = offsetHeight / 2 - newValue / 2;

    showBrushCursor({ x, y });

    cursorTimeout = setTimeout(() => {
      hideBrushCursor();
    }, 1000);
  };

  const toggleHighlightMode = () => {
    setIsHighlightMode((latest) => !latest);
  };

  const submitRemoval = () => {
    if (objectPathsAttrs.length > 0) {
      dispatch({ type: SHOW_LOADER });
      setIsDisabled(true);
      hideBrushCursor();
      if (isFunction(onSubmitCbk)) {
        Promise.resolve(
          onSubmitCbk({
            attrs: { ...objectPath },
            updateOriginalSourceFns,
            appStore: store,
            setIsDisabled,
            resetTmpDrawInstance,
            objectPathsAttrs,
            originalSource,
            // cbkFunctionName => toBlob, toImage, toDataURL, toCanvas
            getMaskedImage: (cbkFunctionName = 'toBlob') =>
              constructMaskImage(
                originalSource,
                objectPathsAttrs,
                cbkFunctionName,
              ),
          }),
        ).finally(() => {
          setIsDisabled(false);
          dispatch({ type: HIDE_LOADER });
          showBrushCursor();
          resetTmpDrawInstance({
            ...objectPathsAttrs[objectPathsAttrs.length - 1],
            points: [],
          });
          setObjectPathsAttrs([]);
        });
      } else {
        setIsDisabled(false);
        dispatch({ type: HIDE_LOADER });
        showBrushCursor();
        resetTmpDrawInstance({
          ...objectPathsAttrs[objectPathsAttrs.length - 1],
          points: [],
        });
        setObjectPathsAttrs([]);
      }
    }
  };

  const renderOptions = () => {
    if (isFunction(renderCustomOptionsChildren)) {
      return renderCustomOptionsChildren({
        ...drawObjectOptions,
        changeBrushSize,
      });
    }

    return (
      <div data-testid="FIE_object-removal-tool-options">
        <StyledBrushSizeWrapper data-testid="FIE_object-removal-tool-brush-size-option">
          <StyledBrushSizeLabel>
            {t('objectRemovalBrushSize')}
          </StyledBrushSizeLabel>
          <Slider
            data-testid="FIE_object-removal-tool-brush-size"
            annotation="px"
            min={minSize}
            max={maxSize}
            onChange={changeBrushSize}
            value={+brushSize}
            width="100%"
          />
        </StyledBrushSizeWrapper>
        <StyledBrushModeWrapper data-testid="FIE_object-removal-brush-mode-toggle">
          <Label htmlFor="FIE_object-removal-tool-brush-mode-toggle">
            {t('objectRemovalEraseMode')}
          </Label>
          <Switcher
            switcherProps={switcherProps}
            data-testid="FIE_object-removal-tool-brush-mode-toggle"
            label={t('objectRemovalBrushMode')}
            onChange={toggleHighlightMode}
            checked={isHighlightMode}
            size="md"
          />
          <Label htmlFor="FIE_object-removal-tool-brush-mode-toggle">
            {t('objectRemovalHighlightMode')}
          </Label>
          <Button
            onClick={submitRemoval}
            size="sm"
            data-testid="FIE_object-removal-tool-trigger-button"
          >
            {t('objectRemovalTriggerButton')}
          </Button>
        </StyledBrushModeWrapper>
      </div>
    );
  };

  return (
    <>
      {/* We are adding it by portal inside the canvas's container to keep it on top of the canvas and avoid overflow outside the canvas
       * by using position: absolute instead of fixed */}
      {canvasContainer &&
        createPortal(
          <StyledBrushCursor
            $size={brushSize}
            $color={objectPath.stroke}
            $opacity={toolConfig?.opacity || DEFAULT_OPACITY}
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
  onSubmitDraw: PropTypes.func,
  minSize: PropTypes.number,
  maxSize: PropTypes.number,
  drawInstanceConfig: PropTypes.instanceOf(Object),
  renderCustomOptionsChildren: PropTypes.func,
};

export default ObjectRemovalOptions;
