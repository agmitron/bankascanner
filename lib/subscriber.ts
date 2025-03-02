type Subscription<P> = (payload: P) => void;

export abstract class Subscriber<E extends string, P> implements Subscriber<E, P> {
    protected readonly _subscribers: Map<E, Subscription<P>[]> = new Map();

    protected _emit(event: E, payload: P): void {
        const list = this._subscribers.get(event) ?? [];
        for (const cb of list) {
            cb(payload);
        }
    }

    public subscribe(event: E, cb: Subscription<P>): void {
        const list = this._subscribers.get(event) ?? [];
        list.push(cb);
        this._subscribers.set(event, list);
    }
}