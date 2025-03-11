/** External Dependencies */
import styled from 'styled-components';
import Label from '@scaleflex/ui/core/label';

const StyledBrushSizeLabel = styled(Label)`
  margin-bottom: 8px;
`;

const StyledBrushSizeWrapper = styled.div`
  width: 100%;
  max-width: 330px;
`;

const StyledBrushCursor = styled.div.attrs(
  ({ $zoom = 1, $display = 'none', $size, $x, $y }) => ({
    style: {
      transform: `translate(${$x}px, ${$y}px) scale(${$zoom}, ${$zoom})`,
      display: $display,
      width: $size,
      height: $size,
    },
  }),
)`
  transform-origin: center;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  border: none;
  outline: none;
  pointer-events: none;
  transition: width 0.1s ease-in-out, height 0.1s ease-in-out;
  background-color: ${({ $color }) => $color};
  opacity: ${({ $opacity }) => $opacity};
  z-index: 1111;
`;

const StyledBrushModeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export {
  StyledBrushSizeWrapper,
  StyledBrushSizeLabel,
  StyledBrushCursor,
  StyledBrushModeWrapper,
};
