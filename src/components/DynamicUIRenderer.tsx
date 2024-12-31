import React from 'react';
import { Card } from './ui/card';
import { transform } from '@babel/standalone';

interface DynamicUIRendererProps {
  code: string;
}

const DynamicUIRenderer = ({ code }: DynamicUIRendererProps) => {
  const createComponentFromCode = (code: string) => {
    try {
      // Extract only the JSX code between ```jsx and ``` tags
      const jsxMatch = code.match(/```(?:jsx|tsx)?\s*([\s\S]*?)```/);
      const jsxCode = jsxMatch ? jsxMatch[1].trim() : code.trim();

      // Create a component function that returns the JSX
      const componentCode = `
        (function() {
          return function DynamicComponent() {
            return ${jsxCode};
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