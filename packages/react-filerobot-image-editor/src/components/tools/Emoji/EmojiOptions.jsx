/** External Dependencies */
import { Button } from '@scaleflex/ui/core';
import { useRef, useState } from 'react';

/** Internal Dependencies */
import { useAnnotation, useStore } from 'hooks';
import { TOOLS_IDS } from 'utils/constants';
import { getEmojiSvgUrl } from 'utils/emojiToSvg';
import { SELECT_TOOL } from 'actions';
import EmojiPicker from './EmojiPicker';

const EmojiOptions = () => {
  const [pickerAnchorEl, setPickerAnchorEl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const buttonRef = useRef(null);
  const {
    shownImageDimensions,
    adjustments: { crop = {} },
    t,
    config = {},
    dispatch,
  } = useStore();

  const [tmpAnnotation, updateAnnotation, addNewEmoji] = useAnnotation(
    {
      name: TOOLS_IDS.IMAGE, // Use IMAGE tool instead of EMOJI
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
    setIsLoading(true);
    const svgUrl = getEmojiSvgUrl(emojiChar);
    
    // Load the emoji SVG as an image element
    const img = new Image();
    img.onload = () => {
      const layerWidth = crop.width || shownImageDimensions.width;
      const layerHeight = crop.height || shownImageDimensions.height;
      const layerCropX = crop.x || 0;
      const layerCropY = crop.y || 0;
      const defaultSize = Math.min(layerWidth, layerHeight) * 0.15; // 15% of the smaller dimension

      // Add the emoji as an image annotation, just like the Image tool does
      addNewEmoji({
        image: img, // Pass the HTMLImageElement directly
        x: layerCropX + layerWidth / 2 - defaultSize / 2,
        y: layerCropY + layerHeight / 2 - defaultSize / 2,
        width: defaultSize,
        height: defaultSize,
        opacity: 1,
        isEmoji: true, // Custom property to identify emojis
      });

      // Switch to IMAGE tool after adding the emoji to allow proper resizing
      setTimeout(() => {
        dispatch({
          type: SELECT_TOOL,
          payload: {
            toolId: TOOLS_IDS.IMAGE,
            keepSelections: true, // Keep the emoji selected
          },
        });
      }, 100);

      setIsLoading(false);
      closeEmojiPicker();
    };
    
    img.onerror = () => {
      console.error('Failed to load emoji SVG:', svgUrl);
      setIsLoading(false);
      // Optionally fall back to text-based emoji
    };
    
    img.crossOrigin = 'anonymous';
    img.src = svgUrl;
  };

  const handleEmojiButtonClick = (e) => {
    if (e.defaultPrevented || isLoading) return;

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
        disabled={isLoading}
      >
        <span style={{ fontSize: '20px', marginRight: '8px' }}>
          {availableEmojis[0]}
        </span>
        {isLoading ? t('loading') : t('emojiLabel')}
      </Button>
      <EmojiPicker
        anchorEl={pickerAnchorEl}
        onClose={closeEmojiPicker}
        onSelect={selectEmoji}
        t={t}
      />
    </>
  );
};

export default EmojiOptions;