#!/bin/bash

set -e

# --- CONFIG ---
SSO_PROFILE="profile"
AWS_ACCOUNT_ID=""
ASSUME_ROLE_ARN=""
SSO_ROLE_ARN="your sso role arn"
CLUSTER_NAME="hard code"
REGION="ap-southeast-1"
SESSION_NAME="cdktf-eks-access"
SERVICE_ACCOUNT_NAME="$CLUSTER_NAME-lb-controller"
IRSA_ROLE_ARN="arn:aws:iam::${AWS_ACCOUNT_ID}:role/$SERVICE_ACCOUNT_NAME"
NAMESPACE="kube-system"
MANIFEST_DIR="./deployment"

echo "🔐 Assuming role $ASSUME_ROLE_ARN using SSO profile $SSO_PROFILE..."

# Assume the role using your SSO session credentials
CREDS=$(aws sts assume-role \
  --profile "$SSO_PROFILE" \
  --role-arn "$ASSUME_ROLE_ARN" \
  --role-session-name "$SESSION_NAME" \
  --query 'Credentials' \
  --output json)

export AWS_ACCESS_KEY_ID=$(echo "$CREDS" | jq -r '.AccessKeyId')
export AWS_SECRET_ACCESS_KEY=$(echo "$CREDS" | jq -r '.SecretAccessKey')
export AWS_SESSION_TOKEN=$(echo "$CREDS" | jq -r '.SessionToken')

echo "✅ Temporary credentials retrieved."

# Update kubeconfig using assumed credentials
echo "⚙️ Updating kubeconfig for cluster: $CLUSTER_NAME"
aws eks update-kubeconfig \
  --region "$REGION" \
  --name "$CLUSTER_NAME"

echo "✅ Kubeconfig updated."

# Create or update the service account with IRSA annotation
kubectl create serviceaccount "$SERVICE_ACCOUNT_NAME" -n "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -

kubectl annotate serviceaccount \
  "$SERVICE_ACCOUNT_NAME" \
  -n "$NAMESPACE" \
  eks.amazonaws.com/role-arn="$IRSA_ROLE_ARN" \
  --overwrite

echo "✅ IRSA annotation applied to service account."

# Ensure Helm is installed
echo "🔍 Checking if Helm is installed..."
if ! command -v helm >/dev/null 2>&1; then
  echo "📦 Helm not found. Installing Helm..."

  curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
  chmod +x get_helm.sh
  ./get_helm.sh
  rm get_helm.sh

  echo "✅ Helm installed."
else
  echo "✅ Helm is already installed."
fi

# Check current service account used by the controller
echo "🔍 Checking service account used by AWS Load Balancer Controller..."
CURRENT_SA=$(kubectl get pods -n "$NAMESPACE" -l app.kubernetes.io/name=aws-load-balancer-controller \
  -o jsonpath='{.items[0].spec.serviceAccountName}' 2>/dev/null || echo "")

if [[ "$CURRENT_SA" != "$SERVICE_ACCOUNT_NAME" ]]; then
  echo "🔄 Service account mismatch: found '$CURRENT_SA', expected '$SERVICE_ACCOUNT_NAME'. Forcing Helm re-deploy..."
  kubectl delete deployment aws-load-balancer-controller -n "$NAMESPACE" --ignore-not-found
  FORCE_REINSTALL=true
else
  echo "✅ Service account is correctly set to '$SERVICE_ACCOUNT_NAME'."
  FORCE_REINSTALL=false
fi

# Install or upgrade the AWS Load Balancer Controller via Helm
if [[ "$FORCE_REINSTALL" = true ]] || ! kubectl get deployment -n "$NAMESPACE" aws-load-balancer-controller >/dev/null 2>&1; then
  echo "🚀 Installing or updating AWS Load Balancer Controller via Helm..."

  helm repo add eks https://aws.github.io/eks-charts || true
  helm repo update

  helm upgrade --install aws-load-balancer-controller eks/aws-load-balancer-controller \
    -n "$NAMESPACE" \
    --set clusterName="$CLUSTER_NAME" \
    --set region="$REGION" \
    --set serviceAccount.create=false \
    --set serviceAccount.name="$SERVICE_ACCOUNT_NAME" \
    --set vpcId=$(aws eks describe-cluster --name "$CLUSTER_NAME" \
        --region "$REGION" --query "cluster.resourcesVpcConfig.vpcId" --output text)

  echo "⏳ Waiting for AWS Load Balancer Controller to become ready..."
  for i in {1..120}; do
    READY_REPLICAS=$(kubectl get deployment aws-load-balancer-controller -n "$NAMESPACE" -o jsonpath='{.status.readyReplicas}' 2>/dev/null)
    if [[ "$READY_REPLICAS" -ge 1 ]]; then
      echo "✅ AWS Load Balancer Controller is running."
      break
    fi
    sleep 5
    echo "Pending controller..."
  done

  READY_REPLICAS=$(kubectl get deployment aws-load-balancer-controller -n "$NAMESPACE" -o jsonpath='{.status.readyReplicas}' 2>/dev/null)
  if [[ "$READY_REPLICAS" -lt 1 ]]; then
    echo "❌ AWS Load Balancer Controller did not become ready within timeout. Exiting."
    exit 1
  fi
else
  echo "✅ AWS Load Balancer Controller is already present and up to date."
fi

# Optional: Grant full access to dashboard
echo "🧩 Giving role full console access..."
kubectl apply -f aws-full-console-access.yaml

eksctl create iamidentitymapping \
  --cluster "$CLUSTER_NAME" \
  --region "$REGION" \
  --arn "$SSO_ROLE_ARN" \
  --group eks-console-dashboard-full-access-group \
  --no-duplicate-arns

# Apply your service's manifests
echo "📦 Applying manifests..."

# Verify dependencies
for cmd in aws kubectl sed; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "❌ $cmd is not installed or not in PATH" >&2
    exit 1
  fi
done

# Loop through each YAML manifest in the deployment directory
for filePath in "$MANIFEST_DIR"/*.yaml; do
  [ -e "$filePath" ] || continue  # skip if no .yaml files exist

  fileName=$(basename "$filePath")
  serviceName="${fileName%.yaml}"
  targetGroupName="${serviceName}-tg"

  echo "🔄 Processing manifest: $fileName"

  # Get the target group ARN from AWS
  targetGroupArn=$(aws elbv2 describe-target-groups \
    --names "$targetGroupName" \
    --query "TargetGroups[0].TargetGroupArn" \
    --region "$REGION" \
    --output text 2>/dev/null)

  if [[ -z "$targetGroupArn" || "$targetGroupArn" == "None" ]]; then
    echo "⚠️  Could not find Target Group ARN for $targetGroupName" >&2
    continue
  fi

  echo "✅ Found Target Group ARN: $targetGroupArn"

  # Replace ${TARGET_GROUP_ARN} in the manifest file and apply
  tmpFile=$(mktemp)
  sed "s|\${TARGET_GROUP_ARN}|$targetGroupArn|g" "$filePath" > "$tmpFile"

  if ! kubectl apply -f "$tmpFile"; then
    echo "❌ Failed to apply manifest for $serviceName" >&2
  fi

  rm -f "$tmpFile"
done

# Clean up sensitive variables
unset AWS_ACCESS_KEY_ID
unset AWS_SECRET_ACCESS_KEY
unset AWS_SESSION_TOKEN
