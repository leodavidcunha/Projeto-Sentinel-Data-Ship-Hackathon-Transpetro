export interface Navio {
  id: string;
  nome: string;
  classe: string;
  ibi: number;
  consumoIdeal: number;
  consumoReal: number;
  deltaFuelNm: number;
  ultimaLimpeza: string;
  diasDesdeUltimaLimpeza: number;
  riscoNormam401: 'baixo' | 'médio' | 'alto' | 'crítico';
  localizacao: {
    lat: number;
    lng: number;
    porto?: string;
  };
  velocidadeMedia: number;
  // Novos campos para análise completa
  dadosAmbientais?: {
    velocidadeVento: number; // m/s
    direcaoVento: number; // graus
    alturaOnda: number; // metros
    periodoOnda: number; // segundos
    intensidadeCorrente: number; // m/s
    direcaoCorrente: number; // graus
  };
  dadosCarregamento?: {
    condicao: 'ballast' | 'laden' | 'parcial';
    calado: number; // metros
    deslocamento: number; // toneladas
    percentualCarga: number; // 0-100
  };
  dadosOperacionais?: {
    trim: number; // metros (positivo = popa, negativo = proa)
    velocidadeAtual: number; // nós
    potenciaAtual: number; // kW
    rpm: number;
    condicaoMar: 'calmo' | 'moderado' | 'agitado' | 'muito-agitado';
  };
}
