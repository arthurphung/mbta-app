import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ITrip, IVehicle } from '../interfaces/IMap';
import { useEffect, useState } from 'react';
import { IData } from '../interfaces/IMap';
import router from 'next/router';

type interactiveMapProps = {
    routeId: string
}

export default function InteractiveMap(props: interactiveMapProps) {
    const [vehicles, setVehicles] = useState<Array<IVehicle>>([]);
    const [vehicleIdsToNamesMap, setVehicleIdsToNamesMap] = useState<{ [key: string]: string }>({});
    const inboundDirectionId = 1;

    const icon = new Icon({
        iconUrl: '/marker.png',
        iconSize: [64, 64]
    });

    const fetchVehicleName = async (vehicleId: string) => {
        const vehicleTripRes = await fetch(`api/trips/${vehicleId}`);
        const vehicleTripData: ITrip = await vehicleTripRes.json();

        return vehicleTripData.attributes.headsign;
    };

    const handleRouteChange = (url: string, { shallow }: { shallow:boolean }) => {
        console.log(`App is changing to ${url} ${shallow ? 'with' : 'without'} shallow routing`);
    }

    useEffect(() => {
        const events: Array<string> = ['reset', 'add', 'update', 'remove'];
        const vehiclesStream = new EventSource(`/api/vehicles/${props.routeId}`);

        for (const event of events) {
            vehiclesStream.addEventListener(event, async (e) => {
                switch (event) {
                    case 'reset':
                        const resetData: Array<IVehicle> = JSON.parse(e.data);
                        console.log('reset vehicles');
                        setVehicles(resetData);
                        const map: { [key: string]: string} = {};
                        for (const vehicle of resetData) {
                            if (!(vehicle.id in map)) {
                                map[vehicle.id] = await fetchVehicleName(vehicle.id);
                            }
                        }
                        setVehicleIdsToNamesMap(map);
                        break;
                    case 'add':
                        const addData: IVehicle = JSON.parse(e.data);
                        console.log('add vehicle');
                        setVehicles([...vehicles, addData]);
                        break;
                    case 'update':
                        const updateData: IVehicle = JSON.parse(e.data);
                        console.log('update vehicle');
                        setVehicles((vehicles) => {
                            return [...vehicles].map((vehicle) => {
                                if (vehicle.id === updateData.id) return updateData;
                                return vehicle;
                            });
                        });
                        break;
                    case 'remove':
                        const removeData: IData = JSON.parse(e.data);
                        console.log('remove vehicle', removeData);
                        const vehicleId: string = removeData.id;
                        setVehicles((vehicles) => {
                            return [...vehicles].filter((vehicle) => vehicle.id !== vehicleId);
                        })
                        break;
                    default:
                        break;
                }
            });
        }

        return () => {
            router.events.off('routeChangeStart', handleRouteChange);
            vehiclesStream.close();
            console.log('connection closed');
        }
    }, []);

    return (
        <MapContainer center={[42.361145, -71.05783]} zoom={13} style={{ height: '500px', width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            {vehicles.map((vehicle) => {
                return (
                    <Marker key={vehicle.id} icon={icon} position={[vehicle.attributes.latitude, vehicle.attributes.longitude]}>
                        <Popup>
                            Train: {vehicleIdsToNamesMap[vehicle.id]}
                            <br />
                            Direction: {vehicle.attributes.direction_id === inboundDirectionId ? 'Inbound' : 'Outbound'}
                            <br />
                            Occupancy Status: {vehicle.attributes.occupancy_status}
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
};