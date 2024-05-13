// Fix Map to make `has` contrain more type accurate. Unfortunately, works only for literals
declare interface Map<K, V> {
    /**
    * @returns boolean indicating whether an element with the specified key exists or not.
    */
    has<S extends K>(k: S): this is (K extends S ? this : { get(k: S): V } & this);
}
