import React from 'react';
import { Table, Tag, Button, Tooltip, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const TabelaRemedios = ({ dados, categoriaId, onEdit, onDelete, onAdd }) => {
  
  const columns = [
    {
      title: 'Remédio',
      dataIndex: 'remedio',
      key: 'remedio',
      width: '40%',
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: 'Qtd.',
      dataIndex: 'quantidade',
      key: 'quantidade',
      align: 'center',
    },
    {
      title: 'Próxima Compra',
      dataIndex: 'proximaCompra',
      key: 'proximaCompra',
      align: 'center',
      render: (data, record) => {
        let color = record.status === 'urgente' ? 'volcano' : 'geekblue';
        return <Tag color={color}>{data}</Tag>;
      }
    },
    {
      title: 'Ações',
      key: 'acoes',
      align: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Editar">
            <Button 
              type="text" 
              icon={<EditOutlined style={{ color: '#1890ff' }} />} 
              onClick={() => onEdit(record, categoriaId)} 
            />
          </Tooltip>

          <Popconfirm
            title="Tem certeza que deseja excluir?"
            onConfirm={() => onDelete(record.id, categoriaId)}
            okText="Sim"
            cancelText="Não"
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table 
        columns={columns} 
        dataSource={dados} 
        pagination={false} 
        size="small" 
        rowKey="id"
      />
      {/* Botão de Adicionar no final da tabela */}
      <Button 
        type="dashed" 
        block 
        style={{ marginTop: 10 }} 
        icon={<PlusOutlined />}
        onClick={() => onAdd(categoriaId)}
      >
        Adicionar Medicamento
      </Button>
    </div>
  );
};

export default TabelaRemedios;