import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { toast } from 'react-toastify'
import { LeafletMouseEvent } from 'leaflet'
import {
  FaLightbulb,
  FaBatteryHalf,
  FaFileAlt,
  FaLaptop,
  FaLeaf,
  FaOilCan
} from 'react-icons/fa'
import api from '../../services/api'
import { locationService } from '../../services/locationService'

import './styles.css'

import logo from '../../assets/logo.svg'

interface Item {
  id: number
  title: string
  image_url: string
}

const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([])
  const [ufs, setUfs] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingLocation, setLoadingLocation] = useState(true)

  const [initialPosition, setInitialPosition] = useState<[number, number]>([-23.550520, -46.633308])

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
  })

  const [selectedUf, setSelectedUf] = useState('0')
  const [selectedCity, setSelectedCity] = useState('0')
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0])

  const navigate = useNavigate()

  // Carregar posição inicial
  useEffect(() => {
    const loadInitialPosition = async () => {
      try {
        setLoadingLocation(true)
        const position = await locationService.getCurrentPosition()
        setInitialPosition(position)
        setSelectedPosition(position)
      } catch (error) {
        console.error('Erro ao obter localização:', error)
        toast.error('Não foi possível obter sua localização. Usando localização padrão.')
      } finally {
        setLoadingLocation(false)
      }
    }

    loadInitialPosition()
  }, [])

  // Carregar itens de coleta
  useEffect(() => {
    const loadItems = async () => {
      try {
        const response = await api.get('items')
        setItems(response.data)
      } catch (error) {
        console.error('Erro ao carregar itens:', error)
        toast.error('Erro ao carregar itens de coleta')
      }
    }

    loadItems()
  }, [])

  // Carregar UFs
  useEffect(() => {
    const loadUfs = async () => {
      try {
        const ufList = await locationService.getUfs()
        setUfs(ufList)
      } catch (error) {
        console.error('Erro ao carregar UFs:', error)
        toast.error('Erro ao carregar estados')
      }
    }

    loadUfs()
  }, [])

  // Carregar cidades quando UF for selecionada
  useEffect(() => {
    if (selectedUf === '0') {
      setCities([])
      return
    }

    const loadCities = async () => {
      try {
        const cityList = await locationService.getCities(selectedUf)
        setCities(cityList)
        setSelectedCity('0') // Reset cidade quando UF muda
      } catch (error) {
        console.error('Erro ao carregar cidades:', error)
        toast.error('Erro ao carregar cidades')
      }
    }

    loadCities()
  }, [selectedUf])

  const handleSelectUf = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedUf(event.target.value)
  }

  const handleSelectCity = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(event.target.value)
  }

  const MapClickHandler = () => {
    useMapEvents({
      click: (event: LeafletMouseEvent) => {
        setSelectedPosition([event.latlng.lat, event.latlng.lng])
      }
    })
    return null
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectItem = (id: number) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  // Função para obter o ícone correspondente a cada item
  const getItemIcon = (itemId: number) => {
    const iconMap: { [key: number]: JSX.Element } = {
      1: <FaLightbulb />,      // Lâmpadas
      2: <FaBatteryHalf />,   // Pilhas e Baterias
      3: <FaFileAlt />,       // Papéis e Papelão
      4: <FaLaptop />,        // Resíduos Eletrônicos
      5: <FaLeaf />,          // Resíduos Orgânicos
      6: <FaOilCan />         // Óleo de Cozinha
    }
    return iconMap[itemId] || <FaFileAlt />
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    // Validação básica
    if (!formData.name || !formData.email || !formData.whatsapp) {
      toast.error('Por favor, preencha todos os campos obrigatórios')
      return
    }

    if (selectedUf === '0') {
      toast.error('Por favor, selecione um estado')
      return
    }

    if (selectedCity === '0') {
      toast.error('Por favor, selecione uma cidade')
      return
    }

    if (selectedItems.length === 0) {
      toast.error('Por favor, selecione pelo menos um item de coleta')
      return
    }

    if (selectedPosition[0] === 0 && selectedPosition[1] === 0) {
      toast.error('Por favor, selecione uma localização no mapa')
      return
    }

    try {
      setLoading(true)

      const { name, email, whatsapp } = formData
      const [latitude, longitude] = selectedPosition

      const data = {
        name,
        email,
        whatsapp,
        uf: selectedUf,
        city: selectedCity,
        latitude,
        longitude,
        items: selectedItems
      }

      await api.post('point', data)

      toast.success('Ponto de coleta criado com sucesso!')

      navigate('/')
    } catch (error) {
      console.error('Erro ao criar ponto de coleta:', error)
      toast.error('Erro ao criar ponto de coleta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />
        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>Cadastro do ponto de coleta</h1>

        <fieldset>
          <legend>
            <h2>Dados da entidade</h2>
          </legend>
          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                value={formData.whatsapp}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          {loadingLocation ? (
            <div style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p>Carregando mapa...</p>
            </div>
          ) : (
            <MapContainer center={initialPosition} zoom={15} style={{ height: '350px', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={selectedPosition} />
              <MapClickHandler />
            </MapContainer>
          )}

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select
                name="uf"
                id="uf"
                value={selectedUf}
                onChange={handleSelectUf}
                required
              >
                <option value="0">Selecione uma UF</option>
                {ufs.map(uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select
                name="city"
                id="city"
                value={selectedCity}
                onChange={handleSelectCity}
                required
              >
                <option value="0">Selecione uma cidade</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Ítens de Coleta</h2>
            <span>Selecione um ou mais ítens abaixo</span>
          </legend>

          <ul className="items-grid">
            {items.map(item => (
              <li
                key={item.id}
                onClick={() => handleSelectItem(item.id)}
                className={selectedItems.includes(item.id) ? 'selected' : ''}
              >
                <div className="item-icon">
                  {getItemIcon(item.id)}
                </div>
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button type="submit" disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar ponto de coleta'}
        </button>
      </form>
    </div>
  )

}
export default CreatePoint
