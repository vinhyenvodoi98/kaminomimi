#!/bin/bash
export AWS_REGION="ap-northeast-1"

chmod -R 777 ./decrypter-v1.0.0-linux-amd64

./decrypter-v1.0.0-linux-amd64 -f .encrypted -t .

exec "$@"
