import React from 'react';
import { Card } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StartForm from '@/components/StartForm';
import { generate } from '@/services/start';

export default (): React.ReactNode => {
  const run = async (res: any) => {
    const data = await generate(res);
    // 测试方法，应该服务端返回正确的地址
    window.open(`http://localhost:3000/download/?filePath=${data.filePath}`);
  };
  return (
    <PageHeaderWrapper>
      <Card>
        <StartForm onChange={(data) => run(data)} />
      </Card>
    </PageHeaderWrapper>
  );
};
