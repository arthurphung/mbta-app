export interface IStops {
    data: Array<IStop>
};

export interface IStop {
    attributes: Attributes,
    id: string,
    links: Links,
    relationships: Relationships,
    type: string
};

interface Attributes {
    address: string,
    at_street: string,
    description: string,
    latitude: number,
    location_type: number,
    longitude: number,
    municipality: string,
    name: string,
    on_street: string,
    platform_code: string,
    platform_name: string,
    vehicle_type: string,
    wheelchair_boarding: number
};

interface Links {
    self: string
};

interface Relationships {
    facilities: FacilitiesLinks,
    parent_station: ParentStation,
    zone: Zone
};

interface FacilitiesLinks {
    related: string
};

interface ParentStation {
    data: string
};

interface Zone {
    data: string
}