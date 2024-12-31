import React, { useState } from 'react';
import { Card } from './ui/card';
import { transform } from '@babel/standalone';
import TypewriterCode from './TypewriterCode';

interface DynamicUIRendererProps {
  code: string;
}

const DynamicUIRenderer = ({ code }: DynamicUIRendererProps) => {
  const [renderedComponent, setRenderedComponent] = useState<React.ReactNode | null>(null);

  const createComponentFromCode = (code: string) => {
    try {
      const jsxMatch = code.match(/```(?:jsx|tsx)?\s*([\s\S]*?)```/);
      const jsxCode = jsxMatch ? jsxMatch[1].trim() : code.trim();

      const componentCode = `
        (function() {
          return function DynamicComponent() {
            return ${jsxCode};
          }
        })()
      `;

      const { code: transpiledCode } = transform(componentCode, {
        presets: ['react'],
      });

      const ComponentFunction = new Function('React', `return ${transpiledCode}`)(React);
      return React.createElement(ComponentFunction);

    } catch (error) {
      console.error('Error rendering component:', error);
      return (
        <div className="p-4 text-red-500">
          Error rendering component: {error.message}
        </div>
      );
    }
  };

  const handleTypewriterComplete = () => {
    setRenderedComponent(createComponentFromCode(code));
  };

  return (
    <div className="space-y-4">
      <TypewriterCode code={code} onComplete={handleTypewriterComplete} />
      {renderedComponent && (
        <Card className="p-4 bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="preview">
            {renderedComponent}
          </div>
        </Card>
      )}
    </div>
  );
};

export default DynamicUIRenderer;