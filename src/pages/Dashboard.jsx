import React from 'react';
import { Card, Col, Row, Statistic, Divider, Modal, Form, Input, InputNumber, Button, Popconfirm, Avatar, Space, TimePicker } from 'antd';
import { 
  MedicineBoxOutlined, 
  AlertOutlined, 
  TeamOutlined, 
  UserOutlined, 
  PlusOutlined, 
  DeleteOutlined,
  CalculatorOutlined
} from '@ant-design/icons';
import TabelaRemedios from '../componentes/TabelaRemedios';
import useDashboard from '../use/useDashboard';
import ChatAssistant from '../componentes/ChatAssistant'

const Dashboard = () => {
  const [itemForm] = Form.useForm();
  const [personForm] = Form.useForm();

  const {
    dadosDoEstoque,
    loading,
    itemModalVisible,
    editingItem,
    personModalVisible,
    handleAddPerson,
    handleSavePerson,
    handleDeletePerson,
    handleAddItem,
    handleEditItem,
    handleDeleteItem,
    handleSaveItem,
    totalRemedios,
    totalUrgentes,
    getEditingItemForForm,
    closeItemModal,
    closePersonModal
  } = useDashboard();

  // Handlers de formulário
  const onSavePerson = () => {
    personForm.validateFields().then(values => {
      handleSavePerson(values);
      personForm.resetFields();
    });
  };

  const onSaveItem = () => {
    itemForm.validateFields().then(values => {
      handleSaveItem(values);
      itemForm.resetFields();
    });
  };

  const onCancelItemModal = () => {
    closeItemModal();
    itemForm.resetFields();
  };

  const onCancelPersonModal = () => {
    closePersonModal();
    personForm.resetFields();
  };

  // Ao editar item, popula o form
  React.useEffect(() => {
    if (editingItem && itemModalVisible) {
      itemForm.setFieldsValue(getEditingItemForForm());
    }
  }, [editingItem, itemModalVisible, itemForm, getEditingItemForForm]);


  return (
    <div style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      {/* Cabeçalho */}
      <div className="mb-4">
        <h2 style={{ margin: 0 }}>Farmácia Inteligente</h2>
        <span className="text-muted">Cálculo automático de reposição</span>
      </div>

      {/* Estatísticas */}
      <Row gutter={[16, 16]} className="mb-4">
        <Col xs={24} sm={8}>
          <Card bordered={false}>
            <Statistic title="Medicamentos Monitorados" value={totalRemedios} prefix={<MedicineBoxOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false}>
            <Statistic title="Pessoas" value={dadosDoEstoque.length} prefix={<TeamOutlined style={{ color: '#52c41a' }} />} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Reposição Urgente"
              value={totalUrgentes}
              precision={0}
              valueStyle={{ color: '#cf1322' }}
              prefix={<AlertOutlined />}
              suffix="itens"
            />
          </Card>
        </Col>
      </Row>

      {/* Título e botão */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <Divider orientation="center" style={{ margin: 0, width: 'auto', minWidth: '150px', flexGrow: 1 }}>
          Medicamentos por Pessoa
        </Divider>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddPerson} loading={loading}>
          Nova Pessoa
        </Button>
      </div>

      {/* Cards de pessoas */}
      <Row gutter={[24, 24]}>
        {dadosDoEstoque.map((pessoa) => (
          <Col xs={24} lg={12} xl={8} key={pessoa.id}>
            <Card
              title={<Space><Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} /><span>{pessoa.nome}</span></Space>}
              bordered={false}
              hoverable
              style={{ height: '100%' }}
              extra={
                <Popconfirm title="Remover?" onConfirm={() => handleDeletePerson(pessoa.id)}>
                  <Button type="text" danger icon={<DeleteOutlined />} loading={loading} />
                </Popconfirm>
              }
            >
              <TabelaRemedios
                dados={pessoa.itens}
                categoriaId={pessoa.id}
                onAdd={handleAddItem}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal Medicamento */}
      <Modal
        title={editingItem ? 'Editar e Recalcular' : 'Novo Medicamento'}
        open={itemModalVisible}
        onOk={onSaveItem}
        onCancel={onCancelItemModal}
        okText="Calcular e Salvar"
        cancelText="Cancelar"
        width="95%"
        style={{ maxWidth: 520 }}
        bodyStyle={{ padding: '1rem' }}
        wrapClassName="d-flex align-items-start justify-content-center"
        destroyOnClose
        maskClosable={true}
        confirmLoading={loading}
      >
        <div className="container-fluid px-2">
          <Form form={itemForm} layout="vertical">
            <Form.Item name="remedio" label="Nome do Medicamento" rules={[{ required: true }]}>
              <Input prefix={<MedicineBoxOutlined />} placeholder="Ex: Losartana 5mg" className="w-100" />
            </Form.Item>

            <Row gutter={12} className="gx-2">
              <Col xs={24} sm={12} className="mb-2">
                <Form.Item
                  name="estoque"
                  label="Estoque Atual (Unidades)"
                  tooltip="Quantos comprimidos você tem na caixa agora?"
                  rules={[{ required: true, message: 'Obrigatório para o cálculo' }]}
                >
                  <InputNumber style={{ width: '100%' }} min={1} placeholder="Ex: 30" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} className="mb-2">
                <Form.Item
                  name="usoDiario"
                  label="Uso por Dia"
                  tooltip="Quantos comprimidos a pessoa toma por dia?"
                  rules={[{ required: true, message: 'Obrigatório' }]}
                >
                  <InputNumber style={{ width: '100%' }} min={1} placeholder="Ex: 2" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={12} className="gx-2 mt-2">
              <Col xs={24} className="mb-2">
                <Form.Item name="horario" label="Horário de Consumo" tooltip="Hora em que o medicamento deve ser tomado">
                  <TimePicker format="HH:mm" style={{ width: '100%' }} placeholder="Ex: 08:30" />
                </Form.Item>
              </Col>
            </Row>

            <div className="bg-light p-3 rounded text-center text-muted w-100">
              <CalculatorOutlined /> O sistema calculará a data da próxima compra automaticamente.
            </div>
          </Form>
        </div>
      </Modal>

      {/* Modal Pessoa */}
      <Modal
        title="Nova Pessoa"
        open={personModalVisible}
        onOk={onSavePerson}
        onCancel={onCancelPersonModal}
        okText="Adicionar"
        confirmLoading={loading}
      >
        <Form form={personForm} layout="vertical">
          <Form.Item name="nomePessoa" label="Nome" rules={[{ required: true }]}>
            <Input prefix={<UserOutlined />} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Chat Assistente */}
      <ChatAssistant dadosEstoque={dadosDoEstoque} />
    </div>
  );
};

export default Dashboard;