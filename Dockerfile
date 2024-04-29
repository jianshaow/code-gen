FROM jianshao/flask-base:3

COPY requirements.txt ./
COPY backend/*.py ./backend/
COPY frontend/build ./frontend

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

ENV PYTHONPATH=${HOME}/backend
ENV FRONTEND_DIR=${HOME}/frontend

CMD [ "python", "-m", "app" ]
