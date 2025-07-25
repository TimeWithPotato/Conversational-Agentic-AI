import React from 'react';
import VoiceToTextAndSpeak from '../Pages/VoiceToTextAndSpeak';
import MessengerInterface from '../components/MessengerInterface';

const ParentInterViewContainer = () => {
    return (
        <div className='flex flex-col md:flex-row gap-6 p-6 h-screen overflow-hidden'>
            <div className='w-full md:w-1/2 overflow-hidden'>
                <VoiceToTextAndSpeak/>
            </div>
            <div className='w-full md:w-1/2 overflow-hidden'>
                <MessengerInterface />
            </div>
        </div>
    );
};

export default ParentInterViewContainer;