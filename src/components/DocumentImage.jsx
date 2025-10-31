import React, { useState } from "react";

const BASE_URL = "http://localhost:8000";

const DocumentImage = ({ documentId, alt }) => {
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const imageUrl = `${BASE_URL}/api/v1/documents/${documentId}/download`;

  return (
    <>
      <div className="my-4 flex justify-center">
        {loading && (
          <div className="flex items-center justify-center h-40 w-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
          </div>
        )}

        <img
          src={imageUrl}
          alt={alt || "Document image"}
          className={`rounded-lg shadow-md max-h-96 object-contain cursor-pointer ${
            loading ? "hidden" : ""
          }`}
          onLoad={() => setLoading(false)}
          onClick={() => setIsModalOpen(true)}
          onError={(e) => {
            console.error("Image failed:", imageUrl);
            setLoading(false);
            e.target.src = "/no-image.png";  // ✅ fallback
          }}
        />
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="max-w-4xl max-h-screen p-4">
            <img
              src={imageUrl}
              alt={alt || "Document image"}
              className="max-h-[90vh] max-w-full object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DocumentImage;
