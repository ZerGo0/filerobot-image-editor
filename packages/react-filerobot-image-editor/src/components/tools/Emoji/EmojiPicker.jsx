/** External Dependencies */
import { Menu, Tabs } from '@scaleflex/ui/core';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

/** Internal Dependencies */
import { useStore } from '../../../hooks';
import {
  StyledCategoryTitle,
  StyledEmojiGrid,
  StyledEmojiItem,
  StyledEmojiPickerContainer,
  StyledNoResults,
  StyledSearchContainer,
  StyledSearchInput,
  StyledSkinToneButton,
  StyledSkinToneSelector,
  StyledTab,
  StyledTabsContainer,
} from './Emoji.styled';
import {
  getEmojiData,
  getEmojiWithSkinTone,
  getFrequentlyUsedEmojis,
  getSavedSkinTone,
  saveSkinTone,
  searchEmojis,
  updateFrequentlyUsedEmoji,
} from './emojiUtils';

const EmojiPicker = ({ anchorEl, onClose, onSelect, t }) => {
  const { theme } = useStore();
  const isOpen = Boolean(anchorEl);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [frequentlyUsed, setFrequentlyUsed] = useState([]);
  const [selectedSkinTone, setSelectedSkinTone] = useState(() =>
    getSavedSkinTone(),
  );
  const [showSkinToneSelector, setShowSkinToneSelector] = useState(false);
  const skinToneButtonRef = useRef(null);

  // Load frequently used emojis on mount
  useEffect(() => {
    if (isOpen) {
      const frequent = getFrequentlyUsedEmojis();
      setFrequentlyUsed(frequent);
    }
  }, [isOpen]);

  // Save skin tone preference when it changes
  useEffect(() => {
    saveSkinTone(selectedSkinTone);
  }, [selectedSkinTone]);

  // Handle emoji selection
  const handleEmojiSelect = useCallback(
    (emoji) => {
      const emojiChar =
        typeof emoji === 'string'
          ? emoji
          : getEmojiWithSkinTone(emoji, selectedSkinTone);

      updateFrequentlyUsedEmoji(emoji);
      onSelect(emojiChar);
      setSearchQuery('');
    },
    [onSelect, selectedSkinTone],
  );

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery) return null;
    return searchEmojis(searchQuery);
  }, [searchQuery]);

  // Tab categories including frequently used
  const categories = useMemo(() => {
    try {
      const { categories: emojiCategories } = getEmojiData();
      const cats = [];

      // Add frequently used tab if there are any
      if (frequentlyUsed.length > 0) {
        cats.push({
          key: 'recently-used',
          name: t('frequentlyUsed') || 'Frequently Used',
          icon: '🔥',
          emojis: frequentlyUsed,
        });
      }

      // Category icons mapping
      const categoryIcons = {
        'smileys-emotion': '😀',
        'people-body': '👋',
        'animals-nature': '🐶',
        'food-drink': '🍔',
        'travel-places': '✈️',
        activities: '⚽',
        objects: '💡',
        symbols: '❤️',
        flags: '🏳️',
      };

      // Add all other categories
      Object.entries(emojiCategories).forEach(([key, data]) => {
        if (data && data.emojis && data.emojis.length > 0) {
          cats.push({
            key,
            name: data.name || key,
            icon:
              categoryIcons[key] || data.emojis[0]?.skins?.[0]?.native || '😀',
            emojis: data.emojis,
          });
        }
      });

      return cats.length > 0
        ? cats
        : [
            {
              key: 'default',
              name: 'Emojis',
              icon: '😀',
              emojis: [],
            },
          ];
    } catch (error) {
      console.error('Error loading emoji categories:', error);
      return [
        {
          key: 'default',
          name: 'Emojis',
          icon: '😀',
          emojis: [],
        },
      ];
    }
  }, [frequentlyUsed, t]);

  // Reset state when closing
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setActiveTab(0);
      setShowSkinToneSelector(false);
    }
  }, [isOpen]);

  // Close skin tone selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showSkinToneSelector &&
        !e.target.closest('.FIE_skin-tone-selector')
      ) {
        setShowSkinToneSelector(false);
      }
    };

    if (showSkinToneSelector) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showSkinToneSelector]);

  const renderEmojiGrid = (emojis, showCategory = false, categoryName = '') => {
    if (!emojis || emojis.length === 0) {
      return null;
    }

    return (
      <>
        {showCategory && categoryName && (
          <StyledCategoryTitle>{categoryName}</StyledCategoryTitle>
        )}
        {emojis.map((emojiData) => {
          const isEmojiObject =
            typeof emojiData === 'object' && emojiData !== null;
          const emojiChar = isEmojiObject
            ? getEmojiWithSkinTone(emojiData, selectedSkinTone)
            : emojiData;
          const emojiKey = isEmojiObject ? emojiData.id : emojiData;
          const hasSkinTones = isEmojiObject && emojiData.has_skin_variations;

          return (
            <StyledEmojiItem
              key={emojiKey}
              onClick={() => handleEmojiSelect(emojiData)}
              title={
                isEmojiObject
                  ? emojiData.name
                  : t('selectEmoji') || 'Select emoji'
              }
              $hasSkinTones={hasSkinTones}
            >
              {emojiChar}
            </StyledEmojiItem>
          );
        })}
      </>
    );
  };

  const renderSearchResults = () => {
    if (!searchResults) return null;

    if (searchResults.length === 0) {
      return (
        <StyledNoResults>
          {t('noEmojisFound') || 'No emojis found'}
        </StyledNoResults>
      );
    }

    return <StyledEmojiGrid>{renderEmojiGrid(searchResults)}</StyledEmojiGrid>;
  };

  // Get current category emojis
  const currentCategory = categories[activeTab];

  // Render skin tone dropdown with portal
  const renderSkinToneDropdown = () => {
    if (!showSkinToneSelector || !skinToneButtonRef.current) return null;

    const rect = skinToneButtonRef.current.getBoundingClientRect();

    return ReactDOM.createPortal(
      <div
        className="FIE_skin-tone-dropdown"
        style={{
          position: 'fixed',
          top: rect.bottom + 4,
          left: rect.left - 200, // Adjust to show on the left side
          background: theme.palette['bg-secondary'],
          borderRadius: '4px',
          padding: '4px',
          display: 'flex',
          gap: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 10000,
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((tone) => (
          <StyledSkinToneButton
            key={tone}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSelectedSkinTone(tone);
              setShowSkinToneSelector(false);
            }}
            $selected={selectedSkinTone === tone}
            title={tone === 1 ? 'Default' : `Skin tone ${tone - 1}`}
          >
            {['✋', '✋🏻', '✋🏼', '✋🏽', '✋🏾', '✋🏿'][tone - 1]}
          </StyledSkinToneButton>
        ))}
      </div>,
      document.body,
    );
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={isOpen}
      onClose={onClose}
      position="bottom"
      className="FIE_emoji-picker"
      PaperProps={{
        style: {
          maxHeight: '450px',
          overflow: 'visible',
          position: 'relative',
        },
      }}
    >
      <StyledEmojiPickerContainer>
        <StyledSearchContainer>
          <StyledSearchInput
            type="text"
            placeholder={t('searchEmoji') || 'Search emoji...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <StyledSkinToneSelector className="FIE_skin-tone-selector">
            <StyledSkinToneButton
              ref={skinToneButtonRef}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowSkinToneSelector(!showSkinToneSelector);
              }}
              title={t('selectSkinTone') || 'Select skin tone'}
              $selected={selectedSkinTone !== 1}
            >
              {['✋', '✋🏻', '✋🏼', '✋🏽', '✋🏾', '✋🏿'][selectedSkinTone - 1]}
            </StyledSkinToneButton>
          </StyledSkinToneSelector>
        </StyledSearchContainer>

        {searchQuery ? (
          <div
            className="FIE_emoji-picker-panel"
            style={{
              height: '300px',
              overflowY: 'auto',
              position: 'relative',
            }}
          >
            {renderSearchResults()}
          </div>
        ) : (
          <>
            <StyledTabsContainer>
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                variant="scrollable"
                scrollButtons={false}
                style={{
                  padding: '12px',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  '&::-webkit-scrollbar': {
                    display: 'none',
                  },
                }}
              >
                {categories.map((category, index) => (
                  <StyledTab
                    key={category.key}
                    label={category.icon}
                    value={index}
                    title={category.name}
                    onClick={() => setActiveTab(index)}
                  />
                ))}
              </Tabs>
            </StyledTabsContainer>

            <div
              className="FIE_emoji-picker-panel"
              style={{
                height: '300px',
                overflowY: 'auto',
                position: 'relative',
              }}
            >
              {currentCategory && (
                <>
                  <StyledCategoryTitle>
                    {currentCategory.name}
                  </StyledCategoryTitle>
                  {currentCategory.emojis &&
                    currentCategory.emojis.length > 0 && (
                      <StyledEmojiGrid>
                        {renderEmojiGrid(currentCategory.emojis)}
                      </StyledEmojiGrid>
                    )}
                </>
              )}
            </div>
          </>
        )}
      </StyledEmojiPickerContainer>
      {renderSkinToneDropdown()}
    </Menu>
  );
};

EmojiPicker.propTypes = {
  anchorEl: PropTypes.instanceOf(Element),
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

EmojiPicker.defaultProps = {
  anchorEl: null,
};

export default EmojiPicker;
