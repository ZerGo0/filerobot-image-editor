/** External Dependencies */
import Konva from 'konva';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { Group, Image } from 'react-konva';

/** Internal Dependencies */
import { useStore } from 'hooks';
import { DESIGN_LAYER_ID } from 'utils/constants';
import nodesCommonPropTypes from '../nodesCommonPropTypes';

const BlurAnnotationNode = ({
  id,
  name,
  x,
  y,
  width = 100,
  height = 100,
  scaleX = 1,
  scaleY = 1,
  rotation = 0,
  annotationEvents,
  opacity = 1,
  blurRadius = 10,
  stroke = null,
  strokeWidth = 0,
  shadowOffsetX = 0,
  shadowOffsetY = 0,
  shadowBlur = 0,
  shadowColor = '#000000',
  shadowOpacity = 1,
  draggable = false,
  ...otherProps
}) => {
  const [blurredPreview, setBlurredPreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const groupRef = useRef();
  const imageRef = useRef();
  const {
    originalImage,
    shownImageDimensions,
    adjustments: { isFlippedX, isFlippedY } = {},
  } = useStore();

  // Check if we're in save mode
  useEffect(() => {
    const checkSaveMode = () => {
      if (groupRef.current) {
        const stage = groupRef.current.getStage();
        const designLayer = stage?.findOne(`#${DESIGN_LAYER_ID}`);
        const isCurrentlySaving = designLayer?.attrs?.isSaving || false;
        setIsSaving(isCurrentlySaving);
      }
    };

    checkSaveMode();
    const interval = setInterval(checkSaveMode, 100);

    return () => clearInterval(interval);
  }, []);

  // Create blurred preview for editing mode
  useEffect(() => {
    if (
      !originalImage ||
      !shownImageDimensions ||
      width <= 0 ||
      height <= 0 ||
      isSaving
    )
      return;

    // Use width and height directly since we handle scaling through width/height updates
    const actualWidth = width;
    const actualHeight = height;

    // First, create a flipped version of the image if needed
    const flippedCanvas = document.createElement('canvas');
    flippedCanvas.width = originalImage.width;
    flippedCanvas.height = originalImage.height;
    const flippedCtx = flippedCanvas.getContext('2d');

    // Apply flip transformations
    flippedCtx.save();
    if (isFlippedX) {
      flippedCtx.scale(-1, 1);
      flippedCtx.translate(-originalImage.width, 0);
    }
    if (isFlippedY) {
      flippedCtx.scale(1, -1);
      flippedCtx.translate(0, -originalImage.height);
    }

    // Draw the flipped image
    flippedCtx.drawImage(originalImage, 0, 0);
    flippedCtx.restore();

    // Calculate scale ratio between original and shown image
    const scaleRatioX = originalImage.width / shownImageDimensions.width;
    const scaleRatioY = originalImage.height / shownImageDimensions.height;

    // Map coordinates from shown dimensions to original image dimensions
    const sourceX = x * scaleRatioX;
    const sourceY = y * scaleRatioY;
    const sourceWidth = actualWidth * scaleRatioX;
    const sourceHeight = actualHeight * scaleRatioY;

    // Create a canvas to extract the region from the flipped image
    const canvas = document.createElement('canvas');
    canvas.width = actualWidth;
    canvas.height = actualHeight;
    const ctx = canvas.getContext('2d');

    // Extract region from the flipped canvas
    ctx.drawImage(
      flippedCanvas,
      sourceX, // Source X
      sourceY, // Source Y
      sourceWidth, // Source Width
      sourceHeight, // Source Height
      0, // Destination X
      0, // Destination Y
      actualWidth, // Destination Width
      actualHeight, // Destination Height
    );

    // Create an off-screen Konva stage for blur processing
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.visibility = 'hidden';
    document.body.appendChild(container);

    const stage = new Konva.Stage({
      container,
      width: actualWidth,
      height: actualHeight,
    });

    const layer = new Konva.Layer();
    stage.add(layer);

    // Create Konva image from canvas
    const imageFromCanvas = new window.Image();
    imageFromCanvas.onload = function () {
      const konvaImage = new Konva.Image({
        image: imageFromCanvas,
        x: 0,
        y: 0,
        width: actualWidth,
        height: actualHeight,
      });

      // Apply blur filter
      konvaImage.filters([Konva.Filters.Blur]);
      konvaImage.blurRadius(blurRadius);
      konvaImage.cache();

      layer.add(konvaImage);
      layer.draw();

      // Convert to image for preview
      const dataUrl = stage.toDataURL();
      const blurredImg = new window.Image();
      blurredImg.onload = () => {
        setBlurredPreview(blurredImg);
        // Cleanup
        stage.destroy();
        document.body.removeChild(container);
      };
      blurredImg.src = dataUrl;
    };
    imageFromCanvas.src = canvas.toDataURL();

    return () => {
      if (container && container.parentNode) {
        document.body.removeChild(container);
      }
    };
  }, [
    originalImage,
    shownImageDimensions,
    x,
    y,
    width,
    height,
    blurRadius,
    isFlippedX,
    isFlippedY,
    isSaving,
  ]);

  // Apply cache and filters when saving
  useEffect(() => {
    if (isSaving && imageRef.current) {
      imageRef.current.cache();
      const layer = imageRef.current.getLayer();
      if (layer) {
        layer.batchDraw();
      }
    }

    return () => {
      if (imageRef.current) {
        imageRef.current.clearCache();
      }
    };
  }, [isSaving]);

  if (!originalImage || !shownImageDimensions) {
    return null;
  }

  // For saving, we need to map coordinates properly
  const scaleRatioX = originalImage.width / shownImageDimensions.width;
  const scaleRatioY = originalImage.height / shownImageDimensions.height;

  // During editing mode, always use an Image element to prevent drag state issues
  if (!isSaving) {
    // If we have the blurred preview, use it
    if (blurredPreview) {
      return (
        <Image
          id={id}
          name={name}
          x={x}
          y={y}
          image={blurredPreview}
          width={width}
          height={height}
          scaleX={scaleX}
          scaleY={scaleY}
          rotation={rotation}
          opacity={opacity}
          draggable={draggable}
          {...annotationEvents}
          {...otherProps}
        />
      );
    }

    // Create a placeholder image from canvas while blur is loading
    const placeholderCanvas = document.createElement('canvas');
    placeholderCanvas.width = Math.max(1, width);
    placeholderCanvas.height = Math.max(1, height);
    const ctx = placeholderCanvas.getContext('2d');
    ctx.fillStyle = 'rgba(200, 200, 200, 0.3)';
    ctx.fillRect(0, 0, placeholderCanvas.width, placeholderCanvas.height);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(0, 0, placeholderCanvas.width, placeholderCanvas.height);

    return (
      <Image
        id={id}
        name={name}
        x={x}
        y={y}
        image={placeholderCanvas}
        width={width * scaleX}
        height={height * scaleY}
        scaleX={1}
        scaleY={1}
        rotation={rotation}
        opacity={opacity}
        draggable={draggable}
        {...annotationEvents}
        {...otherProps}
      />
    );
  }

  // During save, use the complex blur rendering
  return (
    <Group
      ref={groupRef}
      id={id}
      name={name}
      x={x}
      y={y}
      width={width}
      height={height}
      scaleX={scaleX}
      scaleY={scaleY}
      rotation={rotation}
      opacity={opacity}
    >
      <Group
        clip={{
          x: 0,
          y: 0,
          width,
          height,
        }}
      >
        <Group
          x={width / 2}
          y={height / 2}
          offsetX={width / 2}
          offsetY={height / 2}
          scaleX={isFlippedX ? -1 : 1}
          scaleY={isFlippedY ? -1 : 1}
        >
          <Image
            ref={imageRef}
            image={originalImage}
            x={-x * scaleRatioX}
            y={-y * scaleRatioY}
            width={originalImage.width}
            height={originalImage.height}
            scaleX={1 / scaleRatioX}
            scaleY={1 / scaleRatioY}
            filters={[Konva.Filters.Blur]}
            blurRadius={blurRadius}
          />
        </Group>
      </Group>
    </Group>
  );
};

BlurAnnotationNode.propTypes = {
  ...nodesCommonPropTypes.definitions,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  annotationEvents: PropTypes.instanceOf(Object).isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  blurRadius: PropTypes.number,
  draggable: PropTypes.bool,
};

export default BlurAnnotationNode;
