[**dominius-backend**](../../../README.md)

***

[dominius-backend](../../../README.md) / [services/worldservice](../README.md) / WorldService

# Class: WorldService

Defined in: services/worldservice.ts:6

## Constructors

### Constructor

> **new WorldService**(): `WorldService`

#### Returns

`WorldService`

## Methods

### getState()

> `static` **getState**(): `object`

Defined in: services/worldservice.ts:20

#### Returns

`object`

##### kingdoms

> **kingdoms**: [`Kingdom`](../../../models/kingdom/interfaces/Kingdom.md)[]

##### world

> **world**: [`Tile`](../../../engine/world.engine/interfaces/Tile.md)[][]

***

### spawnVillage()

> `static` **spawnVillage**(`x`, `y`, `name`): [`Kingdom`](../../../models/kingdom/interfaces/Kingdom.md) \| `null`

Defined in: services/worldservice.ts:12

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

> `static` **terraform**(`x`, `y`, `type`): `void`

Defined in: services/worldservice.ts:8

#### Parameters

##### x

`number`

##### y

`number`

##### type

`any`

#### Returns

`void`

***

### tick()

> `static` **tick**(): `void`

Defined in: services/worldservice.ts:16

#### Returns

`void`
