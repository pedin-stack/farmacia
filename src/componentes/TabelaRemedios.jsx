import React from 'react';
import { Table, Button, Tooltip, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const TabelaRemedios = ({ dados, categoriaId, onEdit, onDelete, onAdd }) => {
  
  const columns = [
    {
      title: 'Remédio',
      dataIndex: 'remedio',
      key: 'remedio',
      width: 100, // <--- DEFINIMOS UM TAMANHO FIXO PEQUENO
      render: (text) => (
        <span
          style={{
            fontWeight: 500,
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            display: 'block',
            fontSize: '13px', // Diminuí levemente a fonte para caber melhor
            lineHeight: '1.2'
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: 'Qtd.',
      dataIndex: 'quantidade',
      key: 'quantidade',
      align: 'center',
      width: 50, // Reduzi um pouco para ganhar espaço
    },
    {
      title: 'Prox Compra',
      dataIndex: 'proximaCompra',
      key: 'proximaCompra',
      align: 'center',
      // REMOVI O 'width' DAQUI. 
      // Sem width fixo, esta coluna vai crescer e ocupar o espaço livre.
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
      
        const tagStyle = {
          color: textColor,
          backgroundColor: backgroundColor,
          border: `1px solid ${borderColor}`,
          padding: '2px 4px',       
          borderRadius: '4px',        
          fontSize: '12px',          
          display: 'inline-block',    
          whiteSpace: 'nowrap'        
        };

        return (
          (text && text !== 'A calcular') ? (
            <span style={tagStyle}>
              {text}
            </span>
          ) : (
            <span style={{ color: '#ccc', fontSize: '11px' }}>{text || '-'}</span>
          )
        );
      },
    },
    {
      title: 'Ações',
      key: 'acoes',
      align: 'right',
      width: 70, // Ajustado para ficar compacto
      render: (_, record) => (
        <Space size={2}> {/* Reduzi o espaço entre os botões */}
          <Tooltip title="Editar">
            <Button 
              type="text" 
              size="small" 
              icon={<EditOutlined style={{ color: '#1890ff' }} />} 
              onClick={() => onEdit(record, categoriaId)} 
            />
          </Tooltip>

          <Popconfirm
            title="Excluir?"
            onConfirm={() => onDelete(record.id, categoriaId)}
            okText="Sim"
            cancelText="Não"
          >
            <Button 
              type="text" 
              danger 
              size="small"
              icon={<DeleteOutlined />} 
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="table-responsive">
        <Table 
          columns={columns} 
          dataSource={dados} 
          pagination={false} 
          size="small" 
          rowKey="id"
          // O scroll ajuda a manter a proporção se a tela for muito pequena
          scroll={{ x: 'max-content' }} 
        />
      </div>

      <Button 
        type="dashed" 
        block 
        size="small" // Botão 'Adicionar' um pouco mais discreto
        style={{ marginTop: 10 }} 
        icon={<PlusOutlined />}
        onClick={() => onAdd(categoriaId)}
      >
        Adicionar
      </Button>
    </div>
  );
};

export default TabelaRemedios;