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

    const onSent = async () => {
        if (!input.trim() || loading) return;

        try {
            setLoading(true);
            setShowResult(true);

            setMessages(prev => [
                ...prev,
                { role: "user", content: input }
            ]);

            const data = await runChat(input);

            setMessages(prev => [
                ...prev,
                { role: "ai", content: data.reply }
            ]);

        } catch (err) {
            console.error(err);
            setMessages(prev => [
                ...prev,
                { role: "ai", content: "Something went wrong 😬" }
            ]);
        } finally {
            setLoading(false);
            setInput("");
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
