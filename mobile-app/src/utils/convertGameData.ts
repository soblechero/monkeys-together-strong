import {Game} from '@/types';

export const convertGameData = (data: any): Game => {
    return {
        ...data,
        releaseDate: new Date(data.releaseDate), // Asegura que releaseDate sea un objeto Date
    };
};

export const convertGamesList = (data: any[]): Game[] => {
    return data.map(convertGameData);
};
