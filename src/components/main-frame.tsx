'use client';

import { InferenceClient } from '@huggingface/inference';

const hfClient = new InferenceClient(process.env.NEXT_PUBLIC_HF_TOKEN);

interface Props {}

export function MainFrame({}: Props) {
  return <div>main-frame</div>;
}
