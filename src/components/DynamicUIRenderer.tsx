import React from 'react';
import { Card } from './ui/card';
import { transform } from '@babel/standalone';

interface DynamicUIRendererProps {
  code: string;
}

const DynamicUIRenderer = ({ code }: DynamicUIRendererProps) => {
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

  return (
    <Card className="relative bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden">
      <div className="preview bg-white dark:bg-gray-900 p-6">
        {createComponentFromCode(code)}
      </div>
    </Card>
  );
};

export default DynamicUIRenderer;