/** External Dependencies */
import { Loading } from '@scaleflex/icons';
import { Button } from '@scaleflex/ui/core';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const StyledSpinnerWrapper = styled.div`
  background: rgba(255, 255, 255, 0.78);
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  z-index: 11111;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  flex-direction: column;
  user-select: none;
  gap: 12px;
`;

const StyledSpinnerCancelButton = styled(Button)`
  margin-top: 4px;
`;

const StyledSpinner = styled(Loading)`
  animation: ${spin} 1.2s infinite;
`;

export { StyledSpinnerWrapper, StyledSpinner, StyledSpinnerCancelButton };
