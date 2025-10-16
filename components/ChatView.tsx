
import React, { useState, useRef, useEffect } from 'react';
import { chatWithDoc } from '../services/geminiService';
import type { StoredPdf, ChatMessage } from '../types';
import { PaperAirplaneIcon, UserCircleIcon } from './icons';
import { SparklesIcon } from './icons';

interface ChatViewProps {
  pdf: StoredPdf;
}

export const ChatView: React.FC<ChatViewProps> = ({ pdf }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const modelMessage: ChatMessage = { role: 'model', text: '' };
    setMessages(prev => [...prev, modelMessage]);

    try {
        const stream = await chatWithDoc(pdf.textContent, messages, input);
        
        let currentText = '';
        for await (const chunk of stream) {
            currentText += chunk.text;
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = { role: 'model', text: currentText };
                return newMessages;
            });
        }
    } catch (error) {
        const errorMessage: ChatMessage = { role: 'model', text: 'Sorry, I encountered an error. Please try again.' };
        setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = errorMessage;
            return newMessages;
        });
        console.error(error);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-200px)]">
      <div className="flex-grow overflow-y-auto pr-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'model' && <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white"><SparklesIcon className="h-5 w-5"/></div>}
            <div className={`p-3 rounded-lg max-w-lg ${msg.role === 'user' ? 'bg-indigo-500 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            </div>
            {msg.role === 'user' && <UserCircleIcon className="flex-shrink-0 h-8 w-8 text-gray-400 dark:text-gray-500"/>}
          </div>
        ))}
         <div ref={messagesEndRef} />
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question about the document..."
            className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-indigo-500 focus:border-indigo-500"
            disabled={isLoading}
          />
          <button onClick={handleSend} disabled={isLoading || input.trim() === ''} className="p-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 disabled:bg-indigo-300">
            <PaperAirplaneIcon />
          </button>
        </div>
      </div>
    </div>
  );
};
