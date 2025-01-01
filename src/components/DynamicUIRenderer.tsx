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
    <Card className="relative overflow-hidden">
      <div className="preview relative z-10 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-6">
        {createComponentFromCode(code)}
      </div>
    </Card>
  );
};

export default DynamicUIRenderer;