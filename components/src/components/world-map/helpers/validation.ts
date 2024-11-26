import {
    object,
    string,
    array,
    number,
    InferInput,
    union,
} from 'valibot';

const WorldMapData = object({
    title: string(),
    countries: array(string()),
    value: union([number(), string()]),
});

export const WorldMapDataArray = array(WorldMapData);

export type WorldMapData = InferInput<typeof WorldMapDataArray>;
