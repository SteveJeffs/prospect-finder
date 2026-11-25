import { useEffect, useState } from 'react'
import { Link } from 'react-router'

function cleanBusiness(element) {
  const tags = element.tags || {}

  return {
    id: element.id,
    osmType: element.type,
    name: tags.name || 'Unnamed business',
    type: tags.amenity || tags.shop || tags.leisure || 'Unknown',
    street: tags['addr:street'] || '',
    postcode: tags['addr:postcode'] || '',
    phone: tags.phone || tags['contact:phone'] || '',
    website: tags.website || tags['contact:website'] || '',
    hours: tags.opening_hours || '',
  }
}

const areas = [
  { name: 'Wallington', lat: 51.3614, lon: -0.1506 },
  { name: 'Carshalton', lat: 51.3683, lon: -0.1665 },
  { name: 'Sutton', lat: 51.3618, lon: -0.1945 },
  { name: 'Cheam', lat: 51.3577, lon: -0.2148 },
  { name: 'Banstead', lat: 51.3226, lon: -0.2050 },
  { name: 'Reigate', lat: 51.2373, lon: -0.2058 },
]

const types = [
  { label: 'Cafes', tag: '["amenity"="cafe"]' },
  { label: 'Restaurants', tag: '["amenity"="restaurant"]' },
  { label: 'Takeaways', tag: '["amenity"="fast_food"]' },
  { label: 'Pubs', tag: '["amenity"="pub"]' },
  { label: 'Hairdressers', tag: '["shop"="hairdresser"]' },
  { label: 'Beauty salons', tag: '["shop"="beauty"]' },
  { label: 'Gyms', tag: '["leisure"="fitness_centre"]' },
  { label: 'Florists', tag: '["shop"="florist"]' },
]

function SearchPage() {
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [areaName, setAreaName] = useState('Wallington')
  const [typeLabel, setTypeLabel] = useState('Cafes')

  useEffect(() => {
    const selectedArea = areas.find(item => item.name === areaName)
    const selectedType = types.find(item => item.label === typeLabel)
    const controller = new AbortController()
    async function getBusinesses() {
      const query = '[out:json];nwr' + selectedType.tag + '(around:1000,' + selectedArea.lat + ',' + selectedArea.lon + ');out center;'
      const url = 'https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(query)

      try {
        const response = await fetch(url, { signal: controller.signal })

        if (!response.ok) {
          throw new Error("Couldn't load businesses. The map server might be busy, so try again in a minute.")
        }

        const data = await response.json()
        const cleaned = data.elements.map(cleanBusiness)
        setBusinesses(cleaned)
      } catch (err) {
        if (controller.signal.aborted) return
        setError(err.message)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    getBusinesses()
    return () => controller.abort()
  }, [areaName, typeLabel])

  function handleAreaChange(newArea) {
    setAreaName(newArea)
    setLoading(true)
    setError('')
  }

  function handleTypeChange(newType) {
    setTypeLabel(newType)
    setLoading(true)
    setError('')
  }

  return (
    <main>
      <h1>Prospect Finder</h1>
      <label>
        Area
        <select value={areaName} onChange={event => handleAreaChange(event.target.value)}>
          {areas.map(area => (
            <option key={area.name} value={area.name}>{area.name}</option>
          ))}
        </select>
      </label>
      <label>
        Type
        <select value={typeLabel} onChange={event => handleTypeChange(event.target.value)}>
          {types.map(type => (
            <option key={type.label} value={type.label}>{type.label}</option>
          ))}
        </select>
      </label>
      {loading && <p>Loading businesses...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <>
          <p>{businesses.length} results</p>
          <ul>
            {businesses.map(business => (
              <li key={business.id}>
                <Link to={'/Business/' + business.osmType + '/' + business.id}>
                  <strong>{business.name}</strong>
                </Link> {business.street}
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  )
}

export default SearchPage

