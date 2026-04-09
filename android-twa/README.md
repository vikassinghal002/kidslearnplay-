# JiggyJoy Android App — Trusted Web Activity (TWA)

This folder holds everything you need to ship JiggyJoy to the Google Play
Store as a TWA, wrapping `https://jiggyjoy.com` in a native Android shell.
No Android code required — Bubblewrap generates it from the web manifest.

## Prerequisites

- Java 17+ (`java -version`)
- Android SDK (Bubblewrap will install `build-tools` and `platform-tools` on
  first run)
- Google Play Console developer account ($25 one-time, play.google.com/console)
- A production deploy of JiggyJoy with:
  - Valid HTTPS certificate (Vercel provides this)
  - A reachable manifest at `https://jiggyjoy.com/manifest.webmanifest`
  - A 512x512 PNG icon (we have this via `/icon`)
  - A privacy policy URL (we have `/privacy-policy`)

## 1. Initialize the TWA project

From the `android-twa/` directory:

```bash
npx @bubblewrap/cli init --manifest https://jiggyjoy.com/manifest.webmanifest
```

Bubblewrap prompts for:

- **Host**: `jiggyjoy.com`
- **Name**: `JiggyJoy`
- **Launcher name**: `JiggyJoy` (≤ 12 chars ideal)
- **Display mode**: `standalone`
- **Orientation**: `default` (we support both)
- **Theme color**: `#7c3aed`
- **Background color**: `#7c3aed`
- **Start URL**: `/?utm_source=pwa_twa`
- **Icon URL**: `https://jiggyjoy.com/icon`
- **Maskable icon URL**: `https://jiggyjoy.com/icon`
- **Application ID**: `com.jiggyjoy.app` (must be unique, becomes Play Store package)
- **Version**: `1` (bump on every Play release)
- **Signing key**: create a NEW one — Bubblewrap generates `android.keystore`.
  **Back this file up. Losing it means losing the ability to update the app.**
- **Key password** and **keystore password**: store in a password manager.

## 2. Build the APK / AAB

```bash
npx @bubblewrap/cli build
```

This produces:

- `app-release-signed.apk` — for local install/testing (`adb install`)
- `app-release-bundle.aab` — for Play Store upload

## 3. Verify the Digital Asset Link (CRITICAL)

Without a valid `assetlinks.json`, the TWA shows a browser URL bar and feels
like a webview, not a native app. You must host the file at:

```
https://jiggyjoy.com/.well-known/assetlinks.json
```

A template is at `public/.well-known/assetlinks.json` in this repo — it needs
one replacement:

1. Run `npx @bubblewrap/cli fingerprint` or open `assetlinks.json` that
   Bubblewrap generated inside the `android-twa/` folder after `init`.
2. Copy the SHA-256 fingerprint (64 hex chars with colons).
3. Paste it into `public/.well-known/assetlinks.json` in place of the
   `REPLACE_WITH_SHA256_FINGERPRINT` placeholder.
4. Commit and deploy. Verify with:

```bash
curl https://jiggyjoy.com/.well-known/assetlinks.json
```

Also verify from Android:

```bash
adb shell 'content query --uri content://android.app.domain_verification'
```

## 4. Test locally

```bash
adb install app-release-signed.apk
```

Launch JiggyJoy from your Android home screen. Confirm:

- No URL bar at the top (if you see one, assetlinks.json is wrong)
- Icon looks correct on home screen
- Status bar is purple (#7c3aed)
- Navigating around games works
- Offline mode: put phone in airplane mode, reopen, confirm cached games load

## 5. Play Store listing copy

### Title (max 30 chars)

`JiggyJoy: Kids Games & Coloring`

### Short description (max 80 chars)

`Free kids games, coloring pages & worksheets. No ads, works offline.`

### Full description (max 4000 chars)

```
JiggyJoy is a free learning playground for kids — hundreds of fun games,
printable coloring pages, and worksheets in one friendly app.

WHAT'S INSIDE
• Math games for ages 3–8: counting, addition, shapes, patterns
• Coloring pages: dinosaurs, unicorns, Halloween, Christmas, animals and more
• Printable worksheets for pre-K through 2nd grade
• Seasonal collections: Halloween, Christmas, Easter
• Games for ages 3, 4, 5, kindergarten and up

MADE FOR KIDS
• 100% free — no in-app purchases
• No sign-up, no account, no personal info
• Works offline once games are loaded
• Kid-friendly interface, big buttons, clear sounds

FOR PARENTS AND TEACHERS
• Print coloring pages and worksheets at home or in the classroom
• Covers core pre-K and kindergarten skills
• Light on data, works on older devices
• Privacy policy: https://jiggyjoy.com/privacy-policy

Install JiggyJoy and turn screen time into learning time.
```

### Category

`Education` (primary) — use the `Educational` sub-category targeting "Ages 5
& Under" and "Ages 6-8".

### Keywords / tags (Play doesn't use tags like iOS, but use these in the
description for Play Search)

`kids games, coloring pages, math games, preschool games, learning games,
toddler games, educational games, kids activities, free games for kids,
halloween games, christmas games, worksheets`

### Screenshots required

Play Store needs at least 2 phone screenshots (min 320 px, max 3840 px, 16:9
to 9:16 aspect). Capture with:

```bash
adb exec-out screencap -p > screen1.png
```

Shots to take:
1. Home page on phone
2. A math game in action
3. A coloring page thumbnail grid
4. A worksheet preview

### Content rating

- **Target audience**: Ages 5 & Under AND 6–8
- **Content**: no violence, no sexual content, no profanity, no drugs
- **Data collection**: the Play Data Safety form must disclose:
  - Google Analytics (anonymous app usage, device info)
  - No personal info collected
  - No data shared with third parties beyond analytics
  - Data encrypted in transit (HTTPS)
  - User can request deletion via contact form

### Privacy policy URL

`https://jiggyjoy.com/privacy-policy`

### App access

`All functionality is available without an account.`

## 6. Submission checklist

- [ ] Play Console developer account ($25 paid)
- [ ] AAB uploaded (`app-release-bundle.aab`)
- [ ] Signing key backed up in password manager AND a separate offline location
- [ ] `assetlinks.json` deployed, SHA-256 matches keystore
- [ ] Privacy policy URL live and reachable
- [ ] Title, short desc, full desc filled in (copy above)
- [ ] At least 2 phone screenshots uploaded
- [ ] Hi-res icon: 512x512 PNG (use `https://jiggyjoy.com/icon`)
- [ ] Feature graphic: 1024x500 PNG (create separately — Bubblewrap does not)
- [ ] Content rating questionnaire completed — target "Everyone"
- [ ] Target audience set: "Ages 5 & Under" and "6-8"
- [ ] Data safety form filled in
- [ ] Countries: all (or start with India, US, UK)
- [ ] Pricing: Free
- [ ] Review and rollout to production (24–72h review)

## 7. Updates

For each new release:

1. Bump `appVersion` in `twa-manifest.json` (generated by Bubblewrap).
2. `npx @bubblewrap/cli update` — syncs the TWA config with the latest web
   manifest in case shortcuts/screenshots changed.
3. `npx @bubblewrap/cli build` — rebuild signed AAB.
4. Upload the new AAB to Play Console, create a release, roll out.

Because TWA loads content from the live site, most updates ship by deploying
to Vercel — you only need a new AAB when you change manifest, icons,
application ID, or signing config.
