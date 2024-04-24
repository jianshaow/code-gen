import os

prompt_tmpl_dir = os.environ.get("PROMPT_TMPL_DIR", "prompts")
base_url = os.environ.get("OPENAI_API_BASE")
api_key = os.environ.get("OPENAI_API_KEY")
model_name = os.environ.get("OPENAI_MODEL_NAME", "gpt-3.5-turbo")
