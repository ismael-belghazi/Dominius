[**dominius-backend**](../../../README.md)

***

[dominius-backend](../../../README.md) / [engine/game.engine](../README.md) / GameEngine

# Class: GameEngine

Defined in: engine/game.engine.ts:8

## Constructors

### Constructor

> **new GameEngine**(): `GameEngine`

Defined in: engine/game.engine.ts:18

#### Returns

`GameEngine`

## Properties

### kingdoms

> **kingdoms**: [`Kingdom`](../../../models/kingdom/interfaces/Kingdom.md)[] = `[]`

Defined in: engine/game.engine.ts:10

***

### tickEngine

> **tickEngine**: [`TickEngine`](../../tick.engine/classes/TickEngine.md)

Defined in: engine/game.engine.ts:11

***

### world

> **world**: [`WorldEngine`](../../world.engine/classes/WorldEngine.md)

Defined in: engine/game.engine.ts:9

## Methods

### buildInfrastructure()

> **buildInfrastructure**(`village`, `type`): `void`

Defined in: engine/game.engine.ts:121

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

Defined in: engine/game.engine.ts:28

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

Defined in: engine/game.engine.ts:26

#### Returns

`number`

***

### getNextHumanId()

> **getNextHumanId**(): `number`

Defined in: engine/game.engine.ts:23

#### Returns

`number`

***

### getNextKingdomId()

> **getNextKingdomId**(): `number`

Defined in: engine/game.engine.ts:25

#### Returns

`number`

***

### getNextVillageId()

> **getNextVillageId**(): `number`

Defined in: engine/game.engine.ts:24

#### Returns

`number`

***

### getWorldState()

> **getWorldState**(): `object`

Defined in: engine/game.engine.ts:86

#### Returns

`object`

##### kingdoms

> **kingdoms**: [`Kingdom`](../../../models/kingdom/interfaces/Kingdom.md)[]

##### world

> **world**: [`Tile`](../../world.engine/interfaces/Tile.md)[][]

***

### spawnAnimal()

> **spawnAnimal**(`kingdomId`, `animalType`, `village?`): [`Animal`](../../../models/Animal/interfaces/Animal.md) \| `null`

Defined in: engine/game.engine.ts:93

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

Defined in: engine/game.engine.ts:46

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

Defined in: engine/game.engine.ts:82

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

Defined in: engine/game.engine.ts:78

#### Returns

`void`
