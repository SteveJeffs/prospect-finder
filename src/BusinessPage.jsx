import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import cleanBusiness from './cleanBusiness.js'

function BusinessPage() {
    const { osmType, id } = useParams()
    const [business, setBusiness] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const controller = new AbortController()

        async function getBusiness() {
            const query = '[out:json];' + osmType + '(' + id + ');out center;'
            const url = 'https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(query)

            try {
                const response = await fetch(url, { signal: controller.signal })

                if (!response.ok) {
                    throw new Error("Couldn't load this business. The map server might be busy, so try again in a minute.")
                }

                const data = await response.json()

                if (data.elements.length === 0) {
                    throw new Error("Couldn't find this business.")
                }

                setBusiness(cleanBusiness(data.elements[0]))
            } catch (err) {
                if (controller.signal.aborted) return
                setError(err.message)
            } finally {
                if (!controller.signal.aborted) setLoading(false)
            }
        }

        getBusiness()
        return () => controller.abort()
    }, [osmType, id])
    const navigate = useNavigate()

    return (
        <main>
            <button onClick={() => navigate(-1)}>Back to results</button>
            <h1>Business page</h1>

            {loading && <p>Loading business...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && (
                <>
                <h2>{business.name}</h2>
                <p>Type: {business.type}</p>
                <p>Street: {business.street || 'Not listed'}</p>
                <p>Postcode: {business.postcode || 'Not listed'}</p>
                <p>Phone: {business.phone || 'Not listed'}</p>
                <p>Hours: {business.hours || 'Not listed'}</p>
                <p>Website: {business.website || 'Not listed'}</p>
                <a href={'https://www.openstreetmap.org/' + business.osmType + '/' + business.id} target="_blank" rel="noreferrer">View on map</a>
                </>
            )}
        </main>
    )
}

export default BusinessPage