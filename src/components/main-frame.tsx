'use client';

import { InferenceClient } from '@huggingface/inference';
import { Button } from './ui/button';
import { useState } from 'react';

const hfClient = new InferenceClient(process.env.NEXT_PUBLIC_HF_TOKEN);

const textToTranslate = 'Будущее за искусственным интеллектом!';

interface Props {}

export function MainFrame({}: Props) {
  const [translation, setTranslation] = useState('');
  const sendRequest = async () => {
    const output = await hfClient.translation({
      model: 'facebook/mbart-large-50-many-to-many-mmt',
      inputs: textToTranslate,
      provider: 'hf-inference',
      parameters: {
        src_lang: 'ru_RU',
        tgt_lang: 'en_XX',
      },
    });
    if ('translation_text' in output) {
      setTranslation(output.translation_text);
    }
  };
  return (
    <div>
      <Button onClick={sendRequest}>Translate text</Button>
      <p>Original text: {textToTranslate}</p>
      <p>Translated text: {translation}</p>
    </div>
  );
}
