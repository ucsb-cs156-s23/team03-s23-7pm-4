// get hotels from local storage
const get = () => {
    const hotelValue = localStorage.getItem("hotels");
    if (hotelValue === undefined) {
        const hotelCollection = { nextId: 1, hotels: [] }
        return set(hotelCollection);
    }
    const hotelCollection = JSON.parse(hotelValue);
    if (hotelCollection === null) {
        const hotelCollection = { nextId: 1, hotels: [] }
        return set(hotelCollection);
    }
    return hotelCollection;
};

const getById = (id) => {
    if (id === undefined) {
        return { "error": "id is a required parameter" };
    }
    const hotelCollection = get();
    const hotels = hotelCollection.hotels;

    /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
    const index = hotels.findIndex((r) => r.id == id);
    if (index === -1) {
        return { "error": `hotel with id ${id} not found` };
    }
    return { hotel: hotels[index] };
}

// set hotels in local storage
const set = (hotelCollection) => {
    localStorage.setItem("hotels", JSON.stringify(hotelCollection));
    return hotelCollection;
};

// add a hotel to local storage
const add = (hotel) => {
    const hotelCollection = get();
    hotel = { ...hotel, id: hotelCollection.nextId };
    hotelCollection.nextId++;
    hotelCollection.hotels.push(hotel);
    set(hotelCollection);
    return hotel;
};

// update a hotel in local storage
const update = (hotel) => {
    const hotelCollection = get();

    const hotels = hotelCollection.hotels;

    /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
    const index = hotels.findIndex((r) => r.id == hotel.id);
    if (index === -1) {
        return { "error": `hotel with id ${hotel.id} not found` };
    }
    hotels[index] = hotel;
    set(hotelCollection);
    return { hotelCollection: hotelCollection };
};

// delete a hotel from local storage
const del = (id) => {
    if (id === undefined) {
        return { "error": "id is a required parameter" };
    }
    const hotelCollection = get();
    const hotels = hotelCollection.hotels;

    /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
    const index = hotels.findIndex((r) => r.id == id);
    if (index === -1) {
        return { "error": `hotel with id ${id} not found` };
    }
    hotels.splice(index, 1);
    set(hotelCollection);
    return { hotelCollection: hotelCollection };
};

const hotelUtils = {
    get,
    getById,
    add,
    update,
    del
};

export { hotelUtils };