# codegen-demo

Demo a code generator with natural language.

## build react frontend
~~~shell
# install dependencies
docker run -v $PWD/frontend:/home/node/frontend \
       --rm jianshao/node-dev:lts-slim \
       npm --prefix /home/node/frontend install
# build package
docker run -v $PWD/frontend:/home/node/frontend \
       --rm jianshao/node-dev:lts-slim \
       npm --prefix /home/node/frontend run build
~~~

## buld docker
~~~shell
./build-image.sh
~~~

### Test image
~~~ shell
docker run -v $PWD/backend/prompts:/home/devel/prompts \
       -e PROMPT_TPL_DIR=/home/devel/prompts -p 5000:5000 \
       --add-host=host.docker.internal:host-gateway \
       --rm jianshao/codegen-demo:latest
~~~