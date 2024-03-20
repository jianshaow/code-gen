import torch
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig,
    GenerationConfig,
)

bnb_config = BitsAndBytesConfig(load_in_4bit=True, bnb_4bit_compute_dtype=torch.float16)


def generate(model_name="replit/replit-code-v1_5-3b", hint="def fibonacci(n):"):
    tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
    generation_config = GenerationConfig.from_pretrained(model_name, max_length=1024)
    generation_config.pad_token_id = generation_config.eos_token_id
    model = AutoModelForCausalLM.from_pretrained(
        model_name,
        trust_remote_code=True,
        quantization_config=bnb_config,
        device_map="auto",
    )
    inputs = tokenizer.encode(hint, return_tensors="pt").to("cuda:0")
    sample = model.generate(inputs, generation_config=generation_config)
    return tokenizer.decode(sample[0])


if __name__ == "__main__":
    code = generate(
        # "Salesforce/codegen25-7b-multi",
    )
    print("======================================================")
    print(code)
    print("======================================================")
