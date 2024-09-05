import { useState } from 'react'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer } from '@chatscope/chat-ui-kit-react'; 
import { ChatContainer } from '@chatscope/chat-ui-kit-react';
import { MessageList }  from '@chatscope/chat-ui-kit-react';
import { Message } from '@chatscope/chat-ui-kit-react';
import { MessageInput } from '@chatscope/chat-ui-kit-react';
import { TypingIndicator } from '@chatscope/chat-ui-kit-react';

const systemMessage = {
  "role": "system",
  "content": `This multi-container application is designed to comprehensively collect, process, forecast, and visualize data related to the cryptocurrency project "runes." The architecture employs multiple Docker containers, each fulfilling a specific role within the system. The application is designed to be modular, scalable, and efficient, allowing for real-time data handling, forecasting, and user interaction through a React-based frontend dashboard.

Containers Overview:

- **Rune API (rune_api)**: Collects data from the Genidata.io APIs and stores it in PostgreSQL and MongoDB databases.
- **Discord API (discord_api)**: Collects Discord channel chat conversations and stores them in the database for cross-referencing and domain knowledge validation.
- **Flask Forecasting API (flask_api_forecasting)**: Processes rune data, builds and trains machine learning models, and provides forecasting services.
- **Node API Server (node_api_server)**: Handles the retrieval and serving of extensive time series data to the React frontend.
- **React App (react_app)**: Provides a user interface for monitoring system performance, viewing forecasts, historical data, and logs.
- **Training Model Module (training_model_module)**: Facilitates regular retraining of machine learning models.
- **CAdvisor (cadvisor)**: Monitors Docker containers' performance and system statistics.
- **Grafana and Prometheus**: Provides real-time monitoring and metric collection for the entire application.
- **Redis (redis)**: Acts as a caching layer for the node_api_server.
- **Flask Mongo API (flask_mongo_api)**: Serves rune predictions and data directly from MongoDB.

Real-Time Monitoring and Status Updates:

Each service in the ecosystem has a /health endpoint that provides a real-time status check. This health check is displayed on the React dashboard using indicators. The application also provides real-time status updates throughout the forecasting and model training processes.

How It Works:

- **Data Collection**: The rune_api collects rune data from Genidata.io and stores it in both PostgreSQL and MongoDB. The discord_api gathers relevant Discord conversations.
- **Forecasting**: The flask_api_forecasting module processes rune data through an LSTM model, generating forecasts every 5 minutes.
- **Data Serving**: The node_api_server handles the retrieval and caching of time series data. The flask_mongo_api provides access to prediction data.
- **User Interaction**: The React frontend displays real-time health indicators, forecast data, historical values, logs, and Discord summaries.
- **Monitoring**: CAdvisor, Grafana, and Prometheus provide comprehensive monitoring of system performance.

Deployment Instructions:

- **Build and Start Services**: Use 'docker-compose up --build' to build and start services.
- **Verify Service Health**: Access the React app at 'http://your_server_ip:3000' to verify system health and functionality.
- **Monitor the System**: Utilize CAdvisor, Grafana, and Prometheus to track container performance and system metrics.

Conclusion:

This multi-container application provides a robust, scalable platform for collecting, processing, forecasting, and visualizing data related to the "runes" cryptocurrency project.`
};

function ChatWidget() {
  const [messages, setMessages] = useState([
    {
      message: "I am your banking assistant! How can i help you today?",
      sentTime: "just now",
      sender: "ChatGPT"
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

    // Initial system message to determine ChatGPT functionality
    // How it responds, how it talks, etc.
    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) { // messages is an array of messages
    // Format messages for chatGPT API
    // API is expecting objects in format of { role: "user" or "assistant", "content": "message here"}
    // So we need to reformat

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message}
    });


    // Get the request body set up with the model we plan to use
    // and the messages which we formatted above. We add a system message in the front to'
    // determine how we want chatGPT to act. 
    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,  // The system message DEFINES the logic of our chatGPT
        ...apiMessages // The messages from our chat with ChatGPT
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions", 
    {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      console.log(data);
      setMessages([...chatMessages, {
        message: data.choices[0].message.content,
        sender: "ChatGPT"
      }]);
      setIsTyping(false);
    });
  }

  return (
    <div className="ChatGPT">
      <div style={{ position:"relative", height: "800px", width: "700px"  }}>
        <MainContainer>
          <ChatContainer>       
            <MessageList 
              scrollBehavior="smooth" 
              typingIndicator={isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null}
            >
              {messages.map((message, i) => {
                console.log(message)
                return <Message key={i} model={message} />
              })}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />        
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  )
}

export default ChatWidget
