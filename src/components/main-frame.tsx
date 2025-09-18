'use client';

import { InferenceClient } from '@huggingface/inference';
import { Button } from './ui/button';
import { useState } from 'react';

const hfClient = new InferenceClient(process.env.NEXT_PUBLIC_HF_TOKEN);

const textToGenerate = 'The definition of machine learning inference is ';

interface Props {}

export function MainFrame({}: Props) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState('');
  const sendRequest = async () => {
    try {
      setLoading(true);
      const response = await hfClient.textGeneration({
        inputs: textToGenerate,
        model: 'mistralai/Devstral-Small-2505',
        provider: 'nebius',
      });

      if ('generated_text' in response) {
        setData(response.generated_text);
      }
    } catch (error) {
      console.log('error: ', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex justify-center items-center flex-col">
      <Button onClick={sendRequest} disabled={loading}>
        SendRequest
      </Button>
      <div>{`${textToGenerate}${data}`}</div>
    </div>
  );
}
