[**dominius-backend**](../../../README.md)

***

[dominius-backend](../../../README.md) / [engine/game.engine](../README.md) / GameEngine

# Class: GameEngine

Defined in: [engine/game.engine.ts:8](https://github.com/ismael-belghazi/Dominius/blob/0a1ae78088d3117b064832932b6f4b6e4ef77781/dominius-backend/src/engine/game.engine.ts#L8)

## Constructors

### Constructor

> **new GameEngine**(): `GameEngine`

Defined in: [engine/game.engine.ts:18](https://github.com/ismael-belghazi/Dominius/blob/0a1ae78088d3117b064832932b6f4b6e4ef77781/dominius-backend/src/engine/game.engine.ts#L18)

#### Returns

`GameEngine`

## Properties

### kingdoms

> **kingdoms**: [`Kingdom`](../../../models/kingdom/interfaces/Kingdom.md)[] = `[]`

Defined in: [engine/game.engine.ts:10](https://github.com/ismael-belghazi/Dominius/blob/0a1ae78088d3117b064832932b6f4b6e4ef77781/dominius-backend/src/engine/game.engine.ts#L10)

***

### tickEngine

> **tickEngine**: [`TickEngine`](../../tick.engine/classes/TickEngine.md)

Defined in: [engine/game.engine.ts:11](https://github.com/ismael-belghazi/Dominius/blob/0a1ae78088d3117b064832932b6f4b6e4ef77781/dominius-backend/src/engine/game.engine.ts#L11)

***

### world

> **world**: [`WorldEngine`](../../world.engine/classes/WorldEngine.md)

Defined in: [engine/game.engine.ts:9](https://github.com/ismael-belghazi/Dominius/blob/0a1ae78088d3117b064832932b6f4b6e4ef77781/dominius-backend/src/engine/game.engine.ts#L9)

## Methods

### buildInfrastructure()

> **buildInfrastructure**(`village`, `type`): `void`

Defined in: [engine/game.engine.ts:121](https://github.com/ismael-belghazi/Dominius/blob/0a1ae78088d3117b064832932b6f4b6e4ef77781/dominius-backend/src/engine/game.engine.ts#L121)

#### Parameters

##### village

[`Village`](../../../models/village/interfaces/Village.md)

##### type

`"Market"` | `"Mill"` | `"Barracks"` | `"Library"` | `"Hospital"`

#### Returns

`void`

***

### createHuman()

> **createHuman**(`x`, `y`, `kingdomId`): [`Human`](../../../models/human/interfaces/Human.md)

Defined in: [engine/game.engine.ts:28](https://github.com/ismael-belghazi/Dominius/blob/0a1ae78088d3117b064832932b6f4b6e4ef77781/dominius-backend/src/engine/game.engine.ts#L28)

#### Parameters

##### x

`number`

##### y

`number`

##### kingdomId

`number`

#### Returns

[`Human`](../../../models/human/interfaces/Human.md)

***

### getNextAnimalId()

> **getNextAnimalId**(): `number`

Defined in: [engine/game.engine.ts:26](https://github.com/ismael-belghazi/Dominius/blob/0a1ae78088d3117b064832932b6f4b6e4ef77781/dominius-backend/src/engine/game.engine.ts#L26)

#### Returns

`number`

***

### getNextHumanId()

> **getNextHumanId**(): `number`

Defined in: [engine/game.engine.ts:23](https://github.com/ismael-belghazi/Dominius/blob/0a1ae78088d3117b064832932b6f4b6e4ef77781/dominius-backend/src/engine/game.engine.ts#L23)

#### Returns

`number`

***

### getNextKingdomId()

> **getNextKingdomId**(): `number`

Defined in: [engine/game.engine.ts:25](https://github.com/ismael-belghazi/Dominius/blob/0a1ae78088d3117b064832932b6f4b6e4ef77781/dominius-backend/src/engine/game.engine.ts#L25)

#### Returns

`number`

***

### getNextVillageId()

> **getNextVillageId**(): `number`

Defined in: [engine/game.engine.ts:24](https://github.com/ismael-belghazi/Dominius/blob/0a1ae78088d3117b064832932b6f4b6e4ef77781/dominius-backend/src/engine/game.engine.ts#L24)

#### Returns

`number`

***

### getWorldState()

> **getWorldState**(): `object`

Defined in: [engine/game.engine.ts:86](https://github.com/ismael-belghazi/Dominius/blob/0a1ae78088d3117b064832932b6f4b6e4ef77781/dominius-backend/src/engine/game.engine.ts#L86)

#### Returns

`object`

##### kingdoms

> **kingdoms**: [`Kingdom`](../../../models/kingdom/interfaces/Kingdom.md)[]

##### world

> **world**: [`Tile`](../../world.engine/interfaces/Tile.md)[][]

***

### spawnAnimal()

> **spawnAnimal**(`kingdomId`, `animalType`, `village?`): [`Animal`](../../../models/Animal/interfaces/Animal.md) \| `null`

Defined in: [engine/game.engine.ts:93](https://github.com/ismael-belghazi/Dominius/blob/0a1ae78088d3117b064832932b6f4b6e4ef77781/dominius-backend/src/engine/game.engine.ts#L93)

#### Parameters

##### kingdomId

`number`

##### animalType

`"Cow"` | `"Sheep"` | `"Pig"` | `"Chicken"` | `"Deer"` | `"Rabbit"` | `"Fish"`

##### village?

[`Village`](../../../models/village/interfaces/Village.md)

#### Returns

[`Animal`](../../../models/Animal/interfaces/Animal.md) \| `null`

***

### spawnVillageInternal()

> **spawnVillageInternal**(`x`, `y`, `name`): [`Kingdom`](../../../models/kingdom/interfaces/Kingdom.md) \| `null`

Defined in: [engine/game.engine.ts:46](https://github.com/ismael-belghazi/Dominius/blob/0a1ae78088d3117b064832932b6f4b6e4ef77781/dominius-backend/src/engine/game.engine.ts#L46)

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

Defined in: [engine/game.engine.ts:82](https://github.com/ismael-belghazi/Dominius/blob/0a1ae78088d3117b064832932b6f4b6e4ef77781/dominius-backend/src/engine/game.engine.ts#L82)

#### Parameters

##### x

`number`

##### y

`number`

##### type

[`TileType`](../../world.engine/type-aliases/TileType.md)

#### Returns

`void`

***

### tick()

> **tick**(): `void`

Defined in: [engine/game.engine.ts:78](https://github.com/ismael-belghazi/Dominius/blob/0a1ae78088d3117b064832932b6f4b6e4ef77781/dominius-backend/src/engine/game.engine.ts#L78)

#### Returns

`void`
