import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import ecs_patterns = require('@aws-cdk/aws-ecs-patterns');
import cdk = require('@aws-cdk/core');

/**
 * The port range to open up for dynamic port mapping
 */
const EPHEMERAL_PORT_RANGE = ec2.Port.tcpRange(80, 80);

class BonjourECS extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // For better iteration speed, it might make sense to put this VPC into
    // a separate stack and import it here. We then have two stacks to
    // deploy, but VPC creation is slow so we'll only have to do that once
    // and can iterate quickly on consuming stacks. Not doing that for now.
    // const vpc = new ec2.Vpc(this, 'MyVpc', { maxAzs: 2 });
    const vpc = ec2.Vpc.fromLookup(this, 'Vpc', {
      vpcId: 'vpc-0774e3b05f2ed094e',
    });
    const cluster = new ecs.Cluster(this, 'Ec2Cluster', { vpc });

    // Instantiate ECS Service with just cluster and image
    const loadBalancedFargateService = new ecs_patterns.NetworkLoadBalancedFargateService(
      this,
      'Ec2Service',
      {
        cluster,
        memoryLimitMiB: 1024,
        cpu: 512,
        assignPublicIp: true,
        taskImageOptions: {
          image: ecs.ContainerImage.fromAsset('../'),
          logDriver: ecs.LogDrivers.awsLogs({ streamPrefix: 'Event' }),
        },
      }
    );

    // Need target security group to allow all inbound traffic for
    // ephemeral port range (when host port is 0).
    loadBalancedFargateService.service.connections.allowFromAnyIpv4(EPHEMERAL_PORT_RANGE);
  }
}

const app = new cdk.App();

new BonjourECS(app, 'Bonjour', {
  env: {
    account: '394094555638',
    region: 'ap-northeast-1',
  },
});

app.synth();
