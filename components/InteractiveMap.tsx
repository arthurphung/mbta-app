import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function InteractiveMap() {
    const icon = new Icon({
        iconUrl: '/marker.png',
        iconSize: [64, 64]
    });

    return (
        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} style={{ height: '500px', width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            <Marker icon={icon} position={[51.505, -0.09]}>
                <Popup>
                    A pretty popup.
                </Popup>
            </Marker>
        </MapContainer>
    );
};