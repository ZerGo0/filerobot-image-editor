/** External Dependencies */
import { Menu } from '@scaleflex/ui/core';
import PropTypes from 'prop-types';

/** Internal Dependencies */
import { StyledEmojiGrid, StyledEmojiItem } from './Emoji.styled';

const EmojiPicker = ({ anchorEl, onClose, onSelect, emojis, t }) => {
  const isOpen = Boolean(anchorEl);

  return (
    <Menu
      anchorEl={anchorEl}
      open={isOpen}
      onClose={onClose}
      position="top"
      className="FIE_emoji-picker"
    >
      <StyledEmojiGrid>
        {emojis.map((emoji) => (
          <StyledEmojiItem
            key={emoji}
            onClick={() => onSelect(emoji)}
            title={t('selectEmoji')}
          >
            {emoji}
          </StyledEmojiItem>
        ))}
      </StyledEmojiGrid>
    </Menu>
  );
};

EmojiPicker.propTypes = {
  anchorEl: PropTypes.instanceOf(Element),
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  emojis: PropTypes.arrayOf(PropTypes.string),
  t: PropTypes.func.isRequired,
};

EmojiPicker.defaultProps = {
  anchorEl: null,
  emojis: [],
};

export default EmojiPicker;
