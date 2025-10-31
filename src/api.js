const BASE_URL = "http://localhost:8000";   // update if needed

export async function createChatSession(userId = "anonymous") {
  const res = await fetch(`${BASE_URL}/chat/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId }),
  });
  return res.json();
}


export async function sendChatMessage(query, sessionId) {
  const res = await fetch(`${BASE_URL}/api/v1/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      session_id: sessionId,
      include_sources: true,
      include_follow_ups: true,
    }),
  });

  return res.json();
}

export async function getChatHistory(sessionId, limit = 20) {
  const res = await fetch(`${BASE_URL}api/v1/chat/sessions/${sessionId}/history?limit=${limit}`);
  return res.json();
}

// api.js
// api.js - updated getDocumentUrl function
export const getDocumentUrl = async (documentId, expiration = 3600) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/documents/${documentId}/url?expiration=${expiration}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get document URL: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Based on your API response, the URL is in data.data.url
    if (data.success && data.data && data.data.url) {
      return data.data.url;
    } else {
      console.error("Invalid response format from document URL endpoint:", data);
      return null;
    }
  } catch (error) {
    console.error("Error getting document URL:", error);
    return null;
  }
};


export const getDocumentImage = (documentId) => {
  return `${BASE_URL}/api/v1/documents/${documentId}/download`;
};
