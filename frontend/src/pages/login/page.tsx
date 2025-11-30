import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSEO, generateWebPageSchema } from '../../utils/seo';

const PaginaLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [imagemAtual, setImagemAtual] = useState(0);

  // SEO
  useSEO({
    title: 'Login - Sentinel Data Ship',
    description: 'Acesse a plataforma Sentinel Data Ship para monitoramento e gestão de bioincrustação em navios',
    keywords: 'login, sentinel data ship, acesso, plataforma naval',
    schema: generateWebPageSchema(
      'Login - Sentinel Data Ship',
      'Acesse a plataforma Sentinel Data Ship para monitoramento e gestão de bioincrustação em navios',
      '/login'
    )
  });

  // Carrossel de imagens
  const imagens = [
    {
      url: 'https://readdy.ai/api/search-image?query=modern%20cargo%20ship%20sailing%20through%20ocean%20with%20digital%20data%20overlay%20and%20holographic%20interface%20elements%20showing%20maritime%20technology%20and%20innovation%20with%20blue%20sky%20background&width=1200&height=800&seq=login1&orientation=landscape',
      titulo: 'Tecnologia Naval Avançada',
      descricao: 'Monitoramento inteligente da frota'
    },
    {
      url: 'https://readdy.ai/api/search-image?query=futuristic%20data%20visualization%20dashboard%20with%20graphs%20charts%20and%20analytics%20showing%20maritime%20shipping%20data%20with%20glowing%20blue%20and%20cyan%20elements%20on%20dark%20background%20technology%20concept&width=1200&height=800&seq=login2&orientation=landscape',
      titulo: 'Análise de Dados em Tempo Real',
      descricao: 'Decisões baseadas em inteligência artificial'
    },
    {
      url: 'https://readdy.ai/api/search-image?query=digital%20twin%20concept%20of%20ship%20hull%20with%20biofouling%20analysis%20showing%203D%20model%20with%20data%20points%20and%20technical%20measurements%20glowing%20blue%20technology%20interface%20maritime%20innovation&width=1200&height=800&seq=login3&orientation=landscape',
      titulo: 'Digital Twin & Biofouling',
      descricao: 'Previsão e otimização de performance'
    },
    {
      url: 'https://readdy.ai/api/search-image?query=modern%20maritime%20control%20center%20with%20multiple%20screens%20showing%20ship%20tracking%20maps%20and%20data%20analytics%20with%20professional%20technology%20environment%20blue%20lighting&width=1200&height=800&seq=login4&orientation=landscape',
      titulo: 'Centro de Controle Integrado',
      descricao: 'Gestão completa da operação naval'
    }
  ];

  // Rotação automática do carrossel
  useEffect(() => {
    const intervalo = setInterval(() => {
      setImagemAtual((prev) => (prev + 1) % imagens.length);
    }, 5000);
    return () => clearInterval(intervalo);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    
    // Simular login
    setTimeout(() => {
      setCarregando(false);
      navigate('/app/cockpit');
    }, 1500);
  };

  const handleLoginDemo = () => {
    setCarregando(true);
    setTimeout(() => {
      setCarregando(false);
      navigate('/app/cockpit');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-emerald-900 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Efeitos de fundo tecnológicos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid animado */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(251,191,36,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(251,191,36,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
        
        {/* Círculos flutuantes */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Linhas tecnológicas */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-yellow-500/20 to-transparent"></div>
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent"></div>
      </div>

      {/* Container principal */}
      <div className="relative w-full max-w-6xl bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
          
          {/* Lado esquerdo - Formulário */}
          <div className="p-8 flex flex-col justify-center relative">
            
            {/* Logo Grande */}
            <div className="mb-6 flex justify-center">
              <img 
                src="https://static.readdy.ai/image/5da477fdae7b1d111ee386eccbf37db2/732a02039d321f0d322d28065ca5f71b.png" 
                alt="Sentinel Data Ship" 
                className="h-20 w-auto"
              />
            </div>

            {/* Título */}
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Bem-vindo de volta</h1>
              <p className="text-sm text-gray-600">Acesse sua conta para continuar</p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleLogin} className="space-y-4">
              
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="ri-mail-line text-gray-400 text-base"></i>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Senha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="ri-lock-line text-gray-400 text-base"></i>
                  </div>
                  <input
                    type={mostrarSenha ? 'text' : 'password'}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  >
                    <i className={`${mostrarSenha ? 'ri-eye-off-line' : 'ri-eye-line'} text-gray-400 text-base hover:text-gray-600 transition-colors`}></i>
                  </button>
                </div>
              </div>

              {/* Lembrar-me e Esqueci senha */}
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="w-3.5 h-3.5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" />
                  <span className="ml-2 text-xs text-gray-700">Lembrar-me</span>
                </label>
                <button type="button" className="text-xs text-emerald-700 hover:text-emerald-800 font-medium transition-colors">
                  Esqueci minha senha
                </button>
              </div>

              {/* Botão Login */}
              <button
                type="submit"
                disabled={carregando}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-700 to-teal-700 text-white rounded-lg text-sm font-semibold hover:from-emerald-800 hover:to-teal-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {carregando ? (
                  <>
                    <i className="ri-loader-4-line mr-2 animate-spin"></i>
                    Entrando...
                  </>
                ) : (
                  <>
                    <i className="ri-login-box-line mr-2"></i>
                    Entrar
                  </>
                )}
              </button>
            </form>

            {/* Divisor */}
            <div className="my-4 flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-3 text-xs text-gray-500">ou</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Acesso Demo */}
            <button
              onClick={handleLoginDemo}
              className="w-full py-2.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-gray-900 rounded-lg text-sm font-semibold hover:from-yellow-600 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
            >
              <i className="ri-play-circle-line mr-2"></i>
              Acessar Versão Demo
            </button>

            {/* Credenciais Demo */}
            <div className="mt-4 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 flex items-center justify-center bg-emerald-700 rounded-lg flex-shrink-0">
                  <i className="ri-information-line text-white text-sm"></i>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-900 mb-1">Credenciais de Demonstração</div>
                  <div className="text-xs text-gray-700 space-y-0.5">
                    <div><span className="font-medium">E-mail:</span> demo@sentineldataship.com</div>
                    <div><span className="font-medium">Senha:</span> demo123</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 text-center text-xs text-gray-600">
              Não tem uma conta? <button className="text-emerald-700 hover:text-emerald-800 font-medium transition-colors">Solicitar acesso</button>
            </div>
          </div>

          {/* Lado direito - Carrossel */}
          <div className="relative bg-gradient-to-br from-emerald-900 to-teal-800 overflow-hidden">
            
            {/* Efeitos de fundo */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(251,191,36,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(251,191,36,0.1)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
            
            {/* Carrossel de imagens */}
            <div className="relative h-full flex items-center justify-center p-6">
              {imagens.map((imagem, index) => (
                <div
                  key={index}
                  className={`absolute inset-6 transition-all duration-1000 ${
                    index === imagemAtual 
                      ? 'opacity-100 scale-100' 
                      : 'opacity-0 scale-95 pointer-events-none'
                  }`}
                >
                  {/* Imagem */}
                  <div className="relative h-full rounded-xl overflow-hidden shadow-2xl border border-white/10">
                    <img
                      src={imagem.url}
                      alt={imagem.titulo}
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay gradiente */}
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 via-emerald-900/40 to-transparent"></div>
                    
                    {/* Texto sobre a imagem */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl font-bold text-white mb-1">{imagem.titulo}</h3>
                      <p className="text-yellow-200 text-xs">{imagem.descricao}</p>
                    </div>

                    {/* Efeito de brilho tecnológico */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-pulse"></div>
                  </div>
                </div>
              ))}

              {/* Indicadores do carrossel */}
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-10">
                {imagens.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setImagemAtual(index)}
                    className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                      index === imagemAtual 
                        ? 'bg-yellow-400 w-6' 
                        : 'bg-white/40 hover:bg-white/60'
                    }`}
                  ></button>
                ))}
              </div>
            </div>

            {/* Elementos decorativos tecnológicos */}
            <div className="absolute top-6 right-6 w-16 h-16 border-2 border-yellow-400/30 rounded-lg rotate-45 animate-pulse"></div>
            <div className="absolute bottom-6 left-6 w-12 h-12 border-2 border-emerald-400/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            
            {/* Partículas flutuantes */}
            <div className="absolute top-1/4 right-1/4 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping"></div>
            <div className="absolute top-1/3 left-1/4 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-1/3 right-1/3 w-1.5 h-1.5 bg-teal-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
          </div>

        </div>
      </div>

      {/* Badge de versão */}
      <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
        <span className="text-xs text-white font-medium">
          <i className="ri-shield-check-line mr-1"></i>
          Sentinel Data Ship v2.0
        </span>
      </div>
    </div>
  );
};

export default PaginaLogin;
