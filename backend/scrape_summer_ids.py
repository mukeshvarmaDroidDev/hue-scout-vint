import urllib.request
import re
import json
import time

def fetch_search_ids(query):
    # Format query for URL
    url = f"https://unsplash.com/s/photos/{query}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
            # Extract href="/photos/... and grab the ID part at the end
            matches = re.findall(r'href="/photos/([^"/]+)"', html)
            ids = []
            for m in matches:
                # Get the last section (ID) after the dash
                parts = m.split('-')
                if parts:
                    photo_id = parts[-1]
                    if len(photo_id) >= 8 and len(photo_id) <= 15:
                        ids.append(photo_id)
            return list(set(ids))
    except Exception as e:
        print(f"Error fetching search query '{query}': {e}")
        return []

def main():
    queries = [
        "black-man-shorts",
        "black-man-t-shirt",
        "black-man-summer-wear",
        "black-man-linen-shirt",
        "african-man-shorts",
        "african-man-t-shirt",
        "black-male-model-summer",
        "black-man-casual"
    ]
    
    all_ids = []
    for q in queries:
        print(f"Scraping query: {q}...")
        ids = fetch_search_ids(q)
        print(f"Found {len(ids)} unique IDs.")
        all_ids.extend(ids)
        time.sleep(1) # Be nice to the server
        
    unique_ids = list(set(all_ids))
    print(f"\nTotal unique IDs found: {len(unique_ids)}")
    
    # Verify IDs by checking headers via urllib
    valid_ids = []
    for i, photo_id in enumerate(unique_ids):
        # We need 60 valid ones, let's collect at least 70 to be safe
        if len(valid_ids) >= 75:
            break
            
        img_url = f"https://images.unsplash.com/photo-{photo_id}?q=80&w=800"
        req = urllib.request.Request(img_url, method="HEAD", headers={"User-Agent": "Mozilla/5.0"})
        try:
            with urllib.request.urlopen(req) as resp:
                if resp.status == 200:
                    valid_ids.append(photo_id)
                    print(f"[{len(valid_ids)}] Validated ID: {photo_id}")
        except Exception:
            # Skip invalid
            pass
            
    print(f"\nTotal validated unique IDs: {len(valid_ids)}")
    
    if len(valid_ids) >= 60:
        # Write to valid_unsplash_ids.json
        with open("backend/valid_unsplash_ids.json", "w") as f:
            json.dump(valid_ids, f, indent=4)
        print("Successfully updated valid_unsplash_ids.json with summer-fit IDs!")
    else:
        print(f"Warning: Only found {len(valid_ids)} valid IDs. Need at least 60. Not overwriting yet.")

if __name__ == "__main__":
    main()
