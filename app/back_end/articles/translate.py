import requests

# from azure_config import AZURE_TRANSLATOR_KEY, AZURE_TRANSLATOR_ENDPOINT
from environs import Env

env = Env()
env.read_env()

AZURE_TRANSLATOR_ENDPOINT = env("AZURE_TRANSLATOR_ENDPOINT")
AZURE_TRANSLATOR_KEY = env("AZURE_TRANSLATOR_KEY")


def translate_text(text, target_language):

    path = "translate"
    constructed_url = AZURE_TRANSLATOR_ENDPOINT + path

    headers = {
        "Ocp-Apim-Subscription-Key": AZURE_TRANSLATOR_KEY,
        "Ocp-Apim-Subscription-Region": "westeurope",
        "Content-type": "application/json",
    }
    body = [{"text": text}]
    params = {"api-version": "3.0", "to": target_language}

    response = requests.post(constructed_url, headers=headers, params=params, json=body)
    print("Response: ", response.json())
    response.raise_for_status()
    return response.json()[0]["translations"][0]["text"]
