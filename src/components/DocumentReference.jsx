import React from "react";
import { getDocumentUrl } from "../api";

const API_BASE_URL = "http://localhost:8000"; 

const DocIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
  </svg>
);

const DocumentReference = ({ title, type, documentId }) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  
  const handleDocumentClick = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = await getDocumentUrl(documentId);
      if (url) {
        window.open(url, '_blank');
      } else {
        setError("Could not retrieve document URL");
      }
    } catch (err) {
      setError("Failed to open document");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-4 border border-gray-200 rounded-lg p-3 bg-gray-50">
      <div className="flex items-center">
        <div className="mr-3">
          <DocIcon />
        </div>
        <div className="flex-grow">
          <h4 className="text-sm font-medium text-gray-900">{title}</h4>
          <p className="text-xs text-gray-500">{type}</p>
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleDocumentClick}
            disabled={loading}
            className={`px-3 py-1 text-xs font-medium text-white ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} rounded transition-colors flex items-center`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading
              </>
            ) : (
              "View"
            )}
          </button>
          <a
            href={`${API_BASE_URL}/api/v1/documents/${documentId}/download`}
            download={title}
            className="px-3 py-1 text-xs font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
          >
            Download
          </a>
        </div>
      </div>
    </div>
  );
};

export default DocumentReference;
