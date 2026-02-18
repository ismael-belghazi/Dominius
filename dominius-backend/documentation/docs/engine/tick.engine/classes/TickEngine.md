[**dominius-backend**](../../../README.md)

***

[dominius-backend](../../../README.md) / [engine/tick.engine](../README.md) / TickEngine

# Class: TickEngine

Defined in: [engine/tick.engine.ts:7](https://github.com/ismael-belghazi/Dominius/blob/0a1ae78088d3117b064832932b6f4b6e4ef77781/dominius-backend/src/engine/tick.engine.ts#L7)

## Constructors

### Constructor

> **new TickEngine**(`game`): `TickEngine`

Defined in: [engine/tick.engine.ts:8](https://github.com/ismael-belghazi/Dominius/blob/0a1ae78088d3117b064832932b6f4b6e4ef77781/dominius-backend/src/engine/tick.engine.ts#L8)

#### Parameters

##### game

[`GameEngine`](../../game.engine/classes/GameEngine.md)

#### Returns

`TickEngine`

## Methods

### buildInfrastructure()

> **buildInfrastructure**(`village`, `type`): `void`

Defined in: [engine/tick.engine.ts:241](https://github.com/ismael-belghazi/Dominius/blob/0a1ae78088d3117b064832932b6f4b6e4ef77781/dominius-backend/src/engine/tick.engine.ts#L241)

#### Parameters

##### village

[`Village`](../../../models/village/interfaces/Village.md)

##### type

`"Market"` | `"Mill"` | `"Barracks"` | `"Library"` | `"Hospital"`

#### Returns

`void`

***

### spawnAnimal()

> **spawnAnimal**(`kingdom`, `animalType`): `void`

Defined in: [engine/tick.engine.ts:225](https://github.com/ismael-belghazi/Dominius/blob/0a1ae78088d3117b064832932b6f4b6e4ef77781/dominius-backend/src/engine/tick.engine.ts#L225)

#### Parameters

##### kingdom

[`Kingdom`](../../../models/kingdom/interfaces/Kingdom.md)

##### animalType

`"Cow"` | `"Sheep"` | `"Pig"` | `"Chicken"` | `"Deer"` | `"Rabbit"` | `"Fish"`

#### Returns

`void`

***

### tick()

> **tick**(): `void`

Defined in: [engine/tick.engine.ts:10](https://github.com/ismael-belghazi/Dominius/blob/0a1ae78088d3117b064832932b6f4b6e4ef77781/dominius-backend/src/engine/tick.engine.ts#L10)

#### Returns

`void`
