# How to Deploy Your Website

Since this is a static website (HTML, CSS, and JS only), you have several free and easy options to publish it to the web.

## Option 1: Netlify Drop (Easiest & Fastest) 🏆
**Best for:** Getting a live link in 30 seconds without using the command line.

1.  Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2.  Open your file explorer to the folder where your website is located:
    `C:\Users\dinko\.gemini\antigravity\scratch\creativity-boosters`
3.  **Drag and drop** the entire `creativity-boosters` folder onto the Netlify page.
4.  Netlify will upload it and give you a live URL (e.g., `random-name-12345.netlify.app`) immediately.
5.  You can claim the site to change the name or add a custom domain later.

## Option 2: GitHub Pages
**Best for:** If you want to keep your code in version control.

1.  Create a new repository on [GitHub.com](https://github.com).
2.  Open a terminal in your project folder and run:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin <YOUR_GITHUB_REPO_URL>
    git push -u origin main
    ```
3.  Go to your repository **Settings** > **Pages**.
4.  Under **Source**, select `main` branch and click **Save**.
5.  Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

## Option 3: Vercel
**Best for:** High performance and easy updates.

1.  Install Vercel CLI: `npm i -g vercel`
2.  Run `vercel` in your project terminal.
3.  Follow the prompts (mostly just hitting Enter).
4.  You'll get a production URL instantly.

## Setting Up a Custom Domain (www.creativityboosters.com) 🌐

Yes! Both Netlify and GitHub Pages allow you to use your own domain.

### Prerequisites
1.  **Buy the domain**: You must purchase `creativityboosters.com` from a registrar (like Namecheap, GoDaddy, Google Domains, or Porkbun) if you haven't already.

### On Netlify (Recommended)
1.  Log in to your Netlify dashboard and select your site.
2.  Go to **Domain Settings** > **Add custom domain**.
3.  Enter `www.creativityboosters.com`.
4.  Netlify will give you DNS records (usually `CNAME` or `A` records) to add to your domain registrar's settings.
5.  Once added, Netlify automatically provisions a free SSL certificate (HTTPS) for you.

### On GitHub Pages
1.  Go to your repository **Settings** > **Pages**.
2.  Under **Custom domain**, enter `www.creativityboosters.com` and click **Save**.
3.  Go to your domain registrar and add a `CNAME` record pointing `www` to `<your-username>.github.io`.
4.  Check the "Enforce HTTPS" box in GitHub settings once the DNS propagates.
