import re


def clean_text_for_audio(text: str) -> str:
    text = re.sub(r"<think>[\s\S]*?</think>", "", text)
    text = text.strip()
    end_index = text.find("The End.")
    if end_index != -1:
        text = text[:end_index + len("The End.")]
    return text
