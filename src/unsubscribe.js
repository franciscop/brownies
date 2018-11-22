import subscriptions from './subscriptions';

export default id => {
  if (typeof id === 'number') {
    return clearInterval(id);
  }

  return subscriptions
    .filter(({ cb }) => cb === id)
    .map(sub => clearInterval(sub.id));
};
