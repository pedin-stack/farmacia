import React from 'react';
import { Card, Col, Row } from 'antd';
import UsersTable from '../components/UsersTable'; // 1. Importe sua tabela

const DashboardCards = () => {
  
  // Dados de exemplo para passar para a tabela
  const usersData = [
    { key: '1', name: 'John Brown', age: 32, address: 'New York', tags: ['developer'] },
    { key: '2', name: 'Jim Green', age: 42, address: 'London', tags: ['loser'] },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]}> {/* gutter: [horizontal, vertical] */}
        
        <Col span={24}>
          <Card title="Gestão de Usuários" variant="borderless">
        
            <UsersTable data={usersData} />
          </Card>
        </Col>
     
        <Col span={8}>
          <Card title="Estatísticas" variant="borderless">
            Conteúdo do card 2
          </Card>
        </Col>
        
        <Col span={8}>
          <Card title="Gráficos" variant="borderless">
            Conteúdo do card 3
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Notificações" variant="borderless">
            Conteúdo do card 4
          </Card>
        </Col>

      </Row>
    </div>
  );
};

export default DashboardCards;