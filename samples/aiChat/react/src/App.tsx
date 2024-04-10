import {useChatAdapter} from '@nlux-dev/nlbridge-react/src';
import {AiChat} from '@nlux-dev/react/src';
import '@nlux-dev/themes/src/luna/theme.css';
import './App.css';

function App() {
    const nlBridge = useChatAdapter({
        url: 'http://localhost:8899/',
    });

    return (
        <AiChat
            adapter={nlBridge}
            themeId="bina"
        />
    );
}

export default App;