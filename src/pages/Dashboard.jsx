import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Statistic, Divider, Modal, Form, Input, InputNumber, message, Button, Popconfirm, Avatar, Space, TimePicker } from 'antd';
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
import RemedioService from '../api/RemedioService';
import moment from 'moment';

const Dashboard = () => {
 
  const [dadosDoEstoque, setDadosDoEstoque] = useState([]);

  // --- ESTADOS ---
  const [itemModalVisible, setItemModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [targetPersonId, setTargetPersonId] = useState(null);
  
  const [personModalVisible, setPersonModalVisible] = useState(false);
  
  const [itemForm] = Form.useForm();
  const [personForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
 

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await PessoaService.findAll();
      const raw = data.content ?? data;
      
      const pessoas = (Array.isArray(raw) ? raw : (raw ? [raw] : [])).map(p => ({
        ...p,
        itens: (p.remedios || p.itens || []).map(item => ({
          ...item,
          id: item.id,
          remedio: item.nome,
          estoque: item.quantidade,
          usoDiario: item.usoDiario,
          quantidade: `${item.quantidade} un.`,
          
          proximaCompra: item.proxCompra
            ? item.proxCompra.split('-').reverse().join('/')
            : 'A calcular',

          dataIso: item.proxCompra || '',
          status: item.status === 'NORMAL' ? 'ok' : (item.status === 'URGENTE' ? 'urgente' : 'atencao'),

          // TRATAMENTO DO HORÁRIO PARA EXIBIÇÃO
          horario: item.horaConsumo ? item.horaConsumo.substring(0,5) : '-', 
          horaIso: item.horaConsumo || ''
        }))
      }));

      setDadosDoEstoque(pessoas);
    } catch (err) {
      message.error('Erro ao carregar dados');
      console.error(err);
    } finally {
      setLoading(false);
    }
};

 useEffect(() => {

  fetchData();
  
    const loadPessoas = async () => {
      setLoading(true);
      try {
        const data = await PessoaService.findAll();
        
        const raw = data.content ?? data;
        
        const pessoas = (Array.isArray(raw) ? raw : (raw ? [raw] : [])).map(p => ({
          ...p,
          itens: (p.remedios || p.itens || []).map(item => ({
            ...item,
            id: item.id,
            remedio: item.nome,
            estoque: item.quantidade,
            usoDiario: item.usoDiario,
            quantidade: `${item.quantidade} un.`,

            proximaCompra: item.proxCompra
              ? item.proxCompra.split('-').reverse().join('/')
              : 'A calcular',

            dataIso: item.proxCompra || '',
            status: item.status === 'NORMAL' ? 'ok' : (item.status === 'URGENTE' ? 'urgente' : 'atencao'),

            horario: item.horaConsumo ? (typeof item.horaConsumo === 'string' ? item.horaConsumo.substring(0,5) : '') : '-',
            horaIso: item.horaConsumo || ''
          }))
        }));

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
          const saved = await PessoaService.save(nova);
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
        await PessoaService.delete(id);
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
    // Converte o horário string para moment para o TimePicker
    const valuesForForm = {
      ...item,
      horario: item.horario && item.horario !== '-' ? moment(item.horario, 'HH:mm') : null
    };
    itemForm.setFieldsValue(valuesForForm);
    setItemModalVisible(true);
  };

  const handleDeleteItem = (itemId, personId) => {
    (async () => {
      try {
        await RemedioService.delete(itemId);
        setDadosDoEstoque(prevDados => prevDados.map(pessoa => {
          if (pessoa.id === personId) {
            return {
              ...pessoa,
              itens: pessoa.itens.filter(item => item.id !== itemId)
            };
          }
          return pessoa;
        }));
        message.success('Item removido com sucesso!');
      } catch (err) {
        console.error(err);
        message.error('Erro ao remover item.');
      }
    })();
  };
  
const handleSaveItem = () => {
    itemForm.validateFields().then(values => {
      const payloadRemedio = {
        nome: values.remedio,           
        quantidade: values.estoque,     
        usoDiario: values.usoDiario,    
        pessoaId: targetPersonId        
      };
      
      // Formata o horário corretamente para o Backend (HH:mm:ss)
      if (values.horario) {
        payloadRemedio.horaConsumo = values.horario.format('HH:mm:ss');
      }

      setLoading(true); 
      (async () => {
        try {
          console.log('Enviando:', payloadRemedio);
          
          if (editingItem) {
            await RemedioService.update(editingItem.id, payloadRemedio);
            message.success('Medicamento atualizado!');
          } else {
            await RemedioService.save(payloadRemedio);
            message.success('Medicamento criado!');
          }
          
          // --- AQUI ESTÁ A CORREÇÃO ---
          setItemModalVisible(false); // Fecha o modal primeiro
          await fetchData();          // Recarrega os dados sem dar refresh na página (mantém o token)
          
        } catch (err) {
          console.error(err);
          // Detalhe melhor o erro se possível
          message.error('Erro ao salvar. Verifique se a pessoa existe.');
        } finally {
          setLoading(false);
        }
      })();
    });
  };

  const totalRemedios = (Array.isArray(dadosDoEstoque) ? dadosDoEstoque : []).reduce((acc, p) => acc + (p?.itens?.length ?? 0), 0);
  const totalUrgentes = dadosDoEstoque.reduce((acc, pessoa) => {
    const urgentesDessaPessoa = pessoa.itens.filter(item => item.status === 'urgente').length;
    return acc + urgentesDessaPessoa;
  }, 0);


  return (
    <div style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      
      <div className="mb-4">
        <h2 style={{ margin: 0 }}>Farmácia Inteligente</h2>
        <span className="text-muted">Cálculo automático de reposição</span>
      </div>

      <Row gutter={[16, 16]} className="mb-4">
        <Col xs={24} sm={8}><Card bordered={false}><Statistic title="Medicamentos Monitorados" value={totalRemedios} prefix={<MedicineBoxOutlined />} /></Card></Col>
        <Col xs={24} sm={8}><Card bordered={false}><Statistic title="Pessoas" value={dadosDoEstoque.length} prefix={<TeamOutlined style={{ color: '#52c41a' }} />} /></Card></Col>
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

     
     <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <Divider 
          orientation="center" 
          style={{ margin: 0, width: 'auto', minWidth: '150px', flexGrow: 1 }}
        >
            Medicamentos por Pessoa
        </Divider>
        
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddPerson}>
            Nova Pessoa
        </Button>
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

      <Modal
        title={editingItem ? "Editar e Recalcular" : "Novo Medicamento"}
        open={itemModalVisible}
        onOk={handleSaveItem}
        onCancel={() => setItemModalVisible(false)}
        okText="Calcular e Salvar"
        cancelText="Cancelar"
        width="95%"
        style={{ maxWidth: 520 }}
        bodyStyle={{ padding: '1rem' }}
        wrapClassName="d-flex align-items-start justify-content-center"
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