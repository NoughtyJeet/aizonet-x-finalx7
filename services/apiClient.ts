
export const fetchAISummary = async (toolName: string, description: string) => {
  try {
    const response = await fetch("/api/ai/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toolName, description }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to fetch summary");
    }
    return await response.json();
  } catch (error) {
    console.error("Summary Fetch Error:", error);
    throw error;
  }
};

export const fetchAIChat = async (history: { role: string; parts: { text: string }[] }[]) => {
  try {
    const response = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ history }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to fetch chat");
    }
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Chat Fetch Error:", error);
    throw error;
  }
};

export const fetchAIComparison = async (tool1: any, tool2: any, tool3?: any) => {
  try {
    const response = await fetch("/api/ai/compare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tool1, tool2, tool3 }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to fetch comparison");
    }
    return await response.json();
  } catch (error) {
    console.error("Comparison Fetch Error:", error);
    throw error;
  }
};
