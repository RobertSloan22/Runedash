import { useState } from 'react';
import './chat.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer } from '@chatscope/chat-ui-kit-react';
import { ChatContainer } from '@chatscope/chat-ui-kit-react';
import { MessageList } from '@chatscope/chat-ui-kit-react';
import { Message } from '@chatscope/chat-ui-kit-react';
import { MessageInput } from '@chatscope/chat-ui-kit-react';
import { TypingIndicator } from '@chatscope/chat-ui-kit-react';


const systemMessage = {
  "role": "system",
  "content": `This multi-container application is designed to comprehensively collect, process, forecast, and visualize data related to the cryptocurrency project "runes." The architecture employs multiple Docker containers, each fulfilling a specific role within the system...`
};

function ChatGPT() {
  const [messages, setMessages] = useState([
    {
      message: "Welcome to Robert A. Sloan's Profile, How can I help you?",
      sentTime: "just now",
      sender: "Robert A. Sloan's AI"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };

    const newMessages = [...messages, newMessage];
    
    setMessages(newMessages);

    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
      return { role, content: messageObject.message };
    });

    const apiRequestBody = {
      "model": "gpt-4",
      "messages": [
        systemMessage,
        ...apiMessages
      ],
      "stream": true
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify(apiRequestBody)
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let done = false;
    let accumulatedMessage = "";

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      accumulatedMessage += decoder.decode(value, { stream: true });

      const messageParts = accumulatedMessage.split("\n\n").filter(Boolean);

      messageParts.forEach((messagePart, index) => {
        if (messagePart.startsWith("data: ")) {
          const jsonString = messagePart.replace("data: ", "").trim();
          if (jsonString !== "[DONE]") {
            try {
              const parsedResponse = JSON.parse(jsonString);
              const content = parsedResponse.choices?.[0]?.delta?.content || "";
              if (content) {
                setMessages((prevMessages) => {
                  const lastMessage = prevMessages[prevMessages.length - 1];
                  if (lastMessage.sender === "ChatGPT") {
                    lastMessage.message += content;
                    return [...prevMessages];
                  } else {
                    return [...prevMessages, { message: content, sender: "ChatGPT" }];
                  }
                });
              }
            } catch (error) {
              console.error("Error parsing JSON:", error);
            }
          }
        }
      });

      accumulatedMessage = messageParts[messageParts.length - 1];
    }

    setIsTyping(false);
  }

  return (
    <div className="ChatGPT">
      <div style={{ position:"relative", height: "575px", width: "350px" }}>
        <MainContainer>
          <ChatContainer>       
            <MessageList 
              scrollBehavior="smooth" 
              typingIndicator={isTyping ? <TypingIndicator content="Robert's AI is responding" /> : null}
            >
              {messages.map((message, i) => (
                <Message key={i} model={message} />
              ))}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />        
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default ChatGPT;
