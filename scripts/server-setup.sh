#!/bin/bash
# ==============================================
# 🚀 Amazon Linux EC2 Server Setup Script
# Run this ONCE on a fresh EC2 instance
# ==============================================

set -e  # Exit on any error

echo "=============================================="
echo "🚀 Starting Server Setup for Next.js App"
echo "=============================================="

# Update system
echo "📦 Updating system packages..."
sudo dnf update -y

# Install Node.js 20
echo "📦 Installing Node.js 20..."
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs

# Verify Node.js installation
echo "✅ Node.js version: $(node -v)"
echo "✅ NPM version: $(npm -v)"

# Install Git
echo "📦 Installing Git..."
sudo dnf install -y git

# Install PM2 globally
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Install Nginx
echo "📦 Installing Nginx..."
sudo dnf install -y nginx

# Create app directory
echo "📂 Creating application directory..."
mkdir -p /home/ec2-user/airamb/logs
cd /home/ec2-user/airamb

# Configure Nginx
echo "⚙️ Configuring Nginx..."
sudo tee /etc/nginx/conf.d/airamb.conf > /dev/null << 'NGINX'
upstream nextjs_upstream {
    server 127.0.0.1:3000;
    keepalive 64;
}

server {
    listen 80;
    server_name _;  # Replace with your domain

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml application/atom+xml image/svg+xml;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Static files caching
    location /_next/static {
        proxy_pass http://nextjs_upstream;
        proxy_cache_valid 60m;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Public files
    location /public {
        proxy_pass http://nextjs_upstream;
        proxy_cache_valid 60m;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Main proxy
    location / {
        proxy_pass http://nextjs_upstream;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
    }
}
NGINX

# Remove default nginx config if exists
sudo rm -f /etc/nginx/conf.d/default.conf

# Test Nginx config
sudo nginx -t

# Start and enable services
echo "🔄 Starting services..."
sudo systemctl start nginx
sudo systemctl enable nginx

# Setup PM2 startup script
echo "⚙️ Setting up PM2 startup..."
pm2 startup systemd -u ec2-user --hp /home/ec2-user
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ec2-user --hp /home/ec2-user

# Create .env.local template
echo "📝 Creating environment template..."
cat > /home/ec2-user/airamb/.env.local.template << 'ENV'
# Database
MONGODB_URI=your_mongodb_connection_string

# AWS Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=ap-south-1

# Application
NEXT_PUBLIC_API_URL=https://your-domain.com
JWT_SECRET=your_jwt_secret_key

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token

# CCAvenue (Payment Gateway)
CCAVENUE_MERCHANT_ID=your_merchant_id
CCAVENUE_ACCESS_CODE=your_access_code
CCAVENUE_WORKING_KEY=your_working_key
ENV

echo ""
echo "=============================================="
echo "✅ Server Setup Complete!"
echo "=============================================="
echo ""
echo "📋 Next Steps:"
echo "1. Copy .env.local.template to .env.local and fill values"
echo "   cp .env.local.template .env.local"
echo "   nano .env.local"
echo ""
echo "2. Setup GitHub Secrets (see README)"
echo ""
echo "3. Push code to trigger deployment"
echo ""
echo "4. (Optional) Setup SSL with Certbot:"
echo "   sudo dnf install -y certbot python3-certbot-nginx"
echo "   sudo certbot --nginx -d your-domain.com"
echo ""

