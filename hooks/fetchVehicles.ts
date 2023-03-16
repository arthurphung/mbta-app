import { useState } from "react";
import { ICoordinates, IVehicle } from "../interfaces/IMap";
const eventSource = require('eventsource');

const fetchVehicles = (routeId: string) => {
    const coordinates: Array<ICoordinates> = [];

    const events: Array<string> = ['reset', 'add', 'update', 'remove'];
    const vehiclesStream = new EventSource(`/api/vehicles/${routeId}`);
    for (const event of events) {
        vehiclesStream.addEventListener(event, (e: any) => {
            switch (event) {
                case 'reset':
                    const resetRes: Array<IVehicle> = JSON.parse(e.data);
                    const resetData: Array<ICoordinates> = [];
                    resetRes.forEach((vehicle) => resetData.push({ latitude: vehicle.attributes.latitude, longitude: vehicle.attributes.longitude }));
                    // setCoordinates(resetData);
                    // console.log(coordinates);
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
        
    return coordinates;
};

export { fetchVehicles };