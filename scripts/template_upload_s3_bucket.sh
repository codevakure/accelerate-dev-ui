
#   check and see if the input folder exists
if [ ! -d "/tmp/hhs-frontend-phase2" ]; then
    echo "Something is wrong ... directory: /tmp/hhs-frontend-phase2 does not exist??"
    exit 100
fi

cd /tmp/hhs-frontend-phase2

#   Upload to AWS bucket
aws s3 sync . s3://$AWS_BUCKET
