interface Props {
  src: string;
}

export function AudioPlayer({ src }: Props) {
  return <audio controls src={src} />;
}
