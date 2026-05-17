export type Subscription = {
  id: ReturnType<typeof setInterval>;
  key: PropertyKey;
  check: () => void;
  cb: (...args: unknown[]) => unknown;
};

const subscriptions: Subscription[] = [];
export default subscriptions;
