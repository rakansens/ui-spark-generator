import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';

interface TypewriterCodeProps {
  code: string;
  onComplete?: () => void;
}

const TypewriterCode = ({ code, onComplete }: TypewriterCodeProps) => {
  const [displayedCode, setDisplayedCode] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < code.length) {
      const timeout = setTimeout(() => {
        setDisplayedCode(prev => prev + code[currentIndex]);
        setCurrentIndex(c => c + 1);
      }, 25); // タイピング速度を調整（ミリ秒）

      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, code, onComplete]);

  return (
    <Card className="p-4 bg-black/80 text-green-400 font-mono text-sm overflow-x-auto">
      <pre className="whitespace-pre-wrap break-all">
        <code className="block animate-blink">
          {displayedCode}
          <span className="inline-block w-2 h-4 bg-green-400 ml-1 animate-blink">
            &nbsp;
          </span>
        </code>
      </pre>
    </Card>
  );
};

export default TypewriterCode;