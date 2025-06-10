import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatbotService, AskQuestionRequest, ChatbotError } from '../../services/chatbot';
import { clearTokens } from '../../utils/auth';
import './FloatingChatbot.css';

interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
}

export const FloatingChatbot: React.FC = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: input,
            isUser: true,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const request: AskQuestionRequest = {
                lessonId: 'demo',
                question: input
            };

            const response = await chatbotService.askQuestion(request);
            
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: response.answer,
                isUser: false,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error asking question:', error);
            
            let errorMessage: string;
            let shouldLogout = false;

            if (error instanceof ChatbotError) {
                errorMessage = error.message;
                if (error.status === 401) {
                    shouldLogout = true;
                }
            } else {
                errorMessage = 'Sorry, I encountered an error while processing your question. Please try again.';
            }

            const errorResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: errorMessage,
                isUser: false,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, errorResponse]);

            if (shouldLogout) {
                clearTokens();
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`floating-chatbot ${isOpen ? 'open' : ''}`}>
            <button 
                className="chatbot-toggle"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? 'Close chat' : 'Open chat'}
            >
                {isOpen ? '×' : '💬'}
            </button>
            
            {isOpen && (
                <div className="chatbot-container">
                    <div className="chatbot-header">
                        <h3>Novademy Assistant</h3>
                        <p>Ask me anything about our courses</p>
                    </div>
                    
                    <div className="chatbot-messages">
                        {messages.length === 0 && (
                            <div className="welcome-message">
                                <p>👋 Hi! I'm your Novademy assistant. I can help you learn more about our courses and answer your questions.</p>
                                <p>Try asking me:</p>
                                <ul>
                                    <li>What courses do you offer?</li>
                                    <li>How does the subscription work?</li>
                                    <li>Tell me about your teaching methods</li>
                                </ul>
                            </div>
                        )}
                        {messages.map(message => (
                            <div
                                key={message.id}
                                className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}
                            >
                                <div className="message-content">
                                    {message.text}
                                </div>
                                <div className="message-timestamp">
                                    {message.timestamp.toLocaleTimeString()}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="message bot-message">
                                <div className="message-content loading">
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSubmit} className="chatbot-input">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything..."
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading || !input.trim()}>
                            Send
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}; 