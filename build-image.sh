#!/bin/bash

base_image=jianshao/llm-api-base
docker pull ${base_image}:latest

tag=$(docker inspect --format='{{index .Config.Labels "version"}}' ${base_image})
echo "Using llm api base version ${tag}"

image=jianshao/code-gen-demo
version=$(date +%Y%m%d)
docker build -t ${image}:latest . --build-arg TAG=${tag} --build-arg VERSION=${version} $*

docker tag ${image}:latest ${image}:${version}
docker push ${image}:latest
docker push ${image}:${version}

echo "Done"
