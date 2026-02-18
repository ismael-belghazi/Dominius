[**dominius-backend**](../../../README.md)

***

[dominius-backend](../../../README.md) / [engine/tick.engine](../README.md) / TickEngine

# Class: TickEngine

Defined in: engine/tick.engine.ts:7

## Constructors

### Constructor

> **new TickEngine**(`game`): `TickEngine`

Defined in: engine/tick.engine.ts:8

#### Parameters

##### game

[`GameEngine`](../../game.engine/classes/GameEngine.md)

#### Returns

`TickEngine`

## Methods

### buildInfrastructure()

> **buildInfrastructure**(`village`, `type`): `void`

Defined in: engine/tick.engine.ts:241

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

Defined in: engine/tick.engine.ts:225

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

Defined in: engine/tick.engine.ts:10

#### Returns

`void`
