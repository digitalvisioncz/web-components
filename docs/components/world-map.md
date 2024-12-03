---
outline: deep
---

# World Map

Web component for simple world map with configurable countries/regions and optional tooltips on hover.

## Install

You can use this component with script tag in your `<head>` element

```js
<script src="https://cdn.jsdelivr.net/npm/@dvdevcz/components@latest/dist/world-map.js" type="module"></script>
```

or as a npm package

```shell
yarn add @dvdevcz/components
```

```js
import '@dvdevcz/components/world-map';
```

## Usage

### Basic
```html
<dv-world-map></dv-world-map>
```

### With regions data

#### HTML
```html
<dv-world-map>
    <script type="application/json">
        [
            {
                "title": "CZ+SK",
                "description": "Structured purchases",
                "countries": ["203", "703"]
            },
        ]
    </script>
</dv-world-map>
```

#### JSX/TSX
```jsx
<dv-world-map
    regions={[
        {
            title: 'CZ+SK',
            description: 'Structured purchases',
            countries: ['203', '703']
        },
    ]}
></dv-world-map>
```

**Data object properties**
| Property      | description                                                                                     | Type                | Example value       |
| :------------ | :---------------------------------------------------------------------------------------------- | :------------------ | :------------------ |
| *countries*   | Array of country codes ([ISO 3166-1 numeric](https://en.wikipedia.org/wiki/ISO_3166-1_numeric)) | string[]            | ["840"]             |
| *title*       | Tooltip title copy (optional)                                                                   | string              | USA                 |
| *description* | Tooltip description copy (optional)                                                             | string \| string[]  | Strategic purchases |


## Styling

| CSS Variable | Default value |
| ------------ | ------------- |
| --dv-world-map-background | transparent |
| --dv-world-map-land-background | #fff |
| --dv-world-map-land-border-color | #333 |
| --dv-world-map-land-border-width | 0.1 |
| --dv-world-map-region-background | #ffc107 |
| --dv-world-map-region-background-hover | #b68903 |
| --dv-world-map-tooltip-background | #fff |
| --dv-world-map-tooltip-border-color | #ccc |
| --dv-world-map-tooltip-border-width | 1px |
| --dv-world-map-tooltip-border-radius | 1rem |
| --dv-world-map-tooltip-color | #333 |
| --dv-world-map-tooltip-font-size | 1rem |
| --dv-world-map-tooltip-padding | 2rem |
| --dv-world-map-tooltip-title-color | #333 |
| --dv-world-map-tooltip-title-font-size | 1.25em |
| --dv-world-map-tooltip-title-font-weight | 700 |
| --dv-world-map-tooltip-description-color | #555 |
| --dv-world-map-tooltip-description-font-size | .9em |
| --dv-world-map-tooltip-description-font-weight | 400 |
| --dv-world-map-tooltip-description-line-height | 1.25 |
