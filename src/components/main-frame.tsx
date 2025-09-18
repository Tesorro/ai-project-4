'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { InferenceClient } from '@huggingface/inference';

const hfClient = new InferenceClient(process.env.NEXT_PUBLIC_HF_TOKEN);

const textToClassify = "I just bought a new camera. It's the best camera I've ever owned!";

interface Props {}

export function MainFrame({}: Props) {
  const [data, setData] = useState<Array<{ label: string; score: number }>>([]);
  const sendRequest = async () => {
    const output = await hfClient.textClassification({
      model: 'tabularisai/multilingual-sentiment-analysis',
      inputs: textToClassify,
      provider: 'hf-inference',
    });
    if (Array.isArray(output)) {
      setData(output);
    }
  };
  return (
    <div>
      <Button onClick={sendRequest}>SendRequest</Button>
      <ul>
        {Array.isArray(data) &&
          data.length > 0 &&
          data.map((el, idx) => (
            <li key={idx}>
              LABEL: <b>{el.label}</b>; SCORE: <b>{el.score}</b>
            </li>
          ))}
      </ul>
    </div>
  );
}
