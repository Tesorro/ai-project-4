'use client';

import { InferenceClient } from '@huggingface/inference';
import { useState } from 'react';
import { Button } from './ui/button';
import { AudioPlayer } from './audio-player';

const hfClient = new InferenceClient(process.env.NEXT_PUBLIC_HF_TOKEN);

const textToSpeech = "It's an exciting time to be an AI engineer";

interface Props {}

export function MainFrame({}: Props) {
  const [audioUrl, setAudioUrl] = useState('');
  const sendRequest = async () => {
    const audio = await hfClient.textToSpeech({
      provider: 'fal-ai',
      model: 'ResembleAI/chatterbox',
      inputs: textToSpeech,
    });
    if (audio) {
      setAudioUrl(URL.createObjectURL(audio));
    }
  };
  return (
    <div>
      <Button onClick={sendRequest}>Send request</Button>
      {audioUrl && <AudioPlayer src={audioUrl} />}
    </div>
  );
}
