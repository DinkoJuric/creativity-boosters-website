from playwright.sync_api import sync_playwright

def verify_visuals():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Load local index.html
        import os
        cwd = os.getcwd()
        page.goto(f"file://{cwd}/index.html")

        # Wait for content
        page.wait_for_selector('.orbit-item.center')

        # Take a screenshot of the desktop view (Tilt + Pulse)
        page.set_viewport_size({"width": 1280, "height": 800})
        page.screenshot(path="orbit_desktop_polished.png")
        print("Desktop screenshot saved.")

        # Take a screenshot of the mobile view (Vertical Orbit)
        page.set_viewport_size({"width": 390, "height": 844})
        # Scroll down to orbit
        orbit_el = page.locator('#orbit-container')
        orbit_el.scroll_into_view_if_needed()
        page.wait_for_timeout(1000) # Wait for any transitions
        page.screenshot(path="orbit_mobile_polished.png")
        print("Mobile screenshot saved.")

        browser.close()

if __name__ == "__main__":
    verify_visuals()
