import subscriptions from './subscriptions';

export default id => {
  if (typeof id !== 'number') {
    id = subscriptions.find(({ cb }) => cb === id).id;
  }
  clearInterval(id);
};
