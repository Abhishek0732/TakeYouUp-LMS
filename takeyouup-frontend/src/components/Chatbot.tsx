import { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"


const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const chatbotRef = useRef(null);
    const lastMessageRef = useRef(null);

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { text: input, sender: 'user' };
        const botMessage = { text: 'Thinking...', sender: 'bot' };

        setMessages((prev) => [...prev, userMessage, botMessage]);

        setTimeout(() => {
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.sender === 'bot' && msg.text === 'Thinking...'
                        ? { ...msg, text: 'Here is a response from the bot!' }
                        : msg
                )
            );
        }, 1500);

        setInput('');
    };

    const handleToggleChatbot = (e) => {
        e.stopPropagation();
        setIsOpen((prev) => !prev);
    };

    useEffect(() => {
        if (isOpen && lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (chatbotRef.current && !chatbotRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div>
            <div
                className="fixed bottom-5 right-5 p-3 bg-blue-500 text-white rounded-full cursor-pointer shadow-lg"
                onClick={handleToggleChatbot}
            >
                <span className="text-xl">{isOpen ? 'X' : '💬'}</span>
            </div>

            {isOpen && (
                <div
                    ref={chatbotRef}
                    className="fixed bottom-5 right-5 w-80 h-96 bg-gradient-primary border border-gray-300 rounded-lg shadow-lg"
                >
                    <div className="flex flex-col h-full">
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {messages.map((msg, index) => (

                                <div
                                    key={index}
                                    className={`flex ${
                                        msg.sender === 'user' ? 'justify-end' : 'justify-start'
                                    }`}
                                >
                                <Card
                                    key={index}
                                    className={`p-2 max-w-[75%] ${msg.sender === 'bot' ? 'ttext-muted-foreground' : 'text-muted-foreground'} hover:border-primary transition-all  rounded-lg`}
                                >
                                    {msg.text}
                                </Card>
                                </div>
                            ))}
                            <div ref={lastMessageRef} />
                        </div>
                        <div className="p-4 ">
                            <Input
                                placeholder="Type a message..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <button
                                onClick={handleSendMessage}
                                className="mt-2 w-full py-2 bg-blue-500 text-white rounded-lg"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;