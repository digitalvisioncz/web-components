import {
    object,
    string,
    array,
    number,
    InferInput,
    union,
    optional,
} from 'valibot';

const WorldMapData = object({
    title: string(),
    countries: array(string()),
    description: optional(union([number(), string()])),
});

export const WorldMapDataArray = array(WorldMapData);

export type WorldMapData = InferInput<typeof WorldMapDataArray>;
