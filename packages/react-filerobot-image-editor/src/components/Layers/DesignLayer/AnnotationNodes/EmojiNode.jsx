/** External Dependencies */
import PropTypes from 'prop-types';
import { Text } from 'react-konva';

/** Internal Dependencies */
import nodesCommonPropTypes from '../nodesCommonPropTypes';

const EmojiNode = ({
  id,
  name,
  emoji,
  x,
  y,
  width,
  height,
  scaleX,
  scaleY,
  rotation,
  annotationEvents,
  stroke,
  strokeWidth,
  shadowOffsetX,
  shadowOffsetY,
  shadowBlur,
  shadowColor,
  shadowOpacity,
  opacity,
  fontSize,
  ...otherProps
}) => {
  // Use the fontSize or width for text size, and ensure it's properly scaled
  const actualFontSize = fontSize || width;

  return (
    <Text
      id={id}
      name={name}
      text={emoji}
      x={x}
      y={y}
      width={width}
      height={height}
      fontSize={actualFontSize}
      fontFamily="Arial"
      align="center"
      verticalAlign="middle"
      scaleX={scaleX}
      scaleY={scaleY}
      rotation={rotation}
      stroke={stroke}
      strokeWidth={strokeWidth}
      shadowOffsetX={shadowOffsetX}
      shadowOffsetY={shadowOffsetY}
      shadowBlur={shadowBlur}
      shadowColor={shadowColor}
      shadowOpacity={shadowOpacity}
      opacity={opacity}
      {...annotationEvents}
      {...otherProps}
    />
  );
};

EmojiNode.defaultProps = {
  ...nodesCommonPropTypes.defaultProps,
  emoji: '😊',
  fontSize: null,
};

EmojiNode.propTypes = {
  ...nodesCommonPropTypes,
  emoji: PropTypes.string,
  fontSize: PropTypes.number,
};

export default EmojiNode;
