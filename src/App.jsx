import { useState } from 'react';
import styles from './App.module.css';
import { Chat, Controls, Loader } from './components';
import { GoogleGenAIService } from './services';
// import { OpenAIService } from './services';

function App() {
  const googleGenAIService = new GoogleGenAIService();
  // const openAIService = new OpenAIService();

  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  const [messages, setMessages] = useState([]);

  function updateLastMessageContent(content) {
    setMessages((prevMessages) =>
      prevMessages.map((message, index) =>
        index === prevMessages.length - 1 ? { ...message, content: `${message.content}${content}` } : message
      )
    );
  }

  function addMessage(message) {
    setMessages((prevMessages) => [...prevMessages, message]);
  }

  // async function handleContentSend(content) {
  //   setIsLoading(true);
  //   addMessage({ content, role: 'user' });

  //   try {
  //     const result = await openAIService.chat(content, messages);
  //     addMessage({ content: result, role: 'assistant' });
  //   } catch (error) {
  //     console.error('Error during chat:', error);
  //     addMessage({
  //       content: "Sorry, I couldn't process your request. Please try again!",
  //       role: 'system'
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  async function handleContentSend(content) {
    setIsLoading(true);
    addMessage({ content, role: 'user' });

    try {
      const result = await googleGenAIService.chatStream(content);

      let isFirstChunk = false;

      for await (const chunk of result) {
        if (!isFirstChunk) {
          isFirstChunk = true;
          addMessage({ content: '', role: 'assistant' });
          setIsLoading(false);
          setIsStreaming(true);
        }

        updateLastMessageContent(chunk);
      }

      setIsStreaming(false);
    } catch (error) {
      console.error('Error during chat:', error);

      addMessage({
        content: "Sorry, I couldn't process your request. Please try again!",
        role: 'system'
      });

      setIsLoading(false);
      setIsStreaming(false);
    }
  }

  return (
    <div className={styles.App}>
      {isLoading && <Loader />}
      <header className={styles.Header}>
        <img className={styles.Logo} src="/chat-bot.png" alt="Chatbot Logo" />
        <h2 className={styles.Title}>React AI Chatbot</h2>
      </header>
      <div className={styles.ChatContainer}>
        <Chat messages={messages} />
      </div>
      <Controls isDisabled={isLoading || isStreaming} onSend={handleContentSend} />
    </div>
  );
}

export default App;
