import React, { useState, useRef, useEffect } from 'react';
import { chatbotService, AskQuestionRequest } from '../../services/chatbot';
import './Chatbot.css';

interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
}

interface ChatbotProps {
    lessonId: string;
}

export const Chatbot: React.FC<ChatbotProps> = ({ lessonId }) => {
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
                lessonId,
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
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: 'Sorry, I encountered an error while processing your question. Please try again.',
                isUser: false,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">
                <h3>Lesson Assistant</h3>
                <p>Ask questions about the current lesson</p>
            </div>
            
            <div className="chatbot-messages">
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
                    placeholder="Ask a question about the lesson..."
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading || !input.trim()}>
                    Send
                </button>
            </form>
        </div>
    );
}; 