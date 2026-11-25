import { useParams } from 'react-router'

function BusinessPage() {
    const { osmType, id } = useParams()

    return (
        <main>
            <h1>Business page</h1>
            <p>{osmType} {id}</p>
        </main>
    )
}

export default BusinessPage