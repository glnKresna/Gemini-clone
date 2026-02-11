import { createContext, useState } from "react";
import { runChat } from "../services/ChatService"

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompt, setPrevPrompt] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const [messages, setMessages] = useState([]);

    // Typing effect functionality
    const streamText = (index, nextWord) => {
        setTimeout(function () {
            setMessages(prev => {
                const newMessages = [...prev];
                const lastMsg = newMessages[newMessages.length - 1];
                
                lastMsg.content += nextWord;
                
                return newMessages;
            });
        }, 20 * index); // 20ms delay per word
    }

    // User to AI message flow
    const onSent = async (prompt) => {
        // 1. Handle Input & Reset State
        const finalInput = prompt || input;
        setInput(""); // Clear input immediately so it doesn't get stuck
        setResultData("");
        setLoading(true);
        setShowResult(true);
        
        // 2. Add USER message to chat history
        setMessages(prev => [...prev, { role: "user", content: finalInput }]);
        
        // 3. Add a placeholder for AI response
        setMessages(prev => [...prev, { role: "model", content: "" }]);

        try {
            // 4. API Call
            // returns an object like { reply: "..." }
            const response = await runChat(finalInput); 

            // 5. The Streaming Magic (Simulated)
            // FIX: Access 'response.reply' instead of just 'response'
            let responseArray = response.reply.split(" "); 
            
            for (let i = 0; i < responseArray.length; i++) {
                const nextWord = responseArray[i];
                streamText(i, nextWord + " ");
            }

        } catch (error) {
            console.error("Error in onSent:", error);
            // Handle error visually in chat
            setMessages(prev => {
                const newMessages = [...prev];
                // Update the last "empty" model message to show error
                newMessages[newMessages.length - 1].content = "Error: Could not fetch response.";
                return newMessages;
            });
        } finally {
            setLoading(false); // Ensure loading stops even if there's an error
        }
    };

    const contextValue = {
        prevPrompt,
        setPrevPrompt,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        messages,
        setMessages
    }

    return (
        <Context.Provider value = {contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;
