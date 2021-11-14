const router = require('express').Router();
const { KinesisClient, PutRecordsCommand } = require('@aws-sdk/client-kinesis');
const REGION = 'ap-southeast-2';
router.get('/', async (req, res) => {
  res.json('OK');
});

router.post('/trigger', async (req, res) => {
  const client = new KinesisClient({
    region: REGION,
    endpoint: 'http://localhost:4566',
    credentials: {
      accessKeyId: 'fake',
      secretAccessKey: 'fake',
    },
  });
  testData = [
    { id: 'sdsdsdads', name: 'wwwww', is_alive: true, is_eaten: false },
    { id: 'sdsdsdads', name: 'wwwww', is_alive: true, is_eaten: false },
  ];

  record = [
    {
      Data: Buffer.from(JSON.stringify(testData)),
      PartitionKey: 'test',
    },
  ];

  // async/await.
  try {
    const data = await client.send(
      new PutRecordsCommand({
        Records: record,
        StreamName: 'caughtDogs',
      })
    );
  } catch (error) {
    console.log({ error });
    // const { requestId, cfId, extendedRequestId } = error.$metadata;
    // console.log({ requestId, cfId, extendedRequestId });
  } finally {
    // finally.
  }

  res.json('OK');
});

module.exports = router;
