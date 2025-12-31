# Learnings

## Episode Data Parsing Issue

- **Problem**: Episode cards for "Ancient Rhetoric" and "Pancakes to Processors" were displaying "undefined" or missing key takeaways. The issue was traced to the `extractTakeaways` function in `script.js` failing to parse descriptions that lacked specific formatting (newlines and explicit "Key Takeaways" headers).
- **Action**: Manually reformatted the descriptions in `episodes_data.js` to include clear line breaks and "Key Takeaways:" headers.
- **Future**: When adding new episodes, ensure the description follows the structured format (Description \n\n 
- **Key Takeaways** \n • Point 1...). Alternatively, enhance the regex logic in `script.js` to be more permissible with unstructured text.

- **Problem**: The "Orbit" component cards were invisible upon rendering. 
- **Action**: Discovered that the reused createCard function applied an inline opacity: 0 style intended for a different staggered grid animation. Removed this inline style immediately after card creation in the Orbit module.
- **Future**: When reusing UI generation functions, check for hidden state or inline styles that assume a specific context (like an entrance animation). Explicitly reset critical properties (opacity, transform) when repurposing elements.
