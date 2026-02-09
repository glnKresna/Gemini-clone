export const runChat = async (prompt) => {
    const res = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
        throw new Error("Failed to fetch response");
    }

    return res.json();
};