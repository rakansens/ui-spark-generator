import React from 'react';
import { Card } from './ui/card';
import { transform } from '@babel/standalone';

interface DynamicUIRendererProps {
  code: string;
}

const DynamicUIRenderer = ({ code }: DynamicUIRendererProps) => {
  const createComponentFromCode = (code: string) => {
    try {
      // Extract only the JSX code from the response
      const jsxMatch = code.match(/```(?:jsx|tsx)?\s*([\s\S]*?)```/);
      const jsxCode = jsxMatch ? jsxMatch[1].trim() : code.trim();

      // Remove any explanatory text before or after the JSX
      const cleanCode = jsxCode
        .split('\n')
        .filter(line => line.trim().startsWith('<'))
        .join('\n')
        .trim();

      // Create a component function that returns the JSX
      const componentCode = `
        (function() {
          return function DynamicComponent() {
            return ${cleanCode};
          }
        })()
      `;

      // Transform the code using Babel
      const { code: transpiledCode } = transform(componentCode, {
        presets: ['react'],
      });

      // Create and return the component
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
    <Card className="p-4 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="preview">
        {createComponentFromCode(code)}
      </div>
    </Card>
  );
};

export default DynamicUIRenderer;