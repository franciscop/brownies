import subscriptions from './subscriptions';

type Id = ReturnType<typeof setInterval>;

export default (input: Id | ((...args: unknown[]) => unknown)): void => {
  if (typeof input === 'function') {
    subscriptions.filter(({ cb }) => cb === input).forEach(sub => clearInterval(sub.id));
    return;
  }
  clearInterval(input);
};
