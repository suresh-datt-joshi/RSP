#!/usr/bin/env python3
import subprocess
import time
import os

# List of pages to screenshot
pages = [
    ("http://0.0.0.0:5000/", "homepage-hero.png"),
    ("http://0.0.0.0:5000/login", "login-page.png"),
    ("http://0.0.0.0:5000/register", "register-page.png"),
    ("http://0.0.0.0:5000/about", "about-page.png"),
    ("http://0.0.0.0:5000/our-story", "our-story.png"),
    ("http://0.0.0.0:5000/contact", "contact-page.png"),
    ("http://0.0.0.0:5000/forgot-password", "forgot-password.png"),
    ("http://0.0.0.0:5000/predict-yield", "predict-yield.png"),
    ("http://0.0.0.0:5000/caldyn", "caldyn.png"),
]

os.makedirs("screenshots", exist_ok=True)

for url, filename in pages:
    output_path = f"screenshots/{filename}"
    print(f"Capturing {filename}...")
    
    try:
        # Use chromium headless to capture screenshot
        cmd = [
            "chromium",
            "--headless",
            "--disable-gpu",
            "--screenshot=" + output_path,
            "--window-size=1280,720",
            "--virtual-time-budget=5000",
            url
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=15)
        
        if os.path.exists(output_path):
            print(f"✓ Saved: {output_path}")
        else:
            print(f"✗ Failed to save: {filename}")
            if result.stderr:
                print(f"  Error: {result.stderr[:200]}")
                
    except Exception as e:
        print(f"✗ Error capturing {filename}: {str(e)}")
    
    time.sleep(1)

print("\nScreenshot capture complete!")
print(f"Saved screenshots to: screenshots/")
