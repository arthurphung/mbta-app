import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { IPrediction } from '../interfaces/IPredictions';
import { useEffect, useState } from 'react';
import router from 'next/router';
import { ICoordinates, IVehicle } from '../interfaces/IMap';

type InteractiveMapProps = {
    coordinates: Array<ICoordinates>
}

export default function InteractiveMap(props: InteractiveMapProps) {
    const icon = new Icon({
        iconUrl: '/marker.png',
        iconSize: [64, 64]
    });

    console.log(props.coordinates);

    return (
        <MapContainer center={[42.361145, -71.05783]} zoom={13} scrollWheelZoom={false} style={{ height: '500px', width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            {props.coordinates.map((coordinates, idx) => {
                if (idx < 3) {
                    return (
                        <Marker icon={icon} position={[coordinates.latitude, coordinates.longitude]}>
                            <Popup>
                                Last reported position:
                                <br />

                            </Popup>
                        </Marker>
                    );
                }
            })}
        </MapContainer>
    );
};