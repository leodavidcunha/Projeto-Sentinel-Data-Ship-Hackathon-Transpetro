/**
 * Tipos relacionados a dados ambientais e oceânicos
 */

/**
 * Dados meteo-oceânicos em tempo real
 */
export interface DadosMeteoOceanicos {
  latitude: number;
  longitude: number;
  timestamp: string;
  temperaturaAgua: number; // °C
  salinidade: number; // PSU
  corrente: {
    velocidade: number; // m/s
    direcao: number; // graus
  };
  onda: {
    altura: number; // metros
    periodo: number; // segundos
    direcao: number; // graus
  };
  vento: {
    velocidade: number; // m/s
    direcao: number; // graus
  };
  mare: {
    altura: number; // metros
    tipo: 'Enchente' | 'Vazante' | 'Preamar' | 'Baixamar';
  };
}

/**
 * Região biogeográfica marinha
 */
export interface RegiaoBiogeografica {
  id: string;
  nome: string;
  codigo: string;
  riscoFouling: 'Baixo' | 'Médio' | 'Alto' | 'Muito Alto';
  temperaturaMedia: number;
  salinidadeMedia: number;
  especiesInvasoras: string[];
  restricoesNormam401: boolean;
  coordenadas: {
    norte: number;
    sul: number;
    leste: number;
    oeste: number;
  };
}

/**
 * Previsão de risco de bioincrustação
 */
export interface PrevisaoRisco {
  navioId: string;
  dataPrevisao: string;
  horizonte: number; // dias
  ibiAtual: number;
  ibiPrevisto: number;
  probabilidadeAlto: number; // 0-100%
  fatoresRisco: FatorRisco[];
  recomendacoes: string[];
}

export interface FatorRisco {
  fator: string;
  impacto: 'Baixo' | 'Médio' | 'Alto';
  descricao: string;
  peso: number;
}
