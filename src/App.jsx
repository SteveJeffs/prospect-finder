import { useEffect, useState } from 'react'

function cleanBusiness(element) {
  const tags = element.tags || {}

  return {
    id: element.id,
    name: tags.name || 'Unnamed business',
    type: tags.amenity || tags.shop || 'Unknown',
    street: tags['addr:street'] || '',
    postcode: tags['addr:postcode'] || '',
    phone: tags.phone || tags['contact:phone'] || '',
    website: tags.website || tags['contact:website'] || '',
    hours: tags.opening_hours || '',
  }
}

function App() {
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function getBusinesses() {
      const query = '[out:json];nwr["amenity"="cafe"](around:1000,51.3614,-0.1506);out center;'
      const url = 'https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(query)

      try {
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error("Couldn't load businesses. The map server might be busy, so try again in a minute.")
        }

        const data = await response.json()
        const cleaned = data.elements.map(cleanBusiness)
        setBusinesses(cleaned)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    getBusinesses()
  }, [])

  return (
    <main>
      <h1>Prospect Finder</h1>
      {loading && <p>Loading businesses...</p>}
      <p>{businesses.length} results</p>
      <ul>
        {businesses.map(business => (
          <li key={business.id}>
            <strong>{business.name}</strong> {business.street}
          </li>
        ))}
      </ul>
    </main>
  )
}

export default App

