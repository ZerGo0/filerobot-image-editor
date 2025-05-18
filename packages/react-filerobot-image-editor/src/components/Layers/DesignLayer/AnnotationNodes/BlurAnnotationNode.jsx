/** External Dependencies */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Konva from 'konva';
import { Group, Rect, Image, Text } from 'react-konva';

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
  ...otherProps
}) => {
  const [blurredPreview, setBlurredPreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const groupRef = useRef();
  const imageRef = useRef();
  const { 
    originalImage, 
    shownImageDimensions,
    adjustments: { isFlippedX, isFlippedY } = {}
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
    if (!originalImage || !shownImageDimensions || width <= 0 || height <= 0 || isSaving) return;

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
    const sourceWidth = width * scaleRatioX;
    const sourceHeight = height * scaleRatioY;

    // Create a canvas to extract the region from the flipped image
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
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
      width, // Destination Width
      height // Destination Height
    );

    // Create an off-screen Konva stage for blur processing
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.visibility = 'hidden';
    document.body.appendChild(container);

    const stage = new Konva.Stage({
      container: container,
      width: width,
      height: height,
    });

    const layer = new Konva.Layer();
    stage.add(layer);

    // Create Konva image from canvas
    const imageFromCanvas = new window.Image();
    imageFromCanvas.onload = function() {
      const konvaImage = new Konva.Image({
        image: imageFromCanvas,
        x: 0,
        y: 0,
        width: width,
        height: height,
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
  }, [originalImage, shownImageDimensions, x, y, width, height, blurRadius, isFlippedX, isFlippedY, isSaving]);

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

  return (
    <Group
      ref={groupRef}
      id={id}
      name={name}
      x={x}
      y={y}
      scaleX={scaleX}
      scaleY={scaleY}
      rotation={rotation}
      opacity={opacity}
      {...annotationEvents}
      {...otherProps}
    >
      {isSaving ? (
        // During save, use clipped Konva image with blur filter
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
      ) : (
        // During editing, show the pre-blurred preview
        <>
          {blurredPreview ? (
            <Image
              image={blurredPreview}
              width={width}
              height={height}
              listening={false}
            />
          ) : (
            <Rect
              width={width}
              height={height}
              fill="rgba(200, 200, 200, 0.3)"
              stroke="rgba(0, 0, 0, 0.5)"
              strokeWidth={2}
              dash={[5, 5]}
            />
          )}
          
          {/* Border to show the blur region */}
          <Rect
            width={width}
            height={height}
            stroke="rgba(0, 0, 0, 0.3)"
            strokeWidth={2}
            dash={[5, 5]}
            fill="transparent"
            listening={false}
          />
          
          {/* Show blur level indicator */}
          <Group>
            <Rect
              x={5}
              y={5}
              width={60}
              height={20}
              fill="rgba(0, 0, 0, 0.7)"
              cornerRadius={3}
            />
            <Text
              x={10}
              y={8}
              text={`Blur: ${blurRadius}`}
              fontSize={12}
              fill="white"
              fontFamily="Arial"
            />
          </Group>
        </>
      )}
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
};

export default BlurAnnotationNode;