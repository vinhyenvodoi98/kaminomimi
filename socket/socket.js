const { getRules, setRules, deleteRules, streamTweets } = require('../needle/custom');

class WebSockets {
  connection(client) {
    const connect = async () => {
      console.log('Client connected...');

      let currentRules;

      try {
        //   Get all stream rules
        currentRules = await getRules();

        // Delete all stream rules
        await deleteRules(currentRules);

        // Set rules based on array above
        await setRules();
      } catch (error) {
        console.error(error);
        process.exit(1);
      }

      const filteredStream = streamTweets(io);

      let timeout = 0;
      filteredStream.on('timeout', () => {
        // Reconnect on error
        console.warn('A connection error occurred. Reconnecting…');
        setTimeout(() => {
          timeout++;
          streamTweets(io);
        }, 2 ** timeout);
        streamTweets(io);
      });
    };

    connect();

    client.on('disconnect', () => {
      console.log(client.id);
      console.log('disconnect');
      // this.users = this.users.filter((user) => user.socketId !== client.id);
    });
  }
}

module.exports = new WebSockets();
