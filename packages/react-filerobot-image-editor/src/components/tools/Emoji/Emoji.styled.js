/** External Dependencies */
import styled from 'styled-components';

export const StyledEmojiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  padding: 12px;
  max-width: 300px;
`;

export const StyledEmojiItem = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.palette['bg-secondary-press']};
  }
`;
