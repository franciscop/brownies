import subscriptions from './subscriptions';

export default id => {
  if (typeof id === 'number') {
    clearInterval(id);
  }

  subscriptions
    .filter(({ cb }) => cb === id)
    .map(sub => clearInterval(sub.id));
};
