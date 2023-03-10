import { useEffect, useState } from 'react';
import { ICoordinates, IVehicle } from "../interfaces/IMap";
import { IPrediction } from "../interfaces/IPredictions";

const fetchVehicles = (predictions: Array<IPrediction>) => {
    let coordinates: Array<ICoordinates> = [];

    const events: Array<string> = ['reset', 'add', 'update', 'remove'];

    const vehicleIds: Array<string> = [];
    predictions.forEach((prediction) => vehicleIds.push(prediction.relationships.vehicle.data.id));
    const top3VehicleIds = vehicleIds.slice(0, 3).join(',');
    const vehiclesStream = new EventSource(`/api/vehicles/${top3VehicleIds}`);
    for (const event of events) {
        vehiclesStream.addEventListener(event, (e) => {
            switch (event) {
                case 'reset':
                    const resetRes: Array<IVehicle> = JSON.parse(e.data);
                    const resetData: Array<ICoordinates> = [];
                    resetRes.forEach((vehicle) => resetData.push({ latitude: vehicle.attributes.latitude, longitude: vehicle.attributes.longitude }));
                    coordinates = resetData;
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
        
    return coordinates;
};

export { fetchVehicles };