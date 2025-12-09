# Git Push Guide - Push to New GitHub Account

## Step-by-Step Instructions

### 1. Check Current Git Status
```bash
git status
```

### 2. Initialize Git (if not already initialized)
```bash
git init
```

### 3. Add All Files to Staging
```bash
git add .
```

### 4. Commit Changes
```bash
git commit -m "first commit"
```

### 5. Rename Branch to Main (if needed)
```bash
git branch -M main
```

### 6. Remove Old Remote (if exists)
```bash
git remote remove origin
```

### 7. Add New Remote
```bash
git remote add origin https://github.com/pykrakapykpaka-source/naily.git
```

### 8. Push to New Repository
**⚠️ FIX: You had "mai" instead of "main"**
```bash
git push -u origin main
```

---

## Complete Command Sequence

```bash
# Check status
git status

# Add all files
git add .

# Commit
git commit -m "first commit"

# Set branch to main
git branch -M main

# Remove old remote (if exists)
git remote remove origin

# Add new remote
git remote add origin https://github.com/pykrakapykpaka-source/naily.git

# Push to new repository
git push -u origin main
```

---

## If You Get Authentication Errors

### Option 1: Use Personal Access Token
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `repo` permissions
3. Use token as password when pushing:
```bash
git push -u origin main
# Username: your-github-username
# Password: your-personal-access-token
```

### Option 2: Use SSH (Recommended)
```bash
# Change remote to SSH
git remote set-url origin git@github.com:pykrakapykpaka-source/naily.git

# Push
git push -u origin main
```

---

## If Repository Already Has Content

If the GitHub repository already has files (like README), you may need to pull first:

```bash
# Pull and merge
git pull origin main --allow-unrelated-histories

# Then push
git push -u origin main
```

---

## Troubleshooting

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/pykrakapykpaka-source/naily.git
```

### Error: "failed to push some refs"
```bash
# Force push (use with caution!)
git push -u origin main --force
```

### Error: "authentication failed"
- Use Personal Access Token instead of password
- Or set up SSH keys

---

## Quick Copy-Paste Commands

```bash
git add .
git commit -m "first commit"
git branch -M main
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/pykrakapykpaka-source/naily.git
git push -u origin main
```

