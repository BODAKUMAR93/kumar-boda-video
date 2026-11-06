# Kumar Boda Videos — Automatic YouTube Updates

This GitHub Pages website fetches the latest public uploads from `@KUMARBODA` using the YouTube Data API v3. It displays video thumbnails, titles, descriptions, publish dates and links. New uploads appear when visitors reload the page (YouTube API quota and caching may affect timing).

## One-time setup: create a YouTube API key
1. Open https://console.cloud.google.com/
2. Sign in with a Google account.
3. Create or select a Google Cloud project.
4. Open **APIs & Services → Library**.
5. Search for **YouTube Data API v3** and click **Enable**.
6. Open **APIs & Services → Credentials → Create credentials → API key**.
7. Copy the API key.
8. Open `script.js` in this GitHub repository and replace `PASTE_YOUTUBE_DATA_API_KEY_HERE` with your key.
9. Commit the change.

## Important: restrict your API key
The key is visible to visitors because this is a static GitHub Pages site. In Google Cloud Console → Credentials → select the key:
- Under **API restrictions**, choose **Restrict key** and select **YouTube Data API v3**.
- Under **Website restrictions / HTTP referrers**, add your GitHub Pages domain, for example `https://bodakumar93.github.io/*`.
- Save the restrictions.

Never share an unrestricted API key publicly.

## Shorts and long videos
The site automatically separates videos by duration: 180 seconds or less are placed in Shorts; longer videos go under Long Videos. This is an approximate rule because YouTube's API does not provide a definitive Shorts flag for every upload. You can adjust the threshold in `script.js` if desired.

## Publish
After committing all files, GitHub Pages serves the site at:
https://bodakumar93.github.io/kumar-boda-video/

## Notes
- Only public uploads are returned.
- The page loads the latest 50 uploads.
- Descriptions are displayed with a short preview; visitors can open the video on YouTube for the full details.
- YouTube Data API quota and Google API key restrictions apply.
