import React from 'react';
import { Card } from './ui/card';

interface DynamicUIRendererProps {
  code: string;
}

const DynamicUIRenderer = ({ code }: DynamicUIRendererProps) => {
  // コードから実際のJSXを作成する関数
  const createComponentFromCode = (code: string) => {
    try {
      // コードからコンポーネントの中身だけを抽出
      const jsxContent = code.match(/return \(([\s\S]*?)\);/)?.[1] || code;
      
      // dangerouslySetInnerHTMLを使用してJSXをレンダリング
      return <div dangerouslySetInnerHTML={{ __html: jsxContent }} />;
    } catch (error) {
      console.error('Error rendering component:', error);
      return <div className="text-red-500">Error rendering component</div>;
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