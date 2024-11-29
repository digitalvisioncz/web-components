import {
    object,
    string,
    array,
    InferInput,
    union,
    optional,
} from 'valibot';

const WorldMapData = object({
    title: optional(string()),
    countries: array(string()),
    description: optional(
        union(
            [array(string()), string()],
        ),
    ),
});

export const WorldMapDataArray = array(WorldMapData);

export type WorldMapData = InferInput<typeof WorldMapDataArray>;
