import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import DocumentImage from "./DocumentImage";
import DocumentReference from "./DocumentReference"; // Added import for document rendering

const normalizeMarkdown = (text) => {
  if (!text) return "";
  return text
    .replace(/^(#+ )/gm, "\n$1")
    .replace(/!\[(.*?)\]\((.*?)\)/g, "![$1]($2)\n\n")
    .replace(/^(\s*[-*+] )/gm, "\n$1")
    .replace(/^(\s*\d+\. )/gm, "\n$1")
    .replace(/\n(#{2,} )/g, "\n\n$1")
    .replace(/\n{3,}/g, "\n\n");
};

const ChatMessage = ({ message, onFollowUpClick }) => {
  console.log("Rendering message:", message);

  if (message.from === "user") {
    return (
      <div className="px-4 py-2 rounded-2xl bg-blue-600 text-white">
        {message.text}
      </div>
    );
  }
// Add follow-up buttons at the end of your component
  const renderFollowUps = () => {
    if (message.followUps && message.followUps.length > 0) {
      return (
        <div className="mt-3">
          <div className="text-xs text-gray-600 font-medium mb-1">Follow-up questions:</div>
          <div className="flex flex-wrap gap-2">
            {message.followUps.map((question, idx) => (
              <button
                key={idx}
                onClick={() => onFollowUpClick && onFollowUpClick(question)}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };
  const text = message.text || "";

  // Check if the message contains an image reference
  const imageRegex = /!\[(.*?)\]\(image:(.*?)\)/;
  const match = text.match(imageRegex);

  console.log("Image match:", match);

  if (match) {
    const [fullMatch, altText, documentId] = match;
    console.log("Found image reference:", { altText, documentId });

    const parts = text.split(fullMatch);
    const beforeImage = parts[0];
    const afterImage = parts[1] || "";

    return (
      <div className="px-4 py-2 rounded-2xl bg-white border text-gray-900">
        {beforeImage && (
          <div className="prose prose-sm max-w-none overflow-hidden">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {normalizeMarkdown(beforeImage)}
            </ReactMarkdown>
          </div>
        )}
        <DocumentImage documentId={documentId} alt={altText} />
        {afterImage && (
          <div className="prose prose-sm max-w-none overflow-hidden">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {normalizeMarkdown(afterImage)}
            </ReactMarkdown>
          </div>
        )}
        {renderFollowUps()}
      </div>
    );
  }

  // New document detection logic (docx files)
  const tableRowRegex = /\|\s*([^|\n]+\.docx)\s*\|\s*([^|\n]+)\s*\|/i;
  const docMatch = text.match(tableRowRegex);

  if (docMatch) {
    const [fullMatch, title, type] = docMatch;
    const cleanTitle = title.trim();
    const cleanType = type.trim();

    const matchingSource = message.sources?.find(
      (source) => source.title === cleanTitle || source.metadata?.title === cleanTitle
    );
    const documentId = matchingSource?.id || cleanTitle;

    return (
      <div className="px-4 py-2 rounded-2xl bg-white border text-gray-900">
        <div className="prose prose-sm max-w-none overflow-hidden">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              table: ({ node, ...props }) => {
                // Hide the table row containing the document info
                if (fullMatch && props.children && props.children.toString().includes(cleanTitle)) {
                  return null;
                }
                return <table className="min-w-full divide-y divide-gray-300 my-4" {...props} />;
              },
              img: ({ node, ...props }) => {
                const src = props.src;
                if (src && src.startsWith('image:')) {
                  const imageId = src.replace('image:', '');
                  return <DocumentImage documentId={imageId} alt={props.alt} />;
                }
                return (
                  <div className="my-4 flex justify-center">
                    <img
                      {...props}
                      className="rounded-lg shadow-md max-h-80 object-contain"
                      onError={(e) => {
                        console.error("Image failed to load:", props.src);
                        e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Available";
                      }}
                    />
                  </div>
                );
              },
              h1: ({ node, ...props }) => (
                <h1 {...props} className="text-xl font-bold mt-4 mb-2" />
              ),
              h2: ({ node, ...props }) => (
                <h2 {...props} className="text-lg font-bold mt-4 mb-2 text-blue-700" />
              ),
              ul: ({ node, ...props }) => (
                <ul {...props} className="list-disc pl-6 my-2" />
              ),
              ol: ({ node, ...props }) => (
                <ol {...props} className="list-decimal pl-6 my-2" />
              ),
              li: ({ node, ...props }) => (
                <li {...props} className="my-1" />
              ),
              p: ({ node, ...props }) => (
                <p {...props} className="my-2" />
              ),
              strong: ({ node, ...props }) => (
                <strong {...props} className="font-bold text-gray-900" />
              ),
            }}
          >
            {normalizeMarkdown(text)}
          </ReactMarkdown>
        </div>
        <DocumentReference title={cleanTitle} type={cleanType} documentId={documentId} />
         {renderFollowUps()}
      </div>
    );
  }

  // Regular markdown rendering for messages without image or document references
  return (
    <div className="px-4 py-2 rounded-2xl bg-white border text-gray-900">
      <div className="prose prose-sm max-w-none overflow-hidden">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            img: ({ node, ...props }) => {
              console.log("Regular image props:", props);
              const src = props.src;
              
              if (src && src.startsWith('image:')) {
                const imageId = src.replace('image:', '');
                return <DocumentImage documentId={imageId} alt={props.alt} />;
              }
              
              return (
                <div className="my-4 flex justify-center">
                  <img 
                    {...props} 
                    className="rounded-lg shadow-md max-h-80 object-contain"
                    onError={(e) => {
                      console.error("Image failed to load:", props.src);
                      e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Available";
                    }}
                  />
                </div>
              );
            },
            h1: ({ node, ...props }) => (
              <h1 {...props} className="text-xl font-bold mt-4 mb-2" />
            ),
            h2: ({ node, ...props }) => (
              <h2 {...props} className="text-lg font-bold mt-4 mb-2 text-blue-700" />
            ),
            ul: ({ node, ...props }) => (
              <ul {...props} className="list-disc pl-6 my-2" />
            ),
            ol: ({ node, ...props }) => (
              <ol {...props} className="list-decimal pl-6 my-2" />
            ),
            li: ({ node, ...props }) => (
              <li {...props} className="my-1" />
            ),
            p: ({ node, ...props }) => (
              <p {...props} className="my-2" />
            ),
            strong: ({ node, ...props }) => (
              <strong {...props} className="font-bold text-gray-900" />
            )
          }}
        >
          {normalizeMarkdown(message.text)}
        </ReactMarkdown>
      </div>
      {renderFollowUps()}
    </div>
  );
};

export default ChatMessage;

