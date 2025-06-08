/** External Dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import { Emoji as EmojiIcon } from '@scaleflex/icons/emoji';

/** Internal Dependencies */
import ToolsBarItemButton from 'components/ToolsBar/ToolsBarItemButton';
import { TOOLS_IDS } from 'utils/constants';

const EmojiButton = ({ selectTool, isSelected, t }) => (
  <ToolsBarItemButton
    className="FIE_emoji-tool-button"
    id={TOOLS_IDS.EMOJI}
    label={t('emojiTool')}
    Icon={EmojiIcon}
    onClick={selectTool}
    isSelected={isSelected}
  />
);

EmojiButton.defaultProps = {
  isSelected: false,
};

EmojiButton.propTypes = {
  selectTool: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
  t: PropTypes.func.isRequired,
};

export default EmojiButton;
