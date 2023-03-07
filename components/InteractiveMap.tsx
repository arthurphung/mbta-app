import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { IPrediction } from '../interfaces/IPredictions';
import { useEffect, useState } from 'react';
import router from 'next/router';
import { ICoordinates, IVehicles } from '../interfaces/IMap';

type InteractiveMapProps = {
    inboundPredictions: Array<IPrediction>
}

export default function InteractiveMap(props: InteractiveMapProps) {
    const [inboundCoordinates, setInboundCoordinates] = useState<Array<ICoordinates>>([]);

    const events: Array<string> = ['reset', 'add', 'update', 'remove'];

    const handleRouteChange = (url: string, { shallow }: { shallow:boolean }) => {
        console.log(`App is changing to ${url} ${shallow ? 'with' : 'without'} shallow routing`);
    }
    
    useEffect(() => {
        if (props.inboundPredictions) {
            const vehicleIds: Array<string> = [];
            props.inboundPredictions.forEach((prediction) => vehicleIds.push(prediction.relationships.vehicle.data.id));
            const top3VehicleIds = vehicleIds.slice(0, 3).join(',');
            const inboundVehiclesStream = new EventSource(`/api/vehicles/${top3VehicleIds}`);
            for (const event of events) {
                inboundVehiclesStream.addEventListener(event, (e) => {
                    switch (event) {
                        case 'reset':
                            const resetData: IVehicles = JSON.parse(e.data);
                            const coordinates: Array<ICoordinates> = [];
                            resetData.data.forEach((vehicle) => coordinates.push({ latitude: vehicle.attributes.latitude, longitude: vehicle.attributes.longitude }));
                            setInboundCoordinates(coordinates);
                            console.log(resetData);
                            // resetPredictions(resetData, inboundDirectionId);
                            break;
                        case 'add':
                            // const addData: IPrediction = JSON.parse(e.data);
                            // addPrediction(addData, inboundDirectionId);
                            break;
                        case 'update':
                            // const updateData: IPrediction = JSON.parse(e.data);
                            // updatePrediction(updateData, inboundDirectionId);
                            break;
                        case 'remove':
                            // const removeData: IData = JSON.parse(e.data);
                            // const predictionId: string = removeData.id;
                            // removePrediction(predictionId, inboundDirectionId);
                            break;
                        default:
                            break;
                    }
                });
            }
            
            router.events.on('routeChangeStart', handleRouteChange);
    
            return () => {
                router.events.off('routeChangeStart', handleRouteChange);
                inboundVehiclesStream.close();
                console.log('connection closed');
            }
        }

    }, [props.inboundPredictions]);

    const icon = new Icon({
        iconUrl: '/marker.png',
        iconSize: [64, 64]
    });

    return (
        <MapContainer center={[42.361145, -71.05783]} zoom={13} scrollWheelZoom={false} style={{ height: '500px', width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            {inboundCoordinates.map((coordinates, idx) => {
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