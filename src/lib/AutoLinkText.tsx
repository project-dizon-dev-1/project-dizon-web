import { Fragment } from "react";

/**
 * AutoLinkText Component
 * 
 * This component automatically converts URLs in plain text into clickable hyperlinks.
 * It uses regular expressions to identify URLs in the text and replaces them with
 * anchor (<a>) elements while preserving the rest of the text.
 * 
 * Features:
 * - Detects URLs starting with http://, https://, or www.
 * - Automatically adds https:// protocol to URLs that start with www.
 * - Opens links in a new tab with security attributes (noopener, noreferrer)
 * - Preserves the original text formatting
 * - Styling can be customized with the className prop
 * 
 * Usage example:
 * <AutoLinkText 
 *   text="Check out our website at https://example.com or www.example.org"
 *   className="my-text-style" 
 * />
 * 
 * 
 * @param {Object} props - Component props
 * @param {string} props.text - The text content that may contain URLs to be converted to links
 * @param {string} props.className - Optional CSS class to apply to the text container
 * @returns {JSX.Element | null} - Fragment containing text with clickable links or null if text is empty
 */
const AutoLinkText = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  // Return null if no text is provided
  if (!text) return null;

  // Regular expression to match URLs
  // This pattern matches:
  // - URLs starting with http:// or https:// (captured in group 1)
  // - URLs starting with www. (captured in group 2)
  // The \s+ ensures URLs are separated by whitespace
  const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/g;

  // Split the text by URLs and create an array of text and link elements
  const parts = [];
  let lastIndex = 0;
  let match;

  // Iterate through all URL matches in the text
  while ((match = urlRegex.exec(text)) !== null) {
    // Add any text that appears before the current URL match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const url = match[0]; // The matched URL
    
    // If URL starts with www., add https:// protocol, otherwise use as is
    const href = url.startsWith("www.") ? `https://${url}` : url;

    // Create an anchor element for the URL
    parts.push(
      <a
        key={match.index}
        href={href}
        target="_blank" // Open in new tab
        rel="noopener noreferrer" // Security best practice for target="_blank"
        className="text-blue-600 hover:underline"
      >
        {url} {/* Display the original URL text */}
      </a>
    );

    // Update the lastIndex to continue after this URL
    lastIndex = match.index + url.length;
  }

  // Add any remaining text after the last URL
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  // Render all parts (text and links) in sequence
  return (
    <span className={className}>
      {parts.map((part, i) => (
        <Fragment key={i}>{part}</Fragment>
      ))}
    </span>
  );
};

export default AutoLinkText;
