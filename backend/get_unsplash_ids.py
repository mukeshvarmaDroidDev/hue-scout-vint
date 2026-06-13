import urllib.request
import re
import json

def fetch_ids(username):
    url = f"https://unsplash.com/@{username}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
    }
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
            
            # Find photo IDs (which look like /photos/something-ID or similar, or "id":"ID")
            # Unsplash state has a JSON block with photos list. Let's look for "id" fields or photo page links.
            # Example link: /photos/woman-in-yellow-shirt-bA7_8e9
            # Let's search for patterns of photos/ followed by letters, numbers, and dashes
            matches = re.findall(r'href="/photos/([^"/]+)"', html)
            # Filter matches to only get the actual ID part (which is usually the last segment after a dash, or a clean alphanumeric ID)
            ids = []
            for match in matches:
                # If there's a dash, the ID is the last segment
                parts = match.split('-')
                if parts:
                    photo_id = parts[-1]
                    # IDs on Unsplash are typically 11 chars, alphanumeric
                    if len(photo_id) >= 8 and len(photo_id) <= 15:
                        ids.append(match) # keep the full slug or just the ID
            return list(set(matches))
    except Exception as e:
        print(f"Error fetching {username}: {e}")
        return []

if __name__ == "__main__":
    users = ["princearkman", "gift_habeshaw", "danesduet"]
    all_ids = []
    for user in users:
        print(f"Fetching from @{user}...")
        ids = fetch_ids(user)
        print(f"Found {len(ids)} unique slugs/IDs.")
        all_ids.extend(ids)
    
    unique_ids = list(set(all_ids))
    print(f"Total unique photo matches: {len(unique_ids)}")
    print(json.dumps(unique_ids[:150], indent=2))
