type EventCallback<P = unknown> = (payload: P) => void;

type EventMap = Record<string, EventCallback<unknown>[]>;

export class EventManager {
    private events: EventMap = {};

    on<P>(event: string, callback: EventCallback<P>): void {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback as EventCallback<unknown>);
    }

    off<P>(event: string, callback: EventCallback<P>): void {
        const listeners = this.events[event];
        if (!listeners) {
            return;
        }

        const index = listeners.indexOf(callback as EventCallback<unknown>);
        if (index !== -1) {
            listeners.splice(index, 1);
        }
    }

    emit<P>(event: string, payload: P): void {
        const listeners = this.events[event];
        if (!listeners) {
            return;
        }

        for (const callback of listeners) {
            callback(payload as unknown);
        }
    }

    once<P>(event: string, callback: EventCallback<P>): void {
        const onceCallback: EventCallback<P> = (payload: P) => {
            this.off(event, onceCallback);
            callback(payload);
        };
        this.on(event, onceCallback);
    }
}