#!/bin/bash

# Master Node 정보
MASTER_NODE="user1@192.168.100.100"

# primary-webserver의 현재 이미지 버전 가져오기
CURRENT_IMAGE=$(ssh $MASTER_NODE "kubectl get deployment primary-webserver -o=jsonpath='{$.spec.template.spec.containers[:1].image}'")

# 이미지의 버전만 추출 (예: myimage:v1.2.3에서 v1.2.3만 추출)
CURRENT_IMAGE_VERSION=$(echo $CURRENT_IMAGE | cut -d ':' -f2)

LOG_ENTRY="[$(TZ=Asia/Seoul date)] [secondary-webserver] [Rollback to Image Version: $CURRENT_IMAGE_VERSION] [Mode: Rollback]"
echo "$LOG_ENTRY" >> MGMT_log.txt

echo "Rolling back secondary-webserver to match the primary-webserver's image: $CURRENT_IMAGE_VERSION"

# secondary-webserver 롤백
ssh $MASTER_NODE "kubectl set image deployment/secondary-webserver webserver=$CURRENT_IMAGE"

# Round-robin 정책의 istio yaml 파일 실행 (트래픽 분배 복구)
scp istio-rule-round-robin.yaml $MASTER_NODE:~/MGMT/
ssh $MASTER_NODE "kubectl apply -f ~/MGMT/istio-rule-round-robin.yaml"

echo "Rollback of secondary-webserver complete."
