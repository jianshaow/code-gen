# backend

## Local Environment

### Prepare
~~~ shell
python -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
~~~

## Docker Environment

### Build
~~~ shell
export image_tag=0.0.4
docker build -t jianshao/codegen-dev:$image_tag .
docker push jianshao/codegen-dev:$image_tag
~~~
### Test image
~~~ shell
docker run -it --rm jianshao/codegen-dev:$image_tag bash
~~~
