type Iterable<T, Y> = any | Record<string, unknown> | Y[] | [T, Y][] | Set<Y> | Map<T, Y>

/**
 * @author Auke ter Horst
 * @augments Map<T,Y> with Array.prototype methods and more
 * @summary
 * ## ExMap
 *
 * ExMap extends Map and adds methods from Array.prototype as well as other
 * useful tidbits. Keys are not limited to string or number, but can be any
 * type. If one of the keys in the map is not a primitive, the keys are stored
 * stringified in an internal object. If all keys are primitives, no object is
 * created.
 *
 * The ExMap can be constructed with any iterable, like Map, Set, Object, Array.
 * Because not all objects and arrays are equal, the constructor accepts 2
 * additional arguments:
 *
 * @param byKey By default the index of the iteration is used when parsing an
 * array. If the array holds objects and a specific property should be used to
 * define the key instead (e.g. the `id` property), the `byKey` parameter is
 * there to help. For any iterable that has an object as value, the property
 * will be checked. Note: this is only 1 dimensional and not recursive.
 *
 * @param isNotMap If a Map is turned into an array, each entry will be its own
 * array with [key, value]. However, assuming that all arrays with arrays as
 * value are by default array[0] as key and array[1] as value would be a bad
 * idea. Any longer array would be discarded after index 1, for example. Set the
 * `isNotMap` parameter to true and the ExMap will store the full value and use
 * the iterator index as key.
 *
 * ## Methods
 * The ExMap has the following public methods, see each method for more detailed
 * information:
 *
 * @method `first` GET the first item in the map, returns `Y`
 *
 * @method `last` GET the last item in the map, returns `Y`
 *
 * @method `next` get the next key from given key, returns `T`
 *
 * @method `previous` get the previous key from given key, returns `T`
 *
 * @method `has` check if current key<any> exists, returns `boolean`
 *
 * @method `get` return value for key<any>, returns `Y`
 *
 * @method `set` add a key/value pair to the ExMap, returns `this`
 *
 * @method `only` only add a value to the map, key will be auto-incremented,
 * returns current `this`
 *
 * @method `delete` delete key or match items via comparator function
 *
 * @method `index` get the entry at the given index, returns `[T,Y]`
 *
 * @method `indexOf` get the index of given key, returns `number` or `-1`
 *
 * @method `concat` concatenate any iterable to the map, accepts the same
 * arguments as the constructor, returns `this`
 *
 * @method `slice` use keys or callback functions to slice the map, returns a
 * new `ExMap<T,Y>`
 *
 * @method `some` Array.some, matches callback function, returns `boolean`
 *
 * @method `find` Array.find, matches callback function, returns `[T,Y]`
 *
 * @method `map` Array.map, matches callback function, returns `Y[]`
 *
 * @method `filter` Array.filter, matches callback function, returns a new
 * `ExMap<T,Y>`
 *
 * @method `forEach` extends Map.forEach, but the callback function has access
 * to the default value, key and map, as well as the next and previous key and
 * the index of the current item
 *
 * @method `toArray` returns `Y[]` or `[T,Y][]`
 *
 * @constructor
 * ```
 * 	// Normal constructors from iterables
 * 	const objectMap = new ExMap(object)
 * 	const tupleMap = new ExMap(Object.entries(object))
 * 	const mapMap = new ExMap(new Map())
 * 	const setMap = new ExMap(new Set())
 *
 * 	// Use a given property as the value for the key
 * 	const partOfMap = new ExMap(objectArray, 'property')
 *
 * 	// Also works with maps
 * 	const arrayMap = new ExMap(objectArray)
 * 	const keyInMap = new ExMap(arrayMap, 'myKey')
 *
 * 	// Create an index-based map based on an array of arrays
 * 	// Would otherwise be an ExMap with item[0] as key and item[1] as value.
 * 	const notFromMap = new ExMap([[1,2], [3,4], [5,6]], null, true)
 * ```
 */
export class ExMap<T, Y> extends Map {
	/**
	 * Create an empty ExMap, or instantiate it with entries by passing an
	 * iterable to the constructor.
	 *
	 * @param iterable any iterable or object
	 * @param byKey use value of property in `Y` as key
	 * @param isNotMap store all values and use iteration index as key
	 *
	 */
	constructor(iterable?: Iterable<T, Y>, byKey?: string, isNotMap?: boolean) {
		super()
		this.__parseIterable(iterable, byKey, isNotMap)
	}

	static get [Symbol.species]() {
		return ExMap
	}

	/**
	 * @summary
	 * Return the first value in the map
	 *
	 * @returns Y
	 */
	get first(): Y {
		for (const [, val] of this.entries()) {
			return val
		}
	}

	/**
	 * @summary
	 * Return the last value in the map
	 *
	 * @returns Y
	 */
	get last(): Y {
		let i = 1

		for (const [, val] of this.entries()) {
			if (i === this.size) return val
			i++
		}
	}

	/**
	 * @summary
	 * Find and return the key after the given key, if any.
	 *
	 * @param key current key
	 *
	 * @returns T
	 */
	public next(key: T): T {
		let current: T = null
		const keyany = this.__keyAny()

		for (const [index] of this.entries()) {
			if (current !== null) return this.__getKey(index)
			if ((keyany && this.__parseKey(key) === index) || (!keyany && key === index))
				current = index
		}
	}

	/**
	 * @summary
	 * Find and return the key before the given key, if any.
	 *
	 * @param key current key
	 *
	 * @returns T
	 */
	public previous(key: T): T {
		let prevkey: T = null
		const keyany = this.__keyAny()

		for (const [index] of this.entries()) {
			if ((keyany && this.__parseKey(key) === index) || (!keyany && index === key))
				return prevkey
			prevkey = this.__getKey(index)
		}

		return prevkey
	}

	/**
	 * @augments Map.has
	 * @summary
	 * Uses the internal function to return the right key for the Map and then
	 * checking the existence of this key.
	 *
	 * @param key T
	 *
	 * @returns boolean
	 */
	public has(key: T): boolean {
		if (!this.__hasValue(key)) return false
		this.__isPrimitive(key)

		const index = this.__getKeyIndex(key)
		return super.has(index)
	}

	/**
	 * @augments Map.get
	 * @summary
	 * Uses the internal function to return the right key for the Map and then
	 * return the value for this stringified key.
	 *
	 * @param key T
	 *
	 * @returns Y
	 */
	public get(key: T): Y {
		if (!this.__hasValue(key)) return undefined
		this.__isPrimitive(key)

		const index = this.__getKeyIndex(key)
		return super.get(index)
	}

	/**
	 * @augments super.set
	 * @summary
	 * Extends the Map.set by checking if the key is a primitive and, if not,
	 * parse the key and store it in the super class. The stringified key is
	 * stored in the class instance's [[Keys]] object.
	 *
	 * @param key
	 * @param value
	 */
	public set(key: T, value: Y): this {
		if (!this.__hasValue(key)) return this
		this.__isPrimitive(key)

		const index = this.__toKeyIndex(key)
		super.set(index, value)

		return this
	}

	/**
	 * @summary
	 * Add an item to the map, using auto-increment as key
	 *
	 * @param value Y
	 */
	public only(value: Y): this {
		super.set(this.size, value)
		return this
	}

	/**
	 * @augments super.delete
	 * @summary
	 * Extends Map.delete with the added option of using a comparator function.
	 *
	 * @param key T | (key: T, value: Y) => any
	 *
	 * @returns boolean
	 */
	public delete(key: T | ((key: T, value: Y) => any)): boolean {
		if (!this.__hasValue(key)) return false
		const comparator = typeof key === 'function' ? (key as (key: T, value: Y) => any) : null

		if (comparator) {
			const dellist: string[] = []
			for (const [k, value] of this.entries()) {
				const key = this.__getKey(k)
				if (comparator(key, value)) dellist.push(k)
			}
			for (const k of dellist) {
				this.__deleteKey(k)
				super.delete(k)
			}

			if (dellist.length) return true
		} else {
			const index = this.__parseKey(key as T)
			return super.delete(index)
		}

		if (this.__keyAny() && !this['keysize']) this.__unsetKeyMap()

		return false
	}

	/**
	 * @summary
	 * Return the key and value at the given index of the map.
	 *
	 * @param index index number
	 *
	 * @returns [T, Y]
	 */
	public index(index: number): [T, Y] {
		if (!this.__hasValue(index)) return [null, null]
		let idx: number = -1

		for (const [k, v] of this.entries()) {
			idx++
			if (index === idx) {
				return [this.__getKey(k) || k, v]
			}
		}

		return [null, null]
	}

	/**
	 * @summary
	 * Similar to Array.indexOf, returns the index of the given key in the map.
	 *
	 * @param key Key to get the indexOf
	 *
	 * @returns number || -1
	 */
	public indexOf(key: T): number {
		if (!this.__hasValue(key)) return -1
		const keyany = this.__keyAny()
		let idx: number = -1

		for (const [index] of this.entries()) {
			idx++
			if ((keyany && this.__parseKey(key) === index) || !(keyany && key === index)) return idx
		}

		return idx
	}

	/**
	 * @summary
	 * Implements Array.concat functionality, allowing for any iterable to be
	 * added, accepting the same arguments as the constructor. Supply property
	 * name to `byKey` to use as key from the values in the iterable, when
	 * iterating. Set the `isNotMap` property to use the index as key and store
	 * all else as value when iterating.
	 *
	 * Overwrites existing values for keys if `byKey` is set. Appends the map
	 * starting from the current size if `isNotMap` is set.
	 *
	 * @param iterable Iterable (array, tuple-array, Set-like, Map-like)
	 * @param byKey property from `Y` to use as map index
	 * @param isNotMap Iterable is NOT map-like
	 *
	 * @returns this
	 */
	public concat(iterable: Iterable<T, Y>, byKey?: string, isNotMap?: boolean): this {
		this.__parseIterable(iterable, byKey, isNotMap)
		return this
	}

	/**
	 * @summary
	 * Similar to Array.slice, but instead of using the index, the keys or
	 * comparator functions are used for determining where to start and/or end
	 * the slicing.
	 *
	 * @param start starting key or comparator function
	 * @param end ending key or comparator function
	 * @param only use auto-increment for new key
	 *
	 * @returns ExMap<T, Y>
	 */
	public slice(
		start?: T | ((value: Y, key: T) => boolean),
		end?: T | ((value: Y, key: T) => boolean),
		only?: boolean,
	): ExMap<T, Y> {
		const begin: boolean = this.__hasValue(start)
		const final: boolean = this.__hasValue(end)
		if (!begin && !final) return this

		const keyany = this.__keyAny()
		const map = new ExMap<T, Y>()
		const startFn: boolean = begin && typeof start === 'function'
		const endFn: boolean = final && typeof end === 'function'

		let first: boolean = false

		for (const [k, value] of this.entries()) {
			const key = this.__getKey(k)

			if (begin || final) {
				if (!begin && final) first = true

				if (begin) {
					const fn = start as (value: Y, key: T) => boolean
					if (
						(startFn && fn(value, key)) ||
						(keyany && this.__parseKey(start as T) === key) ||
						start === key
					) {
						first = true
						if (!only) map.set(key, value)
						else map.only(value)
					}
				}

				if (final) {
					const fn = end as (value: Y, key: T) => boolean
					if (
						(endFn && fn(value, key)) ||
						(keyany && this.__parseKey(end as T) === key) ||
						end === key
					) {
						first = false
						if (!only) map.set(key, value)
						else map.only(value)
					}
				}

				if (first) {
					if (!only) map.set(key, value)
					else map.only(value)
				} else break
			}
		}

		return map
	}

	/**
	 * @summary
	 * Implements Array.some functionality, returns true on the first match by
	 * the callback function supplied.
	 *
	 * @param callbackFn callback function
	 *
	 * @returns boolean
	 */
	public some(callbackFn: (value: Y, key: T, map: ExMap<T, Y>) => any): boolean {
		if (!this.__hasValue(callbackFn)) return false

		for (const [k, v] of this.entries()) {
			const key = this.__getKey(k)
			if (callbackFn(v, key, this)) return true
		}

		return false
	}

	/**
	 * @summary
	 * Implements Array.find functionality, parses the map for the first match
	 * by the callback function supplied.
	 *
	 * @param callbackFn callback function
	 *
	 * @returns [T, Y]
	 *
	 * @example
	 * ```
	 * 	const found: Y = myMap.find((item) => item.id === myId)
	 * ```
	 */
	public find(callbackFn: (value: Y, key: T, map: Map<T, Y>) => any): [T, Y] {
		if (!this.__hasValue(callbackFn)) return [null, null]

		for (const [k, v] of this.entries()) {
			const key = this.__getKey(k)
			if (callbackFn(v, key, this)) return [key, v]
		}

		return
	}

	/**
	 * @summary
	 * Implements the Array.map functionality, but converts the ExMap to an
	 * array of values based on matching callback function hits.
	 *
	 * @param callbackFn callback function
	 *
	 * @returns Array<unknown>
	 *
	 * @example
	 * ```
	 * 	const myArray = myMap.map((key, value) => value.property)
	 * ```
	 */
	public map<X>(callbackFn: (value: Y, key: T, index: number) => X): X[] {
		if (!this.__hasValue(callbackFn)) return []
		const results = []
		let index = -1

		for (const [k, v] of this.entries()) {
			index++
			const key = this.__getKey(k)
			results.push(callbackFn(v, key, index))
		}

		return results
	}

	/**
	 * @summary
	 * Implements the Array.filter functionality, returning the filtered ExMap
	 * based on matching callback function hits.
	 *
	 * @returns new ExMap<T,Y>
	 * @example
	 * ```
	 * 	const filterMap = myMap.filter((value) => value !== undefined)
	 * ```
	 */
	public filter(callbackFn: (value: Y, key: T, map: Map<T, Y>) => boolean): ExMap<T, Y> {
		const map: ExMap<T, Y> = new ExMap()
		if (!this.__hasValue(callbackFn)) return map

		for (const [k, v] of this.entries()) {
			const key = this.__getKey(k)
			if (callbackFn(v, key, this)) map.set(key, v)
		}

		return map
	}

	/**
	 * @augments super.forEach
	 * @summary
	 * Extends Map.forEach functionality, by adding the next and previous keys
	 * as well as the index to the callback function.
	 *
	 * @returns void
	 *
	 * @example
	 * ```
	 * 	myMap.forEach((value, key, map, next, previous, index) => {
	 * 		const nextItem: Y = myMap.get(next)
	 * 		const previousItem: Y = myMap.get(previous)
	 * 		const atIndex: [T, Y] = myMap.index( index + 2 )
	 * 	})
	 * ```
	 */
	public forEach(
		callbackFn: (
			value: Y,
			key: T,
			map: ExMap<T, Y>,
			next?: T,
			previous?: T,
			index?: number,
		) => void,
	): void {
		if (!this.__hasValue(callbackFn)) return

		let index = -1
		const idxMap: Map<number, T> = new Map()

		for (const [k] of this.entries()) {
			index++
			const key = this.__getKey(k)
			idxMap.set(index, key)
		}

		index = -1

		for (const [, value] of this.entries()) {
			index++

			const curKey = idxMap.get(index)
			const nextKey = idxMap.get(index + 1)
			const lastKey = idxMap.get(index - 1)

			callbackFn(value, curKey, this, nextKey, lastKey, index)
		}
	}

	/**
	 * @summary
	 * Convert the map to an unfiltered array with only the values, or the key
	 * and value as tuple.
	 *
	 * @param keyValue return as key/value tuple array
	 *
	 * @returns
	 * Array of values or key/value tuples
	 */
	public toArray(keyValue?: boolean): Y[] {
		const array = []
		for (const [key, value] of this.entries()) {
			if (keyValue) array.push([key, value])
			else array.push(value)
		}

		return array
	}

	/**
	 * @summary
	 * Check if the current Map has the stringified key inside its key mapping
	 * object [[Keys]] and return the stringified key if found, or undefined if
	 * not. If the mapping object is not set, returns the original value.
	 *
	 * @param key T
	 *
	 * @returns number | T
	 */
	private __getKeyIndex(key: T): string | T {
		if (!this.__keyAny()) return key

		const stringed = JSON.stringify(key)
		if (this['[[Keys]]'][stringed]) return stringed
		return undefined
	}

	/**
	 * @summary
	 * Match the given key to an existing value in the internal [[Keys]] mapping
	 * object. If none is found, a new entry is created and the stringified key
	 * is returned. If the mapping object is not set, returns the original
	 * value.
	 *
	 * @param key T
	 *
	 * @returns string | T
	 */
	private __toKeyIndex(key: T): string | T {
		if (!this.__keyAny()) return key

		let index = this.__getKeyIndex(key)
		if (!this.__hasValue(index)) {
			index = JSON.stringify(key)
			this['[[Keys]]'][index] = key
		}

		return index
	}

	/**
	 * @summary
	 * Simple property-in check to determine if the internal key mapping object
	 * has been defined. If so, that means we're using it by default.
	 */
	private __keyAny(): boolean {
		return '[[Keys]]' in this
	}

	/**
	 * @summary
	 * Return the given key as T or stringified
	 *
	 * @param key T
	 *
	 * @returns string | T
	 */
	private __parseKey(key: T): string | T {
		if (!this.__keyAny()) return key
		return JSON.stringify(key)
	}

	/**
	 * @summary
	 * Find and get the proper key that can be used as an index.
	 *
	 * @param key key to get
	 *
	 * @returns string | T
	 */
	private __getKey(key: T | string): T {
		return this.__keyAny() ? this['[[Keys]]'][key] : key
	}

	/**
	 * @summary
	 * Remove key at given index in Object
	 *
	 * @param key key to delete
	 */
	private __deleteKey(key: string): void {
		if (this.__keyAny()) delete this['[[Keys]]'][key]
	}

	/**
	 * @summary
	 * Create the internal [[Keys]] mapping object to assign values to
	 * stringified keys, as `[[Keys]]: { [key: string]: T }`. Adds a getter for
	 * the size of this object called `keysize`
	 */
	private __setKeyMap(): void {
		if (!this.__keyAny()) {
			const prefill = {}

			for (const [k] of this.entries()) {
				prefill[k] = k
			}

			Object.defineProperty(this, '[[Keys]]', {
				configurable: true,
				enumerable: false,
				value: prefill,
			})

			Object.defineProperty(this, 'keysize', {
				enumerable: false,
				configurable: false,
				get: () => (Object.entries(this['[[Keys]]']) || []).length,
			})
		}
	}

	/**
	 * @summary
	 * Removes the internal key mapping object in order to keep the Map as clean
	 * as possible.
	 */
	private __unsetKeyMap(): void {
		delete this['[[Keys]]']
		delete this['keysize']
	}

	/**
	 * @summary
	 * Parse any given iterable and apply its values to the super class. If the
	 * keys found are not primitives, the internal mapping object is created
	 * and/or used. If the `byKey` parameter is supplied, the function will
	 * attempt to use the property value of each item in the loop as key.
	 *
	 * If the content of the iterable is an array of arrays but not a collection
	 * of `[key, value]` items like Array.from(Map) would create, toggling
	 * `isNotMap` will use index/value as key/value, instead of array[0] and
	 * array[1].
	 *
	 * @param iterable any iterable
	 * @param byKey property to use value as key from
	 * @param isNotMap Iterable is NOT map-like
	 *
	 * @todo
	 * There's some more edge cases when `isNotMap` is set and no `byKey` is
	 * given that could be refined.
	 */
	private __parseIterable(
		iterable: Iterable<T, Y>,
		byKey?: string | number,
		isNotMap?: boolean,
	): void {
		if (!iterable) return
		if (typeof iterable === 'function') return
		let keyany = this.__keyAny()
		const size = this.size

		// Check if the key is a primitive, use the super.set instead, skipping
		// some calculations. Otherwise use the internal set.
		const checkKey = (k: string | number | T, value: Y, valueKey: any = byKey) => {
			const key = !!valueKey && this.__hasValue(value[valueKey]) ? value[valueKey] : k
			this.__isPrimitive(key)
			if (!keyany && this.__keyAny()) keyany = true

			if (!keyany) super.set(key, value)
			else this.set(key, value)
		}

		// Check if the iterable is an array, map or set
		if (iterable['forEach'] && typeof iterable['forEach'] === 'function') {
			if (Array.isArray(iterable)) {
				if (!iterable.length) return
				iterable.forEach((value, index) => {
					if (
						Array.isArray(value) &&
						this.__hasValue(value[0]) &&
						value.length === 2 &&
						!isNotMap
					)
						checkKey(value[0], value[1])
					else checkKey(size + index, value)
				})
			} else if (iterable['add'] && typeof iterable['add'] === 'function') {
				if (!iterable.size) return
				Array.from(iterable as Set<Y>).forEach((value: Y, index: any) =>
					checkKey(index, value),
				)
			} else if (iterable['set'] && typeof iterable['set'] === 'function') {
				if (!iterable.size) return
				iterable.forEach((value: Y, key: T) => {
					checkKey(key, value)
				})
			}
		} else if (typeof iterable === 'object') {
			for (const key in iterable) {
				const value: Y = iterable[key]
				checkKey(key, value)
			}
		} else if (typeof iterable === 'string' || typeof iterable === 'number') {
			super.set(size, iterable)
		}
	}

	/**
	 * @summary
	 * Implements a not-null-or-undefined check on the supplied value. Takes in
	 * to account if the value is an array and if it has length.
	 *
	 * @param val value to check
	 *
	 * @returns boolean
	 */
	private __hasValue(val: any): boolean {
		if (typeof val === 'string' || Array.isArray(val)) return val.length > 0
		return val !== undefined && val !== null && val !== ''
	}

	/**
	 * @summary
	 * Checks if the current ExMap uses dynamic keys, if not checks if the
	 * given value is a primitive. If it's not, the _keyany is set to true and
	 * the _keymap is made.
	 *
	 * @param value any value
	 */
	private __isPrimitive(key: unknown): void {
		if (this.__keyAny()) return
		if (!this.__checkPrimitive(key)) this.__setKeyMap()
	}

	/**
	 * @summary
	 * Checks the given key for primitive status.
	 *
	 * @param key any key value to check
	 *
	 * @returns boolean
	 */
	private __checkPrimitive(key: unknown): boolean {
		return (
			(typeof key === 'string' ||
				typeof key === 'number' ||
				typeof key === 'bigint' ||
				typeof key === 'boolean' ||
				typeof key === 'undefined' ||
				typeof key === 'symbol') &&
			typeof key !== 'object' &&
			typeof key !== 'function' &&
			!Array.isArray(key)
		)
	}
}
