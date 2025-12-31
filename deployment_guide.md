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

## Setting Up a Custom Domain (www.thecreativityboosters.com) 🌐

Yes! Both Netlify and GitHub Pages allow you to use your own domain.

### Prerequisites
1.  **Buy the domain**: You must purchase `thecreativityboosters.com` from a registrar (like Namecheap, GoDaddy, Google Domains, or Porkbun) if you haven't already.

### On Netlify (Recommended)
1.  Log in to your Netlify dashboard and select your site.
2.  Go to **Domain Settings** > **Add custom domain**.
3.  Enter `www.thecreativityboosters.com`.
4.  Netlify will give you DNS records (usually `CNAME` or `A` records) to add to your domain registrar's settings.
5.  Once added, Netlify automatically provisions a free SSL certificate (HTTPS) for you.

### On GitHub Pages
1.  Go to your repository **Settings** > **Pages**.
2.  Under **Custom domain**, enter `www.thecreativityboosters.com` and click **Save**.
3.  Go to your domain registrar and add a `CNAME` record pointing `www` to `<your-username>.github.io`.
4.  Check the "Enforce HTTPS" box in GitHub settings once the DNS propagates.

## What to do after purchasing the domain (www.thecreativityboosters.com)
You bought the "house" (the domain), but when they asked if you wanted to pay for the "address book listing" (DNS), you said no. That was actually a smart move. Why pay Dandomain monthly for a phonebook when Netlify gives you one for free?

Here is the breakdown so you don't feel lost in the sauce:

### 1. What is DNS? (The "Address Book")
Computers don't speak English; they speak numbers (IP addresses like 192.0.0.1).

The Domain: `thecreativityboosters.com` is what humans type.
The DNS: Is the system that translates that human name into the computer number.
The Nameserver: Is the specific server that holds your specific translation list.
Right now, Dandomain holds your domain, but nobody knows "where" it lives because you haven't assigned a Nameserver.

### 2. The Game Plan (Linking them)
Since you don't have Dandomain's DNS properly set up, we are going to use Netlify's DNS. It’s cleaner and free.

#### Step 1: Get the "Coordinates" from Netlify

Log into Netlify and drag-and-drop your folder to create the site.
Click "Domain Settings" -> "Add Custom Domain".
Type thecreativityboosters.com.
Netlify will pop up a warning saying "We don't manage this domain."
Click "Set up Netlify DNS".
They will give you 4 addresses that look like this:
- dns1.p01.nsone.net
- dns2.p01.nsone.net
- dns3.p01.nsone.net
- dns4.p01.nsone.net
(Keep this tab open!)

#### Step 2: Tell Dandomain to look at Netlify Looking at your screenshot, Dandomain has hidden the goods because you didn't buy their "DNS Product." But they must let you change Nameservers (Navneservere).

In that Dandomain dashboard, click on "Tilvalg" (Add-ons) on the left.
Look for something called "DNS Service" or "Navneservere".
Note: Sometimes you have to "activate" the free DNS ability.
If you can't find it there, look for a button that says "Rediger Navneservere" (Edit Nameservers). It might be under "Oversigten" if you scroll down, or hidden under a "gear" icon.
Once you find the "Navneservere" section, select "Egne Navneservere" (Own/Custom Nameservers).
- Paste in those 4 addresses from Netlify.
- Can't find it? Dandomain can be tricky. If you don't see "Navneservere" anywhere, you might need to use their chat or "Kontakt os" (Contact us) tab and say:

"Jeg vil gerne pege mit domæne til eksterne navneservere (Netlify). Hvor ændrer jeg mine navneservere?" ("I want to point my domain to external nameservers. Where do I change my nameservers?")

Once Dandomain points to Netlify, Netlify takes over everything. You never have to log into Dandomain again except to pay the yearly renewal fee.