#!/bin/bash

# Master Node 정보
MASTER_NODE="user1@192.168.100.100"

# secondary-webserver의 현재 이미지 버전 가져오기
CURRENT_IMAGE=$(ssh $MASTER_NODE "kubectl get deployment secondary-webserver -o=jsonpath='{$.spec.template.spec.containers[:1].image}'")

# 이미지의 버전만 추출 (예: myimage:v1.2.3에서 v1.2.3만 추출)
CURRENT_IMAGE_VERSION=$(echo $CURRENT_IMAGE | cut -d ':' -f2)

LOG_ENTRY="[$(TZ=Asia/Seoul date)] [primary-webserver] [Image Version: $CURRENT_IMAGE_VERSION] [Mode: update]"
echo "$LOG_ENTRY" >> MGMT_log.txt

echo "Current image version of secondary-webserver: $CURRENT_IMAGE_VERSION"

# primary-webserver 업데이트
ssh $MASTER_NODE "kubectl set image deployment/primary-webserver webserver=$CURRENT_IMAGE"

# Round-robin 정책의 istio yaml 파일 실행
scp istio-rule-round-robin.yaml $MASTER_NODE:~/MGMT/
ssh $MASTER_NODE "kubectl apply -f ~/MGMT/istio-rule-round-robin.yaml"

echo "Primary-webserver update complete."
