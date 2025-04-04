/** External Dependencies */
import styled from 'styled-components';
import Label from '@scaleflex/ui/core/label';
import { IconButton, MenuItemIcon } from '@scaleflex/ui/core';
import { Color as PC } from '@scaleflex/ui/utils/types/palette';
import { ArrowBottom } from '@scaleflex/icons';
import { FontVariant as FV } from '@scaleflex/ui/utils/types/typography';

const StyledRemoveOptionLabel = styled(Label)`
  margin-bottom: 8px;
  ${({ theme: { typography } }) => typography.font[FV.LabelExtraSmallUp]};
`;

const StyledBrushSizeWrapper = styled.div`
  max-width: 330px;
  min-width: 200px;

  @media (max-width: 480px) {
    max-width: 100%;
    width: 100%;
    order: 1;
  }
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
  border-radius: ${({ $isSquareBrushType }) =>
    $isSquareBrushType ? '4px' : '50%'};
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  border: 2px solid rgba(255, 255, 255, 1);
  outline: none;
  pointer-events: none;
  transition: width 0.1s ease-in-out, height 0.1s ease-in-out;
  background-color: ${({ $isHighlightMode, theme: { palette } }) =>
    $isHighlightMode
      ? palette[PC.Accent_0_7_Opacity]
      : palette[PC.Extra_0_7_Overlay]};
  z-index: 1111;
`;

const StyledRemoveObjectOptionsWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 16px;

  @media (max-width: 480px) {
    flex-wrap: wrap;
  }
`;

const StyledBrushModeWrapper = styled.div`
  align-self: stretch;
`;

const StyledButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StyledIconButton = styled(IconButton)`
  width: ${({ $width }) => $width || '24px'};
  height: ${({ $height }) => $height || '24px'};

  svg {
    flex-shrink: 0;
    color: ${({ theme: { palette }, active }) =>
      active && palette[PC.AccentStateless]};
  }
`;

const StyledActiveMenuItem = styled(MenuItemIcon)`
  svg {
    color: ${({ theme: { palette } }) => palette[PC.AccentStateless]};
  }
`;

const StyledMenuArrow = styled(ArrowBottom)`
  transform: rotate(${({ $rotate = 0 }) => $rotate}deg);
  transition: transform 0.1s ease-in-out;
`;

export {
  StyledBrushSizeWrapper,
  StyledRemoveOptionLabel,
  StyledBrushCursor,
  StyledRemoveObjectOptionsWrapper,
  StyledButtonsWrapper,
  StyledIconButton,
  StyledBrushModeWrapper,
  StyledActiveMenuItem,
  StyledMenuArrow,
};
