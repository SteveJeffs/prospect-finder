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

export default cleanBusiness