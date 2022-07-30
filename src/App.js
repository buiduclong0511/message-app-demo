import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import './App.css';

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [value, setValue] = useState('');
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const socket = useRef(null);

    useEffect(() => {
        socket.current = io('https://buiduclong-mesage-app.herokuapp.com/');
        socket.current.on('get_users', (data) => {
            setUsers(data.users);
        });
        socket.current.on('get_messages', (data) => {
            setMessages(data.messages);
        });

        return () => socket.current.emit('out');
    }, []);

    const handleChangeName = (e) => {
        setValue(e.target.value);
    };

    const handleJoin = () => {
        socket.current.emit('join', {
            name: value.trim(),
        });
        setLoggedIn(true);
    };

    const handleChangeMessage = (e) => {
        setNewMessage(e.target.value);
    };

    const handleSendMessage = () => {
        socket.current.emit('send_message', {
            message: newMessage.trim(),
        });
        setNewMessage('');
    };

    return (
        <div className="App">
            {!loggedIn ? (
                <>
                    <input value={value} onChange={handleChangeName} />
                    <button disabled={!value.trim()} onClick={handleJoin}>
                        Join
                    </button>
                </>
            ) : (
                <>
                    <input value={newMessage} onChange={handleChangeMessage} />
                    <button onClick={handleSendMessage}>Send</button>
                    {messages.map((message) => (
                        <li key={message.id}>
                            <b>{message.user.name}:</b>
                            {message.content}
                        </li>
                    ))}
                </>
            )}
        </div>
    );
}

export default App;
