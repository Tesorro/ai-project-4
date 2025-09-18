'use client';
import { pipeline, ProgressInfo } from '@huggingface/transformers';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';

type Box = { xmin: number; ymin: number; xmax: number; ymax: number };
type Detection = { score: number; label: string; box: Box };

export function MainFrame() {
  const [status, setStatus] = useState('');
  const [boxes, setBoxes] = useState<Detection[]>([]);

  const renderW = 400;
  const renderH = 533;

  const [natW, setNatW] = useState<number | null>(null);
  const [natH, setNatH] = useState<number | null>(null);

  const detectAndDrawObjects = useCallback(async () => {
    try {
      setStatus('Start detection');
      const od = await pipeline('object-detection', 'Xenova/detr-resnet-50', {
        progress_callback: (progressInfo: ProgressInfo) => {
          setStatus(progressInfo.status);
        },
      });
      const res = (await od('/road.png')) as Detection[];
      console.log('res', res);
      setBoxes(res);
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    }
  }, []);

  const scaleX = natW ? renderW / natW : 1;
  const scaleY = natH ? renderH / natH : 1;

  return (
    <main>
      <p>{status}</p>
      <Button onClick={detectAndDrawObjects}>Detect</Button>
      <div style={{ position: 'relative', width: renderW, height: renderH }}>
        <Image
          src="/road.png"
          alt="road"
          width={renderW}
          height={renderH}
          onLoadingComplete={(img) => {
            setNatW(img.naturalWidth);
            setNatH(img.naturalHeight);
          }}
          style={{ display: 'block' }}
        />

        {boxes
          .filter((b) => b.score >= 0.5)
          .map((b, i) => {
            const { xmin, ymin, xmax, ymax } = b.box;
            const x = xmin * scaleX;
            const y = ymin * scaleY;
            const w = (xmax - xmin) * scaleX;
            const h = (ymax - ymin) * scaleY;

            return (
              <div
                key={i}
                title={`${b.label} (${(b.score * 100).toFixed(1)}%)`}
                style={{
                  position: 'absolute',
                  left: x,
                  top: y,
                  width: w,
                  height: h,
                  border: '2px solid #00ffff',
                  pointerEvents: 'none',
                }}>
                {b.label}
              </div>
            );
          })}
      </div>
    </main>
  );
}

function drawObjectBox(detectedObject: Detection) {
  const { label, score, box } = detectedObject;
  const { xmax, xmin, ymax, ymin } = box;

  const color =
    '#' +
    Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, '0');

  const boxElement = document.createElement('div');
  boxElement.className = 'bounding-box';
  Object.assign(boxElement.style, {
    borderColor: color,
    left: 100 * xmin + '%',
    top: 100 * ymin + '%',
    width: 100 * (xmax - xmin) + '%',
    height: 100 * (ymax - ymin) + '%',
  });

  // Draw label
  const labelElement = document.createElement('span');
  labelElement.textContent = `${label}: ${Math.floor(score * 100)}%`;
  labelElement.className = 'bounding-box-label';
  labelElement.style.backgroundColor = color;

  boxElement.appendChild(labelElement);
  imageContainer.appendChild(boxElement);
}
