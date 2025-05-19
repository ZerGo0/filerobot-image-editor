/** External Dependencies */
import { Button } from '@scaleflex/ui/core';
import { useRef, useState } from 'react';

/** Internal Dependencies */
import { useAnnotation, useStore } from 'hooks';
import { TOOLS_IDS } from 'utils/constants';
import EmojiPicker from './EmojiPicker';

const EmojiOptions = () => {
  const [pickerAnchorEl, setPickerAnchorEl] = useState(null);
  const buttonRef = useRef(null);
  const {
    shownImageDimensions,
    adjustments: { crop = {} },
    t,
    config = {},
  } = useStore();

  const [tmpAnnotation, updateAnnotation, addNewEmoji] = useAnnotation(
    {
      name: TOOLS_IDS.EMOJI,
    },
    false,
  );

  const emojiConfig = config[TOOLS_IDS.EMOJI];
  const availableEmojis = emojiConfig?.emojis || [
    '😃',
    '😎',
    '❤️',
    '👍',
    '👎',
    '🎉',
    '🔥',
    '💯',
    '🌟',
    '🚀',
  ];

  const openEmojiPicker = (e) => {
    e.stopPropagation();
    setPickerAnchorEl(e.currentTarget);
  };

  const closeEmojiPicker = () => {
    setPickerAnchorEl(null);
  };

  const selectEmoji = (emojiChar) => {
    const layerWidth = crop.width || shownImageDimensions.width;
    const layerHeight = crop.height || shownImageDimensions.height;
    const layerCropX = crop.x || 0;
    const layerCropY = crop.y || 0;
    const defaultSize = Math.min(layerWidth, layerHeight) * 0.15; // 15% of the smaller dimension

    addNewEmoji({
      emoji: emojiChar,
      fontSize: defaultSize,
      x: layerCropX + layerWidth / 2 - defaultSize / 2,
      y: layerCropY + layerHeight / 2 - defaultSize / 2,
      width: defaultSize,
      height: defaultSize,
      opacity: 1,
    });

    closeEmojiPicker();
  };

  const handleEmojiButtonClick = (e) => {
    if (e.defaultPrevented) return;

    const firstEmoji = availableEmojis[0];
    selectEmoji(firstEmoji);
  };

  return (
    <>
      <Button
        ref={buttonRef}
        className="FIE_emoji-tool-options"
        color="secondary"
        size="sm"
        onClick={handleEmojiButtonClick}
        onMouseDown={openEmojiPicker}
      >
        <span style={{ fontSize: '20px', marginRight: '8px' }}>
          {availableEmojis[0]}
        </span>
        {t('emojiLabel')}
      </Button>
      <EmojiPicker
        anchorEl={pickerAnchorEl}
        onClose={closeEmojiPicker}
        onSelect={selectEmoji}
        emojis={availableEmojis}
        t={t}
      />
    </>
  );
};

export default EmojiOptions;
