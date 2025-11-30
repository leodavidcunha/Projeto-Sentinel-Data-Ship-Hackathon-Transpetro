import { useState } from 'react';
import { registrosUploadMock } from '../../mocks/ingestao';
import { naviosMock } from '../../mocks/navios';
import { Cartao } from '../../components/atoms/Cartao';
import { Badge } from '../../components/atoms/Badge';

const PaginaIngestao = () => {
  const [abaSelecionada, setAbaSelecionada] = useState<'upload' | 'manual' | 'historico' | 'datalake' | 'regressao'>('upload');
  const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(null);
  const [categoriaUpload, setCategoriaUpload] = useState('Dados Obrigatórios');
  const [navioSelecionado, setNavioSelecionado] = useState('');
  const [processando, setProcessando] = useState(false);
  const [modalNovo, setModalNovo] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'ativo' | 'erro' | 'pausado'>('todos');
  
  // Estados para formulário manual expandido
  const [categoriaManual, setCategoriaManual] = useState('Dados Obrigatórios');
  const [subcategoriaManual, setSubcategoriaManual] = useState('');

  // Estados para o modal de Nova Fonte
  const [novaFonte, setNovaFonte] = useState({
    nome: '',
    tipo: 'API REST',
    categoria: 'Dados Obrigatórios',
    frequencia: 'Tempo Real',
    url: '',
    metodo: 'GET',
    autenticacao: 'API Key',
    apiKey: '',
    descricao: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArquivoSelecionado(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!arquivoSelecionado) return;
    setProcessando(true);
    setTimeout(() => {
      setProcessando(false);
      setArquivoSelecionado(null);
      alert('Arquivo processado com sucesso! IA extraiu os campos automaticamente.');
    }, 2000);
  };

  const handleSalvarNovaFonte = () => {
    // Validação básica
    if (!novaFonte.nome || !novaFonte.url) {
      alert('Por favor, preencha os campos obrigatórios (Nome e URL)');
      return;
    }
    
    // Simular salvamento
    alert(`Fonte "${novaFonte.nome}" criada com sucesso! A integração será ativada em alguns instantes.`);
    
    // Resetar formulário e fechar modal
    setNovaFonte({
      nome: '',
      tipo: 'API REST',
      categoria: 'Dados Obrigatórios',
      frequencia: 'Tempo Real',
      url: '',
      metodo: 'GET',
      autenticacao: 'API Key',
      apiKey: '',
      descricao: ''
    });
    setModalNovo(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aprovado': return 'bg-emerald-500';
      case 'Validação Pendente': return 'bg-yellow-500';
      case 'Processando': return 'bg-blue-500';
      case 'Rejeitado': return 'bg-red-500';
      case 'Erro': return 'bg-red-600';
      default: return 'bg-slate-600';
    }
  };

  const categoriasDataLake = [
    { id: 'obrigatorios', nome: 'Dados Obrigatórios', icon: 'ri-ship-line', cor: 'cyan' },
    { id: 'meteorologicos', nome: 'Meteorológicos', icon: 'ri-cloud-windy-line', cor: 'blue' },
    { id: 'subaquaticos', nome: 'Subaquáticos', icon: 'ri-water-flash-line', cor: 'teal' },
    { id: 'limpeza', nome: 'Limpeza', icon: 'ri-brush-line', cor: 'green' },
    { id: 'noon', nome: 'Relatórios Noon', icon: 'ri-file-list-3-line', cor: 'purple' },
    { id: 'gps', nome: 'GPS/AIS', icon: 'ri-map-pin-line', cor: 'orange' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Lake Naval & ETL Inteligente</h1>
            <p className="text-gray-600">Sistema completo de ingestão, validação e integração de dados</p>
          </div>
          <button 
            onClick={() => setModalNovo(true)}
            className="px-6 py-3 bg-transpetro-green-600 text-white rounded-lg font-medium hover:bg-transpetro-green-700 transition-colors whitespace-nowrap cursor-pointer"
          >
            <i className="ri-add-line mr-2"></i>
            Nova Fonte
          </button>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <Cartao>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-600 mb-1">Total Processado</div>
                <div className="text-2xl font-bold text-cyan-600">17.2k</div>
                <div className="text-xs text-gray-600 mt-1">Registros</div>
              </div>
              <div className="w-10 h-10 flex items-center justify-center bg-cyan-500/20 rounded-lg">
                <i className="ri-file-list-3-line text-xl text-cyan-600"></i>
              </div>
            </div>
          </Cartao>

          <Cartao>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-600 mb-1">Taxa de Sucesso</div>
                <div className="text-2xl font-bold text-emerald-600">99.8%</div>
                <div className="text-xs text-gray-600 mt-1">Validação</div>
              </div>
              <div className="w-10 h-10 flex items-center justify-center bg-emerald-500/20 rounded-lg">
                <i className="ri-checkbox-circle-line text-xl text-emerald-600"></i>
              </div>
            </div>
          </Cartao>

          <Cartao>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-600 mb-1">Pendentes</div>
                <div className="text-2xl font-bold text-yellow-600">3</div>
                <div className="text-xs text-gray-600 mt-1">Validação</div>
              </div>
              <div className="w-10 h-10 flex items-center justify-center bg-yellow-500/20 rounded-lg">
                <i className="ri-time-line text-xl text-yellow-600"></i>
              </div>
            </div>
          </Cartao>

          <Cartao>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-600 mb-1">IA Ativa</div>
                <div className="text-2xl font-bold text-purple-600">95%</div>
                <div className="text-xs text-gray-600 mt-1">Confiança</div>
              </div>
              <div className="w-10 h-10 flex items-center justify-center bg-purple-500/20 rounded-lg">
                <i className="ri-brain-line text-xl text-purple-600"></i>
              </div>
            </div>
          </Cartao>

          <Cartao>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-600 mb-1">Categorias</div>
                <div className="text-2xl font-bold text-blue-600">6</div>
                <div className="text-xs text-gray-600 mt-1">Data Lake</div>
              </div>
              <div className="w-10 h-10 flex items-center justify-center bg-blue-500/20 rounded-lg">
                <i className="ri-database-2-line text-xl text-blue-600"></i>
              </div>
            </div>
          </Cartao>
        </div>

        {/* Abas */}
        <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
          {[
            { id: 'datalake', label: 'Data Lake Naval', icon: 'ri-database-2-line' },
            { id: 'upload', label: 'Upload de Arquivos', icon: 'ri-upload-cloud-line' },
            { id: 'manual', label: 'Entrada Manual', icon: 'ri-edit-box-line' },
            { id: 'historico', label: 'Histórico', icon: 'ri-history-line' },
            { id: 'regressao', label: 'Análise de Regressão', icon: 'ri-function-line' }
          ].map(aba => (
            <button
              key={aba.id}
              onClick={() => setAbaSelecionada(aba.id as any)}
              className={`px-5 py-2 font-medium transition-all whitespace-nowrap text-sm cursor-pointer ${
                abaSelecionada === aba.id
                  ? 'text-transpetro-green-600 border-b-2 border-transpetro-green-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <i className={`${aba.icon} mr-2`}></i>
              {aba.label}
            </button>
          ))}
        </div>

        {/* Data Lake Naval */}
        {abaSelecionada === 'datalake' && (
          <div className="space-y-6">
            {/* Visão Geral das Categorias */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categoriasDataLake.map(cat => (
                <Cartao key={cat.id}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 flex items-center justify-center bg-${cat.cor}-500/20 rounded-lg`}>
                      <i className={`${cat.icon} text-2xl text-${cat.cor}-600`}></i>
                    </div>
                    <Badge cor={`bg-${cat.cor}-500`} className="text-xs">Ativo</Badge>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{cat.nome}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Registros</span>
                      <span className="font-medium text-gray-900">
                        {cat.id === 'obrigatorios' ? '1.2k' :
                         cat.id === 'meteorologicos' ? '8.5k' :
                         cat.id === 'subaquaticos' ? '342' :
                         cat.id === 'limpeza' ? '156' :
                         cat.id === 'noon' ? '4.8k' : '12.3k'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Última atualização</span>
                      <span className="font-medium text-gray-900">Hoje</span>
                    </div>
                  </div>
                </Cartao>
              ))}
            </div>

            {/* Detalhamento por Categoria */}
            <Cartao>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <i className="ri-ship-line text-cyan-600 mr-2"></i>
                1. Dados Obrigatórios
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { campo: 'Classe do navio', tipo: 'Texto', obrigatorio: true },
                  { campo: 'Modelo tinta antifouling', tipo: 'Texto', obrigatorio: true },
                  { campo: 'Especificações da tinta', tipo: 'Texto', obrigatorio: true },
                  { campo: 'Datas de docagem', tipo: 'Data', obrigatorio: true },
                  { campo: 'Data de construção', tipo: 'Data', obrigatorio: true },
                  { campo: 'Relatórios Noon', tipo: 'Arquivo', obrigatorio: true },
                  { campo: 'Perfil operacional', tipo: 'Texto', obrigatorio: true },
                  { campo: 'Localizações GPS', tipo: 'Coordenadas', obrigatorio: true },
                  { campo: 'Consumo real vs estimado', tipo: 'Numérico', obrigatorio: true },
                  { campo: 'Velocidade (knots)', tipo: 'Numérico', obrigatorio: true },
                  { campo: 'Distância navegada', tipo: 'Numérico', obrigatorio: true },
                  { campo: 'Eventos operacionais', tipo: 'Seleção', obrigatorio: true }
                ].map((campo, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{campo.campo}</span>
                      {campo.obrigatorio && (
                        <span className="text-xs text-red-600">*</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-600">{campo.tipo}</span>
                  </div>
                ))}
              </div>
            </Cartao>

            <Cartao>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <i className="ri-cloud-windy-line text-blue-600 mr-2"></i>
                2. Dados Meteorológicos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { campo: 'Timestamp', tipo: 'Data/Hora', obrigatorio: true },
                  { campo: 'Latitude', tipo: 'Coordenada', obrigatorio: true },
                  { campo: 'Longitude', tipo: 'Coordenada', obrigatorio: true },
                  { campo: 'Velocidade do vento (m/s)', tipo: 'Numérico', obrigatorio: true },
                  { campo: 'Direção do vento (°)', tipo: 'Numérico', obrigatorio: true },
                  { campo: 'Intensidade corrente (m/s)', tipo: 'Numérico', obrigatorio: true },
                  { campo: 'Direção corrente (°)', tipo: 'Numérico', obrigatorio: true },
                  { campo: 'Altura das ondas (m)', tipo: 'Numérico', obrigatorio: true },
                  { campo: 'Período das ondas (s)', tipo: 'Numérico', obrigatorio: true },
                  { campo: 'Direção das ondas (°)', tipo: 'Numérico', obrigatorio: true },
                  { campo: 'SWH - Significant Wave Height', tipo: 'Numérico', obrigatorio: true }
                ].map((campo, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{campo.campo}</span>
                      {campo.obrigatorio && (
                        <span className="text-xs text-red-600">*</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-600">{campo.tipo}</span>
                  </div>
                ))}
              </div>
            </Cartao>

            <Cartao>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <i className="ri-water-flash-line text-teal-600 mr-2"></i>
                3. Dados Subaquáticos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { campo: 'Relatórios de inspeção', tipo: 'Arquivo PDF', obrigatorio: true },
                  { campo: 'Fotos subaquáticas', tipo: 'Imagem', obrigatorio: true },
                  { campo: 'Vídeos de inspeção', tipo: 'Vídeo', obrigatorio: true },
                  { campo: 'Nível incrustação (IA)', tipo: 'Numérico 0-100', obrigatorio: true },
                  { campo: 'Escala IMO MEPC.378', tipo: 'Seleção 0-4', obrigatorio: true },
                  { campo: 'Observações técnicas', tipo: 'Texto longo', obrigatorio: false }
                ].map((campo, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{campo.campo}</span>
                      {campo.obrigatorio && (
                        <span className="text-xs text-red-600">*</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-600">{campo.tipo}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <div className="flex items-start gap-2">
                  <i className="ri-brain-line text-purple-600 text-lg mt-0.5"></i>
                  <div>
                    <div className="text-sm font-medium text-gray-900 mb-1">IA de Análise Visual</div>
                    <div className="text-xs text-gray-700">
                      Sistema detecta automaticamente o nível de incrustação em fotos e vídeos, classificando segundo a Escala IMO MEPC.378
                    </div>
                  </div>
                </div>
              </div>
            </Cartao>

            <Cartao>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <i className="ri-brush-line text-green-600 mr-2"></i>
                4. Dados de Limpeza
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { campo: 'Data da limpeza', tipo: 'Data', obrigatorio: true },
                  { campo: 'Método utilizado', tipo: 'Seleção', obrigatorio: true },
                  { campo: 'Região do casco', tipo: 'Texto', obrigatorio: true },
                  { campo: 'Fotos antes', tipo: 'Imagem', obrigatorio: true },
                  { campo: 'Fotos depois', tipo: 'Imagem', obrigatorio: true },
                  { campo: 'Vídeos antes', tipo: 'Vídeo', obrigatorio: false },
                  { campo: 'Vídeos depois', tipo: 'Vídeo', obrigatorio: false },
                  { campo: '% Redução resistência', tipo: 'Numérico', obrigatorio: true },
                  { campo: 'Custo total', tipo: 'Monetário', obrigatorio: true }
                ].map((campo, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{campo.campo}</span>
                      {campo.obrigatorio && (
                        <span className="text-xs text-red-600">*</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-600">{campo.tipo}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
                <div className="text-xs text-gray-700 p-2 bg-gray-50 rounded">
                  <span className="font-medium">Métodos:</span> in-water, dock, captura, ROV, jato d'água, soft brush
                </div>
              </div>
            </Cartao>

            <Cartao>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <i className="ri-file-list-3-line text-purple-600 mr-2"></i>
                5. Relatórios Noon & Operacionais
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { campo: 'Timestamp', tipo: 'Data/Hora', obrigatorio: true },
                  { campo: 'Latitude', tipo: 'Coordenada', obrigatorio: true },
                  { campo: 'Longitude', tipo: 'Coordenada', obrigatorio: true },
                  { campo: 'Velocidade (knots)', tipo: 'Numérico', obrigatorio: true },
                  { campo: 'Distância navegada (nm)', tipo: 'Numérico', obrigatorio: true },
                  { campo: 'Consumo real (ton)', tipo: 'Numérico', obrigatorio: true },
                  { campo: 'Consumo estimado (ton)', tipo: 'Numérico', obrigatorio: true },
                  { campo: 'Tipo de evento', tipo: 'Seleção', obrigatorio: true },
                  { campo: 'Observações', tipo: 'Texto', obrigatorio: false }
                ].map((campo, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{campo.campo}</span>
                      {campo.obrigatorio && (
                        <span className="text-xs text-red-600">*</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-600">{campo.tipo}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="text-xs text-gray-700 p-2 bg-gray-50 rounded text-center">
                  <i className="ri-pause-circle-line text-yellow-600 mr-1"></i>
                  Idle
                </div>
                <div className="text-xs text-gray-700 p-2 bg-gray-50 rounded text-center">
                  <i className="ri-water-percent-line text-blue-600 mr-1"></i>
                  Águas Interiores
                </div>
                <div className="text-xs text-gray-700 p-2 bg-gray-50 rounded text-center">
                  <i className="ri-ship-2-line text-cyan-600 mr-1"></i>
                  Cruzeiro
                </div>
                <div className="text-xs text-gray-700 p-2 bg-gray-50 rounded text-center">
                  <i className="ri-steering-2-line text-purple-600 mr-1"></i>
                  Manobrando
                </div>
              </div>
            </Cartao>

            {/* Input Manual com IA */}
            <Cartao>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  <i className="ri-upload-2-line text-transpetro-green-600 mr-2"></i>
                  Input Manual com Extração por IA
                </h3>
                <Badge cor="bg-purple-500" className="text-xs">
                  <i className="ri-brain-line mr-1"></i>
                  IA Ativa
                </Badge>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-lg mb-4">
                <div className="flex items-start gap-3">
                  <i className="ri-magic-line text-purple-600 text-2xl"></i>
                  <div>
                    <div className="text-sm font-medium text-gray-900 mb-2">Como funciona:</div>
                    <ol className="text-xs text-gray-700 space-y-1 list-decimal list-inside">
                      <li>Faça upload de PDF, XLSX, DOC ou imagens (JPG/PNG)</li>
                      <li>IA extrai automaticamente todos os campos relevantes</li>
                      <li>Sistema realiza validação semântica dos dados</li>
                      <li>Você revisa e aprova as sugestões da IA</li>
                      <li>Dados são integrados ao Data Lake global</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-transpetro-green-500 transition-colors cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      id="file-upload-ia"
                      accept=".csv,.xlsx,.xls,.pdf,.doc,.docx,.jpg,.jpeg,.png"
                      multiple
                    />
                    <label htmlFor="file-upload-ia" className="cursor-pointer">
                      <i className="ri-file-upload-line text-4xl text-gray-400 mb-2 block"></i>
                      <p className="text-sm text-gray-900 font-medium mb-1">
                        Arraste arquivos ou clique aqui
                      </p>
                      <p className="text-xs text-gray-600">
                        PDF, XLSX, DOC, JPG - Múltiplos arquivos
                      </p>
                    </label>
                  </div>
                  
                  <button className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors whitespace-nowrap">
                    <i className="ri-brain-line mr-2"></i>
                    Processar com IA
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <i className="ri-checkbox-circle-line text-cyan-600"></i>
                      <span className="text-sm font-medium text-gray-900">Validação Semântica</span>
                    </div>
                    <p className="text-xs text-gray-700">
                      IA verifica coerência dos dados extraídos com o contexto naval
                    </p>
                  </div>

                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <i className="ri-links-line text-emerald-600"></i>
                      <span className="text-sm font-medium text-gray-900">Auto-relacionamento</span>
                    </div>
                    <p className="text-xs text-gray-700">
                      Associa automaticamente com navios, eventos e histórico
                    </p>
                  </div>

                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <i className="ri-error-warning-line text-yellow-600"></i>
                      <span className="text-sm font-medium text-gray-900">Detecção de Anomalias</span>
                    </div>
                    <p className="text-xs text-gray-700">
                      Identifica valores fora do padrão e sugere correções
                    </p>
                  </div>
                </div>
              </div>
            </Cartao>
          </div>
        )}

        {/* Upload de Arquivos */}
        {abaSelecionada === 'upload' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Área de Upload */}
            <Cartao>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload de Documentos</h3>
              
              <div className="space-y-4">
                {/* Categoria */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Categoria de Dados
                  </label>
                  <select
                    value={categoriaUpload}
                    onChange={(e) => setCategoriaUpload(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500"
                  >
                    <option>Dados Obrigatórios</option>
                    <option>Meteorológicos</option>
                    <option>Subaquáticos</option>
                    <option>Limpeza</option>
                    <option>Relatórios Noon</option>
                    <option>GPS/AIS</option>
                    <option>Inspeção</option>
                    <option>Evento Operacional</option>
                    <option>Consumo</option>
                    <option>Compliance</option>
                    <option>Ambiental</option>
                    <option>Documento Livre</option>
                  </select>
                </div>

                {/* Navio */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Navio (Opcional)
                  </label>
                  <select
                    value={navioSelecionado}
                    onChange={(e) => setNavioSelecionado(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500"
                  >
                    <option value="">Selecione um navio...</option>
                    {naviosMock.map(navio => (
                      <option key={navio.id} value={navio.id}>{navio.nome}</option>
                    ))}
                  </select>
                </div>

                {/* Área de Drop */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-transpetro-green-500 transition-colors cursor-pointer">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    accept=".csv,.xlsx,.xls,.pdf,.doc,.docx,.jpg,.jpeg,.png,.mp4,.avi"
                    multiple
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <i className="ri-upload-cloud-2-line text-5xl text-gray-400 mb-3 block"></i>
                    <p className="text-gray-900 font-medium mb-1">
                      {arquivoSelecionado ? arquivoSelecionado.name : 'Clique ou arraste arquivos aqui'}
                    </p>
                    <p className="text-xs text-gray-600">
                      Suporta: CSV, XLSX, PDF, DOCX, Imagens, Vídeos
                    </p>
                  </label>
                </div>

                {/* Botão Upload */}
                <button
                  onClick={handleUpload}
                  disabled={!arquivoSelecionado || processando}
                  className={`w-full px-4 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    !arquivoSelecionado || processando
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-transpetro-green-600 text-white hover:bg-transpetro-green-700'
                  }`}
                >
                  {processando ? (
                    <>
                      <i className="ri-loader-4-line mr-2 animate-spin"></i>
                      Processando...
                    </>
                  ) : (
                    <>
                      <i className="ri-upload-line mr-2"></i>
                      Fazer Upload
                    </>
                  )}
                </button>
              </div>
            </Cartao>

            {/* Informações e Recursos IA */}
            <div className="space-y-4">
              <Cartao>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Recursos de IA</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <i className="ri-brain-line text-purple-600 text-xl mt-0.5"></i>
                    <div>
                      <div className="text-sm font-medium text-gray-900 mb-1">Extração Inteligente</div>
                      <div className="text-xs text-gray-700">
                        IA extrai dados automaticamente de PDFs e imagens
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                    <i className="ri-shield-check-line text-cyan-600 text-xl mt-0.5"></i>
                    <div>
                      <div className="text-sm font-medium text-gray-900 mb-1">Validação Automática</div>
                      <div className="text-xs text-gray-700">
                        Verifica consistência e sugere correções
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                    <i className="ri-links-line text-emerald-600 text-xl mt-0.5"></i>
                    <div>
                      <div className="text-sm font-medium text-gray-900 mb-1">Associação Inteligente</div>
                      <div className="text-xs text-gray-700">
                        Relaciona dados com navios e eventos existentes
                      </div>
                    </div>
                  </div>
                </div>
              </Cartao>

              <Cartao>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Formatos Suportados</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { tipo: 'CSV', icon: 'ri-file-text-line', cor: 'text-green-600' },
                    { tipo: 'XLSX', icon: 'ri-file-excel-2-line', cor: 'text-emerald-600' },
                    { tipo: 'PDF', icon: 'ri-file-pdf-line', cor: 'text-red-600' },
                    { tipo: 'DOCX', icon: 'ri-file-word-2-line', cor: 'text-blue-600' },
                    { tipo: 'JPG/PNG', icon: 'ri-image-line', cor: 'text-purple-600' },
                    { tipo: 'JSON', icon: 'ri-file-code-line', cor: 'text-yellow-600' }
                  ].map(formato => (
                    <div key={formato.tipo} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <i className={`${formato.icon} ${formato.cor} text-lg`}></i>
                      <span className="text-sm text-gray-900">{formato.tipo}</span>
                    </div>
                  ))}
                </div>
              </Cartao>
            </div>
          </div>
        )}

        {/* Entrada Manual */}
        {abaSelecionada === 'manual' && (
          <div className="space-y-4">
            <Cartao>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Formulário de Entrada Manual</h3>
              
              {/* Seleção de Categoria */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Selecione a Categoria de Dados *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categoriasDataLake.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setCategoriaManual(cat.nome);
                        setSubcategoriaManual('');
                      }}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        categoriaManual === cat.nome
                          ? `border-${cat.cor}-500 bg-${cat.cor}-500/10`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <i className={`${cat.icon} text-xl text-${cat.cor}-600 mb-2 block`}></i>
                      <div className="text-sm font-medium text-gray-900">{cat.nome}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Formulário Dinâmico baseado na categoria */}
              {categoriaManual === 'Dados Obrigatórios' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Navio *</label>
                      <select className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500">
                        <option value="">Selecione...</option>
                        {naviosMock.map(navio => (
                          <option key={navio.id} value={navio.id}>{navio.nome}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Classe do Navio *</label>
                      <input type="text" placeholder="Ex: Suezmax" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Modelo Tinta Antifouling *</label>
                      <input type="text" placeholder="Ex: International Intersleek 1100SR" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Especificações da Tinta *</label>
                      <textarea rows={3} placeholder="Detalhes técnicos..." className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500 resize-none"></textarea>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Data de Docagem *</label>
                      <input type="date" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Data de Construção *</label>
                      <input type="date" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Perfil Operacional *</label>
                      <select className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500">
                        <option>Longo curso</option>
                        <option>Cabotagem</option>
                        <option>Misto</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Velocidade Média (knots) *</label>
                      <input type="number" step="0.1" placeholder="Ex: 14.5" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500" />
                    </div>
                  </div>
                </div>
              )}

              {categoriaManual === 'Meteorológicos' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Timestamp *</label>
                    <input type="datetime-local" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Latitude *</label>
                    <input type="number" step="0.000001" placeholder="-23.550520" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Longitude *</label>
                    <input type="number" step="0.000001" placeholder="-46.633308" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Velocidade Vento (m/s) *</label>
                    <input type="number" step="0.1" placeholder="Ex: 8.5" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Direção Vento (°) *</label>
                    <input type="number" min="0" max="360" placeholder="0-360" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Intensidade Corrente (m/s) *</label>
                    <input type="number" step="0.1" placeholder="Ex: 1.2" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Direção Corrente (°) *</label>
                    <input type="number" min="0" max="360" placeholder="0-360" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Altura Ondas (m) *</label>
                    <input type="number" step="0.1" placeholder="Ex: 2.5" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">SWH (m) *</label>
                    <input type="number" step="0.1" placeholder="Significant Wave Height" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500" />
                  </div>
                </div>
              )}

              {categoriaManual === 'Subaquáticos' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Navio *</label>
                      <select className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500">
                        <option value="">Selecione...</option>
                        {naviosMock.map(navio => (
                          <option key={navio.id} value={navio.id}>{navio.nome}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Data da Inspeção *</label>
                      <input type="date" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Nível Incrustação IA (0-100) *</label>
                      <input type="number" min="0" max="100" placeholder="Detectado por IA" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Escala IMO MEPC.378 *</label>
                      <select className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500">
                        <option value="0">0 - Sem incrustação</option>
                        <option value="1">1 - Biofilme leve</option>
                        <option value="2">2 - Incrustação moderada</option>
                        <option value="3">3 - Incrustação pesada</option>
                        <option value="4">4 - Incrustação severa</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Upload Fotos *</label>
                      <input type="file" accept="image/*" multiple className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Upload Vídeos</label>
                      <input type="file" accept="video/*" multiple className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Relatório PDF *</label>
                      <input type="file" accept=".pdf" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Observações</label>
                      <textarea rows={4} placeholder="Detalhes técnicos da inspeção..." className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500 resize-none"></textarea>
                    </div>
                  </div>
                </div>
              )}

              {categoriaManual === 'Limpeza' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Navio *</label>
                      <select className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500">
                        <option value="">Selecione...</option>
                        {naviosMock.map(navio => (
                          <option key={navio.id} value={navio.id}>{navio.nome}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Data da Limpeza *</label>
                      <input type="date" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Método Utilizado *</label>
                      <select className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500">
                        <option>in-water</option>
                        <option>dock</option>
                        <option>captura</option>
                        <option>ROV</option>
                        <option>jato-agua</option>
                        <option>soft-brush</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Região do Casco *</label>
                      <input type="text" placeholder="Ex: Proa, Popa, Lateral..." className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">% Redução Resistência *</label>
                      <input type="number" min="0" max="100" step="0.1" placeholder="Ex: 15.5" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Custo Total (R$) *</label>
                      <input type="number" step="0.01" placeholder="Ex: 185000.00" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Fotos Antes *</label>
                      <input type="file" accept="image/*" multiple className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Fotos Depois *</label>
                      <input type="file" accept="image/*" multiple className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500" />
                    </div>
                  </div>
                </div>
              )}

              {categoriaManual === 'Relatórios Noon' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Navio *</label>
                    <select className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500">
                      <option value="">Selecione...</option>
                      {naviosMock.map(navio => (
                        <option key={navio.id} value={navio.id}>{navio.nome}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Timestamp *</label>
                    <input type="datetime-local" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Velocidade (knots) *</label>
                    <input type="number" step="0.1" placeholder="Ex: 14.5" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Distância (nm) *</label>
                    <input type="number" step="0.1" placeholder="Milhas náuticas" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Consumo Real (ton) *</label>
                    <input type="number" step="0.01" placeholder="Ex: 45.5" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Consumo Estimado (ton) *</label>
                    <input type="number" step="0.01" placeholder="Ex: 42.0" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Tipo de Evento *</label>
                    <select className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500">
                      <option>idle</option>
                      <option>aguas-interiores</option>
                      <option>cruzeiro</option>
                      <option>manobrando</option>
                    </select>
                  </div>
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-900 mb-2">Observações</label>
                    <textarea rows={3} placeholder="Detalhes do relatório..." className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500 resize-none"></textarea>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button className="flex-1 px-4 py-3 bg-transpetro-green-600 text-white rounded-lg font-medium hover:bg-transpetro-green-700 transition-colors whitespace-nowrap">
                  <i className="ri-save-line mr-2"></i>
                  Salvar no Data Lake
                </button>
                <button className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors whitespace-nowrap">
                  <i className="ri-close-line mr-2"></i>
                  Limpar
                </button>
              </div>
            </Cartao>
          </div>
        )}

        {/* Histórico */}
        {abaSelecionada === 'historico' && (
          <div className="space-y-4">
            {registrosUploadMock.map(registro => (
              <Cartao key={registro.id}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <i className={`${
                        registro.tipoArquivo === 'CSV' ? 'ri-file-text-line text-green-600' :
                        registro.tipoArquivo === 'XLSX' ? 'ri-file-excel-2-line text-emerald-600' :
                        registro.tipoArquivo === 'PDF' ? 'ri-file-pdf-line text-red-600' :
                        registro.tipoArquivo === 'DOCX' ? 'ri-file-word-2-line text-blue-600' :
                        registro.tipoArquivo === 'Imagem' ? 'ri-image-line text-purple-600' :
                        'ri-file-code-line text-yellow-600'
                      } text-xl`}></i>
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">{registro.nomeArquivo}</h3>
                        <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
                          <span>
                            <i className="ri-user-line mr-1"></i>
                            {registro.usuario}
                          </span>
                          <span>
                            <i className="ri-calendar-line mr-1"></i>
                            {new Date(registro.dataUpload).toLocaleString('pt-BR')}
                          </span>
                          <span>
                            <i className="ri-file-line mr-1"></i>
                            {(registro.tamanhoArquivo / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge cor={getStatusColor(registro.status)} className="text-xs">
                    {registro.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-4 gap-3 mb-3">
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <div className="text-xs text-gray-600 mb-1">Categoria</div>
                    <div className="text-sm font-medium text-gray-900">{registro.categoria}</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <div className="text-xs text-gray-600 mb-1">Processados</div>
                    <div className="text-sm font-medium text-cyan-600">{registro.registrosProcessados}</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <div className="text-xs text-gray-600 mb-1">Válidos</div>
                    <div className="text-sm font-medium text-emerald-600">{registro.registrosValidos}</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <div className="text-xs text-gray-600 mb-1">Inválidos</div>
                    <div className="text-sm font-medium text-red-600">{registro.registrosInvalidos}</div>
                  </div>
                </div>

                {registro.erros.length > 0 && (
                  <div className="mb-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <div className="text-xs font-medium text-red-600 mb-2">
                      <i className="ri-error-warning-line mr-1"></i>
                      Erros Encontrados ({registro.erros.length})
                    </div>
                    <div className="space-y-1">
                      {registro.erros.slice(0, 2).map((erro, idx) => (
                        <div key={idx} className="text-xs text-gray-700">
                          Linha {erro.linha}: {erro.mensagem}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {registro.sugestoesIA.length > 0 && (
                  <div className="mb-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <div className="text-xs font-medium text-purple-600 mb-2">
                      <i className="ri-brain-line mr-1"></i>
                      Sugestões da IA ({registro.sugestoesIA.length})
                    </div>
                    <div className="space-y-2">
                      {registro.sugestoesIA.slice(0, 2).map((sugestao, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <div className="text-gray-700">
                            <span className="text-gray-600">{sugestao.campo}:</span> {String(sugestao.valorOriginal)} → {String(sugestao.valorSugerido)}
                          </div>
                          <Badge cor={sugestao.aceita ? 'bg-emerald-500' : 'bg-slate-600'} className="text-xs">
                            {sugestao.confianca}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {registro.aprovadoPor && (
                  <div className="text-xs text-gray-600">
                    <i className="ri-checkbox-circle-line text-emerald-600 mr-1"></i>
                    Aprovado por {registro.aprovadoPor} em {new Date(registro.dataAprovacao!).toLocaleString('pt-BR')}
                  </div>
                )}
              </Cartao>
            ))}
          </div>
        )}

        {/* Análise de Regressão */}
        {abaSelecionada === 'regressao' && (
          <div className="space-y-6">
            {/* Seletor de Navio */}
            <Cartao>
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Embarcação em Análise:</label>
                <select 
                  className="bg-white text-gray-800 px-4 py-2 rounded-lg border border-gray-300 focus:border-transpetro-green-500 focus:outline-none cursor-pointer"
                >
                  {naviosMock.map(navio => (
                    <option key={navio.id} value={navio.id}>{navio.nome} - {navio.classe}</option>
                  ))}
                </select>
              </div>
            </Cartao>

            {/* Descrição */}
            <Cartao className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 flex items-center justify-center bg-blue-600 rounded-xl flex-shrink-0">
                  <i className="ri-function-line text-2xl text-white"></i>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Análise de Regressão Multivariada</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    Sistema avançado de análise que isola e quantifica cada fator que impacta o consumo e performance da embarcação, 
                    utilizando dados reais operacionais, ambientais, de carregamento e condições do casco.
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-start gap-2">
                      <i className="ri-check-line text-emerald-600 mt-0.5"></i>
                      <span className="text-gray-700">Curvas Speed-Power teóricas vs reais</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <i className="ri-check-line text-emerald-600 mt-0.5"></i>
                      <span className="text-gray-700">Dados ambientais (vento, ondas, correntes)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <i className="ri-check-line text-emerald-600 mt-0.5"></i>
                      <span className="text-gray-700">Dados de carregamento (ballast/laden)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <i className="ri-check-line text-emerald-600 mt-0.5"></i>
                      <span className="text-gray-700">TRIM, deslocamento e condição operacional</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <i className="ri-check-line text-emerald-600 mt-0.5"></i>
                      <span className="text-gray-700">Isolamento de fatores por regressão</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <i className="ri-check-line text-emerald-600 mt-0.5"></i>
                      <span className="text-gray-700">Quantificação de impacto individual</span>
                    </div>
                  </div>
                </div>
              </div>
            </Cartao>

            {/* Fatores Analisados */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Cartao className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 flex items-center justify-center bg-red-500 rounded-lg">
                    <i className="ri-ship-line text-2xl text-white"></i>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Fator Principal</div>
                    <div className="text-lg font-bold text-gray-900">Bioincrustação</div>
                  </div>
                </div>
                <div className="text-sm text-gray-700">
                  Análise do IBI e impacto da resistência hidrodinâmica adicional causada por organismos marinhos no casco
                </div>
              </Cartao>

              <Cartao className="bg-gradient-to-br from-cyan-50 to-cyan-100 border-2 border-cyan-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 flex items-center justify-center bg-cyan-500 rounded-lg">
                    <i className="ri-windy-line text-2xl text-white"></i>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Condições</div>
                    <div className="text-lg font-bold text-gray-900">Ambientais</div>
                  </div>
                </div>
                <div className="text-sm text-gray-700">
                  Impacto de vento, ondas e correntes marítimas na resistência ao avanço e consumo de combustível
                </div>
              </Cartao>

              <Cartao className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 flex items-center justify-center bg-emerald-500 rounded-lg">
                    <i className="ri-ship-2-line text-2xl text-white"></i>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Condição</div>
                    <div className="text-lg font-bold text-gray-900">Carregamento</div>
                  </div>
                </div>
                <div className="text-sm text-gray-700">
                  Análise de ballast/laden, calado, deslocamento e distribuição de carga afetando eficiência
                </div>
              </Cartao>

              <Cartao className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 flex items-center justify-center bg-blue-500 rounded-lg">
                    <i className="ri-contrast-2-line text-2xl text-white"></i>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Otimização</div>
                    <div className="text-lg font-bold text-gray-900">TRIM</div>
                  </div>
                </div>
                <div className="text-sm text-gray-700">
                  Diferença entre calado de proa e popa e seu impacto na resistência hidrodinâmica
                </div>
              </Cartao>

              <Cartao className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 flex items-center justify-center bg-purple-500 rounded-lg">
                    <i className="ri-paint-brush-line text-2xl text-white"></i>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Degradação</div>
                    <div className="text-lg font-bold text-gray-900">Tinta Antifouling</div>
                  </div>
                </div>
                <div className="text-sm text-gray-700">
                  Perda progressiva de eficiência do revestimento antifouling ao longo do tempo
                </div>
              </Cartao>

              <Cartao className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 flex items-center justify-center bg-orange-500 rounded-lg">
                    <i className="ri-line-chart-line text-2xl text-white"></i>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Curvas</div>
                    <div className="text-lg font-bold text-gray-900">Speed-Power</div>
                  </div>
                </div>
                <div className="text-sm text-gray-700">
                  Comparação entre curvas teóricas da classe e performance real medida em operação
                </div>
              </Cartao>
            </div>

            {/* Exemplo de Resultado */}
            <Cartao>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Exemplo de Decomposição de Consumo</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-48 text-sm font-medium text-gray-700">Consumo Base (Ideal):</div>
                  <div className="flex-1 h-8 bg-emerald-100 rounded-lg flex items-center px-4">
                    <span className="text-sm font-bold text-emerald-700">38.5 t/dia</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-48 text-sm font-medium text-gray-700">+ Bioincrustação (35.8%):</div>
                  <div className="flex-1 h-8 bg-red-100 rounded-lg flex items-center px-4">
                    <div className="h-full bg-red-500 rounded-lg" style={{ width: '35.8%' }}></div>
                    <span className="text-sm font-bold text-red-700 ml-3">+13.8 t/dia</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-48 text-sm font-medium text-gray-700">+ Ambiental (10.9%):</div>
                  <div className="flex-1 h-8 bg-orange-100 rounded-lg flex items-center px-4">
                    <div className="h-full bg-orange-500 rounded-lg" style={{ width: '10.9%' }}></div>
                    <span className="text-sm font-bold text-orange-700 ml-3">+4.2 t/dia</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-48 text-sm font-medium text-gray-700">+ Carregamento (7.3%):</div>
                  <div className="flex-1 h-8 bg-yellow-100 rounded-lg flex items-center px-4">
                    <div className="h-full bg-yellow-500 rounded-lg" style={{ width: '7.3%' }}></div>
                    <span className="text-sm font-bold text-yellow-700 ml-3">+2.8 t/dia</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-48 text-sm font-medium text-gray-700">+ TRIM (3.9%):</div>
                  <div className="flex-1 h-8 bg-blue-100 rounded-lg flex items-center px-4">
                    <div className="h-full bg-blue-500 rounded-lg" style={{ width: '3.9%' }}></div>
                    <span className="text-sm font-bold text-blue-700 ml-3">+1.5 t/dia</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-48 text-sm font-medium text-gray-700">+ Degradação Tinta (8.3%):</div>
                  <div className="flex-1 h-8 bg-purple-100 rounded-lg flex items-center px-4">
                    <div className="h-full bg-purple-500 rounded-lg" style={{ width: '8.3%' }}></div>
                    <span className="text-sm font-bold text-purple-700 ml-3">+3.2 t/dia</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-3 border-t-2 border-gray-300">
                  <div className="w-48 text-sm font-bold text-gray-900">Consumo Real Total:</div>
                  <div className="flex-1 h-10 bg-red-100 rounded-lg flex items-center px-4 border-2 border-red-300">
                    <span className="text-lg font-bold text-red-700">64.0 t/dia (+66.2% vs ideal)</span>
                  </div>
                </div>
              </div>
            </Cartao>

            {/* Botão para Análise Completa */}
            <Cartao className="bg-gradient-to-r from-transpetro-green-50 to-emerald-50 border-2 border-transpetro-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 flex items-center justify-center bg-transpetro-green-600 rounded-xl">
                    <i className="ri-bar-chart-box-line text-3xl text-white"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Análise Completa Disponível</h3>
                    <p className="text-sm text-gray-700">
                      Acesse a análise detalhada com gráficos interativos, decomposição por velocidade e recomendações personalizadas
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => window.REACT_APP_NAVIGATE('/analise-regressao')}
                  className="px-6 py-3 bg-transpetro-green-600 text-white rounded-lg font-medium hover:bg-transpetro-green-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-arrow-right-line mr-2"></i>
                  Abrir Análise Completa
                </button>
              </div>
            </Cartao>
          </div>
        )}

        {/* Modal Nova Fonte */}
        {modalNovo && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header do Modal */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Nova Fonte de Dados</h2>
                  <p className="text-sm text-gray-600 mt-1">Configure uma nova integração para o Data Lake</p>
                </div>
                <button 
                  onClick={() => setModalNovo(false)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-2xl text-gray-600"></i>
                </button>
              </div>

              {/* Conteúdo do Modal */}
              <div className="p-6 space-y-6">
                
                {/* Informações Básicas */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <i className="ri-information-line text-transpetro-green-600"></i>
                    Informações Básicas
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Nome da Fonte *
                      </label>
                      <input
                        type="text"
                        value={novaFonte.nome}
                        onChange={(e) => setNovaFonte({...novaFonte, nome: e.target.value})}
                        placeholder="Ex: API Meteorológica NOAA"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Tipo de Fonte *
                      </label>
                      <select
                        value={novaFonte.tipo}
                        onChange={(e) => setNovaFonte({...novaFonte, tipo: e.target.value})}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500 cursor-pointer"
                      >
                        <option>API REST</option>
                        <option>Webhook</option>
                        <option>FTP/SFTP</option>
                        <option>Database</option>
                        <option>MQTT</option>
                        <option>WebSocket</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Categoria de Dados *
                      </label>
                      <select
                        value={novaFonte.categoria}
                        onChange={(e) => setNovaFonte({...novaFonte, categoria: e.target.value})}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500 cursor-pointer"
                      >
                        <option>Dados Obrigatórios</option>
                        <option>Meteorológicos</option>
                        <option>Subaquáticos</option>
                        <option>Limpeza</option>
                        <option>Relatórios Noon</option>
                        <option>GPS/AIS</option>
                        <option>Inspeção</option>
                        <option>Consumo</option>
                        <option>Compliance</option>
                        <option>Ambiental</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Frequência de Atualização *
                      </label>
                      <select
                        value={novaFonte.frequencia}
                        onChange={(e) => setNovaFonte({...novaFonte, frequencia: e.target.value})}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500 cursor-pointer"
                      >
                        <option>Tempo Real</option>
                        <option>A cada 5 minutos</option>
                        <option>A cada 15 minutos</option>
                        <option>A cada hora</option>
                        <option>A cada 6 horas</option>
                        <option>Diária</option>
                        <option>Semanal</option>
                        <option>Manual</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Configuração de Conexão */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <i className="ri-links-line text-transpetro-green-600"></i>
                    Configuração de Conexão
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        URL do Endpoint *
                      </label>
                      <input
                        type="url"
                        value={novaFonte.url}
                        onChange={(e) => setNovaFonte({...novaFonte, url: e.target.value})}
                        placeholder="https://api.exemplo.com/v1/dados"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Método HTTP
                        </label>
                        <select
                          value={novaFonte.metodo}
                          onChange={(e) => setNovaFonte({...novaFonte, metodo: e.target.value})}
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500 cursor-pointer"
                        >
                          <option>GET</option>
                          <option>POST</option>
                          <option>PUT</option>
                          <option>PATCH</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Tipo de Autenticação
                        </label>
                        <select
                          value={novaFonte.autenticacao}
                          onChange={(e) => setNovaFonte({...novaFonte, autenticacao: e.target.value})}
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500 cursor-pointer"
                        >
                          <option>API Key</option>
                          <option>Bearer Token</option>
                          <option>OAuth 2.0</option>
                          <option>Basic Auth</option>
                          <option>Sem autenticação</option>
                        </select>
                      </div>
                    </div>

                    {novaFonte.autenticacao !== 'Sem autenticação' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Chave de Autenticação
                        </label>
                        <input
                          type="password"
                          value={novaFonte.apiKey}
                          onChange={(e) => setNovaFonte({...novaFonte, apiKey: e.target.value})}
                          placeholder="••••••••••••••••"
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Descrição */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <i className="ri-file-text-line text-transpetro-green-600"></i>
                    Descrição
                  </h3>
                  
                  <div>
                    <textarea
                      value={novaFonte.descricao}
                      onChange={(e) => setNovaFonte({...novaFonte, descricao: e.target.value})}
                      rows={3}
                      placeholder="Descreva o propósito desta fonte de dados e quais informações ela fornece..."
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-transpetro-green-500 resize-none"
                    ></textarea>
                  </div>
                </div>

                {/* Recursos IA */}
                <div className="p-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-lg">
                  <div className="flex items-start gap-3">
                    <i className="ri-brain-line text-purple-600 text-2xl"></i>
                    <div>
                      <div className="text-sm font-medium text-gray-900 mb-2">Recursos de IA Inclusos</div>
                      <ul className="text-xs text-gray-700 space-y-1">
                        <li className="flex items-center gap-2">
                          <i className="ri-check-line text-emerald-600"></i>
                          Mapeamento automático de campos
                        </li>
                        <li className="flex items-center gap-2">
                          <i className="ri-check-line text-emerald-600"></i>
                          Validação semântica de dados
                        </li>
                        <li className="flex items-center gap-2">
                          <i className="ri-check-line text-emerald-600"></i>
                          Detecção de anomalias em tempo real
                        </li>
                        <li className="flex items-center gap-2">
                          <i className="ri-check-line text-emerald-600"></i>
                          Sugestões de correção automática
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer do Modal */}
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
                <button
                  onClick={() => setModalNovo(false)}
                  className="px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSalvarNovaFonte}
                  className="px-5 py-2 bg-transpetro-green-600 text-white rounded-lg font-medium hover:bg-transpetro-green-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-save-line mr-2"></i>
                  Criar Fonte
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PaginaIngestao;
