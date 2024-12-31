import React from 'react';
import { Card } from './ui/card';
import { transform } from '@babel/standalone';

interface DynamicUIRendererProps {
  code: string;
}

const DynamicUIRenderer = ({ code }: DynamicUIRendererProps) => {
  const createComponentFromCode = (code: string) => {
    try {
      // JSXコードのみを抽出（import文やコンポーネント定義を除去）
      const jsxCode = code.replace(/import.*?;/g, '')
                         .replace(/const.*?=.*?=>\s*{/, '')
                         .replace(/return\s*\(?\s*/, '')
                         .replace(/\s*\)\s*;\s*}\s*;?\s*$/, '')
                         .trim();

      // JSXをReactコンポーネントとしてラップ
      const wrappedCode = `
        (function() {
          return function Component() {
            return (${jsxCode});
          };
        })()
      `;
      
      // Babelでコードをトランスパイル
      const { code: transpiledCode } = transform(wrappedCode, {
        presets: ['react'],
      });

      // 文字列のコードを評価して実際のコンポーネントを取得
      const ComponentFunction = new Function('React', `return ${transpiledCode}`)(React);
      return React.createElement(ComponentFunction);
      
    } catch (error) {
      console.error('Error rendering component:', error);
      return (
        <div className="p-4 text-red-500 bg-red-100 rounded">
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