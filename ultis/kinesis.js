const { KinesisClient, PutRecordsCommand } = require('@aws-sdk/client-kinesis');
const REGION = 'ap-northeast-1';

const client = new KinesisClient({
  region: REGION,
  //   endpoint: 'http://localhost:4566',
  //   credentials: {
  //     accessKeyId: proce,
  //     secretAccessKey: 'fake',
  //   },
});

const pushKinesis = async (data, streamName) => {
  record = [
    {
      Data: data,
      PartitionKey: 'test',
    },
  ];

  try {
    const data = await client.send(
      new PutRecordsCommand({
        Records: record,
        StreamName: streamName,
      })
    );
  } catch (error) {
    console.log({ error });
    // const { requestId, cfId, extendedRequestId } = error.$metadata;
    // console.log({ requestId, cfId, extendedRequestId });
  } finally {
    // finally.
  }
};

module.exports = {
  pushKinesis,
};
