import { useState } from 'react';
import styles from './App.module.css';
import { Chat } from './components/Chat/Chat';
import { Controls } from './components/Controls/Controls';
import GoogleGenAIService from './services/GoogleGenAiService';

function App() {
  const googleGenAIService = new GoogleGenAIService();

  const [messages, setMessages] = useState([]);

  function addMessage(message) {
    setMessages((prevMessages) => [...prevMessages, message]);
  }

  async function handleContentSend(content) {
    addMessage({ content, role: 'user' });

    try {
      const result = await googleGenAIService.chat(content);
      addMessage({ content: result, role: 'assistant' });
    } catch (error) {
      addMessage({
        content: "Sorry, I couldn't process your request. Please try again!",
        role: 'system'
      });
      console.error('Error during chat:', error);
    }
  }

  return (
    <div className={styles.App}>
      <header className={styles.Header}>
        <img className={styles.Logo} src="/chat-bot.png" alt="Chatbot Logo" />
        <h2 className={styles.Title}>React AI Chatbot</h2>
      </header>
      <div className={styles.ChatContainer}>
        <Chat messages={messages} />
      </div>
      <Controls onSend={handleContentSend} />
    </div>
  );
}

export default App;
