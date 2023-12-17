import {highlighter} from '@nlux/highlighter';
import {useAdapter} from '@nlux/openai-react';
import {AiChat} from '@nlux/react';
import React, {useCallback, useState} from 'react';
import {createRoot} from 'react-dom/client';

debugger;
const apiKey = localStorage.getItem('apiKey') || 'YOUR_API_KEY_HERE';

const ExampleWrapper = () => {
    const [height, setHeight] = useState<number>(350);
    const [key, setKey] = useState<number>(0);
    const handleRandomContainerHeight = useCallback(() => {
        const newHeight = Math.floor(Math.random() * 1000);
        setHeight(newHeight);
    }, []);

    const adapter = useAdapter({
        apiKey,
        model: 'gpt-3.5-turbo',
        // dataTransferMode: 'stream',
        dataTransferMode: 'stream',
        systemMessage: 'Give sound, tailored financial advice. Explain concepts simply. When unsure, ask questions. '
            + 'Only recommend legal, ethical practices. Be friendly and patient. Write concise answers under 5 sentences.',
    });

    if (!adapter) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <span>{key}</span>
            <button onClick={() => setKey(key + 1)}>Reset</button>
            <button onClick={handleRandomContainerHeight}>Random Container Height</button>
            <div style={{marginTop: '50px'}}>
                <AiChat
                    key={key}
                    className="ai-chat-emulator"
                    adapter={adapter}
                    conversationOptions={{
                        scrollWhenGenerating: true,
                    }}
                    layoutOptions={{
                        height,
                        width: 420,
                    }}
                    // Optional: Instruct ChatGPT how to behave during the conversation.
                    promptBoxOptions={{
                        placeholder: 'How can I help you today?',
                        autoFocus: true,
                    }}
                    syntaxHighlighter={highlighter}
                />
            </div>
        </div>
    );
};

export default () => {
    const root = document.getElementById('nlux-ai-chat-root');
    if (!root) {
        throw new Error('Root element not found');
    }

    const reactRoot = createRoot(root);
    reactRoot.render(
        <React.StrictMode>
            <ExampleWrapper/>
        </React.StrictMode>,
    );
};