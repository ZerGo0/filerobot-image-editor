/** External Dependencies */
import { Tab } from '@scaleflex/ui/core';
import { Color as PC } from '@scaleflex/ui/utils/types/palette';
import styled from 'styled-components';

export const StyledEmojiPickerContainer = styled.div`
  width: 380px;
  max-height: 450px;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.palette['bg-primary']};
  
  /* Hide scrollbars in emoji picker panels */
  .FIE_emoji-picker-panel {
    scrollbar-width: none;
    -ms-overflow-style: none;
    
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

export const StyledSearchContainer = styled.div`
  padding: 12px;
  border-bottom: 1px solid
    ${({ theme }) => theme.palette['border-primary-stateless']};
  position: relative;
  display: flex;
  gap: 8px;
  z-index: 1;
`;

export const StyledSearchInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.palette['border-primary-stateless']};
  border-radius: 4px;
  background: ${({ theme }) => theme.palette['bg-secondary']};
  color: ${({ theme }) => theme.palette['text-primary']};
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.palette['accent-primary']};
  }

  &::placeholder {
    color: ${({ theme }) => theme.palette['text-secondary']};
  }
`;

export const StyledSkinToneSelector = styled.div`
  position: relative;
`;

export const StyledSkinToneButton = styled.button`
  width: 36px;
  height: 36px;
  padding: 0;
  margin: 0;
  border: 1px solid ${({ theme, $selected }) => 
    $selected ? theme.palette['accent-primary'] : theme.palette['border-primary-stateless']};
  border-radius: 4px;
  background: ${({ theme }) => theme.palette['bg-secondary']};
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.palette['bg-secondary-hover']};
    border-color: ${({ theme }) => theme.palette['accent-primary']};
  }
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.palette['accent-primary']};
  }
`;

export const StyledTabsContainer = styled.div`
  border-bottom: 1px solid
    ${({ theme }) => theme.palette['border-primary-stateless']};
  overflow-x: auto;
  position: relative;
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  .MuiTabs-root {
    padding: 12px;
  }
  
  .MuiTabs-scrollable {
    overflow-x: auto !important;
  }
  
  .MuiTabs-scroller {
    scrollbar-width: none;
    -ms-overflow-style: none;
    
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

export const StyledTab = styled(Tab)`
  min-width: 40px !important;
  width: 40px;
  padding: 4px !important;
  font-size: 20px;
  margin-left: 4px !important;

  &.selected {
    background: ${({ theme }) => theme.palette['bg-secondary']};
  }

  .MuiTab-wrapper {
    width: 100%;
  }
`;

export const StyledEmojiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 4px;
  padding: 12px;
`;

export const StyledEmojiItem = styled.div`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background-color: ${({ theme }) => theme.palette['bg-secondary-press']};
    transform: scale(1.2);
  }
  
  ${({ $hasSkinTones }) => $hasSkinTones && `
    &::after {
      content: '';
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 4px;
      height: 4px;
      background: ${({ theme }) => theme.palette['accent-primary']};
      border-radius: 50%;
    }
  `}
`;

export const StyledCategoryTitle = styled.div`
  grid-column: 1 / -1;
  padding: 12px 12px 4px 12px;
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.palette[PC.TextPrimary]};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const StyledNoResults = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: ${({ theme }) => theme.palette[PC.TextSecondary]};
  font-size: 14px;
`;

export const StyledEmojiTooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 8px;
  background: ${({ theme }) => theme.palette['bg-tooltip']};
  color: ${({ theme }) => theme.palette[PC.TextPrimary]};
  font-size: 12px;
  border-radius: 4px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease;

  ${StyledEmojiItem}:hover & {
    opacity: 1;
  }
`;
