ARG BASE_IMAGE=jianshao/llm-api-base
ARG TAG=latest

FROM ${BASE_IMAGE}:${TAG}

ARG VERSION=snapshot
LABEL version=${VERSION}

RUN pip install --no-cache-dir --upgrade pip && \
pip install --no-cache-dir fastapi uvicorn

COPY --chown=devel:devel backend/*.py ./backend/
COPY --chown=devel:devel frontend/build ./frontend

ENV PYTHONPATH=${HOME}/backend
ENV FRONTEND_DIR=${HOME}/frontend

CMD [ "uvicorn", "app:app", "--host", "0.0.0.0"]
