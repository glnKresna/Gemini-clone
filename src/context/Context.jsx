import { createContext, useState } from "react";
import { runChat } from "../services/ChatService";

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]); 
    const [prevPrompts, setPrevPrompts] = useState([]); 
    const [currentChatId, setCurrentChatId] = useState(null); 
    
    const newChat = () => {
        setLoading(false);
        setMessages([]);
        setCurrentChatId(null);
    };

    const loadChat = (chatId) => {
        const chatSession = prevPrompts.find(chat => chat.id === chatId);
        if (chatSession) {
            setMessages(chatSession.messages);
            setCurrentChatId(chatId);
        }
    };

    const saveToHistory = (chatId, updatedMessages) => {
        setPrevPrompts(prev => {
            const existingIndex = prev.findIndex(item => item.id === chatId);
            
            if (existingIndex > -1) {
                const updatedHistory = [...prev];
                updatedHistory[existingIndex] = { 
                    ...updatedHistory[existingIndex], 
                    messages: updatedMessages 
                };
                return updatedHistory;
            } 

            return [{
                id: chatId,
                title: updatedMessages[0]?.content.substring(0, 20) + "...",
                messages: updatedMessages
            }, ...prev];
        });
    };

    const streamText = (index, nextWord) => {
        setTimeout(function () {
            setMessages(prev => {
                const newMessages = [...prev];
                const lastMsg = newMessages[newMessages.length - 1];
                lastMsg.content += nextWord;
                return newMessages;
            });
        }, 20 * index);
    };

    const onSent = async (prompt) => {
        const finalInput = prompt || input;
        setInput("");
        setLoading(true);

        let chatId = currentChatId;
        if (!chatId) {
            chatId = Date.now();
            setCurrentChatId(chatId);
        }

        const userMessage = { role: "user", content: finalInput };
        
        let updatedMsgs = [...messages, userMessage]; 
        setMessages(updatedMsgs);

        const aiPlaceholder = { role: "model", content: "" };
        updatedMsgs = [...updatedMsgs, aiPlaceholder];
        setMessages(updatedMsgs);

        try {
            const response = await runChat(finalInput);
            
            saveToHistory(chatId, updatedMsgs);

            let responseArray = response.reply.split(" ");
            for (let i = 0; i < responseArray.length; i++) {
                const nextWord = responseArray[i];
                streamText(i, nextWord + " ");
            }
            
            setTimeout(() => {
                setPrevPrompts(prev => {
                    const existingIndex = prev.findIndex(item => item.id === chatId);
                    if (existingIndex > -1) {
                        const updatedHistory = [...prev];
                        const msgs = [...updatedMsgs];
                        msgs[msgs.length -1].content = response.reply; 
                        updatedHistory[existingIndex].messages = msgs;
                        return updatedHistory;
                    }
                    return prev;
                })
            }, 20 * responseArray.length + 100);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        loading,
        input,
        setInput,
        messages,
        newChat,
        loadChat  
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;