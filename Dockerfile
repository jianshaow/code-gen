ARG BASE_IMAGE=jianshao/llm-api-base
ARG TAG=latest

FROM ${BASE_IMAGE}:${TAG}

ARG VERSION=snapshot
LABEL version=${VERSION}

COPY --chown=devel:devel requirements.txt ./
COPY --chown=devel:devel backend/*.py ./backend/
COPY --chown=devel:devel frontend/build ./frontend

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

ENV PYTHONPATH=${HOME}/backend
ENV FRONTEND_DIR=${HOME}/frontend

CMD [ "python", "-m", "app" ]
