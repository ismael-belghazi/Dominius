[**dominius-backend**](../../../README.md)

***

[dominius-backend](../../../README.md) / [engine/divine-power.engine](../README.md) / DivinePowerEngine

# Class: DivinePowerEngine

Defined in: [engine/divine-power.engine.ts:4](https://github.com/ismael-belghazi/Dominius/blob/0a1ae78088d3117b064832932b6f4b6e4ef77781/dominius-backend/src/engine/divine-power.engine.ts#L4)

## Constructors

### Constructor

> **new DivinePowerEngine**(`game`): `DivinePowerEngine`

Defined in: [engine/divine-power.engine.ts:6](https://github.com/ismael-belghazi/Dominius/blob/0a1ae78088d3117b064832932b6f4b6e4ef77781/dominius-backend/src/engine/divine-power.engine.ts#L6)

#### Parameters

##### game

[`GameEngine`](../../game.engine/classes/GameEngine.md)

#### Returns

`DivinePowerEngine`

## Methods

### smite()

> **smite**(`x`, `y`, `radius`): `void`

Defined in: [engine/divine-power.engine.ts:16](https://github.com/ismael-belghazi/Dominius/blob/0a1ae78088d3117b064832932b6f4b6e4ef77781/dominius-backend/src/engine/divine-power.engine.ts#L16)

#### Parameters

##### x

`number`

##### y

`number`

##### radius

`number`

#### Returns

`void`

***

### spawnVillage()

> **spawnVillage**(`x`, `y`, `name`): [`Kingdom`](../../../models/kingdom/interfaces/Kingdom.md) \| `null`

Defined in: [engine/divine-power.engine.ts:12](https://github.com/ismael-belghazi/Dominius/blob/0a1ae78088d3117b064832932b6f4b6e4ef77781/dominius-backend/src/engine/divine-power.engine.ts#L12)

#### Parameters

##### x

`number`

##### y

`number`

##### name

`string`

#### Returns

[`Kingdom`](../../../models/kingdom/interfaces/Kingdom.md) \| `null`

***

### terraform()

> **terraform**(`x`, `y`, `type`): `void`

Defined in: [engine/divine-power.engine.ts:8](https://github.com/ismael-belghazi/Dominius/blob/0a1ae78088d3117b064832932b6f4b6e4ef77781/dominius-backend/src/engine/divine-power.engine.ts#L8)

#### Parameters

##### x

`number`

##### y

`number`

##### type

[`TileType`](../../world.engine/type-aliases/TileType.md)

#### Returns

`void`
