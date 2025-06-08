const TWEMOJI_CDN_BASE = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/';

export const emojiToCodepoints = (emoji) => {
  const codepoints = [];
  for (let i = 0; i < emoji.length; i++) {
    const char = emoji.charCodeAt(i);
    if (char >= 0xd800 && char <= 0xdbff) {
      const high = char;
      const low = emoji.charCodeAt(++i);
      const codepoint = ((high - 0xd800) * 0x400) + (low - 0xdc00) + 0x10000;
      codepoints.push(codepoint.toString(16));
    } else {
      codepoints.push(char.toString(16));
    }
  }
  // Remove variation selector (fe0f) if it's the last codepoint
  // This helps match more emojis in the Twemoji set
  if (codepoints[codepoints.length - 1] === 'fe0f') {
    codepoints.pop();
  }
  return codepoints.join('-');
};

export const getEmojiSvgUrl = (emoji) => {
  const codepoints = emojiToCodepoints(emoji);
  return `${TWEMOJI_CDN_BASE}${codepoints}.svg`;
};