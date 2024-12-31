import React from 'react';
import { Card } from './ui/card';
import * as ReactDOMServer from 'react-dom/server';
import { transform } from '@babel/standalone';

interface DynamicUIRendererProps {
  code: string;
}

const DynamicUIRenderer = ({ code }: DynamicUIRendererProps) => {
  const createComponentFromCode = (code: string) => {
    try {
      // コードを実際のReactコンポーネントに変換
      const wrappedCode = `
        const Component = () => {
          return (${code})
        };
        return Component;
      `;
      
      // Babelでコードをトランスパイル
      const { code: transpiledCode } = transform(wrappedCode, {
        presets: ['react'],
      });

      // 文字列のコードを評価して実際のコンポーネントを取得
      const Component = new Function('React', transpiledCode)(React);
      
      // コンポーネントをレンダリング
      return <Component />;
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