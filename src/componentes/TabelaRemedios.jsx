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

      sorter: (a, b) => {
        
      const dataA = a.dataIso; 
      const dataB = b.dataIso;

      if (!dataA) return -1; 
      if (!dataB) return 1;

      return new Date(dataA) - new Date(dataB);
    },

     render: (text, record) => {
 
      let textColor = '#1890ff';       
      let backgroundColor = '#e6f7ff'; 
      let borderColor = '#91d5ff';     

      if (record.status === 'urgente') {
        textColor = '#cf1322';       
        backgroundColor = '#fff1f0'; 
        borderColor = '#ffa39e';     
      } else if (record.status === 'atencao') {
        textColor = '#faad14';      
        backgroundColor = '#fffbe6'; 
        borderColor = '#ffe58f';     
      }

      // --- ESTILO FINAL DA "ETIQUETA" ---
      const tagStyle = {
        color: textColor,
        backgroundColor: backgroundColor,
        border: `1px solid ${borderColor}`,
        padding: '4px 8px',        
        borderRadius: '4px',        
        fontSize: '13px',          
        display: 'inline-block',    
        whiteSpace: 'nowrap'        
      };

      return (
      
        (text && text !== 'A calcular') ? (
          <span style={tagStyle}>
            {text}
          </span>
        ) : (
          <span style={{ color: '#ccc' }}>{text || '-'}</span>
        )
      );
    },
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