# 🚀 Deployment Guide - Amazon Linux EC2

## Overview

Ye guide aapko batayega ki kaise:
1. EC2 instance setup karna hai
2. GitHub Actions CI/CD pipeline configure karna hai
3. Automatic deployments enable karna hai

---

## 📋 Prerequisites

- AWS Account
- GitHub Repository
- Domain name (optional, but recommended)

---

## 🖥️ Step 1: EC2 Instance Launch

### 1.1 AWS Console se EC2 Launch karo

1. **AWS Console** → EC2 → Launch Instance
2. **Name**: `airamb-production`
3. **AMI**: Amazon Linux 2023
4. **Instance Type**: `t2.small` (production) ya `t2.micro` (testing)
5. **Key Pair**: New key pair create karo ya existing use karo
   - ⚠️ `.pem` file safe rakho - ye baad mein chahiye hogi

### 1.2 Security Group Configuration

Inbound rules add karo:

| Type  | Port | Source    | Description       |
|-------|------|-----------|-------------------|
| SSH   | 22   | My IP     | SSH access        |
| HTTP  | 80   | 0.0.0.0/0 | Web traffic       |
| HTTPS | 443  | 0.0.0.0/0 | Secure web traffic|

### 1.3 Elastic IP (Recommended)

1. EC2 → Elastic IPs → Allocate Elastic IP
2. Actions → Associate → Apna instance select karo
3. Ye IP note kar lo

---

## ⚙️ Step 2: Server Setup

### 2.1 SSH into EC2

```bash
ssh -i your-key.pem ec2-user@your-elastic-ip
```

### 2.2 Run Setup Script

```bash
# Download and run setup script
curl -O https://raw.githubusercontent.com/ShivamAwasthi1129/air-ambulance-client/main/scripts/server-setup.sh
chmod +x server-setup.sh
./server-setup.sh
```

Ya manually commands run karo:

```bash
# Update system
sudo dnf update -y

# Install Node.js 20
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs git nginx

# Install PM2
sudo npm install -g pm2

# Create directories
mkdir -p /home/ec2-user/airamb/logs
```

### 2.3 Environment Variables Setup

```bash
cd /home/ec2-user/airamb
cp .env.local.template .env.local
nano .env.local
```

Required variables:

```env
# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname

# AWS
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxx
AWS_REGION=ap-south-1

# Application
NEXT_PUBLIC_API_URL=https://your-domain.com

# JWT
JWT_SECRET=your-super-secret-key-here

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your-app-password

# Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaXXXXXXXXXX
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyXXXXXXXXXX

# Payment Gateway
CCAVENUE_MERCHANT_ID=xxxxx
CCAVENUE_ACCESS_CODE=xxxxx
CCAVENUE_WORKING_KEY=xxxxx
```

---

## 🔐 Step 3: GitHub Secrets Setup

### 3.1 GitHub Repository Settings

1. Repository → Settings → Secrets and variables → Actions
2. Ye secrets add karo:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `EC2_HOST` | `12.34.56.78` | EC2 Elastic IP |
| `EC2_USER` | `ec2-user` | SSH username |
| `EC2_SSH_KEY` | `-----BEGIN RSA...` | Full .pem file content |
| `NEXT_PUBLIC_API_URL` | `https://your-domain.com` | API URL |

### 3.2 SSH Key Secret Add karna

```bash
# Local machine par (Windows PowerShell):
Get-Content your-key.pem | Set-Clipboard

# Ya Linux/Mac:
cat your-key.pem | pbcopy  # Mac
cat your-key.pem | xclip   # Linux
```

Poora content copy karke `EC2_SSH_KEY` secret mein paste karo.

---

## 🔄 Step 4: First Deployment

### Option A: Manual First Deploy (Recommended)

```bash
# EC2 par SSH karo
ssh -i your-key.pem ec2-user@your-elastic-ip

# App directory mein jao
cd /home/ec2-user/airamb

# Git clone karo
git clone https://github.com/ShivamAwasthi1129/air-ambulance-client.git .

# Dependencies install karo
npm install

# Build karo
npm run build

# PM2 se start karo
pm2 start ecosystem.config.cjs --env production
pm2 save

# Nginx restart karo
sudo systemctl restart nginx
```

### Option B: Push to GitHub

Simply push to `main` branch:

```bash
git add .
git commit -m "Setup CI/CD pipeline"
git push origin main
```

GitHub Actions automatically deploy kar dega!

---

## 🌐 Step 5: Domain & SSL Setup (Optional)

### 5.1 Domain DNS Configuration

Apne domain registrar mein:
- **A Record**: `@` → `your-elastic-ip`
- **A Record**: `www` → `your-elastic-ip`

### 5.2 Update Nginx Config

```bash
sudo nano /etc/nginx/conf.d/airamb.conf
```

`server_name _;` ko change karo:

```nginx
server_name your-domain.com www.your-domain.com;
```

### 5.3 SSL Certificate (Let's Encrypt)

```bash
# Certbot install karo
sudo dnf install -y certbot python3-certbot-nginx

# SSL certificate generate karo
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal test karo
sudo certbot renew --dry-run
```

---

## 📊 Monitoring & Maintenance

### Useful Commands

```bash
# Application logs dekho
pm2 logs airamb

# Real-time monitoring
pm2 monit

# Application status
pm2 status

# Restart application
pm2 restart airamb

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Nginx restart
sudo systemctl restart nginx
```

### Health Check

```bash
curl -I http://localhost:3000
curl -I http://your-domain.com
```

---

## 🔧 Troubleshooting

### Build Fails

```bash
# Memory issue ho to
export NODE_OPTIONS="--max-old-space-size=1024"
npm run build
```

### PM2 Not Starting

```bash
# Logs check karo
pm2 logs airamb --lines 100

# Delete and restart
pm2 delete airamb
pm2 start ecosystem.config.cjs --env production
```

### Nginx 502 Error

```bash
# Check if app is running
pm2 status

# Check if port 3000 is listening
sudo netstat -tlnp | grep 3000

# Restart both services
pm2 restart airamb
sudo systemctl restart nginx
```

### Permission Issues

```bash
# Fix ownership
sudo chown -R ec2-user:ec2-user /home/ec2-user/airamb
```

---

## 📁 File Structure

```
airamb/
├── .github/
│   └── workflows/
│       └── deploy.yml      # CI/CD pipeline
├── scripts/
│   └── server-setup.sh     # Server initialization
├── ecosystem.config.cjs    # PM2 configuration
├── .env.local              # Environment variables (not in git)
└── DEPLOYMENT.md           # This file
```

---

## 🆘 Support

Koi issue aaye to:
1. PM2 logs check karo: `pm2 logs airamb`
2. Nginx logs check karo: `sudo tail -f /var/log/nginx/error.log`
3. GitHub Actions tab mein deployment logs dekho

---

**Happy Deploying! 🚀**

