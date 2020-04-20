import React, { Fragment, useState, useEffect, FC } from 'react';
import { Table, Button, Input, message, Popconfirm, Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface AuthorsInputProps {
  value?: any;
  onChange?: (value: any) => void;
}
const AuthorsInput: FC<AuthorsInputProps> = ({ value = [], onChange }) => {
  const [loading, setLoading] = useState(false);
  const [clickedCancel, setClickedCancel] = useState(false);
  const [data, setData] = useState(value);
  const [addIndex, setAddIndex] = useState(0);
  const [cacheOriginData, setCacheOriginData] = useState({});

  useEffect(() => {
    setData(data);
  }, [value]);

  const getRowByKey = (key: string, newData?: any) => {
    return (newData || data).filter((item: any) => item.key === key)[0];
  };
  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
    key: string,
  ) => {
    const newData = data.map((item: any) => ({ ...item }));
    const target = getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e.target.value;
      setData(newData);
    }
  };

  const newMember = () => {
    const newData = data.map((item: any) => ({ ...item }));
    newData.push({
      key: `NEW_TEMP_ID_${addIndex}`,
      email: '',
      name: '',
      url: '',
      editable: true,
      isNew: true,
    });
    setAddIndex(addIndex + 1);
    setData(newData);
  };

  const toggleEditable = (e: React.MouseEvent, key: string) => {
    e.preventDefault();
    const newData = data.map((item: any) => ({ ...item }));
    const target = getRowByKey(key, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        cacheOriginData[key] = { ...target };
        setCacheOriginData(cacheOriginData);
      }
      target.editable = !target.editable;
      setData(newData);
    }
  };
  const cancel = (e: React.MouseEvent, key: string) => {
    setClickedCancel(true);
    e.preventDefault();
    const newData = data.map((item: any) => ({ ...item }));
    const target = getRowByKey(key, newData);
    if (cacheOriginData[key]) {
      Object.assign(target, cacheOriginData[key]);
      delete cacheOriginData[key];
      setCacheOriginData(cacheOriginData);
    }
    target.editable = false;
    setData(newData);
    setClickedCancel(false);
  };
  const saveRow = (e: React.MouseEvent, key: string) => {
    e.persist();
    setLoading(true);

    setTimeout(() => {
      if (clickedCancel) {
        setClickedCancel(false);
        return;
      }
      const target = getRowByKey(key) || {};
      if (!target.email || !target.name || !target.url) {
        message.error('请填写完整成员信息。');
        // @ts-ignore
        e.target.focus();
        setLoading(false);
        return;
      }
      delete target.isNew;
      toggleEditable(e, key);
      if (onChange) onChange(data);
      setLoading(false);
    }, 500);
  };
  const remove = (key: string) => {
    const newData = data.filter((item: any) => item.key !== key);
    setData(newData);
    if (onChange) onChange(newData);
  };

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: '28%',
      render: (text: string, record: any) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              autoFocus
              onChange={(e) => handleFieldChange(e, 'name', record.key)}
              placeholder="成员姓名"
            />
          );
        }
        return text;
      },
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: '28%',
      render: (text: string, record: any) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              autoFocus
              onChange={(e) => handleFieldChange(e, 'email', record.key)}
              placeholder="邮箱"
            />
          );
        }
        return text;
      },
    },
    {
      title: '网址',
      dataIndex: 'url',
      key: 'url',
      width: '28%',
      render: (text: string, record: any) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              autoFocus
              onChange={(e) => handleFieldChange(e, 'url', record.key)}
              placeholder="网址"
            />
          );
        }
        return text;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: '15%',
      render: (text: string, record: any) => {
        if (!!record.editable && loading) {
          return null;
        }
        if (record.editable) {
          if (record.isNew) {
            return (
              <span>
                <a onClick={(e) => saveRow(e, record.key)}>添加</a>
                <Divider type="vertical" />
                <Popconfirm title="是否要删除此行？" onConfirm={() => remove(record.key)}>
                  <a>删除</a>
                </Popconfirm>
              </span>
            );
          }
          return (
            <span>
              <a onClick={(e) => saveRow(e, record.key)}>保存</a>
              <Divider type="vertical" />
              <a onClick={(e) => cancel(e, record.key)}>取消</a>
            </span>
          );
        }
        return (
          <span>
            <a onClick={(e) => toggleEditable(e, record.key)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm title="是否要删除此行？" onConfirm={() => remove(record.key)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];
  return (
    <Fragment>
      <Table loading={loading} columns={columns} dataSource={data} pagination={false} />
      <Button
        style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
        type="dashed"
        onClick={newMember}
      >
        <PlusOutlined />
        添加作者
      </Button>
    </Fragment>
  );
};

export default AuthorsInput;
