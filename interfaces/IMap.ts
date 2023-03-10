export interface ICoordinates {
    latitude: number,
    longitude: number
};

export interface IVehicle {
    attributes: Attributes,
    id: string,
    relationships: {
        route: { data: Data },
        stop: { data: Data },
        trip: { data: Data }
    },
    type: string
}

interface Attributes {
    bearing: number,
    current_status: string,
    current_stop_sequence: number,
    direction_id: number,
    label: string,
    latitude: number,
    longitude: number,
    occupancy_status: string,
    speed: number,
    updated_at: string
}

interface Data {
    id: string,
    type: string
}