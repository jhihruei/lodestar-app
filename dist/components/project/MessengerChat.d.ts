import React from 'react';
import './MessengerChat.css';
declare type MessengerChatProps = {
    appId: string;
    pageId: string;
    debug?: boolean;
    themeColor?: string;
    shouldShowDialog?: boolean;
    htmlRef?: string;
    minimized?: boolean;
    loggedInGreeting?: string;
    loggedOutGreeting?: string;
    greetingDialogDisplay?: string;
    greetingDialogDelay?: number;
    autoLogAppEvents?: boolean;
    xfbml?: boolean;
    version?: string;
    language?: string;
    onCustomerChatDialogShow?: () => void;
    onCustomerChatDialogHide?: () => void;
};
declare const MessengerChat: React.FC<MessengerChatProps>;
export default MessengerChat;
