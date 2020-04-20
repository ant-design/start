import React, { FC } from 'react';
import { Form, Input, Select, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { Store } from 'rc-field-form/es/interface';

const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

/**
 * antd: {
 *   dark: true,
 *   // or
 *   compact: true,
 * },
 */
interface StartData extends Store {
  name?: string;
  description?: string;
  keywords?: string[];
  authors?: string[];
  antd?: 'dark' | 'compact';
}

interface StartFormProps {
  onChange?: (data: StartData) => void;
  value?: StartData;
  loading?: boolean;
}

const StartForm: FC<StartFormProps> = ({ value, onChange, loading = false }) => {
  const [form] = Form.useForm();

  const onFinish = (values: Store) => {
    if (onChange) onChange(values);
  };

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="start"
      onFinish={onFinish}
      initialValues={value}
      scrollToFirstError
    >
      <Form.Item
        name="name"
        label="项目名称"
        rules={[
          {
            required: true,
            message: '请输入项目名称',
          },
        ]}
      >
        <Input placeholder="请输入项目名称" />
      </Form.Item>
      <Form.Item
        name="description"
        label="项目描述"
        rules={[
          {
            required: true,
            message: '请输入项目描述',
          },
        ]}
      >
        <Input placeholder="请输入项目描述" />
      </Form.Item>
      <Form.Item
        name="keywords"
        label="关键字"
        rules={[
          {
            required: true,
            message: '请输入关键字',
          },
        ]}
      >
        <Select mode="tags" placeholder="关键字" />
      </Form.Item>
      <Form.Item
        name="author"
        label="作者"
        rules={[
          {
            required: true,
            message: '请输入作者',
          },
        ]}
      >
        <Input placeholder="请输入作者" />
      </Form.Item>
      <Form.Item name="antd" label="antd主题风格">
        <Select defaultValue="primary" style={{ width: '100%' }}>
          <Option value="primary">默认</Option>
          <Option value="dark">暗黑</Option>
          <Option value="compact">紧凑</Option>
        </Select>
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit" loading={loading}>
          <DownloadOutlined />
          生成项目
        </Button>
      </Form.Item>
    </Form>
  );
};
export default StartForm;
