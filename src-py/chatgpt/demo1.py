import os
import openai

# openai.organization = "org-dthπmzrY9zKKEzGjdslXYhpIb"
openai.api_key  = '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' #更换成你自己的key

def get_completion(prompt, model="gpt-3.5-turbo"):
    messages = [{"role": "user", "content": prompt}]
    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        temperature=0,
    )
    return response.choices[0].message["content"]

response = get_completion("Hello")
print(response)