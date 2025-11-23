# How to Create Gmail App Password - Step by Step

## The Problem
Gmail doesn't allow regular passwords for SMTP access. You need to create an "App Password" which is a special 16-character password for applications.

## Solution: Create a Gmail App Password

### Step 1: Enable 2-Step Verification (If Not Already Enabled)

1. Go to your Google Account: https://myaccount.google.com/
2. Click on **Security** (left sidebar)
3. Under "Signing in to Google", find **2-Step Verification**
4. If it says "Off", click on it and follow the steps to enable it
   - You'll need to verify your phone number
   - This is required before you can create App Passwords

### Step 2: Create App Password

1. Go directly to App Passwords: https://myaccount.google.com/apppasswords
   - Or navigate: Google Account → Security → 2-Step Verification → App Passwords (at the bottom)

2. You may be asked to sign in again

3. Under "Select app", choose **Mail**

4. Under "Select device", choose **Other (Custom name)**

5. Type: **Django Contact Form** (or any name you like)

6. Click **Generate**

7. **IMPORTANT**: Google will show you a 16-character password like this:
   ```
   abcd efgh ijkl mnop
   ```
   **Copy this password immediately!** You won't be able to see it again.

### Step 3: Update Your Settings

1. Open `backend/donorconnect/settings.py`

2. Replace `EMAIL_HOST_PASSWORD` with your App Password:
   ```python
   EMAIL_HOST_PASSWORD = 'abcdefghijklmnop'  # Use the App Password (remove spaces)
   ```
   
   **Important**: Remove all spaces from the App Password when pasting it!

### Step 4: Test Again

1. Restart your Django server (if it's running):
   ```bash
   # Stop the server (Ctrl+C)
   # Then start again:
   python manage.py runserver
   ```

2. Try submitting the contact form again

3. Check your email inbox - you should receive the email!

## Example

If Google gives you: `abcd efgh ijkl mnop`

Use in settings.py: `EMAIL_HOST_PASSWORD = 'abcdefghijklmnop'`

## Troubleshooting

### "2-Step Verification is not enabled"
- You MUST enable 2-Step Verification first
- Go to: https://myaccount.google.com/security
- Enable 2-Step Verification
- Then create App Password

### "App Passwords" option not showing
- Make sure 2-Step Verification is enabled
- Try refreshing the page
- Make sure you're signed in to the correct Google account

### Still getting errors?
- Make sure you removed all spaces from the App Password
- Make sure you're using the App Password, not your regular password
- Restart your Django server after changing settings

## Quick Links

- **App Passwords**: https://myaccount.google.com/apppasswords
- **Security Settings**: https://myaccount.google.com/security
- **2-Step Verification**: https://myaccount.google.com/signinoptions/two-step-verification

## Security Note

✅ **App Passwords are safe**: They only work for the specific app you created them for
✅ **You can revoke them**: Delete them anytime from your Google Account
✅ **Better than regular password**: More secure for applications




