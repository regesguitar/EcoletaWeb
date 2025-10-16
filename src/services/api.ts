import axios, { AxiosResponse } from 'axios'

// Mock API para desenvolvimento - substitui o backend localhost:3333
const api = axios.create({
  baseURL: 'http://localhost:3333',
  timeout: 10000,
})

// Dados mock para desenvolvimento
const mockItems = [
  { id: 1, title: 'Lâmpadas', image_url: 'http://localhost:3333/uploads/lampadas.svg' },
  { id: 2, title: 'Pilhas e Baterias', image_url: 'http://localhost:3333/uploads/baterias.svg' },
  { id: 3, title: 'Papéis e Papelão', image_url: 'http://localhost:3333/uploads/papeis-papelao.svg' },
  { id: 4, title: 'Resíduos Eletrônicos', image_url: 'http://localhost:3333/uploads/eletronicos.svg' },
  { id: 5, title: 'Resíduos Orgânicos', image_url: 'http://localhost:3333/uploads/organicos.svg' },
  { id: 6, title: 'Óleo de Cozinha', image_url: 'http://localhost:3333/uploads/oleo.svg' }
]

function isItemsUrl(url?: string) {
  if (!url) return false
  return url.endsWith('items') || url.endsWith('/items')
}

function isPointUrl(url?: string) {
  if (!url) return false
  return url.endsWith('point') || url.endsWith('/point')
}

// Interceptar respostas para garantir mock em dev quando houver erro
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url: string | undefined = error?.config?.url
    const method: string = (error?.config?.method || 'get').toLowerCase()

    // Quaisquer falhas (404, 5xx, CORS ou rede) nos endpoints conhecidos usam mock
    if (isItemsUrl(url)) {
      const mockResponse: AxiosResponse = {
        data: mockItems,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: error.config,
      }
      return Promise.resolve(mockResponse)
    }

    if (isPointUrl(url) && method === 'post') {
      const mockResponse: AxiosResponse = {
        data: {
          id: Math.floor(Math.random() * 1000),
          message: 'Ponto de coleta criado com sucesso!',
        },
        status: 201,
        statusText: 'Created',
        headers: {},
        config: error.config,
      }
      return Promise.resolve(mockResponse)
    }

    return Promise.reject(error)
  }
)

export default api
