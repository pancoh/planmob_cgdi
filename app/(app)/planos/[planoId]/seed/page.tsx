'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { CheckCircle, Database } from 'lucide-react';

const JARAGUÁ_DATA: Record<string, object> = {
  apresentacao: {
    municipioUf: 'Jaraguá — GO',
    contextualizacao: 'Plano de Mobilidade Urbana da Cidade Jaraguá-GO, de acordo com o disposto no artigo 24 da Política Nacional de Mobilidade Urbana, em conformidade com o Plano Diretor (lei nº 997/2007).',
  },
  historico: {
    origemHistorica: `Jaraguá é um município brasileiro do estado de Goiás situado no Parque Ecológico da Serra de Jaraguá. É um município emancipado de Pirenópolis e se inclui na Microrregião de Anápolis, no Vale do São Patrício, conhecido por seu patrimônio cultural sendo uma das cidades mais antigas do estado.

O Bandeirante Bartolomeu Bueno da Silva veio com sua bandeira rumo a Goiás mais ou menos no ano de 1726 e fundou Vila Boa (Cidade de Goiás) às margens do Rio Vermelho, ao sopé da Serra Dourada. Não levou muito tempo e logo descobriram ouro em Meia Ponte (Pirenópolis), e por consequência, descobriram mais uma região aurífera, que por sua imponente serra garantiria a prosperidade do ciclo do ouro, impulsionando a criação de acampamentos às margens dos rios e córregos que nasciam dali. Assim surge o Arraial denominado Córrego do Jaraguá.

A palavra Jaraguá deriva da língua Tupi-Guarani – Yara – Guá – e significa Senhor do Vale. Com a exploração das jazidas auríferas iniciou-se o povoamento e com o passar dos anos iam surgindo as primeiras habitações, definindo-se as ruas. Em 1748 já estava pronta a primeira capela sob a evocação de São José e Nossa Senhora da Penha. A segunda igreja a ser construída foi a igreja de Nª Sª do Rosário e São Benedito, em 1776 e no ano de 1828 deu-se início à terceira igreja, a de Nª Sª da Conceição.

Através do Decreto Nº. 8 de 1 de julho de 1833, o Arraial do Córrego do Jaraguá é oficialmente elevado à categoria de Vila. Em 25 de julho de 1882, a Vila de Nossa Senhora da Penha de Jaraguá eleva-se à categoria de cidade através da resolução 666, emancipando-se de Meia Ponte e passando a se chamar apenas Jaraguá.`,
    fatoresCulturais: `Com mais de 138 anos de idade, Jaraguá é uma das cidades mais antigas do estado de Goiás e abriga o Parque Ecológico da Serra de Jaraguá, ponto turístico que está no Caminho de Cora Coralina e é considerado a nível nacional um dos melhores locais para a prática de voo livre, como o parapente. Ao longo dos anos a cidade refinou seus atrativos, como as festas religiosas, museus, carnaval, cavalhadas, quilômetro de arrancada e outras práticas culturais de identidade.`,
    fatoresHistoricos: `No século XX, com o surgimento da "modernidade", o Governo Federal estabelece metas que visavam a ocupação do Centro-oeste brasileiro: abertura de novas estradas, abertura da ferrovia no sudeste do estado e a construção de Goiânia. A marcha para o oeste, a maior procura de terras agricultáveis, a implantação da Colônia Agrícola Nacional e a construção da Capital Federal (Brasília) proporcionaram um impulso desenvolvimentista no município.

No início dos anos de 1960, Jaraguá sentiu os impactos decorrentes da construção da BR-153, mudando o ritmo de seu crescimento, ganhando oportunidades para ocupar o papel de núcleo comercial, dinamizando sua expansão urbana. Na década de 80 a cidade de Jaraguá vê crescer o domínio das máquinas, elevando-a ao título de Capital das Confecções.`,
  },
  caracterizacao: {
    caracteristicasGerais: `Fundação: 1882
Aniversário: 29 de julho
Gentílico: Jaraguense
População: 51.338 habitantes (estimativa 2020)
Área: 1.849,552 Km²

Jaraguá está inserida no Vale do São Patrício a apenas 120km da capital goiana e a 220km do Distrito Federal, situada em posição privilegiada às margens da BR-153, onde por semana passam mais de 15 mil veículos. Outras formas de acesso são através da GO-080, GO-427 e via aeronave de pequeno porte pelo aeroporto municipal.

Dada a extensão do município, existem ainda diversos povoados: Alvelândia, Artulândia, Cruzeirinho, Mirilândia, Monte Castelo, Palestina, Vila Santa Bárbara, Vila Aparecida (Chapeulândia) e São Geraldo.

Topografia: Plana: 55% | Ondulada: 35% | Montanhosa: 10%
Altitude Média: 570 metros.`,
    atividadesEconomicas: `Considerada o maior polo de confecção da região centro-oeste do Brasil, com mais de 850 empresas envolvidas na atividade, englobando as facções, os catadores de linha, lavanderias, fornecedores de matéria-prima, aviamentos e máquinas industriais, com produção média de 3 milhões de peças por mês e por volta de 15 mil empregos diretos e indiretos.

Entre outras atividades destaca-se a pecuária e a agricultura, como por exemplo no cultivo do abacaxi.`,
    climaGeografia: `Clima e Vegetação: Segundo classificação de Koeppen, é do tipo Tropical Úmido (AW), tipicamente quente e com o período de chuvas bem definido (Verão — setembro a abril) e o inverno seco (maio a setembro). Possui uma vegetação principalmente de Cerrado e floresta tropical.

A elevação mais importante é a Serra do Jaraguá, onde estão instaladas as torres repetidoras de televisão. A serra do Jaraguá também é conhecida por fazer parte do circuito nacional do campeonato de parapente; suas correntes de ar são consideradas como umas das melhores do Brasil para prática desse esporte.`,
    festividades: `Festas religiosas, museus, carnaval, cavalhadas, quilômetro de arrancada e outras práticas culturais de identidade. O Parque Ecológico da Serra de Jaraguá está no Caminho de Cora Coralina e atrai praticantes de voo livre de todo o país.`,
  },
  'transporte-coletivo': {
    diagnosis: 'Não possui serviço de transporte público coletivo.',
    objectives: { selected: [], other: '' },
    goals: [
      { theme: 'Frota de veículos', checked: false, specification: '', quantity: '', deadline: '' },
      { theme: 'Itinerários e linhas', checked: false, specification: '', quantity: '', deadline: '' },
      { theme: 'Frequência e horários', checked: false, specification: '', quantity: '', deadline: '' },
      { theme: 'Acessibilidade dos veículos', checked: false, specification: '', quantity: '', deadline: '' },
      { theme: 'Pontos de parada e terminais', checked: false, specification: '', quantity: '', deadline: '' },
      { theme: 'Tarifa e sistema de bilhetagem', checked: false, specification: '', quantity: '', deadline: '' },
      { theme: 'Informação ao usuário', checked: false, specification: '', quantity: '', deadline: '' },
    ],
    goalsOther: [],
    actions: [
      { theme: 'Realização de pesquisa de origem-destino', checked: false, specification: '' },
      { theme: 'Revisão do plano de linhas e itinerários', checked: false, specification: '' },
      { theme: 'Implantação de faixas exclusivas para ônibus', checked: false, specification: '' },
      { theme: 'Renovação e adequação da frota', checked: false, specification: '' },
      { theme: 'Implantação de sistema de bilhetagem eletrônica', checked: false, specification: '' },
      { theme: 'Adequação de pontos de parada (acessibilidade)', checked: false, specification: '' },
      { theme: 'Implantação de sistema de informação ao usuário', checked: false, specification: '' },
      { theme: 'Criação de conselho de transporte público', checked: false, specification: '' },
      { theme: 'Revisão do modelo de concessão/permissão', checked: false, specification: '' },
    ],
    actionsOther: [],
  },
  'circulacao-viaria': {
    diagnosis: 'Rodovias: GO-080, GO-427 e BR-153. Frota de táxi: 34 taxistas, 11 pontos. Frota de mototáxi: 64 mototaxistas, 5 pontos. Frota de transporte escolar: 40 veículos. Ônibus rural: 2 linhas.',
    objectives: {
      selected: [
        'Melhorar a fluidez do tráfego',
        'Reduzir o número de acidentes de trânsito',
        'Organizar o estacionamento em vias públicas',
        'Melhorar a sinalização viária',
      ],
      other: 'Promover a articulação com demais esferas envolvidas para intervenções em trechos urbanos de rodovias estaduais e federais; Integrar o planejamento da circulação viária com a política de uso e ocupação do solo',
    },
    goals: [
      { theme: 'Sinalização horizontal e vertical', checked: false, specification: '', quantity: '', deadline: '' },
      { theme: 'Semáforos e controladores', checked: false, specification: '', quantity: '', deadline: '' },
      { theme: 'Velocidade e segurança viária', checked: false, specification: '', quantity: '', deadline: '' },
      { theme: 'Estacionamento regulamentado', checked: false, specification: '', quantity: '', deadline: '' },
      { theme: 'Circulação de veículos pesados', checked: false, specification: '', quantity: '', deadline: '' },
      { theme: 'Fiscalização eletrônica', checked: true, specification: 'Ampliar em 200% a fiscalização com relação ao cumprimento da legislação de trânsito', quantity: '200%', deadline: '8 anos' },
      { theme: 'Educação para o trânsito', checked: false, specification: '', quantity: '', deadline: '' },
      { theme: 'Redução de emissões', checked: false, specification: '', quantity: '', deadline: '' },
    ],
    goalsOther: [
      { theme: 'Redução de acidentes', specification: 'Reduzir os acidentes de trânsito na área urbana do município', quantity: '', deadline: 'Até 2029' },
      { theme: 'Municipalização da gestão do trânsito', specification: 'Municipalização do Trânsito', quantity: '1', deadline: 'Até 2022' },
      { theme: 'Implantação de sentido único', specification: 'Implantar sentido único de deslocamento em vias que atendam as demandas da população e autoridades', quantity: '', deadline: '2 anos' },
    ],
    actions: [
      { theme: 'Elaboração de plano de sinalização viária', checked: false, specification: '' },
      { theme: 'Implantação de semáforos inteligentes', checked: true, specification: 'Realização de estudo para realocação de semáforos.' },
      { theme: 'Criação de áreas de velocidade reduzida (Zona 30)', checked: true, specification: 'Implantação de redutores de velocidade/lombadas nas vias evidenciadas pelo estudo de engenharia tráfego.' },
      { theme: 'Regulamentação de estacionamento rotativo', checked: false, specification: '' },
      { theme: 'Definição de rotas para veículos pesados', checked: false, specification: '' },
      { theme: 'Implantação de fiscalização eletrônica', checked: true, specification: 'Estabelecimento de parceria com Governo do Estado para realização de atividade delegada para reforço da fiscalização.' },
      { theme: 'Campanhas de educação para o trânsito', checked: true, specification: 'Realização de ações educativas sobre segurança de trânsito; Realização de ações educativas voltadas a melhorar o serviço de moto-táxi.' },
      { theme: 'Plano de redução de acidentes', checked: true, specification: 'Realização de estudos de engenharia de tráfego para melhoria da circulação viária; Realização de estudo para identificar a causa dos principais acidentes de trânsito.' },
      { theme: 'Implantação de rotatórias', checked: false, specification: '' },
      { theme: 'Programa de inspeção veicular', checked: false, specification: '' },
      { theme: 'Revisão da hierarquia viária', checked: false, specification: '' },
      { theme: 'Plano de circulação para áreas centrais', checked: false, specification: '' },
      { theme: 'Regulamentação do transporte por aplicativo', checked: false, specification: '' },
    ],
    actionsOther: [
      { theme: 'Ciclorrotas', specification: 'Implantação de ciclorrotas nas principais vias que comportam a infraestrutura.' },
      { theme: 'Arborização', specification: 'Implantação de projeto de arborização nas principais vias.' },
      { theme: 'Ouvidoria', specification: 'Criação de ouvidoria para atendimento com relação ao trânsito e os serviços de transporte.' },
      { theme: 'Ocupação de calçadas', specification: 'Proibição da invasão das calçadas pelo comércio local em todas as vias da cidade.' },
    ],
  },
  infraestruturas: {
    diagnosis: `Apenas uma ciclovia de curto percurso (aproximadamente 800 metros) existente (Local: Lago Passarela da Moda). Calçadas com dimensões irregulares, pisos deteriorados com ausência de piso tátil, carentes de acessibilidade com acessos de veículos e de pessoas inapropriados, uso inapropriado do comércio e moradores, e falta de arborização aconselhada para plantio em calçadas.

Ruas e acessos às principais localidades e bairros apresentam deficiências quanto à pavimentação, a dificuldade de locomoção e de acessibilidade dos moradores ocasionada pela má qualidade do piso natural ou da má qualidade do pavimento existente que, em muitos períodos do ano ficam praticamente intransitáveis pela temporada de chuvas, acumulando lama, lixo e permitindo o avanço da vegetação rasteira sobre as áreas carroçáveis.

A sinalização viária carece de: fornecer informações precisas, claras e padronizadas aos usuários, regulamentar a circulação, a velocidade e outras condições para a segurança local; posicionar e ordenar adequadamente os veículos, para reduzir os riscos de acidentes e congestionamentos.`,
    objectives: {
      selected: [
        'Ampliar e qualificar a malha viária',
        'Melhorar as condições de pavimentação',
        'Adequar as calçadas para acessibilidade universal',
        'Implantar infraestrutura cicloviária',
      ],
      other: 'Prover condições físicas de pavimento e sinalização compatíveis com a segurança e a fluidez dos deslocamentos',
    },
    goals: [
      { theme: 'Pavimentação de vias', checked: true, specification: 'Asfaltar e recuperar todas as vias urbanas necessárias', quantity: '100%', deadline: '8 anos' },
      { theme: 'Calçadas e passeios', checked: true, specification: 'Qualificar a infraestrutura de calçadas em 100% nos bairros com situação ruim ou inadequada', quantity: '100%', deadline: '8 anos' },
      { theme: 'Ciclovias e ciclofaixas', checked: true, specification: 'Implantar ciclovias e ciclofaixas', quantity: '10 km', deadline: 'Até o final da vigência do plano' },
      { theme: 'Iluminação pública', checked: false, specification: '', quantity: '', deadline: '' },
      { theme: 'Drenagem urbana nas vias', checked: false, specification: '', quantity: '', deadline: '' },
      { theme: 'Pontes e viadutos', checked: false, specification: '', quantity: '', deadline: '' },
      { theme: 'Terminais e estações', checked: true, specification: 'Implantar infraestrutura nas paradas de ônibus (abrigos, sinalização, bancos, acessibilidade)', quantity: '100% dos pontos', deadline: '8 anos' },
    ],
    goalsOther: [
      { theme: 'Sinalização', specification: 'Adequar a sinalização horizontal e vertical em toda a cidade', quantity: '100%', deadline: '4 anos' },
      { theme: 'Obras viárias', specification: 'Criar e requalificar vias com calçadas, acessibilidade, e ciclofaixas', quantity: '', deadline: '8 anos' },
      { theme: 'Travessias de pedestres', specification: 'Requalificar todas vias e passeios necessários', quantity: '100%', deadline: '8 anos' },
    ],
    actions: [
      { theme: 'Elaboração de plano de pavimentação', checked: true, specification: 'Pavimentar e reestruturar a malha viária do município.' },
      { theme: 'Programa de recuperação de calçadas', checked: true, specification: 'Priorizar calçadas com foco na acessibilidade, desobstrução em zonas comerciais, ênfase em faixa livre de passeio. Parceria público-privado. Criação de incentivo para construção de calçadas.' },
      { theme: 'Implantação de rede cicloviária', checked: true, specification: 'Implantação de ciclovias e ciclofaixas nas vias pertinentes da cidade.' },
      { theme: 'Construção de bicicletários e paraciclos', checked: false, specification: '' },
      { theme: 'Melhoria da iluminação em corredores de transporte', checked: false, specification: '' },
      { theme: 'Construção/reforma de terminais de integração', checked: false, specification: '' },
      { theme: 'Programa de acessibilidade em calçadas', checked: true, specification: 'Elevação das travessias de pedestres em pontos estratégicos. Requalificação de vias e passeios.' },
      { theme: 'Implantação de piso tátil em rotas acessíveis', checked: false, specification: '' },
    ],
    actionsOther: [
      { theme: 'Obras viárias', specification: 'Abertura da Av. Passarela da Moda fazendo ligação entre o trevo norte e sul. Implantação de lombada eletrônica em pontos necessários.' },
      { theme: 'Sinalização', specification: 'Implantação de sinalização viária de trânsito nas vias pertinentes. Sinalização para travessia de pedestres. Padronização da sinalização de identificação.' },
      { theme: 'Parque linear', specification: 'Realização de estudos de viabilidade para implantação de Parque linear.' },
      { theme: 'Gerência de pavimentos', specification: 'Criação de uma gerência de pavimentos para estudos, implantação, monitoramento e manutenção.' },
    ],
  },
  'modos-nao-motorizados': {
    diagnosis: `Calçadas com dimensões irregulares, pisos deteriorados com ausência de piso tátil, carentes de acessibilidade. Vagas de estacionamento carecem de acessibilidade, necessário implantação de vagas para pessoas com deficiência. Não possui frota de transporte público.

(Nota: No documento de Jaraguá, este tema está coberto junto com Acessibilidade — Cap. 7)`,
    objectives: {
      selected: [
        'Estimular o uso da bicicleta como meio de transporte',
        'Melhorar as condições para deslocamento a pé',
        'Garantir acessibilidade nos deslocamentos não motorizados',
      ],
      other: '',
    },
    goals: [
      { theme: 'Rede cicloviária', checked: true, specification: 'Implantação de ciclorrotas nas principais vias', quantity: '', deadline: '8 anos' },
      { theme: 'Bicicletários e paraciclos', checked: true, specification: 'Reservar áreas em estacionamentos públicos para implantação de paraciclos', quantity: '', deadline: '4 anos' },
      { theme: 'Sistema de bicicletas compartilhadas', checked: false, specification: '', quantity: '', deadline: '' },
      { theme: 'Calçadas acessíveis', checked: true, specification: 'Qualificar calçadas em 100% nos bairros com situação ruim', quantity: '100%', deadline: '8 anos' },
      { theme: 'Travessias seguras para pedestres', checked: true, specification: 'Requalificar todas vias e passeios necessários', quantity: '100%', deadline: '8 anos' },
      { theme: 'Arborização e sombreamento de rotas', checked: true, specification: 'Implantação de projeto de arborização nas principais vias', quantity: '', deadline: '8 anos' },
      { theme: 'Sinalização para ciclistas e pedestres', checked: false, specification: '', quantity: '', deadline: '' },
    ],
    goalsOther: [],
    actions: [
      { theme: 'Elaboração de plano cicloviário', checked: false, specification: '' },
      { theme: 'Implantação de ciclovias e ciclofaixas', checked: true, specification: 'Implantação de ciclovias e ciclofaixas nas vias pertinentes da cidade.' },
      { theme: 'Instalação de bicicletários em terminais e equipamentos públicos', checked: true, specification: 'Implantação de paraciclos na área central e nos principais polos geradores de viagem.' },
      { theme: 'Implantação de sistema de bicicletas compartilhadas', checked: false, specification: '' },
      { theme: 'Programa de melhoria de calçadas', checked: true, specification: 'Priorizar calçadas com foco na acessibilidade, desobstrução em zonas comerciais.' },
      { theme: 'Criação de rotas acessíveis', checked: true, specification: 'Implantação de ciclorrotas nas principais vias que comportam a infraestrutura.' },
      { theme: 'Campanhas de estímulo ao uso da bicicleta', checked: false, specification: '' },
      { theme: 'Programa "Pedala [Município]"', checked: false, specification: '' },
      { theme: 'Criação de zonas de prioridade para pedestres', checked: true, specification: 'Elevação das travessias de pedestres em pontos estratégicos.' },
    ],
    actionsOther: [],
  },
  acessibilidade: {
    diagnosis: `Calçadas com dimensões irregulares, pisos deteriorados com ausência de piso tátil, carentes de acessibilidade com acessos de veículos e de pessoas inapropriados, uso inapropriado do comércio e moradores, e falta de arborização aconselhada para plantio em calçadas. Vagas de estacionamento carecem de acessibilidade, necessário implantação de vagas para pessoas com deficiência. Não possui frota de transporte público.`,
    objectives: {
      selected: [
        'Garantir acessibilidade em todo o sistema de mobilidade',
        'Eliminar barreiras arquitetônicas nas vias e espaços públicos',
        'Promover o desenho universal em novos projetos',
      ],
      other: 'Assegurar o deslocamento de pessoas com deficiência e restrição de mobilidade',
    },
    goals: [
      { theme: 'Veículos acessíveis na frota de transporte público', checked: true, specification: 'Adequar a frota municipal de transporte escolar para acessibilidade', quantity: '100%', deadline: 'Até 2025' },
      { theme: 'Pontos de parada acessíveis', checked: false, specification: '', quantity: '', deadline: '' },
      { theme: 'Rampas e rebaixamento de calçadas', checked: true, specification: 'Requalificar 100% da infraestrutura urbana existente para acessibilidade universal na área central', quantity: '100%', deadline: '4 anos' },
      { theme: 'Piso tátil em rotas estratégicas', checked: true, specification: 'Implantação de sinalização no passeio público de rotas para circulação de deficientes visuais próximas a escolas e hospitais', quantity: '', deadline: '4 anos' },
      { theme: 'Sinalização acessível (visual, tátil, sonora)', checked: true, specification: 'Implantação de sistemas de comunicação visual acessíveis na área central do município', quantity: '', deadline: '4 anos' },
      { theme: 'Vagas reservadas para PCD', checked: false, specification: '', quantity: '', deadline: '' },
    ],
    goalsOther: [],
    actions: [
      { theme: 'Diagnóstico de acessibilidade do sistema de mobilidade', checked: true, specification: 'Realização de estudo prévio para definição das intervenções de acessibilidade a serem realizadas, incluindo pontos de parada, travessias, interior de veículos etc.' },
      { theme: 'Programa de adequação de calçadas e travessias', checked: true, specification: 'Rebaixamento de guias ou meios-fios em esquinas e locais onde houver faixa para travessia de pedestres na área central da cidade.' },
      { theme: 'Adaptação dos pontos de parada e terminais', checked: false, specification: '' },
      { theme: 'Adequação da frota de transporte coletivo', checked: true, specification: 'Aquisição de veículos para transporte de pessoas com deficiência.' },
      { theme: 'Implantação de semáforos sonoros', checked: false, specification: '' },
      { theme: 'Capacitação de operadores e motoristas', checked: false, specification: '' },
      { theme: 'Criação de comitê de acessibilidade', checked: false, specification: '' },
      { theme: 'Fiscalização de vagas reservadas', checked: false, specification: '' },
    ],
    actionsOther: [
      { theme: 'Normatização', specification: 'Inclusão dos requisitos de acessibilidade em todos os projetos; Revisão da Legislação municipal sobre calçadas para adequação quanto aos quesitos de acessibilidade.' },
      { theme: 'Piso tátil', specification: 'Realização de estudos para definição de locais para implantação de piso tátil.' },
    ],
  },
  'integracao-modal': {
    diagnosis: 'Contendo as seguintes informações: Existência de serviço de transporte público coletivo; Levantamento dos diferentes modos e serviços de transporte presentes no município. (Não se aplica ao município de Jaraguá no momento)',
    objectives: { selected: [], other: '' },
    goals: [
      { theme: 'Terminais de integração', checked: false, specification: '', quantity: '', deadline: '' },
      { theme: 'Bilhetagem integrada (temporal/espacial)', checked: false, specification: '', quantity: '', deadline: '' },
      { theme: 'Integração bicicleta-transporte público', checked: false, specification: '', quantity: '', deadline: '' },
      { theme: 'Integração com transporte intermunicipal', checked: false, specification: '', quantity: '', deadline: '' },
      { theme: 'Estacionamentos park-and-ride', checked: false, specification: '', quantity: '', deadline: '' },
      { theme: 'Pontos de conexão intermodal', checked: false, specification: '', quantity: '', deadline: '' },
    ],
    goalsOther: [],
    actions: [
      { theme: 'Estudo de viabilidade de terminais de integração', checked: false, specification: '' },
      { theme: 'Implantação de bilhetagem integrada', checked: false, specification: '' },
      { theme: 'Criação de bicicletários em terminais', checked: false, specification: '' },
      { theme: 'Definição de pontos de integração intermodal', checked: false, specification: '' },
      { theme: 'Convênio com operadores de transporte intermunicipal', checked: false, specification: '' },
      { theme: 'Implantação de estacionamentos de integração', checked: false, specification: '' },
      { theme: 'Sistema de informação integrada ao usuário', checked: false, specification: '' },
    ],
    actionsOther: [],
  },
  'polos-geradores': {
    diagnosis: `Principais polos geradores de viagens: Estádio Municipal Dr. Amintas de Freitas, Ginásio JK, Ginásio de Esportes Dr. Ciro Machado, Praça da Matriz, Lago Passarela da Moda, Lago Urbano e Parque Ecológico da Serra de Jaraguá, Feira de Terça (Lago Urbano), Feira de Quarta (Primavera), Feira de Quinta (Ana Edith), Feira de Sexta (Praça do Cigano), Feira de Sábado (Dhema da Mata), Feira de Domingo (Feira Coberta), Residencial Dhema da Mata, Hospital Estadual de Jaraguá Dr. Sandino de Amorim (HEJA).`,
    objectives: {
      selected: [
        'Identificar e monitorar polos geradores de viagens',
        'Mitigar impactos de grandes empreendimentos na mobilidade',
        'Promover a gestão da demanda de viagens',
      ],
      other: 'Facilitar o acesso aos principais pontos de atrativos turísticos, artísticos e culturais da cidade; Melhorar os espaços de convivência na área central',
    },
    goals: [
      { theme: 'Cadastro de polos geradores de viagens', checked: true, specification: 'Adequar as áreas de funcionamento das feiras livres', quantity: '', deadline: 'Até 2029' },
      { theme: 'Estudos de impacto viário (EIV)', checked: false, specification: '', quantity: '', deadline: '' },
      { theme: 'Medidas mitigadoras em empreendimentos existentes', checked: true, specification: 'Implantar e revitalizar equipamentos públicos existentes', quantity: '', deadline: 'Até 2029' },
      { theme: 'Integração com o plano diretor', checked: true, specification: 'Implantar no conjunto habitacional popular existente serviços básicos de saúde, educação etc.', quantity: '', deadline: 'Até 2029' },
      { theme: 'Gestão da demanda por estacionamento', checked: true, specification: 'Revitalizar as principais praças do município', quantity: '', deadline: 'Até 2029' },
    ],
    goalsOther: [],
    actions: [
      { theme: 'Levantamento dos polos geradores de viagens do município', checked: true, specification: 'Requalificação do entorno dos equipamentos públicos dando prioridade ao fluxo de pedestres.' },
      { theme: 'Regulamentação de estudos de impacto viário', checked: false, specification: '' },
      { theme: 'Definição de medidas mitigadoras padrão', checked: true, specification: 'Inclusão da mobilidade urbana no planejamento dos novos bairros ou conjuntos habitacionais (arborização, calçadas, pavimentação, pontos de parada, ciclovias etc).' },
      { theme: 'Criação de fundo de mobilidade (contrapartida de empreendimentos)', checked: false, specification: '' },
      { theme: 'Articulação com o plano diretor para uso do solo', checked: true, specification: 'Reestruturação de feiras livres com remodelação estrutural.' },
      { theme: 'Programa de gestão de demanda (horários flexíveis, carona, teletrabalho)', checked: true, specification: 'Estudo para melhoria da circulação viária nos horários de entrada e saída de escolas.' },
    ],
    actionsOther: [],
  },
  'areas-vulneraveis': {
    diagnosis: `Inventário das áreas públicas e privadas de estacionamento e vagas de estacionamento nas vias públicas, gratuitas ou onerosas.

(Nota: No documento de Jaraguá, o Cap. 11 trata de "Áreas de estacionamento")`,
    objectives: {
      selected: [
        'Melhorar a mobilidade em áreas de vulnerabilidade social',
      ],
      other: 'Desestimular o uso do transporte individual motorizado por meio da cobrança de estacionamento na área central; Estabelecer a política de estacionamento como instrumento de gestão da mobilidade',
    },
    goals: [
      { theme: 'Cobertura do transporte público em áreas vulneráveis', checked: false, specification: '', quantity: '', deadline: '' },
      { theme: 'Infraestrutura viária em áreas vulneráveis', checked: false, specification: '', quantity: '', deadline: '' },
      { theme: 'Iluminação pública em rotas de acesso', checked: false, specification: '', quantity: '', deadline: '' },
      { theme: 'Calçadas e acessibilidade em áreas vulneráveis', checked: false, specification: '', quantity: '', deadline: '' },
      { theme: 'Tarifa social ou gratuidade', checked: false, specification: '', quantity: '', deadline: '' },
    ],
    goalsOther: [
      { theme: 'Vagas PCD', specification: 'Garantir 2% de reserva de vagas em estacionamentos públicos e privados para veículos que transportem pessoas com deficiência', quantity: '2%', deadline: 'Até 2025' },
      { theme: 'Vagas idosos', specification: 'Garantir 5% de reserva de vagas em estacionamentos públicos e privados para idosos', quantity: '5%', deadline: 'Até 2025' },
      { theme: 'Paraciclos', specification: 'Reservar áreas em estacionamentos públicos para implantação de paraciclos', quantity: '', deadline: '4 anos' },
      { theme: 'Zona azul', specification: 'Criar vagas de zona azul', quantity: '', deadline: '4 anos' },
    ],
    actions: [
      { theme: 'Mapeamento de áreas vulneráveis e suas necessidades de mobilidade', checked: true, specification: 'Realização de estudo para contagem das vagas existentes ao longo da via urbana na área central.' },
      { theme: 'Extensão de linhas de transporte público', checked: false, specification: '' },
      { theme: 'Programa de pavimentação em áreas vulneráveis', checked: false, specification: '' },
      { theme: 'Melhoria de iluminação em rotas de acesso', checked: false, specification: '' },
      { theme: 'Implantação de tarifa social', checked: false, specification: '' },
      { theme: 'Programa de calçadas em áreas vulneráveis', checked: false, specification: '' },
      { theme: 'Criação de linhas de transporte sob demanda', checked: false, specification: '' },
    ],
    actionsOther: [
      { theme: 'Zona azul', specification: 'Realização de estudo de viabilidade para implantação de zona azul; Implantação de zona azul nas vias pertinentes.' },
      { theme: 'Demarcação de vagas', specification: 'Demarcação de vagas de estacionamento em vias públicas; Ordenamento do estacionamento de motos na área central.' },
    ],
  },
  'seguranca-viaria': {
    diagnosis: 'Não há a existência de áreas com restrição e controle de acesso e circulação permanente ou temporário.',
    objectives: {
      selected: [
        'Reduzir mortes e lesões graves no trânsito',
        'Implantar medidas de moderação de tráfego',
      ],
      other: 'Estimular a criação de ambientes mais seguros e amigáveis para a circulação de pedestres; Fomentar o lazer',
    },
    goals: [
      { theme: 'Redução de acidentes fatais', checked: false, specification: '', quantity: '', deadline: '' },
      { theme: 'Pontos críticos de acidentes tratados', checked: false, specification: '', quantity: '', deadline: '' },
      { theme: 'Travessias seguras implantadas', checked: false, specification: '', quantity: '', deadline: '' },
      { theme: 'Áreas de velocidade reduzida (Zona 30)', checked: false, specification: '', quantity: '', deadline: '' },
      { theme: 'Equipamentos de fiscalização', checked: false, specification: '', quantity: '', deadline: '' },
      { theme: 'Campanhas de educação realizadas', checked: false, specification: '', quantity: '', deadline: '' },
    ],
    goalsOther: [
      { theme: 'Fechamento de vias em grandes eventos', specification: 'Fechar vias municipais de forma temporária em feiras livres, encontros religiosos e grandes eventos. Realizar um projeto piloto com fechamento de vias para pedestres e ciclistas.', quantity: '', deadline: '4 anos' },
    ],
    actions: [
      { theme: 'Mapeamento de pontos críticos de acidentes', checked: false, specification: '' },
      { theme: 'Implantação de medidas de traffic calming', checked: false, specification: '' },
      { theme: 'Criação de Zonas 30 em áreas escolares e residenciais', checked: false, specification: '' },
      { theme: 'Melhoria de travessias de pedestres', checked: false, specification: '' },
      { theme: 'Implantação de lombadas eletrônicas e radares', checked: false, specification: '' },
      { theme: 'Campanhas de segurança viária (Maio Amarelo)', checked: false, specification: '' },
      { theme: 'Programa de educação de trânsito nas escolas', checked: false, specification: '' },
      { theme: 'Fortalecimento da fiscalização de trânsito', checked: false, specification: '' },
      { theme: 'Criação de comitê de segurança viária', checked: false, specification: '' },
    ],
    actionsOther: [
      { theme: 'Estudos', specification: 'Realização de estudo para implantação de restrição de circulação de veículos motorizados de forma permanente ou temporária; Campanhas e consultas à sociedade.' },
      { theme: 'Fechamento de vias', specification: 'Fechar vias municipais de forma temporária em feiras livres, encontros religiosos e grandes eventos.' },
      { theme: 'Infraestrutura', specification: 'Qualificação de infraestrutura urbana das áreas de circulação de pedestres existentes.' },
    ],
  },
  'logistica-urbana': {
    diagnosis: `Origens: Anápolis, Goiânia, Goianésia, Brasília, Itaguaru, Itaguari, zonas rurais (agricultura, pecuária), britadeiras.
Rotas: BR-153, GO-427, GO-080.
Cargas distribuídas em comércio e empresas de grande e pequeno porte em todo perímetro urbano do município.`,
    objectives: {
      selected: [
        'Ordenar o transporte de carga na área urbana',
        'Reduzir conflitos entre carga e demais modos de transporte',
        'Definir horários e rotas para veículos de carga',
        'Regulamentar áreas de carga e descarga',
      ],
      other: 'Preservar a infraestrutura urbana; Preservar o patrimônio histórico',
    },
    goals: [
      { theme: 'Regulamentação de horários de carga/descarga', checked: true, specification: 'Instituir o marco normativo do transporte de cargas municipal', quantity: '', deadline: 'Até 2029' },
      { theme: 'Rotas definidas para veículos de carga', checked: true, specification: 'Regulamentar as paradas, rotas e restrições de circulação do transporte de cargas', quantity: '', deadline: '8 anos' },
      { theme: 'Áreas de carga e descarga sinalizadas', checked: true, specification: 'Demarcar 100% das áreas de carga e descarga na cidade', quantity: '100%', deadline: '8 anos' },
      { theme: 'Veículos de carga com restrição de circulação', checked: true, specification: 'Implantar barreiras para o transporte de cargas em todas as vias locais', quantity: '100% vias locais', deadline: '4 anos' },
      { theme: 'Logística de última milha sustentável', checked: true, specification: 'Implantar 2 centros logísticos', quantity: '2 centros', deadline: '8 anos' },
    ],
    goalsOther: [],
    actions: [
      { theme: 'Estudo de logística urbana do município', checked: true, specification: 'Realização de estudo para definição da estratégia de circulação para o transporte de cargas.' },
      { theme: 'Regulamentação de horários e locais de carga/descarga', checked: true, specification: 'Definição de locais e regras para carga e descarga.' },
      { theme: 'Definição de rotas para veículos pesados', checked: true, specification: 'Definição de rotas preferenciais e vias de uso proibido.' },
      { theme: 'Implantação de áreas de carga/descarga demarcadas', checked: true, specification: 'Implantação de sinalização viária específica para veículos de carga.' },
      { theme: 'Estímulo à logística de última milha com veículos leves', checked: false, specification: '' },
      { theme: 'Regulamentação do transporte de produtos perigosos', checked: false, specification: '' },
      { theme: 'Criação de centro de distribuição urbana (CDU)', checked: true, specification: 'Realização de estudo para implantação de centro logístico de distribuição.' },
    ],
    actionsOther: [
      { theme: 'Fiscalização', specification: 'Fiscalização das atuais normas presentes na legislação municipal.' },
    ],
  },
  'revisao-atualizacao': {
    prazoAtualizacao: '4',
    revisoesPeriodicasSim: true,
    avaliacaoSelected: [
      'Consulta à sociedade civil',
      'Banco de dados e indicadores de mobilidade',
    ],
    avaliacaoOther: '',
    orgaoResponsavel: 'Município de Jaraguá - GO\n\nGestor Responsável: Marcos Antônio de Assunção\nCargo: Arquiteto e Urbanista\nÓrgão: Prefeitura Municipal de Jaraguá\nUnidade: Planejamento Técnico',
    instrumentoNormativo: ['Lei municipal'],
  },
};

export default function SeedPage() {
  const params = useParams();
  const router = useRouter();
  const planoId = params.planoId as string;
  const [done, setDone] = useState(false);

  function seedData() {
    for (const [slug, data] of Object.entries(JARAGUÁ_DATA)) {
      localStorage.setItem(`planmob:${planoId}:${slug}`, JSON.stringify(data));
    }
    setDone(true);
  }

  return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      {!done ? (
        <>
          <Database size={48} color="var(--primary-500)" style={{ marginBottom: 20 }} />
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
            Preencher com dados de Jaraguá-GO
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 500, marginLeft: 'auto', marginRight: 'auto', marginBottom: 24 }}>
            Isso irá preencher todos os 14 capítulos com os dados reais extraídos do
            PDF &quot;Minuta — Plano de Mobilidade Urbana — Jaraguá/GO&quot;.
          </p>
          <button className="btn btn-primary btn-lg" onClick={seedData}>
            <Database size={20} /> Preencher Dados
          </button>
        </>
      ) : (
        <>
          <CheckCircle size={48} color="var(--success-500)" style={{ marginBottom: 20 }} />
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12, color: 'var(--success-500)' }}>
            Dados preenchidos com sucesso!
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
            Todos os 14 capítulos foram preenchidos com os dados de Jaraguá-GO.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button
              className="btn btn-secondary"
              onClick={() => router.push(`/planos/${planoId}/capitulos/apresentacao`)}
            >
              Ver Capítulos
            </button>
            <button
              className="btn btn-accent"
              onClick={() => router.push(`/planos/${planoId}/minuta`)}
            >
              Ver Minuta
            </button>
          </div>
        </>
      )}
    </div>
  );
}
