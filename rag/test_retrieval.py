from retriever import retrieve_cultural_snippets

snippets = retrieve_cultural_snippets("sky gods", culture="kazakh")
print("🔍 Top retrieved snippets:")
for i, s in enumerate(snippets):
    print(f"{i+1}. {s}\n")
