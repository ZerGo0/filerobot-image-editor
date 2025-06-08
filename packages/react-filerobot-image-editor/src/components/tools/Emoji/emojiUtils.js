import data from '@emoji-mart/data';

// Helper to get emoji with skin tone variation
export const getEmojiWithSkinTone = (emoji, skinTone) => {
  // If emoji is a string, return it as is
  if (typeof emoji === 'string') return emoji;
  
  // Get the native emoji from the skins array
  if (!emoji.skins || emoji.skins.length === 0) return '❓';
  
  // Default skin tone (1) or no skin tone
  if (!skinTone || skinTone === 1) {
    return emoji.skins[0].native;
  }
  
  // Map our skin tone indices (2-6) to emoji-mart indices (1-5)
  const skinIndex = skinTone - 1;
  
  // Return the skin variation if it exists
  if (emoji.skins[skinIndex]) {
    return emoji.skins[skinIndex].native;
  }
  
  // Fallback to default skin
  return emoji.skins[0].native;
};

// Process emoji data from @emoji-mart/data into our format
export const processEmojiData = () => {
  const categories = {};
  const allEmojis = {};
  const searchIndex = {};
  
  // Process categories from emoji-mart data
  if (!data.categories || !Array.isArray(data.categories)) {
    console.error('Invalid emoji data: categories not found or not an array');
    return { categories, allEmojis, searchIndex };
  }
  
  // Process each category
  data.categories.forEach((categoryData) => {
    const categoryId = categoryData.id;
    let targetCategoryId;
    
    // Map emoji-mart categories to our display categories
    // The 'people' category in emoji-mart contains all smileys and people
    // We'll split it into two categories for better organization
    if (categoryId === 'people') {
      // We'll process this category twice - once for smileys, once for people
      targetCategoryId = 'smileys-emotion';
    } else {
      const categoryMap = {
        'nature': 'animals-nature',
        'foods': 'food-drink',
        'activity': 'activities',
        'places': 'travel-places',
        'objects': 'objects',
        'symbols': 'symbols',
        'flags': 'flags',
      };
      targetCategoryId = categoryMap[categoryId] || categoryId;
    }
    
    if (!categories[targetCategoryId]) {
      // Category display names
      const categoryNames = {
        'smileys-emotion': 'Smileys & Emotion',
        'people-body': 'People & Body',
        'animals-nature': 'Animals & Nature',
        'food-drink': 'Food & Drink',
        'travel-places': 'Travel & Places',
        'activities': 'Activities',
        'objects': 'Objects',
        'symbols': 'Symbols',
        'flags': 'Flags'
      };
      
      categories[targetCategoryId] = {
        id: targetCategoryId,
        name: categoryNames[targetCategoryId] || targetCategoryId,
        emojis: []
      };
    }
    
    // Process emojis in this category
    (categoryData.emojis || []).forEach((emojiId) => {
      const emojiData = data.emojis[emojiId];
      if (!emojiData || !emojiData.skins || emojiData.skins.length === 0) return;
      
      const emoji = {
        id: emojiId,
        skins: emojiData.skins,
        name: emojiData.name,
        keywords: emojiData.keywords || [],
        has_skin_variations: emojiData.skins && emojiData.skins.length > 1
      };
      
      // For the people category, split emojis between smileys and people
      if (categoryId === 'people') {
        // First ~200 emojis are mostly smileys/emotions
        const categoryIndex = categoryData.emojis.indexOf(emojiId);
        if (categoryIndex < 200) {
          categories['smileys-emotion'].emojis.push(emoji);
        } else {
          // Create people-body category if it doesn't exist
          if (!categories['people-body']) {
            categories['people-body'] = {
              id: 'people-body',
              name: 'People & Body',
              emojis: []
            };
          }
          categories['people-body'].emojis.push(emoji);
        }
      } else {
        categories[targetCategoryId].emojis.push(emoji);
      }
      
      allEmojis[emojiId] = emoji;
      
      // Build search index
      const searchTerms = [
        emoji.name,
        ...emoji.keywords
      ].filter(Boolean);
      
      searchTerms.forEach(term => {
        if (!term) return;
        const lowerTerm = term.toLowerCase();
        if (!searchIndex[lowerTerm]) {
          searchIndex[lowerTerm] = [];
        }
        searchIndex[lowerTerm].push(emoji);
      });
    });
  });
  
  return { categories, allEmojis, searchIndex };
};

// Cache processed data
let cachedData = null;

export const getEmojiData = () => {
  if (!cachedData) {
    cachedData = processEmojiData();
  }
  return cachedData;
};

// Search emojis
export const searchEmojis = (query, maxResults = 50) => {
  if (!query || query.length < 1) return [];
  
  const { searchIndex, allEmojis } = getEmojiData();
  const lowerQuery = query.toLowerCase();
  const results = new Map(); // Use Map to prevent duplicates
  
  // First, try exact matches
  Object.entries(searchIndex).forEach(([term, emojis]) => {
    if (term === lowerQuery) {
      emojis.forEach(emoji => results.set(emoji.id, emoji));
    }
  });
  
  // Then, try prefix matches
  Object.entries(searchIndex).forEach(([term, emojis]) => {
    if (term.startsWith(lowerQuery)) {
      emojis.forEach(emoji => results.set(emoji.id, emoji));
    }
  });
  
  // Finally, try includes matches
  Object.entries(searchIndex).forEach(([term, emojis]) => {
    if (term.includes(lowerQuery) && results.size < maxResults) {
      emojis.forEach(emoji => results.set(emoji.id, emoji));
    }
  });
  
  return Array.from(results.values()).slice(0, maxResults);
};

// Storage keys
export const FREQUENTLY_USED_KEY = 'fie_frequently_used_emojis';
export const SKIN_TONE_KEY = 'fie_selected_skin_tone';

// Get frequently used emojis from localStorage
export const getFrequentlyUsedEmojis = () => {
  try {
    const stored = localStorage.getItem(FREQUENTLY_USED_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      const { allEmojis } = getEmojiData();
      
      // Sort by count and return top 25
      return Object.entries(data)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 25)
        .map(([emojiId]) => allEmojis[emojiId])
        .filter(Boolean); // Filter out any emojis that don't exist
    }
  } catch (e) {
    console.error('Error loading frequently used emojis:', e);
  }
  return [];
};

// Update frequently used emojis
export const updateFrequentlyUsedEmoji = (emoji) => {
  try {
    const stored = localStorage.getItem(FREQUENTLY_USED_KEY);
    const data = stored ? JSON.parse(stored) : {};
    
    // Increment count for this emoji ID
    const emojiId = typeof emoji === 'string' ? emoji : emoji.id;
    data[emojiId] = (data[emojiId] || 0) + 1;
    
    // Keep only top 50 to prevent localStorage from growing too large
    const sorted = Object.entries(data)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 50);
    
    const cleanedData = Object.fromEntries(sorted);
    
    localStorage.setItem(FREQUENTLY_USED_KEY, JSON.stringify(cleanedData));
  } catch (e) {
    console.error('Error updating frequently used emojis:', e);
  }
};

// Get saved skin tone preference
export const getSavedSkinTone = () => {
  try {
    const saved = localStorage.getItem(SKIN_TONE_KEY);
    if (saved) {
      const tone = parseInt(saved, 10);
      // Validate it's between 1-6
      if (tone >= 1 && tone <= 6) {
        return tone;
      }
    }
  } catch (e) {
    console.error('Error loading saved skin tone:', e);
  }
  return 1; // Default skin tone
};

// Save skin tone preference
export const saveSkinTone = (skinTone) => {
  try {
    localStorage.setItem(SKIN_TONE_KEY, skinTone.toString());
  } catch (e) {
    console.error('Error saving skin tone:', e);
  }
};