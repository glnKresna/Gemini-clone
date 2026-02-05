import React from 'react'
import './Main.css'
import { assets }  from '../../assets/assets'

const Main = () => {
    return (
        <div className='main'>
            <div className="nav">
                <p>Gemini</p>
                <img src={assets.user_icon} alt="" className='icon-size'/>
            </div>

            <div className="main-container">
                <div className="greet">
                    <p><span>Hello, Galan</span></p>
                    <p>How can I help you today?</p>
                </div>

                <div className="cards">
                    <div className="card">
                        <p>Bro pikir dia diddyblud einstein</p>
                        <img src={assets.compass_icon} alt="" />
                    </div>

                    <div className="card">
                        <p>Nama Prabowo dimention di epstein file 11x</p>
                        <img src={assets.bulb_icon} alt="" />
                    </div>

                    <div className="card">
                        <p>Cara gooning</p>
                        <img src={assets.message_icon} alt="" />
                    </div>

                    <div className="card">
                        <p>Buatkan pseudocode + implementasi C++ tugas pak mad</p>
                        <img src={assets.code_icon} alt="" />
                    </div>
                </div>

                <div className="main-bottom">
                    <div className="search-box">
                        <input type="text" placeholder='Enter prompt here'/>

                        <div>
                            <img src={assets.gallery_icon} alt="" />
                            <img src={assets.mic_icon} alt="" />
                            <img src={assets.send_icon} alt="" />
                        </div>
                    </div>
                    <p className="bottom-info">Gemini may display inaccurate info, including about people, so double-check its responses. Your privacy and Gemini Apps</p>
                </div>
            </div>
        </div>
    )
}

export default Main
