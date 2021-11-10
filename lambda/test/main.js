module.exports.handler = async (event) => {
  console.log('----------Lambda is triggered');
  console.log('event received', JSON.stringify(event));
};
