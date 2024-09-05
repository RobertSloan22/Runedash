// create a simple chat component
import React from 'react';
import './ChatComponent.css';
import { useState } from 'react';
import { Button, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'


const useStyles = makeStyles({
    button: {
        backgroundColor: 'black',
        color: 'white',
        '&:hover': {
        backgroundColor: 'white',
        color: 'black',
        }
    }
    })

function ChatComponent() {
    const classes = useStyles();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const sendMessage = () => {
        setMessages([...messages, input]);
        setInput('');
    }

    return (
        <div className="chat">
            <div className="chat__messages">
                {messages.map((message) => (
                    <p>{message}</p>
                ))}
            </div>
            <div className="chat__input">
                <TextField
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    label="Enter a message"
                    variant="outlined"
                    fullWidth
                />
                <Button
                    onClick={sendMessage}
                    className={classes.button}
                >
                    Send
                </Button>
            </div>
        </div>
    );
}

export default ChatComponent;