import React, { useContext, useEffect, useRef } from 'react';
import './Main.css';
import { assets }  from '../../assets/assets';
import { Context } from '../../context/Context';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import TextareaAutosize from 'react-textarea-autosize';

const Main = () => {
    const {onSent, recentPrompt, showResult, loading, resultData, input, setInput, messages} = useContext(Context);

    // End-of-chat reference
    const messageEndRef = useRef(null);

    // Trigger scroll when messages updates
    useEffect(() => {
        toBottom();
    }, [messages, resultData]);

    // Scroll function
    const toBottom = () => {
        messageEndRef.current?.scrollIntoView({behavior: "smooth"});
    }

    return (
        <div className='main'>
            <div className="nav">
                <p>Gemini</p>
                <img src={assets.user_icon} alt="" className='icon-size'/>
            </div>

            <div className="main-container">

                {messages.length === 0 ? 
                    <>
                        <div className="greet">
                        <p><span>Hello, Galan</span></p>
                        <p>How can I help you today?</p>
                    </div>

                    <div className="cards">
                        <div className="card">
                            <p>Suggest beautiful places for an upcoming road trip</p>
                            <img src={assets.compass_icon} alt="" />
                        </div>

                        <div className="card">
                            <p>Summarize the concept of urban planning</p>
                            <img src={assets.bulb_icon} alt="" />
                        </div>

                        <div className="card">
                            <p>Brainstorm team-bonding activites for our work retreat</p>
                            <img src={assets.message_icon} alt="" />
                        </div>

                        <div className="card">
                            <p>Improvise readability of the following code</p>
                            <img src={assets.code_icon} alt="" />
                        </div>
                    </div>
                    </>
                    : <div className='result'>
                        {/* Message components */}
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.role}`}>
                                <img src={msg.role === "user" ? assets.user_icon : assets.gemini_icon} alt=""/>

                                <div className="message-content">
                                    <ReactMarkdown remarkPlugins={remarkGfm}>
                                    {msg.content}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        ))}

                        {/* Loader */}
                        {loading && (
                            <div className="message assistant">
                                <img src={assets.gemini_icon} alt="" />
                                <div className="message-content loading">
                                    <div className="loader">
                                        <hr />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* End-of-chat anchor */}
                        <div ref={messageEndRef}> </div>
                    </div>
                }

                <div className="main-bottom">
                    <div className="search-box">
                        <TextareaAutosize className="search-input" onChange={(e)=>setInput(e.target.value)} value={input} type="text" placeholder='Enter prompt here'/>

                        <div>
                            <img src={assets.gallery_icon} alt="" />
                            <img src={assets.mic_icon} alt="" />
                            <img onClick={()=>onSent(input)} src={assets.send_icon} alt="" />
                        </div>
                    </div>
                    <p className="bottom-info">Gemini may display inaccurate info, including about people, so double-check its responses. Your privacy and Gemini Apps</p>
                </div>
            </div>
        </div>
    )
}

export default Main
