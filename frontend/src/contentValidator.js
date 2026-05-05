// contentValidator.js
import { Filter } from 'bad-words';

class ContentValidator {
  constructor() {
    // Initialize bad-words filter
    this.filter = new Filter();
    
    // Add custom inappropriate words/phrases
    this.customBadWords = [
      'sex', 'sexy', 'porn', 'fuck', 'shit', 'damn', 'hell', 'bitch', 'ass',
      'bastard', 'crap', 'piss', 'dick', 'cock', 'pussy', 'boobs', 'tits',
      'slut', 'whore', 'faggot', 'nigger', 'retard', 'gay', 'lesbian',
      'stupid', 'idiot', 'moron', 'dumb', 'loser', 'hate', 'kill', 'die',
      'murder', 'suicide', 'rape', 'abuse', 'violence', 'drug', 'alcohol',
      'beer', 'wine', 'smoke', 'cigarette', 'weed', 'marijuana', 'cocaine',
      'asshole', 'motherfucker', 'jackass', 'dipshit', 'bullshit', 'goddamn',
      'prick', 'screw', 'screwed', 'suck', 'sucks', 'bloody', 'freaking',
      // Add more as needed
    ];

    // Add custom words to filter
    this.filter.addWords(...this.customBadWords);

    // Spam/gibberish patterns
    this.spamPatterns = [
      /(.)\1{4,}/g, // Repeated characters (aaaaa, 11111)
      /^[a-z]{1,3}$/i, // Too short words
      /\b(\w+)\s+\1\b/gi, // Repeated words
      /[!@#$%^&*()]{3,}/g, // Too many special characters
      /\d{10,}/g, // Long number sequences
      /[A-Z]{5,}/g, // Too many consecutive capitals
    ];

    // Offensive phrases and patterns
    this.offensivePatterns = [
      /\b(kill\s*(yourself|urself|ur\s*self))\b/gi,
      /\b(go\s*(die|to\s*hell))\b/gi,
      /\b(i\s*hate\s*(you|u|this|that))\b/gi,
      /\b(you\s*(suck|are\s*stupid|are\s*dumb))\b/gi,
      /\b(this\s*is\s*(shit|crap|garbage|trash))\b/gi,
      /\b(worst\s*(college|university|school|teacher))\b/gi,
      /\b(piece\s*of\s*(shit|crap))\b/gi,
      /\b(shut\s*(up|the\s*f\*ck\s*up))\b/gi,
    ];
  }

  // Check if text is too short
  isTextTooShort(text) {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    return words.length < 5;
  }

  // Check for gibberish/spam patterns
  containsGibberish(text) {
    return this.spamPatterns.some(pattern => pattern.test(text));
  }

  // Enhanced client-side bad words check
  containsBadWords(text) {
    // Use bad-words library
    if (this.filter.isProfane(text)) {
      return true;
    }

    // Check offensive patterns
    if (this.offensivePatterns.some(pattern => pattern.test(text))) {
      return true;
    }

    // Manual check for variations and leetspeak
    const lowerText = text.toLowerCase();
    const variations = {
      'a': ['@', '4'],
      'e': ['3'],
      'i': ['1', '!'],
      'o': ['0'],
      's': ['5', '$'],
      't': ['7'],
    };

    // Check for leetspeak variations of bad words
    for (const badWord of this.customBadWords) {
      let regex = badWord;
      for (const [letter, replacements] of Object.entries(variations)) {
        const pattern = `[${letter}${replacements.join('')}]`;
        regex = regex.replace(new RegExp(letter, 'gi'), pattern);
      }
      
      if (new RegExp(`\\b${regex}\\b`, 'gi').test(lowerText)) {
        return true;
      }
    }

    return false;
  }

  // Working Profanity API (CORS-friendly)
  async checkProfanityAPI(text) {
    try {
      // Using a CORS-friendly API
      const response = await fetch(`https://www.purgomalum.com/service/containsprofanity?text=${encodeURIComponent(text)}`);
      
      if (response.ok) {
        const result = await response.text();
        return result.toLowerCase() === 'true';
      }
    } catch (error) {
      console.warn('Profanity API unavailable:', error);
    }
    return false;
  }

  // Alternative profanity check using purgomalum
  async checkAlternativeProfanity(text) {
    try {
      // Get filtered text and compare with original
      const response = await fetch(`https://www.purgomalum.com/service/plain?text=${encodeURIComponent(text)}`);
      
      if (response.ok) {
        const filteredText = await response.text();
        // If text was filtered (contains *), it had profanity
        return filteredText !== text && filteredText.includes('*');
      }
    } catch (error) {
      console.warn('Alternative Profanity API unavailable:', error);
    }
    return false;
  }

  // Enhanced toxicity detection using text analysis
  checkToxicityPatterns(text) {
    const toxicPatterns = [
      // Hate speech patterns
      /\b(hate\s*(you|this|that|everyone|everything))\b/gi,
      /\b(you\s*(are|r)\s*(stupid|dumb|idiot|moron|retard))\b/gi,
      /\b(go\s*(die|kill\s*yourself|to\s*hell))\b/gi,
      
      // Discriminatory language
      /\b(because\s*(you|ur|your)\s*(black|white|asian|gay|lesbian))\b/gi,
      
      // Threatening language
      /\b(i\s*(will|gonna)\s*(kill|hurt|beat))\b/gi,
      /\b(you\s*(deserve|should)\s*(die|suffer))\b/gi,
      
      // Extreme negativity
      /\b(worst\s*(ever|thing|place|college|school))\b/gi,
      /\b(complete\s*(garbage|trash|shit|crap))\b/gi,
      /\b(absolutely\s*(terrible|awful|horrible))\b/gi,
    ];

    return toxicPatterns.some(pattern => pattern.test(text));
  }

  // Check for repeated patterns that might indicate spam
  hasRepeatedPatterns(text) {
    const words = text.toLowerCase().split(/\s+/);
    const wordCount = {};
    
    for (const word of words) {
      if (word.length > 2) {
        wordCount[word] = (wordCount[word] || 0) + 1;
        if (wordCount[word] > 3) {
          return true; // Same word repeated more than 3 times
        }
      }
    }
    return false;
  }

  // Check if text contains only special characters or numbers
  isOnlySpecialCharsOrNumbers(text) {
    const alphaCount = (text.match(/[a-zA-Z]/g) || []).length;
    const totalLength = text.replace(/\s/g, '').length;
    return totalLength > 0 && alphaCount / totalLength < 0.3; // Less than 30% alphabetic characters
  }

  // Check for excessive caps
  hasExcessiveCaps(text) {
    const capsCount = (text.match(/[A-Z]/g) || []).length;
    const letterCount = (text.match(/[a-zA-Z]/g) || []).length;
    return letterCount > 10 && capsCount / letterCount > 0.7; // More than 70% caps
  }

  // Check for suspicious keywords and phrases
  containsSuspiciousContent(text) {
    const lowerText = text.toLowerCase();
    const suspiciousKeywords = [
      'kill yourself', 'go die', 'hate you', 'stupid teacher', 'worst college',
      'garbage', 'trash', 'useless', 'pathetic', 'disgusting', 'horrible',
      'terrible', 'awful', 'sucks', 'worst ever', 'piece of shit',
      'screw you', 'screw this', 'screw that', 'damn you', 'damn this',
      'bullshit', 'horseshit', 'what the hell', 'what the fuck',
      'son of a bitch', 'pain in the ass', 'kiss my ass',
      'shut up', 'shut the hell up', 'shut the fuck up',
      'i dont care', 'dont give a damn', 'dont give a shit',
      'waste of time', 'waste of money', 'complete waste',
      'total crap', 'total garbage', 'absolute shit'
    ];

    for (const keyword of suspiciousKeywords) {
      if (lowerText.includes(keyword)) {
        return true;
      }
    }
    return false;
  }

  // Main validation function
  async validateContent(text) {
    if (!text || typeof text !== 'string') {
      return {
        isValid: false,
        error: 'Please provide valid feedback content.'
      };
    }

    const trimmedText = text.trim();

    // Check if text is empty
    if (!trimmedText) {
      return {
        isValid: false,
        error: 'Feedback cannot be empty. Please provide meaningful content.'
      };
    }

    // Check minimum length
    if (this.isTextTooShort(trimmedText)) {
      return {
        isValid: false,
        error: 'Feedback is too short. Please provide at least 5 words with meaningful content.'
      };
    }

    // Check for gibberish patterns
    if (this.containsGibberish(trimmedText)) {
      return {
        isValid: false,
        error: 'Invalid feedback format detected. Please provide meaningful feedback without spam patterns.'
      };
    }

    // Check for repeated patterns
    if (this.hasRepeatedPatterns(trimmedText)) {
      return {
        isValid: false,
        error: 'Please avoid repeating the same words multiple times. Provide constructive feedback.'
      };
    }

    // Check if only special characters or numbers
    if (this.isOnlySpecialCharsOrNumbers(trimmedText)) {
      return {
        isValid: false,
        error: 'Please provide meaningful text feedback, not just symbols or numbers.'
      };
    }

    // Check for excessive caps
    if (this.hasExcessiveCaps(trimmedText)) {
      return {
        isValid: false,
        error: 'Please avoid using excessive capital letters. Write in a normal tone.'
      };
    }

    // Enhanced client-side bad words check
    if (this.containsBadWords(trimmedText)) {
      return {
        isValid: false,
        error: 'Inappropriate language detected. Please maintain respectful communication in your feedback.'
      };
    }

    // Check for toxicity patterns
    if (this.checkToxicityPatterns(trimmedText)) {
      return {
        isValid: false,
        error: 'Toxic or harmful content detected. Please provide constructive and respectful feedback.'
      };
    }

    // Check for suspicious content
    if (this.containsSuspiciousContent(trimmedText)) {
      return {
        isValid: false,
        error: 'Please provide constructive feedback. Avoid using harsh or inappropriate language.'
      };
    }

    // API-based checks (only working ones)
    try {
      const [profanityAPIResult, alternativeProfanityResult] = await Promise.allSettled([
        this.checkProfanityAPI(trimmedText),
        this.checkAlternativeProfanity(trimmedText)
      ]);

      // Check results from successful API calls
      const apiResults = [
        profanityAPIResult.status === 'fulfilled' ? profanityAPIResult.value : false,
        alternativeProfanityResult.status === 'fulfilled' ? alternativeProfanityResult.value : false
      ];

      // If any API detects inappropriate content
      if (apiResults.some(result => result === true)) {
        return {
          isValid: false,
          error: 'Inappropriate content detected by our filtering system. Please provide constructive and respectful feedback.'
        };
      }

    } catch (error) {
      console.warn('Some content validation APIs failed:', error);
      // Continue with client-side validation even if APIs fail
    }

    // If all checks pass
    return {
      isValid: true,
      error: null
    };
  }
}

export default ContentValidator;