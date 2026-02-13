export const runChat = async (prompt, history = []) => {
    const API_URL = import.meta.env.DEV 
        ? "http://localhost:3001/api/chat" 
        : "/api/chat";

    const res = await fetch(API_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({ prompt, history }), 
    });

    if (!res.ok) {
        throw new Error("Failed to fetch response");
    }

    return res.json();
};