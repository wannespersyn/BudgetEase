#!/bin/bash

# Set your Azure Storage account name, container name, and SAS token
storage_account="$AZURE_STORAGE_ACCOUNT"
container_name="$AZURE_STORAGE_CONTAINER"
sas_token="$AZURE_STORAGE_SAS_TOKEN"

# Set the local folder path
local_folder="out"

echo "Delete files from \$web container..."
az storage blob delete-batch \
  --account-name "$AZURE_STORAGE_ACCOUNT" \
  --source '$web' \
  --sas-token "$AZURE_STORAGE_SAS_TOKEN"

echo "Uploading files to $container_name container..."
# Iterate over each file in the local folder and its subfolders
find "$local_folder" -type f | while read -r file_path; do
    if [ -f "$file_path" ]; then
        # Extract the relative path from the local folder
        relative_path=${file_path#$local_folder/}
        echo "Uploading $relative_path..."

        # Construct the Blob Storage URL for the file
        blob_url="https://$storage_account.blob.core.windows.net/$container_name/$relative_path?$sas_token"
        blob_url=$(echo "$blob_url" | tr -d ' ')

        # Set Content-Type based on file extension
        extension="${file_path##*.}"
        content_type=""
        if [ "$extension" == "css" ]; then
            content_type="text/css"
        else
            content_type=$(file --mime-type -b "$file_path")
        fi

        # Upload the file to Blob Storage using curl
        # curl -X PUT -T "$file_path" -H "x-ms-blob-type: BlockBlob" -H "Content-Type: $content_type" "$blob_url"
        
        # az storage blob upload \
        #     --account-name "$storage_account" \
        #     --container-name "$container_name" \
        #     --name "$relative_path" \
        #     --file "$file_path" \
        #     --auth-mode login
        az storage blob upload \
            --container-name "$AZURE_STORAGE_CONTAINER" \
            --name "$relative_path" \
            --file "$file" \
            --sas-token "$SAS_TOKEN" \
            --account-name "$AZURE_ACCOUNT"
        
    fi
done