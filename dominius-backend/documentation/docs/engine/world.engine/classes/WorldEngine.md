[**dominius-backend**](../../../README.md)

***

[dominius-backend](../../../README.md) / [engine/world.engine](../README.md) / WorldEngine

# Class: WorldEngine

Defined in: [engine/world.engine.ts:9](https://github.com/ismael-belghazi/Dominius/blob/0a1ae78088d3117b064832932b6f4b6e4ef77781/dominius-backend/src/engine/world.engine.ts#L9)

## Constructors

### Constructor

> **new WorldEngine**(`width`, `height`): `WorldEngine`

Defined in: [engine/world.engine.ts:12](https://github.com/ismael-belghazi/Dominius/blob/0a1ae78088d3117b064832932b6f4b6e4ef77781/dominius-backend/src/engine/world.engine.ts#L12)

#### Parameters

##### width

`number`

##### height

`number`

#### Returns

`WorldEngine`

## Properties

### grid

> **grid**: [`Tile`](../interfaces/Tile.md)[][]

Defined in: [engine/world.engine.ts:10](https://github.com/ismael-belghazi/Dominius/blob/0a1ae78088d3117b064832932b6f4b6e4ef77781/dominius-backend/src/engine/world.engine.ts#L10)

***

### height

> **height**: `number`

Defined in: [engine/world.engine.ts:12](https://github.com/ismael-belghazi/Dominius/blob/0a1ae78088d3117b064832932b6f4b6e4ef77781/dominius-backend/src/engine/world.engine.ts#L12)

***

### width

> **width**: `number`

Defined in: [engine/world.engine.ts:12](https://github.com/ismael-belghazi/Dominius/blob/0a1ae78088d3117b064832932b6f4b6e4ef77781/dominius-backend/src/engine/world.engine.ts#L12)

## Methods

### getTile()

> **getTile**(`x`, `y`): [`Tile`](../interfaces/Tile.md) \| `null`

Defined in: [engine/world.engine.ts:23](https://github.com/ismael-belghazi/Dominius/blob/0a1ae78088d3117b064832932b6f4b6e4ef77781/dominius-backend/src/engine/world.engine.ts#L23)

#### Parameters

##### x

`number`

##### y

`number`

#### Returns

[`Tile`](../interfaces/Tile.md) \| `null`

***

### setTile()

> **setTile**(`x`, `y`, `type`): `void`

Defined in: [engine/world.engine.ts:28](https://github.com/ismael-belghazi/Dominius/blob/0a1ae78088d3117b064832932b6f4b6e4ef77781/dominius-backend/src/engine/world.engine.ts#L28)

#### Parameters

##### x

`number`

##### y

`number`

##### type

[`TileType`](../type-aliases/TileType.md)

#### Returns

`void`
