'use client';

import { InferenceClient } from '@huggingface/inference';
import { useState } from 'react';
import { Button } from './ui/button';
import Image from 'next/image';

const hfClient = new InferenceClient(process.env.NEXT_PUBLIC_HF_TOKEN);

interface Props {}

export function MainFrame({}: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const sendRequest = async () => {
    try {
      const response = await fetch('/photo.avif');
      if (!response.ok) {
        throw new Error('Failed to load image!');
      }
      const dataBlob = await response.blob();
      const image = await hfClient.imageToImage({
        provider: 'fal-ai',
        model: 'Qwen/Qwen-Image-Edit',
        inputs: dataBlob,
        parameters: {
          prompt: 'Color this photo to make it maximum real as it possible',
          negative_prompt: 'Black and white photo. text, bad anatomy, blurry, low quality',
          // // Between 0 and 1 (how close final result could be to original)
          // strength: 0,
        },
      });
      const imageUrl = URL.createObjectURL(image);

      setImageUrl(imageUrl);
    } catch (error) {
      console.log('error loading image: ', error);
    }
  };
  return (
    <div>
      <Button onClick={sendRequest}>Send request</Button>
      <div className="flex gap-10">
        <Image width={500} height={750} src={'/photo.avif'} alt="image" />
        {imageUrl && <Image width={500} height={750} src={imageUrl} alt="image" />}
      </div>
    </div>
  );
}
