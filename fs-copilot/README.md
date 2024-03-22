# fs-copilot

## Docker Environment

### Build
~~~ shell
export fschat_ver=0.2.35
docker build -t jianshao/fs-cp-demo:$fschat_ver .
docker push jianshao/fs-cp-demo:$fschat_ver
~~~

### Test image
~~~ shell
docker run -it --rm --gpus all \
           -v $HOME/.cache:/home/devel/.cache \
           jianshao/fs-cp-demo:$fschat_ver bash
python -m fastchat.serve.cli --model-path replit/replit-code-v1_5-3b
~~~