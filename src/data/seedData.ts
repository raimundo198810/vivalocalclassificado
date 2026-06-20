import { Category, Region, Listing } from '../types';

export const BRAZIL_REGIONS: Region[] = [
  {
    id: 'AC',
    name: 'Acre (AC)',
    cities: ['Rio Branco', 'Cruzeiro do Sul', 'Sena Madureira', 'Tarauacá', 'Feijó']
  },
  {
    id: 'AL',
    name: 'Alagoas (AL)',
    cities: ['Maceió', 'Arapiraca', 'Palmeira dos Índios', 'Rio Largo', 'Penedo', 'Maragogi']
  },
  {
    id: 'AP',
    name: 'Amapá (AP)',
    cities: ['Macapá', 'Santana', 'Laranjal do Jari', 'Oiapoque', 'Porto Grande']
  },
  {
    id: 'AM',
    name: 'Amazonas (AM)',
    cities: ['Manaus', 'Parintins', 'Itacoatiara', 'Manacapuru', 'Tefé', 'Coari']
  },
  {
    id: 'BA',
    name: 'Bahia (BA)',
    cities: ['Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Camaçari', 'Itabuna', 'Porto Seguro', 'Ilhéus', 'Juazeiro', 'Barreiras']
  },
  {
    id: 'CE',
    name: 'Ceará (CE)',
    cities: ['Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Maracanaú', 'Sobral', 'Crato', 'Jijoca de Jericoacoara']
  },
  {
    id: 'DF',
    name: 'Distrito Federal (DF)',
    cities: ['Brasília', 'Taguatinga', 'Ceilândia', 'Samambaia', 'Águas Claras', 'Sobradinho']
  },
  {
    id: 'ES',
    name: 'Espírito Santo (ES)',
    cities: ['Vitória', 'Vila Velha', 'Serra', 'Cariacica', 'Cachoeiro de Itapemirim', 'Linhares', 'Guarapari']
  },
  {
    id: 'GO',
    name: 'Goiás (GO)',
    cities: ['Goiânia', 'Aparecida de Goiânia', 'Anápolis', 'Rio Verde', 'Luziânia', 'Águas Lindas de Goiás', 'Caldas Novas']
  },
  {
    id: 'MA',
    name: 'Maranhão (MA)',
    cities: ['São Luís', 'Imperatriz', 'São José de Ribamar', 'Timon', 'Caxias', 'Codó', 'Barreirinhas']
  },
  {
    id: 'MT',
    name: 'Mato Grosso (MT)',
    cities: ['Cuiabá', 'Várzea Grande', 'Rondonópolis', 'Sinop', 'Sorriso', 'Tangará da Serra', 'Primavera do Leste']
  },
  {
    id: 'MS',
    name: 'Mato Grosso do Sul (MS)',
    cities: ['Campo Grande', 'Dourados', 'Três Lagoas', 'Corumbá', 'Ponta Porã', 'Bonito']
  },
  {
    id: 'MG',
    name: 'Minas Gerais (MG)',
    cities: ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Betim', 'Montes Claros', 'Ribeirão das Neves', 'Uberaba', 'Ipatinga', 'Ouro Preto']
  },
  {
    id: 'PA',
    name: 'Pará (PA)',
    cities: ['Belém', 'Ananindeua', 'Santarém', 'Marabá', 'Parauapebas', 'Castanhal', 'Altamira']
  },
  {
    id: 'PB',
    name: 'Paraíba (PB)',
    cities: ['João Pessoa', 'Campina Grande', 'Santa Rita', 'Patos', 'Bayeux', 'Cabedelo']
  },
  {
    id: 'PR',
    name: 'Paraná (PR)',
    cities: ['Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa', 'Cascavel', 'São José dos Pinhais', 'Foz do Iguaçu', 'Guarapuava']
  },
  {
    id: 'PE',
    name: 'Pernambuco (PE)',
    cities: ['Recife', 'Jaboatão dos Guararapes', 'Olinda', 'Caruaru', 'Petrolina', 'Paulista', 'Cabo de Santo Agostinho', 'Porto de Galinhas']
  },
  {
    id: 'PI',
    name: 'Piauí (PI)',
    cities: ['Teresina', 'Parnaíba', 'Picos', 'Floriano', 'Piripiri']
  },
  {
    id: 'RJ',
    name: 'Rio de Janeiro (RJ)',
    cities: ['Rio de Janeiro', 'Niterói', 'Duque de Caxias', 'Nova Iguaçu', 'São Gonçalo', 'Belford Roxo', 'Campos dos Goytacazes', 'Petrópolis', 'Cabo Frio', 'Angra dos Reis']
  },
  {
    id: 'RN',
    name: 'Rio Grande do Norte (RN)',
    cities: ['Natal', 'Mossoró', 'Parnamirim', 'São Gonçalo do Amarante', 'Macaíba', 'Caicó', 'Tibau do Sul']
  },
  {
    id: 'RS',
    name: 'Rio Grande do Sul (RS)',
    cities: ['Porto Alegre', 'Caxias do Sul', 'Canoas', 'Pelotas', 'Santa Maria', 'Gravataí', 'Viamão', 'Novo Hamburgo', 'Gramado', 'Canela']
  },
  {
    id: 'RO',
    name: 'Rondônia (RO)',
    cities: ['Porto Velho', 'Ji-Paraná', 'Ariquemes', 'Cacoal', 'Vilhena']
  },
  {
    id: 'RR',
    name: 'Roraima (RR)',
    cities: ['Boa Vista', 'Rorainópolis', 'Caracaraí', 'Mucajaí']
  },
  {
    id: 'SC',
    name: 'Santa Catarina (SC)',
    cities: ['Joinville', 'Florianópolis', 'Blumenau', 'São José', 'Chapecó', 'Itajaí', 'Criciúma', 'Balneário Camboriú']
  },
  {
    id: 'SP',
    name: 'São Paulo (SP)',
    cities: ['São Paulo', 'Campinas', 'Guarulhos', 'São Bernardo do Campo', 'Santo André', 'São José dos Campos', 'Ribeirão Preto', 'Sorocaba', 'Santos', 'São José do Rio Preto']
  },
  {
    id: 'SE',
    name: 'Sergipe (SE)',
    cities: ['Aracaju', 'Nossa Senhora do Socorro', 'Lagarto', 'Itabaiana', 'Estância']
  },
  {
    id: 'TO',
    name: 'Tocantins (TO)',
    cities: ['Palmas', 'Araguaína', 'Gurupi', 'Porto Nacional', 'Paraíso do Tocantins']
  }
];

export const CATEGORIES: Category[] = [
  {
    id: 'compra-venda',
    name: 'Compra e Venda',
    iconName: 'ShoppingBag',
    subCategories: ['Celulares & Telefonia', 'Computadores & Informática', 'Móveis & Decoração', 'Roupas & Acessórios', 'Esportes & Lazer', 'Brinquedos & Games'],
    color: 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100'
  },
  {
    id: 'imoveis',
    name: 'Imóveis',
    iconName: 'Home',
    subCategories: ['Aluguel de Casas & Aptos', 'Venda de Casas & Aptos', 'Quartos & República', 'Temporada', 'Terrenos & Lotes'],
    color: 'bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100'
  },
  {
    id: 'servicos',
    name: 'Serviços',
    iconName: 'Wrench',
    subCategories: ['Manutenção & Reformas', 'Aulas & Treinamentos', 'Saúde, Estética & Bem-estar', 'Eventos & Festas', 'Fretes & Mudanças', 'Assistência Técnica'],
    color: 'bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-100'
  },
  {
    id: 'empregos',
    name: 'Empregos',
    iconName: 'Briefcase',
    subCategories: ['Comercial & Vendas', 'Administrativo & Secretariado', 'Atendimento & Telemarketing', 'Tecnologia & T.I.', 'Serviços Gerais', 'Estágios & Menor Aprendiz'],
    color: 'bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100'
  },
  {
    id: 'veiculos',
    name: 'Veículos',
    iconName: 'Car',
    subCategories: ['Carros & Utilitários', 'Motos & Motonetas', 'Peças & Acessórios', 'Caminhões & Ônibus', 'Barcos & Náutica'],
    color: 'bg-sky-50 text-sky-700 border-sky-100 hover:bg-sky-100'
  },
  {
    id: 'comunidade',
    name: 'Comunidade',
    iconName: 'Users',
    subCategories: ['Animais de Estimação', 'Adoção e Doações', 'Achados e Perdidos', 'Eventos Locais', 'Voluntariado'],
    color: 'bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100'
  },
  {
    id: 'adulto',
    name: 'Adulto & Sex Shop',
    iconName: 'Flame',
    subCategories: ['Acompanhantes & Encontros', 'Produtos de Sex Shop', 'Fantasias & Lingeries', 'Massagem Sensual', 'Eventos & Despedidas'],
    color: 'bg-pink-50 text-pink-700 border-pink-100 hover:bg-pink-100'
  }
];

export const INITIAL_LISTINGS: Listing[] = [
  {
    id: '1',
    title: 'iPhone 14 Pro Max 256GB - Estado de Novo, Saúde da Bateria 89%',
    description: 'Vendo iPhone 14 Pro Max na belíssima cor Roxo-profundo. O aparelho está impecável, sem nenhum risco ou marca de uso. Sempre utilizado com película de cerâmica e capinha de proteção de alta qualidade. Acompanha caixa original e cabo de carregamento original nunca usado. Entrego em mãos em shopping seguro na capital.',
    price: 4850,
    category: 'compra-venda',
    subCategory: 'Celulares & Telefonia',
    region: 'SP',
    city: 'São Paulo',
    neighborhood: 'Jardins',
    createdAt: '2026-06-19T10:15:00.000Z',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    sellerName: 'Rodrigo Alencar',
    sellerPhone: '(11) 98765-4321',
    sellerEmail: 'rodrigo.alencar@example.com',
    isPremium: true,
    views: 142
  },
  {
    id: '2',
    title: 'Apartamento de 2 Quartos para Alugar Próximo ao Metrô Ana Rosa',
    description: 'Lindo apartamento de 65m² totalmente mobiliado e pronto para morar. Dispõe de 2 quartos amplos, sendo 1 suíte, sala com sacada envidraçada de frente para o sol da manhã, cozinha equipada com armários embutidos e fogão, 1 vaga coberta na garagem. Condomínio completo com piscina climatizada, academia, salão de festas decorado e portaria 24 horas. Localização fantástica a apenas 5 minutos de caminhada da estação Ana Rosa do metrô (Linha Verde/Azul).',
    price: 3200,
    category: 'imoveis',
    subCategory: 'Aluguel de Casas & Aptos',
    region: 'SP',
    city: 'São Paulo',
    neighborhood: 'Vila Mariana',
    createdAt: '2026-06-20T08:30:00.000Z',
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80',
    sellerName: 'Beatriz Imóveis Sp',
    sellerPhone: '(11) 97123-4567',
    sellerEmail: 'contato@beatrizimoveis.com.br',
    isPremium: true,
    views: 310
  },
  {
    id: '3',
    title: 'Pintor Profissional e Pequenas Reformas Residenciais',
    description: 'Realizo serviços profissionais de pintura residencial e comercial com alto padrão de acabamento. Aplicação de massa corrida, texturas, efeitos decorativos (como cimento queimado), pintura de portas e janelas. Também realizo pequenos reparos gerais como furação de paredes, fixação de quadros, instalação de torneiras e reparos hidráulicos simples. Orçamento gratuito via WhatsApp. Preço justo, rapidez e excelente limpeza pós-serviço.',
    price: null, // A combinar
    category: 'servicos',
    subCategory: 'Manutenção & Reformas',
    region: 'RJ',
    city: 'Rio de Janeiro',
    neighborhood: 'Copacabana',
    createdAt: '2026-06-18T14:45:00.000Z',
    imageUrl: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&auto=format&fit=crop&q=80',
    sellerName: 'Marcos Silva Pinturas',
    sellerPhone: '(21) 96543-2109',
    sellerEmail: 'marcos.pinturas@example.com',
    isPremium: false,
    views: 78
  },
  {
    id: '4',
    title: 'Vaga para Vendedor Interno de Tecnologia - Comissões Atrativas',
    description: 'Empresa especializada em soluções de automação e tecnologia comercial contrata Vendedor Interno para atuar de segunda a sexta-feira. Oferecemos salário fixo CLT de R$ 1.950,00 + Comissões sem teto sobre as vendas, vale transporte, vale refeição diário de R$ 32,00, e plano de saúde integral unificado. Desejável experiência anterior com vendas por telefone/redes sociais ou venda de softwares. Venha fazer parte de uma equipe animada e competitiva.',
    price: 1950,
    category: 'empregos',
    subCategory: 'Comercial & Vendas',
    region: 'MG',
    city: 'Belo Horizonte',
    neighborhood: 'Savassi',
    createdAt: '2026-06-20T11:00:00.000Z',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80',
    sellerName: 'TechPlus Automação',
    sellerPhone: '(31) 98888-7777',
    sellerEmail: 'recrutamento@techplus.com.br',
    isPremium: false,
    views: 95
  },
  {
    id: '5',
    title: 'Lindo Lote de 450m² em Condomínio Fechado de Alto Padrão em Curitiba',
    description: 'Estudo propostas para este espetacular terreno aclive suave de 450m² (15m x 30m) situado em condomínio fechado rodeado de amplas áreas verdes. O condomínio oferece infraestrutura completa subterrânea (água/luz), ruas asfaltadas com ciclovias, quadras de tênis de saibro, bosque preservado com trilha para caminhadas recreativas e vigilância armada monitorada permanente por câmeras térmicas de alta resolução.',
    price: 340000,
    category: 'imoveis',
    subCategory: 'Terrenos & Lotes',
    region: 'PR',
    city: 'Curitiba',
    neighborhood: 'Santa Felicidade',
    createdAt: '2026-06-15T09:00:00.000Z',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80',
    sellerName: 'Klemtz Imobiliária',
    sellerPhone: '(41) 99999-8888',
    sellerEmail: 'vendas@klemtzimoveis.com.br',
    isPremium: true,
    views: 245
  },
  {
    id: '6',
    title: 'Honda Civic LX 2.0 Automático - Banco de Couro, Única Dona, 72.000km',
    description: 'Vendo excelente Honda Civic LX com motor 2.0 Flex One e câmbio automático CVT de 7 marchas virtuais simuladas. Carro de única dona, extremamente bem cuidado, histórico de revisões rigorosamente em dia realizadas apenas na concessionária autorizada Honda. Equipado com bancos originais em couro natural cinza, sensor de chuva crepuscular, faróis de neblina diurnos e kit multimídia completo compatível com Apple CarPlay de forma sem fio. IPVA de 2026 totalmente quitado.',
    price: 94800,
    category: 'veiculos',
    subCategory: 'Carros & Utilitários',
    region: 'SP',
    city: 'Campinas',
    neighborhood: 'Taquaral',
    createdAt: '2026-06-19T14:30:00.000Z',
    imageUrl: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=600&auto=format&fit=crop&q=80',
    sellerName: 'Mariana G. Silva',
    sellerPhone: '(19) 97321-0987',
    sellerEmail: 'marianags@example.com',
    isPremium: true,
    views: 512
  },
  {
    id: '7',
    title: 'Filhote de Golden Retriever para Adoção Responsável',
    description: 'Buscamos uma família muito amorosa e responsável para acolher este filhote macho de Golden Retriever de 3 meses. Ele já foi vacinado com as duas primeiras doses da vacina V10 importada e desverminado conforme orientação do médico veterinário. Ele é extremamente brincalhão, dócil com crianças e de fácil adaptação em casas espaçosas com quintal. Será cobrada apenas uma taxa simbólica para cobrir os custos veterinários de vacinação e ração premium inicial.',
    price: 350,
    category: 'comunidade',
    subCategory: 'Animais de Estimação',
    region: 'RJ',
    city: 'Niterói',
    neighborhood: 'Icaraí',
    createdAt: '2026-06-20T12:00:00.000Z',
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80',
    sellerName: 'Carla Vasconcellos',
    sellerPhone: '(21) 97722-1133',
    sellerEmail: 'carlav@example.com',
    isPremium: false,
    views: 312
  },
  {
    id: '8',
    title: 'Sofá Retrátil e Reclinável de 3 Lugares em Veludo Cinza',
    description: 'Estou de mudança e vendo excelente sofá de 3 lugares de alta qualidade com assentos retráteis confortáveis e encostos de cabeça com regulagem multilíngue ergonômica. Tecido de veludo macio na cor cinza-grafite, super impermeabilizado contra manchas e respingos acidentais de líquidos. Medidas: 2,10m de largura por 1,00m de profundidade fechado e 1,45m de abertura quando totalmente estirado. Precisa retirar no local.',
    price: 850,
    category: 'compra-venda',
    subCategory: 'Móveis & Decoração',
    region: 'MG',
    city: 'Uberlândia',
    neighborhood: 'Santa Mônica',
    createdAt: '2026-06-18T16:20:00.000Z',
    imageUrl: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&auto=format&fit=crop&q=80',
    sellerName: 'Fernando Costa',
    sellerPhone: '(34) 99345-6789',
    sellerEmail: 'f.costa88@example.com',
    isPremium: false,
    views: 110
  },
  {
    id: '9',
    title: 'Sessão de Massoterapia Relaxante e Drenagem Linfática',
    description: 'Clínica especializada e acolhedora oferece sessões agendadas individuais de Massoterapia Relaxante, Massagem Sueca, Liberação Miofascial e Drenagem Linfática Pós-operatória conduzidas por fisioterapeutas graduados e certificados. Ambiente climatizado com velas perfumadas, aromaterapia relaxante com óleos essenciais orgânicos doTERRA e música instrumental suave de fundo. Atendemos de segunda a sábado das 08h às 21h em consultório central de excelente acesso público.',
    price: 120,
    category: 'servicos',
    subCategory: 'Saúde, Estética & Bem-estar',
    region: 'BA',
    city: 'Salvador',
    neighborhood: 'Pituba',
    createdAt: '2026-06-19T17:15:00.000Z',
    imageUrl: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&auto=format&fit=crop&q=80',
    sellerName: 'Espaço Vitalle',
    sellerPhone: '(71) 99111-2222',
    sellerEmail: 'vitalle.spa@example.com',
    isPremium: false,
    views: 154
  },
  {
    id: '10',
    title: 'Lancha Coral 26 Pés Motor Mercruiser 250HP - Muito Nova!',
    description: 'Oportunidade incrível de lazer! Lancha Coral de 26 pés com motor de centro Mercruiser 4.3 V6 de 250 cavalos de potência, apenas 180 horas totais de uso em água doce. Embarcação super espaçosa homologada para transportar com amplo conforto 1 tripulante + 9 passageiros em águas abrigadas. Tapeçaria naval importada inteiramente reformada recentemente, targa em fibra de vidro, rádio VHF avançado, sonar de navegação marítima Garmin de última geração e churrasqueira de popa em inox regulável.',
    price: 185000,
    category: 'veiculos',
    subCategory: 'Barcos & Náutica',
    region: 'RJ',
    city: 'Angra dos Reis',
    neighborhood: 'Marina Porto Frade',
    createdAt: '2026-06-17T11:40:00.000Z',
    imageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&auto=format&fit=crop&q=80',
    sellerName: 'Guilherme Corretor Náutico',
    sellerPhone: '(24) 99876-5432',
    sellerEmail: 'guilherme.coral@example.com',
    isPremium: true,
    views: 290
  },
  {
    id: '11',
    title: 'Kit de Cosméticos & Lingeries Finas de Luxo para Casais - Boutique',
    description: 'Oferecemos o melhor catálogo premium de lingerie importada, óleos aromáticos afrodisíacos para massagem tântrica, velas de soja perfumadas e acessórios elegantes de sex shop para apimentar a vida íntima de casais. Realizamos entregas super discretas com embalagem neutra sem qualquer identificação de conteúdo em toda a região metropolitana ou frete grátis via Sedex. Atendimento exclusivo e sigilo absoluto garantido.',
    price: 189,
    category: 'adulto',
    subCategory: 'Produtos de Sex Shop',
    region: 'SP',
    city: 'São Paulo',
    neighborhood: 'Cerqueira César',
    createdAt: '2026-06-20T10:15:00.000Z',
    imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&auto=format&fit=crop&q=80',
    sellerName: 'Amour Boutique Sensual',
    sellerPhone: '(11) 98888-7711',
    sellerEmail: 'contato@amourboutique.com.b',
    isPremium: true,
    views: 395
  },
  {
    id: '12',
    title: 'Sessão de Massagem Tântrica & Relaxante Sensual Individualizada',
    description: 'Viva uma jornada inesquecível de revigoramento físico e cura emocional. Nossa massagem corporal tântrica e sensitiva trabalha a respiração profunda, liberação do estresse acumulado e desperta de energia com profissionais capacitados em um ambiente de absoluto respeito, conforto térmico, som ambiente relaxante de alta fidelidade e óleos de coco puros e aquecidos com essências afrodisíacas importadas. Atendemos homens, mulheres e casais de forma personalizada.',
    price: 300,
    category: 'adulto',
    subCategory: 'Massagem Sensual',
    region: 'RJ',
    city: 'Rio de Janeiro',
    neighborhood: 'Copacabana',
    createdAt: '2026-06-20T11:45:00.000Z',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80',
    sellerName: 'Espaço Harmony Copacabana',
    sellerPhone: '(21) 98222-3344',
    sellerEmail: 'harmony_copa@example.com',
    isPremium: false,
    views: 184
  }
];
