# Git GitHub Account Setup Guide

## Step 1: Find Your GitHub Username

1. Open your browser and go to: https://github.com
2. Click on your profile picture (top right)
3. Your username is shown in the dropdown menu
4. Or go to: https://github.com/settings/profile
5. Your username is shown at the top

## Step 2: Find Your GitHub Email

1. Go to: https://github.com/settings/emails
2. Find your primary email (the one marked as "Primary")
3. Or use the GitHub noreply email: `username@users.noreply.github.com`

## Step 3: Configure Git with Your GitHub Account

### Set Git Username and Email

Replace `YOUR_GITHUB_USERNAME` and `YOUR_EMAIL` with your actual values:

```bash
# Set your GitHub username
git config --global user.name "YOUR_GITHUB_USERNAME"

# Set your GitHub email (use the one from GitHub settings)
git config --global user.email "YOUR_EMAIL"

# Verify the configuration
git config --global user.name
git config --global user.email
```

### Example:
```bash
git config --global user.name "pykrakapykpaka-source"
git config --global user.email "your-email@example.com"
```

## Step 4: Configure Git Credentials

### Option 1: Use GitHub Credential Manager (Recommended for Windows)

```bash
# Configure Git to use Windows Credential Manager
git config --global credential.helper manager-core

# Or use the built-in credential manager
git config --global credential.helper wincred
```

### Option 2: Use Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name (e.g., "Naily Project")
4. Select scopes: `repo` (full control of private repositories)
5. Click "Generate token"
6. Copy the token (you won't see it again!)

When you push, use:
- **Username:** Your GitHub username
- **Password:** Your Personal Access Token (not your GitHub password)

### Option 3: Use SSH (Most Secure)

```bash
# Generate SSH key (if you don't have one)
ssh-keygen -t ed25519 -C "your-email@example.com"

# Start SSH agent
eval "$(ssh-agent -s)"

# Add SSH key to agent
ssh-add ~/.ssh/id_ed25519

# Copy public key to clipboard
cat ~/.ssh/id_ed25519.pub

# Add SSH key to GitHub:
# 1. Go to: https://github.com/settings/keys
# 2. Click "New SSH key"
# 3. Paste your public key
# 4. Save

# Change remote to SSH
git remote set-url origin git@github.com:pykrakapykpaka-source/naily.git
```

## Step 5: Update Remote URL (if needed)

```bash
# Check current remote
git remote -v

# Update remote URL to match your account
git remote set-url origin https://github.com/pykrakapykpaka-source/naily.git

# Or use SSH
git remote set-url origin git@github.com:pykrakapykpaka-source/naily.git
```

## Step 6: Test the Configuration

```bash
# Test authentication
git ls-remote origin

# If successful, you're all set!
```

## Quick Setup Script

Replace the values and run:

```bash
# Set your GitHub username
git config --global user.name "YOUR_GITHUB_USERNAME"

# Set your GitHub email
git config --global user.email "YOUR_EMAIL"

# Configure credential helper (Windows)
git config --global credential.helper manager-core

# Set remote URL
git remote set-url origin https://github.com/pykrakapykpaka-source/naily.git

# Verify
git config --global --list | grep user
git remote -v
```

## Troubleshooting

### Clear Cached Credentials
```bash
# Windows
git credential-manager-core erase
# Then enter: https://github.com

# Or manually delete from Windows Credential Manager
# Control Panel → Credential Manager → Windows Credentials
```

### Check Current Configuration
```bash
git config --global --list
git remote -v
```

### Reset Everything
```bash
git config --global --unset user.name
git config --global --unset user.email
git config --global --unset credential.helper
```
