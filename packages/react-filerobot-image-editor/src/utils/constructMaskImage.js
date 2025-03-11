/** External Dependencies */
import Konva from 'konva';
import isFunction from './isFunction';

/**
 * Constructs a mask image from a set of points
 * @param {Object} imageDimensions - The dimensions of the image (width and height)
 * @param {Array} lines - The lines array defining the mask shape
 * @param {Object} [options={}] - Additional options
 * @param {number} [options.strokeWidth=5] - Width of the stroke
 * @returns {HTMLImageElement} The constructed mask image
 */
const constructMaskImage = (
  imageDimensions,
  lines,
  cbkFunctionName = 'toBlob',
) => {
  const stage = new Konva.Stage({
    container: document.createElement('div'),
    width: imageDimensions.width,
    height: imageDimensions.height,
    listening: false,
  });

  const layer = new Konva.Layer({ listening: false });

  stage.add(layer);

  const bgRect = new Konva.Rect({
    x: 0,
    y: 0,
    width: imageDimensions.width,
    height: imageDimensions.height,
    fill: '#000000',
    listening: false,
  });

  const linesInstances = lines.map(
    ({
      strokeWidth = 50,
      stroke = '#ffffff',
      tension = 1,
      lineCap = 'round',
      lineJoin = 'round',
      bezier = true,
      points = [],
    }) =>
      new Konva.Line({
        opacity: 1,
        stroke,
        strokeWidth,
        bezier,
        tension,
        lineCap,
        lineJoin,
        listening: false,
        closed: false,
        points,
      }),
  );

  layer.add(bgRect, ...linesInstances);

  const maskImage = isFunction(stage[cbkFunctionName])
    ? stage[cbkFunctionName]()
    : stage.toBlob();

  stage.destroy();
  return maskImage;
};

export default constructMaskImage;
