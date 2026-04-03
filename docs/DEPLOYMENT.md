# AWS Deployment Guide

This document outlines how to deploy the Health Project to AWS using GitHub Actions and Terraform.

## Prerequisites

1. **AWS Account**: You need an active AWS account with appropriate permissions
2. **GitHub Secrets**: Configure the following secrets in your GitHub repository:
   - `AWS_ACCESS_KEY_ID`: Your AWS access key
   - `AWS_SECRET_ACCESS_KEY`: Your AWS secret access key
   - `SLACK_WEBHOOK_URL` (optional): Slack webhook for notifications
   - `EMAIL_SERVER` (optional): SMTP server for email notifications
   - `EMAIL_PORT` (optional): SMTP port
   - `EMAIL_USERNAME` (optional): SMTP username
   - `EMAIL_PASSWORD` (optional): SMTP password
   - `EMAIL_TO` (optional): Recipient email address
   - `EMAIL_FROM` (optional): Sender email address

## Setting Up Secrets

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add each required secret

## Terraform Configuration

### S3 Remote State (Recommended)

For production deployments, configure remote state:

1. Create an S3 bucket for Terraform state:
```bash
aws s3 mb s3://your-terraform-state-bucket
aws s3api put-bucket-versioning --bucket your-terraform-state-bucket --versioning-configuration Status=Enabled
```

2. Create a DynamoDB table for state locking:
```bash
aws dynamodb create-table \
  --table-name terraform-locks \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST
```

3. Uncomment the backend configuration in `terraform/main.tf`

### Local Development

For local testing:

1. Install Terraform: https://www.terraform.io/downloads.html
2. Configure AWS credentials:
```bash
aws configure
```

3. Initialize Terraform:
```bash
cd terraform
tf init
```

4. Plan deployment:
```bash
tf plan -var-file=terraform.tfvars
```

5. Apply configuration:
```bash
tf apply -var-file=terraform.tfvars
```

## Workflow Triggers

The deployment workflow is triggered:

- **On Push to Main**: If `terraform/` or workflow file changes
- **On Pull Request**: Creates a plan comment on the PR

## Monitoring Deployments

1. Go to **Actions** tab in your GitHub repository
2. View workflow execution logs
3. Check CloudFormation stack in AWS Console for resource details

## Rollback

To rollback infrastructure:

1. Revert the commit that caused issues
2. Merge to main - the workflow will automatically apply the previous configuration

## Costs

Monitor AWS costs as resources are created:
- S3 Bucket
- CloudFront Distribution (free tier may apply)
- CloudWatch Logs

## Troubleshooting

### Terraform State Lock
If stuck in a locked state:
```bash
tf force-unlock <LOCK_ID>
```

### AWS Credentials Issues
Ensure `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are correctly set in GitHub Secrets.

### Terraform Plan Failures
Check the workflow logs in the Actions tab for detailed error messages.

## Support

For issues or questions, open an issue in the repository.
