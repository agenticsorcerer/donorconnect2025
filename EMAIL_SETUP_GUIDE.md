# Email Setup Guide for Contact Form

## ✅ What Has Been Implemented

I've set up a secure email system for your contact form. Here's what was created:

1. **Backend API Endpoint**: `/api/contact/` - Handles contact form submissions
2. **Email Sending**: Automatically sends emails to you when someone submits the contact form
3. **Confirmation Emails**: Users receive a confirmation email after submitting
4. **Frontend Integration**: Contact form now sends data to the backend securely

## 🔧 How to Configure Your Email

### Step 1: Open Settings File
Edit `backend/donorconnect/settings.py` and find the email configuration section (near the end of the file).

### Step 2: Configure Email Settings

Replace the empty strings with your email credentials:

```python
EMAIL_HOST_USER = 'your-email@gmail.com'  # Your email address
EMAIL_HOST_PASSWORD = 'your-app-password'  # Your email password or app password
DEFAULT_FROM_EMAIL = 'your-email@gmail.com'  # Same as EMAIL_HOST_USER
CONTACT_EMAIL = 'your-email@gmail.com'  # Where contact form messages will be sent
```

### Step 3: For Gmail Users (Recommended)

If you're using Gmail, you need to use an **App Password** instead of your regular password:

1. Go to your Google Account: https://myaccount.google.com/
2. Click on **Security**
3. Enable **2-Step Verification** (if not already enabled)
4. Go to **App Passwords**: https://myaccount.google.com/apppasswords
5. Select "Mail" and "Other (Custom name)"
6. Enter "Django Contact Form" as the name
7. Click "Generate"
8. Copy the 16-character password (no spaces)
9. Use this password in `EMAIL_HOST_PASSWORD`

**Example:**
```python
EMAIL_HOST_USER = 'yourname@gmail.com'
EMAIL_HOST_PASSWORD = 'abcd efgh ijkl mnop'  # Use the app password here
DEFAULT_FROM_EMAIL = 'yourname@gmail.com'
CONTACT_EMAIL = 'yourname@gmail.com'
```

### Step 4: For Other Email Providers

#### Outlook/Hotmail:
```python
EMAIL_HOST = 'smtp-mail.outlook.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
```

#### Yahoo:
```python
EMAIL_HOST = 'smtp.mail.yahoo.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
```

#### Custom SMTP Server:
```python
EMAIL_HOST = 'smtp.yourdomain.com'  # Your SMTP server
EMAIL_PORT = 587  # Usually 587 for TLS, 465 for SSL
EMAIL_USE_TLS = True  # Set to False if using SSL
```

## 🧪 Testing the Setup

1. **Start your Django server:**
   ```bash
   cd backend
   python manage.py runserver
   ```

2. **Open the contact form:**
   - Navigate to `http://localhost:8000/contact.html` (or your server URL)

3. **Fill out and submit the form**

4. **Check your email:**
   - You should receive an email with the contact form submission
   - The user should receive a confirmation email

## 🔒 Security Notes

✅ **What's Secure:**
- Email credentials are stored in Django settings (server-side only)
- Passwords are never exposed to the frontend
- All email sending happens on the server

❌ **What's NOT Secure (Don't Do This):**
- Never put email/password in frontend JavaScript code
- Never commit email passwords to Git (use environment variables in production)

## 🚀 Production Deployment

For production, use environment variables instead of hardcoding credentials:

1. Install python-decouple:
   ```bash
   pip install python-decouple
   ```

2. Create a `.env` file (add to `.gitignore`):
   ```
   EMAIL_HOST_USER=your-email@gmail.com
   EMAIL_HOST_PASSWORD=your-app-password
   DEFAULT_FROM_EMAIL=your-email@gmail.com
   CONTACT_EMAIL=your-email@gmail.com
   ```

3. Update `settings.py`:
   ```python
   from decouple import config
   
   EMAIL_HOST_USER = config('EMAIL_HOST_USER')
   EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD')
   DEFAULT_FROM_EMAIL = config('DEFAULT_FROM_EMAIL')
   CONTACT_EMAIL = config('CONTACT_EMAIL')
   ```

## 📧 What Emails Are Sent?

1. **To You (Contact Email):**
   - Subject: "Contact Form: [Subject Type]"
   - Contains: User's name, email, phone, subject, and message

2. **To User (Confirmation):**
   - Subject: "Thank you for contacting Donor Connect"
   - Contains: Confirmation message and their submitted message

## ❓ Troubleshooting

### Email not sending?
- Check that `EMAIL_HOST_USER` and `EMAIL_HOST_PASSWORD` are correct
- For Gmail, make sure you're using an App Password, not your regular password
- Check Django server logs for error messages
- Verify your email provider allows SMTP access

### Getting authentication errors?
- Gmail: Make sure 2-Step Verification is enabled and you're using an App Password
- Other providers: Check if SMTP access is enabled in your email account settings

### Emails going to spam?
- This is normal for new email setups
- Check your spam/junk folder
- Consider using a professional email service (SendGrid, Mailgun, AWS SES) for production

## 📝 Summary

Your contact form is now ready! Just:
1. Add your email credentials to `backend/donorconnect/settings.py`
2. Start your Django server
3. Test the contact form

The system will automatically send emails to you when someone submits the contact form! 🎉






