#!/bin/bash
# test_api.sh - Script to test the Fairy Tale Generator API

echo "Testing Fairy Tale Generator API..."
echo

# Check if the API is running
echo "Checking if the API is running at http://localhost:8000..."
if ! curl -s "http://localhost:8000" > /dev/null; then
    echo "Error: API is not running. Please start it with 'uvicorn app:app --reload'"
    exit 1
fi

echo "API is running!"
echo

# Test the mock endpoint
echo "Testing mock endpoint..."
curl -s -X POST "http://localhost:8000/generate-tale-mock/" \
    -H "Content-Type: application/json" \
    -d '{"prompt": "a magical unicorn", "theme": "friendship"}' | python3 -m json.tool
echo

# Test the real endpoint
echo "Testing real generation endpoint..."
curl -s -X POST "http://localhost:8000/generate-tale/" \
    -H "Content-Type: application/json" \
    -d '{"prompt": "a brave little mouse", "theme": "courage", "max_length": 500, "temperature": 0.8}' | python3 -m json.tool
echo

echo "Tests completed!"