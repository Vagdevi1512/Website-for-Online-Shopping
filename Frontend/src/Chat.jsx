import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaRegPaperPlane } from 'react-icons/fa';
import Navbar from "./Navbar";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const userId = 'testUser123';

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:9876/chat/${userId}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };
    fetchMessages();
  }, []);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = { type: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await axios.post('http://localhost:9876/chat', {
        userId,
        message: input,
      });

      const aiMessage = { type: 'ai', text: response.data.reply };
      setMessages((prev) => [...prev, aiMessage]);
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [...prev, { type: 'ai', text: 'Error connecting to server' }]);
    }
  };

  const clearChat = async () => {
    try {
      await axios.delete(`http://localhost:9876/chat/${userId}`);
      setMessages([{ type: 'ai', text: 'Chat history cleared! Ready to help you.' }]);
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  };

  return (
    <div>
      <Navbar /> 
      <div className="chat-container bg-gray-100 rounded-lg shadow-md max-w-md mx-auto mt-4">
        <div className="chat-header bg-blue-500 text-white p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-lg font-bold">IIIT Buy-Sell Platform Support</h2>
          <button onClick={clearChat} className="text-sm bg-white text-blue-500 px-2 py-1 rounded hover:bg-gray-100">
            Clear Chat
          </button>
        </div>

        <div className="chat-messages h-96 overflow-y-auto p-4">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-2 max-w-[80%] ${msg.type === 'user' ? 'ml-auto text-right' : 'mr-auto text-left'}`}>
              <span className={`inline-block p-2 rounded-lg ${msg.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                {msg.text}
              </span>
            </div>
          ))}
        </div>

        <div className="chat-input flex p-4 bg-white rounded-b-lg">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className="flex-grow px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600">
            <FaRegPaperPlane />
          </button>
        </div>
      </div>
      <style jsx>{`
         
         body {
            margin: 0;
            padding: 0;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            background-image: url("./src/assets/Chat.jpg");
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            background-repeat: no-repeat;
            text-align: center;
          }

        .chat-container {
          display: flex;
          flex-direction: column;
          width: 700px;
          margin: 20px auto;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: #f9f9f9;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .chat-header {
          text-align: center;
          margin-bottom: 15px;
        }

        .chat-header h2 {
          font-size: 18px;
          color: #333;
        }

        .chat-messages {
          flex-grow: 1;
          padding: 10px;
          overflow-y: auto;
          height: 300px;
          margin-bottom: 15px;
          background-color: #fff;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .chat-messages .user {
          text-align: right;
          color: #0056b3;
          font-weight: bold;
        }

        .chat-messages .ai {
          text-align: left;
          color: #333;
        }

        .chat-input {
          display: flex;
          justify-content: space-between;
        }

        .chat-input input {
          width: 80%;
          padding: 10px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .chat-input button {
          background-color: #0056b3;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 10px 15px;
          cursor: pointer;
        }

        .chat-input button:hover {
          background-color: #004080;
        }

        .chat-input input:focus,
        .chat-input button:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default Chat;