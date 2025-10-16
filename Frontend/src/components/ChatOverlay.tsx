import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
    isTyping?: boolean;
}

interface ChatOverlayProps {
    onClose: () => void;
}

const ChatOverlay: React.FC<ChatOverlayProps> = ({ onClose }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isAiTyping, setIsAiTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Focus input when chat opens, but not if AI is typing (e.g. on re-open)
        if (!isAiTyping) {
            inputRef.current?.focus();
        }
    }, [isAiTyping]);

    const simulateTyping = (text: string, messageId: number) => {
        let currentText = '';
        const words = text.split(' ');
        
        const typeWord = (index: number) => {
            if (index < words.length) {
                currentText += (index === 0 ? '' : ' ') + words[index];
                setMessages(prev => prev.map(msg => 
                    msg.id === messageId 
                        ? { ...msg, text: currentText, isTyping: true }
                        : msg
                ));
                setTimeout(() => typeWord(index + 1), 80); // Adjusted typing speed
            } else {
                setMessages(prev => prev.map(msg => 
                    msg.id === messageId 
                        ? { ...msg, isTyping: false }
                        : msg
                ));
                setIsAiTyping(false);
                inputRef.current?.focus(); // Re-focus input after AI finishes
            }
        };
        typeWord(0);
    };

    const API_BASE_URL = import.meta.env.VITE_APP_API_URL

    const handleSendMessage = () => {
        if (!inputMessage.trim()) return;

        const newMessage: Message = {
            id: Date.now(),
            text: inputMessage,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newMessage]);
        const currentInput = inputMessage;
        setInputMessage('');
        setIsAiTyping(true);

        // Placeholder for AI response
        const aiMessageId = Date.now() + 1; // Ensure unique ID
        const aiPlaceholderMessage: Message = {
            id: aiMessageId,
            text: '',
            sender: 'ai',
            timestamp: new Date(),
            isTyping: true
        };
        setMessages(prev => [...prev, aiPlaceholderMessage]);

        axios.post(`${API_BASE_URL}/api/chat/general-chat`, { message: currentInput })
            .then(response => {
                simulateTyping(response.data.response, aiMessageId);
            })
            .catch (error => {
                console.error('Error sending message:', error);
                setMessages(prev => prev.map(msg => 
                    msg.id === aiMessageId 
                        ? { ...msg, text: "Sorry, I couldn't connect. Please try again.", isTyping: false }
                        : msg
                ));
                setIsAiTyping(false);
                inputRef.current?.focus();
            });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex justify-center items-center md:items-end md:justify-end">
            <div 
                className={`
                    bg-white w-full h-full shadow-2xl 
                    flex flex-col transition-transform duration-300 ease-out
                    md:max-w-md md:h-[70vh] md:max-h-[650px] md:rounded-xl 
                    md:mr-6 md:bottom-24 md:fixed md:animate-slide-up
                `}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside chat
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-[#C62828] to-[#E53935] px-4 py-3 flex items-center justify-between shadow-md md:rounded-t-xl">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-white/25 flex items-center justify-center ring-2 ring-white/30">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.33 12.33A3.001 3.001 0 0012 15a3 3 0 00-2.33-2.67M12 9a3 3 0 002.33 2.67M12 9a3 3 0 00-2.33 2.67" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold text-lg">Atomixx AI</h3>
                            <div className="flex items-center space-x-1.5">
                                <span className={`w-2 h-2 rounded-full ${isAiTyping ? 'bg-yellow-300 animate-pulse' : 'bg-green-300'}`}></span>
                                <span className="text-xs text-white/80">
                                    {isAiTyping ? 'Typing...' : 'Online'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                        aria-label="Close chat"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto bg-gray-100 p-4 space-y-4">
                    {messages.length === 0 && !isAiTyping && (
                        <div className="text-center text-gray-500 mt-10 flex flex-col items-center">
                            <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-3.861 8.25-8.625 8.25S3.75 16.556 3.75 12c0-4.556 3.861-8.25 8.625-8.25s8.625 3.694 8.625 8.25z" />
                                </svg>
                            </div>
                            <p className="font-medium">Welcome to Atomixx AI!</p>
                            <p className="text-sm">Ask me anything about chemistry.</p>
                        </div>
                    )}
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex items-end ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {message.sender === 'ai' && (
                                <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center mr-2 flex-shrink-0 shadow">
                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            )}
                            <div className={`
                                max-w-[75%] p-3 rounded-2xl shadow-sm
                                ${message.sender === 'user' 
                                    ? 'bg-gradient-to-br from-[#C62828] to-[#E53935] text-white rounded-br-lg' 
                                    : 'bg-white text-gray-800 rounded-bl-lg'}
                            `}>
                                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                                {message.isTyping && message.sender === 'ai' && (
                                    <span className="inline-flex items-center ml-1 space-x-1">
                                        <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '100ms' }}></span>
                                        <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></span>
                                    </span>
                                )}
                            </div>
                             {message.sender === 'user' && (
                                <div className="w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center ml-2 flex-shrink-0 shadow">
                                    <span className="text-xs font-semibold">ME</span>
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 bg-white border-t border-gray-200 md:rounded-b-xl">
                    <div className="flex items-center space-x-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }}}
                            placeholder="Ask Atomixx AI..."
                            className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all text-sm"
                            disabled={isAiTyping}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={isAiTyping || !inputMessage.trim()}
                            className={`p-2.5 rounded-full transition-all duration-200 ease-in-out transform active:scale-95
                                ${isAiTyping || !inputMessage.trim()
                                    ? 'bg-gray-300 cursor-not-allowed' 
                                    : 'bg-gradient-to-br from-[#C62828] to-[#E53935] hover:shadow-md'
                            }`}
                            aria-label="Send message"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatOverlay;