import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Statistic, Divider, Modal, Form, Input, InputNumber, message, Button, Popconfirm, Avatar, Space, Tag } from 'antd';
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
import PessoaService from '../api/PessoaService';

const Dashboard = () => {
 
  const [dadosDoEstoque, setDadosDoEstoque] = useState([

  ]);

  // --- ESTADOS ---
  const [itemModalVisible, setItemModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [targetPersonId, setTargetPersonId] = useState(null);
  
  const [personModalVisible, setPersonModalVisible] = useState(false);
  
  const [itemForm] = Form.useForm();
  const [personForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
 
  useEffect(() => {
    const loadPessoas = async () => {
      setLoading(true);
      try {
        console.debug('DEBUG PessoaService import:', PessoaService);
        console.debug('CHAMANDO PessoaService.findAll()');
        const data = await PessoaService.findAll();
        console.debug('RETORNO PessoaService.findAll():', data);
        // suporta paginação ({ content: [...] }) ou lista direta
        const raw = data.content ?? data;
        // Normaliza para array e garante `itens` como array em cada pessoa
        const pessoas = (Array.isArray(raw) ? raw : (raw ? [raw] : [])).map(p => ({
          ...p,
          itens: Array.isArray(p?.itens) ? p.itens : []
        }));
        console.debug('PESSOAS NORMALIZADAS:', pessoas);
        setDadosDoEstoque(pessoas);
      } catch (err) {
        message.error('Erro ao carregar pessoas do servidor');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadPessoas();
  }, []);
  const calcularPrevisao = (estoque, usoDiario) => {
    if (!estoque || !usoDiario || usoDiario === 0) return { dataFormatada: 'Indefinido', status: 'ok' };

    const diasDeDuracao = Math.floor(estoque / usoDiario);
    
    // Pega a data de hoje e soma os dias
    const dataFutura = new Date();
    dataFutura.setDate(dataFutura.getDate() + diasDeDuracao);

    // Formata para dia/mês/ano
    const dataFormatada = dataFutura.toLocaleDateString('pt-BR');

    // Define status (se sobrar menos de 5 dias, vira urgente)
    const status = diasDeDuracao <= 5 ? 'urgente' : 'ok';

    return { dataFormatada, status, diasRestantes: diasDeDuracao };
  };

  // --- HANDLERS PESSOA ---
  const handleAddPerson = () => {
    personForm.resetFields();
    setPersonModalVisible(true);
  };

  const handleSavePerson = () => {
    personForm.validateFields().then(values => {
      (async () => {
        try {
          const nova = { nome: values.nomePessoa, itens: [] };
          console.debug('CHAMANDO PessoaService.save() com:', nova);
          const saved = await PessoaService.save(nova);
          console.debug('RETORNO PessoaService.save():', saved);
          const savedNormalized = { ...saved, itens: Array.isArray(saved?.itens) ? saved.itens : [] };
          setDadosDoEstoque(prev => [...prev, savedNormalized]);
          setPersonModalVisible(false);
          message.success('Pessoa adicionada!');
        } catch (err) {
          console.error(err);
          message.error('Erro ao adicionar pessoa');
        }
      })();
    });
  };

  const handleDeletePerson = (id) => {
    (async () => {
      try {
        console.debug('CHAMANDO PessoaService.delete() id=', id);
        await PessoaService.delete(id);
        console.debug('PessoaService.delete() concluído para id=', id);
        setDadosDoEstoque(prev => prev.filter(p => p.id !== id));
        message.success('Pessoa removida');
      } catch (err) {
        console.error(err);
        message.error('Erro ao remover pessoa');
      }
    })();
  };

  // --- HANDLERS ITENS ---
  const handleAddItem = (personId) => {
    setEditingItem(null);
    setTargetPersonId(personId);
    itemForm.resetFields();
    setItemModalVisible(true);
  };

  const handleEditItem = (item, personId) => {
    setEditingItem(item);
    setTargetPersonId(personId);
    itemForm.setFieldsValue(item);
    setItemModalVisible(true);
  };

  const handleDeleteItem = (itemId, personId) => {
    const novosDados = dadosDoEstoque.map(p => 
      p.id === personId ? { ...p, itens: p.itens.filter(i => i.id !== itemId) } : p
    );
    setDadosDoEstoque(novosDados);
    (async () => {
      try {
        const pessoa = novosDados.find(p => p.id === personId);
        console.debug('CHAMANDO PessoaService.update() após remoção, pessoa=', pessoa);
        if (pessoa && pessoa.id) {
          const res = await PessoaService.update(pessoa.id, pessoa);
          console.debug('RETORNO PessoaService.update() after delete:', res);
        }
        message.success('Item removido');
      } catch (err) {
        console.error(err);
        message.error('Erro ao remover item no servidor');
      }
    })();
  };

  // --- ONDE A MÁGICA ACONTECE (SALVAR COM CÁLCULO) ---
  const handleSaveItem = () => {
    itemForm.validateFields().then(values => {
      // 1. Executa a previsão baseada nos números inseridos
      const previsao = calcularPrevisao(values.estoque, values.usoDiario);

      const itemProcessado = {
        remedio: values.remedio,
        estoque: values.estoque,
        usoDiario: values.usoDiario,
        // Campos gerados automaticamente:
        quantidade: `${values.estoque} un.`, // Exibição visual
        proximaCompra: previsao.dataFormatada,
        status: previsao.status
      };

      const novosDados = dadosDoEstoque.map(pessoa => {
        if (pessoa.id === targetPersonId) {
          const listaAtualizada = [...pessoa.itens];
          if (editingItem) {
            const index = listaAtualizada.findIndex(i => i.id === editingItem.id);
            if (index > -1) listaAtualizada[index] = { ...editingItem, ...itemProcessado };
          } else {
            listaAtualizada.push({ id: Date.now(), ...itemProcessado });
          }
          return { ...pessoa, itens: listaAtualizada };
        }
        return pessoa;
      });

      setDadosDoEstoque(novosDados);
      setItemModalVisible(false);
      // Sincroniza pessoa alterada com backend
      (async () => {
        try {
          const pessoaAtualizada = novosDados.find(p => p.id === targetPersonId);
          console.debug('CHAMANDO PessoaService.update() com:', pessoaAtualizada);
          if (pessoaAtualizada && pessoaAtualizada.id) {
            const res = await PessoaService.update(pessoaAtualizada.id, pessoaAtualizada);
            console.debug('RETORNO PessoaService.update():', res);
          }
          if (previsao.diasRestantes < 5) {
            message.warning(`Atenção: Esse remédio acabará em ${previsao.diasRestantes} dias!`);
          } else {
            message.success(`Salvo! Próxima compra estimada para ${previsao.dataFormatada}`);
          }
        } catch (err) {
          console.error(err);
          message.error('Erro ao sincronizar item com o servidor');
        }
      })();
    });
  };

  // KPIs
  const totalRemedios = (Array.isArray(dadosDoEstoque) ? dadosDoEstoque : []).reduce((acc, p) => acc + (p?.itens?.length ?? 0), 0);
  const comprasUrgentes = (Array.isArray(dadosDoEstoque) ? dadosDoEstoque : []).reduce((acc, p) => acc + ((p?.itens ?? []).filter(i => i.status === 'urgente').length), 0);

  return (
    <div style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      
      <div className="mb-4">
        <h2 style={{ margin: 0 }}>Farmácia Inteligente</h2>
        <span className="text-muted">Cálculo automático de reposição</span>
      </div>

      <Row gutter={[16, 16]} className="mb-4">
        <Col xs={24} sm={8}><Card bordered={false}><Statistic title="Medicamentos Monitorados" value={totalRemedios} prefix={<MedicineBoxOutlined />} /></Card></Col>
        <Col xs={24} sm={8}><Card bordered={false}><Statistic title="Pessoas" value={dadosDoEstoque.length} prefix={<TeamOutlined style={{ color: '#52c41a' }} />} /></Card></Col>
        <Col xs={24} sm={8}><Card bordered={false}><Statistic title="Reposição Urgente" value={comprasUrgentes} valueStyle={{ color: '#cf1322' }} prefix={<AlertOutlined />} /></Card></Col>
      </Row>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <Divider orientation="left" style={{ margin: 0, width: 'auto', minWidth: '150px' }}>Medicamentos por Pessoa</Divider>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddPerson}>Nova Pessoa</Button>
      </div>

      <Row gutter={[24, 24]}>
        {dadosDoEstoque.map((pessoa) => (
          <Col xs={24} lg={12} xl={8} key={pessoa.id}>
            <Card 
              title={<Space><Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} /><span>{pessoa.nome}</span></Space>} 
              bordered={false} 
              hoverable 
              style={{ height: '100%' }}
              extra={<Popconfirm title="Remover?" onConfirm={() => handleDeletePerson(pessoa.id)}><Button type="text" danger icon={<DeleteOutlined />} /></Popconfirm>}
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

      {/* --- MODAL DE MEDICAMENTO (INTELIGENTE) --- */}
      <Modal
        title={editingItem ? "Editar e Recalcular" : "Novo Medicamento"}
        open={itemModalVisible}
        onOk={handleSaveItem}
        onCancel={() => setItemModalVisible(false)}
        okText="Calcular e Salvar"
        cancelText="Cancelar"
      >
        <Form form={itemForm} layout="vertical">
          <Form.Item name="remedio" label="Nome do Medicamento" rules={[{ required: true }]}>
            <Input prefix={<MedicineBoxOutlined />} placeholder="Ex: Losartana" />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="estoque" 
                label="Estoque Atual (Unidades)" 
                tooltip="Quantos comprimidos você tem na caixa agora?"
                rules={[{ required: true, message: 'Obrigatório para o cálculo' }]}
              >
                <InputNumber style={{ width: '100%' }} min={1} placeholder="Ex: 30" />
              </Form.Item>
            </Col>
            <Col span={12}>
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

          <div className="bg-light p-3 rounded text-center text-muted">
            <CalculatorOutlined /> O sistema calculará a data da próxima compra automaticamente.
          </div>
        </Form>
      </Modal>

      {/* --- MODAL PESSOA --- */}
      <Modal
        title="Nova Pessoa"
        open={personModalVisible}
        onOk={handleSavePerson}
        onCancel={() => setPersonModalVisible(false)}
        okText="Adicionar"
      >
        <Form form={personForm} layout="vertical">
          <Form.Item name="nomePessoa" label="Nome" rules={[{ required: true }]}>
            <Input prefix={<UserOutlined />} />
          </Form.Item>
        </Form>
      </Modal>

    </div>
  );
};

export default Dashboard;