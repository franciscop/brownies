import subscriptions from './subscriptions';

export default id => {
  if (typeof id !== 'number') {
    id = subscriptions.find(([i, sub]) => sub === id)[0];
  }
  clearInterval(id);
};
