// Serviço moderno para localização - substitui IBGE API
export interface Uf {
  sigla: string
  nome: string
}

export interface Cidade {
  nome: string
}

// Dados atualizados das UFs brasileiras (2025)
const UFS_BRASILEIRAS: Uf[] = [
  { sigla: 'AC', nome: 'Acre' },
  { sigla: 'AL', nome: 'Alagoas' },
  { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' },
  { sigla: 'BA', nome: 'Bahia' },
  { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' },
  { sigla: 'ES', nome: 'Espírito Santo' },
  { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' },
  { sigla: 'MT', nome: 'Mato Grosso' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'PA', nome: 'Pará' },
  { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PR', nome: 'Paraná' },
  { sigla: 'PE', nome: 'Pernambuco' },
  { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'RN', nome: 'Rio Grande do Norte' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'Rondônia' },
  { sigla: 'RR', nome: 'Roraima' },
  { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' },
  { sigla: 'SE', nome: 'Sergipe' },
  { sigla: 'TO', nome: 'Tocantins' }
]

// Cidades principais por UF (dados mock para desenvolvimento)
const CIDADES_POR_UF: Record<string, string[]> = {
  'SP': ['São Paulo', 'Campinas', 'São José dos Campos', 'Sorocaba', 'Santos', 'São Vicente', 'Guarulhos', 'Osasco'],
  'RJ': ['Rio de Janeiro', 'Niterói', 'São Gonçalo', 'Duque de Caxias', 'Nova Iguaçu', 'Campos dos Goytacazes'],
  'MG': ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Betim', 'Montes Claros'],
  'RS': ['Porto Alegre', 'Caxias do Sul', 'Pelotas', 'Canoas', 'Santa Maria', 'Gravataí'],
  'PR': ['Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa', 'Cascavel', 'São José dos Pinhais'],
  'SC': ['Florianópolis', 'Joinville', 'Blumenau', 'Chapecó', 'Criciúma', 'Lages'],
  'GO': ['Goiânia', 'Aparecida de Goiânia', 'Anápolis', 'Rio Verde', 'Águas Lindas de Goiás'],
  'DF': ['Brasília', 'Ceilândia', 'Samambaia', 'Taguatinga', 'Plano Piloto'],
  'MT': ['Cuiabá', 'Várzea Grande', 'Rondonópolis', 'Sinop', 'Tangará da Serra'],
  'MS': ['Campo Grande', 'Dourados', 'Três Lagoas', 'Corumbá', 'Ponta Porã'],
  'ES': ['Vitória', 'Vila Velha', 'Serra', 'Cariacica', 'Cachoeiro de Itapemirim'],
  'BA': ['Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Camaçari', 'Juazeiro'],
  'PE': ['Recife', 'Jaboatão dos Guararapes', 'Olinda', 'Caruaru', 'Petrolina'],
  'CE': ['Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Maracanaú', 'Sobral'],
  'PA': ['Belém', 'Ananindeua', 'Santarém', 'Marabá', 'Castanhal'],
  'MA': ['São Luís', 'Imperatriz', 'São José de Ribamar', 'Timon', 'Caxias'],
  'PB': ['João Pessoa', 'Campina Grande', 'Santa Rita', 'Patos', 'Bayeux'],
  'RN': ['Natal', 'Mossoró', 'Parnamirim', 'São Gonçalo do Amarante', 'Macaíba'],
  'AL': ['Maceió', 'Arapiraca', 'Rio Largo', 'Palmeira dos Índios', 'União dos Palmares'],
  'SE': ['Aracaju', 'Lagarto', 'Itabaiana', 'São Cristóvão', 'Nossa Senhora do Socorro'],
  'PI': ['Teresina', 'Parnaíba', 'Picos', 'Piripiri', 'Floriano'],
  'TO': ['Palmas', 'Araguaína', 'Gurupi', 'Porto Nacional', 'Paraíso do Tocantins'],
  'AP': ['Macapá', 'Santana', 'Laranjal do Jari', 'Oiapoque', 'Porto Grande'],
  'RR': ['Boa Vista', 'Rorainópolis', 'Caracaraí', 'São Luiz', 'Bonfim'],
  'RO': ['Porto Velho', 'Ji-Paraná', 'Ariquemes', 'Vilhena', 'Cacoal'],
  'AC': ['Rio Branco', 'Cruzeiro do Sul', 'Sena Madureira', 'Tarauacá', 'Feijó'],
  'AM': ['Manaus', 'Parintins', 'Itacoatiara', 'Manacapuru', 'Coari']
}

export const locationService = {
  // Buscar todas as UFs
  async getUfs(): Promise<string[]> {
    try {
      // Em produção, você poderia usar uma API como:
      // const response = await fetch('https://brasilapi.com.br/api/ibge/uf/v1')
      // const data = await response.json()
      // return data.map((uf: Uf) => uf.sigla)

      // Para desenvolvimento, retornamos dados mock
      return UFS_BRASILEIRAS.map(uf => uf.sigla)
    } catch (error) {
      console.error('Erro ao buscar UFs:', error)
      return UFS_BRASILEIRAS.map(uf => uf.sigla)
    }
  },

  // Buscar cidades por UF
  async getCities(uf: string): Promise<string[]> {
    try {
      // Em produção, você poderia usar uma API como:
      // const response = await fetch(`https://brasilapi.com.br/api/ibge/municipios/v1/${uf}`)
      // const data = await response.json()
      // return data.map((city: Cidade) => city.nome)

      // Para desenvolvimento, retornamos dados mock
      return CIDADES_POR_UF[uf] || []
    } catch (error) {
      console.error('Erro ao buscar cidades:', error)
      return CIDADES_POR_UF[uf] || []
    }
  },

  // Buscar posição atual do usuário
  async getCurrentPosition(): Promise<[number, number]> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalização não é suportada neste navegador'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve([position.coords.latitude, position.coords.longitude])
        },
        (error) => {
          console.error('Erro ao obter localização:', error)
          // Posição padrão (São Paulo) caso erro
          resolve([-23.550520, -46.633308])
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutos
        }
      )
    })
  }
}
