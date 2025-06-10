import React, { useState, useRef, useEffect } from 'react';
import { chatbotService, AskQuestionRequest } from '../../services/chatbot';
import './PackageChatbot.css';

interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
}

interface PackageChatbotProps {
    packageId: string;
    packageTitle: string;
    packageDescription: string;
    packagePrice: number;
}

export const PackageChatbot: React.FC<PackageChatbotProps> = ({
    packageId,
    packageTitle,
    packageDescription,
    packagePrice
}) => {
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
                lessonId: packageId, // Using package ID as context
                question: `Package: ${packageTitle} (${packageDescription}) - Price: $${packagePrice}. Question: ${input}`
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
        <div className="package-chatbot">
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
                        <h3>Package Assistant</h3>
                        <p>Ask me about {packageTitle}</p>
                    </div>
                    
                    <div className="chatbot-messages">
                        {messages.length === 0 && (
                            <div className="welcome-message">
                                <p>👋 Hi! I can help you understand this package better.</p>
                                <p>Try asking me:</p>
                                <ul>
                                    <li>What courses are included in this package?</li>
                                    <li>How long does the subscription last?</li>
                                    <li>What are the benefits of this package?</li>
                                    <li>Can I upgrade or downgrade later?</li>
                                    <li>Is there a refund policy?</li>
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
                            placeholder="Ask about this package..."
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