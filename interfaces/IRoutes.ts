export interface IRoutes {
    data: Array<IRoute>
};

export interface IRoute {
    attributes: Attributes,
    id: string,
    links: Links,
    relationships: Relationships,
    type: string
};

export interface IRouteIdToDestinationsMap {
    [key: string]: Array<string>
}

interface Attributes {
    color: string,
    description: string,
    direction_destinations: Array<string>,
    direction_names: Array<string>,
    fare_class: string,
    long_name: string,
    short_name: string,
    sort_order: number,
    text_color: string,
    type: number
};

interface Links {
    self: string
};

interface Relationships {
    line: Line
};

interface Line {
    data: LineData
};

interface LineData {
    id: string,
    type: string
};