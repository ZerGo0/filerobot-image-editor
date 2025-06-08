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
  rotation = 0, // Rotation is disabled for blur regions
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
  const [cachedBlurredFullImage, setCachedBlurredFullImage] = useState(null);
  const [cachedBlurParams, setCachedBlurParams] = useState(null);
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

  // Create blurred preview for editing mode with caching optimization
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

    // Check if we need to recreate the blurred full image
    const currentBlurParams = JSON.stringify({
      blurRadius,
      isFlippedX,
      isFlippedY,
      imgWidth: shownImageDimensions.width,
      imgHeight: shownImageDimensions.height,
    });

    const createBlurredFullImage = (callback) => {
      // Step 1: Create a canvas with the full image to blur
      const fullCanvas = document.createElement('canvas');
      fullCanvas.width = shownImageDimensions.width;
      fullCanvas.height = shownImageDimensions.height;
      const fullCtx = fullCanvas.getContext('2d');

      // Apply flip transformations to match the current image state
      fullCtx.save();
      if (isFlippedX) {
        fullCtx.scale(-1, 1);
        fullCtx.translate(-shownImageDimensions.width, 0);
      }
      if (isFlippedY) {
        fullCtx.scale(1, -1);
        fullCtx.translate(0, -shownImageDimensions.height);
      }

      // Draw the entire image at shown dimensions
      fullCtx.drawImage(
        originalImage,
        0,
        0,
        originalImage.width,
        originalImage.height,
        0,
        0,
        shownImageDimensions.width,
        shownImageDimensions.height,
      );
      fullCtx.restore();

      // Step 2: Create an off-screen Konva stage to blur the entire image
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.visibility = 'hidden';
      document.body.appendChild(container);

      const blurStage = new Konva.Stage({
        container,
        width: shownImageDimensions.width,
        height: shownImageDimensions.height,
      });

      const blurLayer = new Konva.Layer();
      blurStage.add(blurLayer);

      // Create Konva image from the full canvas
      const fullImageElement = new window.Image();
      fullImageElement.onload = function () {
        const konvaFullImage = new Konva.Image({
          image: fullImageElement,
          x: 0,
          y: 0,
          width: shownImageDimensions.width,
          height: shownImageDimensions.height,
        });

        // Apply blur filter to the entire image
        konvaFullImage.filters([Konva.Filters.Blur]);
        konvaFullImage.blurRadius(blurRadius);
        konvaFullImage.cache();

        blurLayer.add(konvaFullImage);
        blurLayer.draw();

        // Get the blurred full image as a data URL
        const blurredFullDataUrl = blurStage.toDataURL();
        const blurredFullImg = new window.Image();

        blurredFullImg.onload = () => {
          // Cache the blurred full image
          setCachedBlurredFullImage(blurredFullImg);
          setCachedBlurParams(currentBlurParams);

          // Call the callback with the blurred full image
          callback(blurredFullImg);

          // Cleanup
          blurStage.destroy();
          if (container.parentNode) {
            document.body.removeChild(container);
          }
        };

        blurredFullImg.src = blurredFullDataUrl;
      };
      fullImageElement.src = fullCanvas.toDataURL();
    };

    const extractRegionFromBlurredImage = (blurredFullImg) => {
      // Extract the blurred region from the fully blurred image
      const extractCanvas = document.createElement('canvas');
      extractCanvas.width = actualWidth;
      extractCanvas.height = actualHeight;
      const extractCtx = extractCanvas.getContext('2d');

      // Extract the specific region from the blurred full image
      extractCtx.drawImage(
        blurredFullImg,
        x, // Source X
        y, // Source Y
        actualWidth, // Source Width
        actualHeight, // Source Height
        0, // Destination X
        0, // Destination Y
        actualWidth, // Destination Width
        actualHeight, // Destination Height
      );

      // Convert the extracted region to an image for preview
      const extractedDataUrl = extractCanvas.toDataURL();
      const blurredRegionImg = new window.Image();
      blurredRegionImg.onload = () => {
        setBlurredPreview(blurredRegionImg);
      };
      blurredRegionImg.src = extractedDataUrl;
    };

    // Use cached blurred image if blur parameters haven't changed
    if (cachedBlurredFullImage && cachedBlurParams === currentBlurParams) {
      extractRegionFromBlurredImage(cachedBlurredFullImage);
    } else {
      // Create new blurred full image
      createBlurredFullImage(extractRegionFromBlurredImage);
    }
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
    cachedBlurredFullImage,
    cachedBlurParams,
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
          rotation={0}
          opacity={opacity}
          draggable={draggable}
          stroke={stroke}
          strokeWidth={strokeWidth}
          shadowOffsetX={shadowOffsetX}
          shadowOffsetY={shadowOffsetY}
          shadowBlur={shadowBlur}
          shadowColor={shadowColor}
          shadowOpacity={shadowOpacity}
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

  // During save, use the same approach but with higher resolution
  // We create a blurred version of the entire image and then clip to show only the region
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
            // Position the image so the blur region aligns correctly
            // We offset by the region position scaled to original dimensions
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
