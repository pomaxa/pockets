#!/bin/bash

###############################################################################
# Pockets SSL Certificate Installation Script
# This script helps install Let's Encrypt SSL certificates using certbot
###############################################################################

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="pockets"
NGINX_CONFIG="/etc/nginx/sites-available/${APP_NAME}"

# Helper functions
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
check_root() {
    if [ "$EUID" -ne 0 ]; then
        print_error "Please run this script as root or with sudo"
        exit 1
    fi
}

# Check if certbot is installed
check_certbot() {
    if ! command -v certbot &> /dev/null; then
        print_warning "Certbot is not installed"
        install_certbot
    else
        print_success "Certbot is already installed"
    fi
}

# Install certbot
install_certbot() {
    print_info "Installing certbot..."

    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$ID

        case $OS in
            ubuntu|debian)
                apt-get update
                apt-get install -y certbot python3-certbot-nginx
                ;;
            centos|rhel|fedora)
                yum install -y certbot python3-certbot-nginx || dnf install -y certbot python3-certbot-nginx
                ;;
            *)
                print_error "Unsupported OS: $OS"
                print_info "Please install certbot manually:"
                echo "  Visit: https://certbot.eff.org/instructions"
                exit 1
                ;;
        esac

        print_success "Certbot installed successfully"
    else
        print_error "Cannot detect OS. Please install certbot manually."
        exit 1
    fi
}

# Get domain from nginx config
get_domain() {
    if [ -f "$NGINX_CONFIG" ]; then
        DOMAIN=$(grep -m 1 "server_name" "$NGINX_CONFIG" | awk '{print $2}' | sed 's/;//' | sed 's/{{DOMAIN}}//')

        if [ -z "$DOMAIN" ] || [ "$DOMAIN" = "{{DOMAIN}}" ]; then
            print_warning "Could not auto-detect domain from nginx config"
            read -p "Enter your domain name: " DOMAIN
        fi
    else
        print_error "Nginx config not found at $NGINX_CONFIG"
        print_info "Please run ./setup.sh first"
        exit 1
    fi

    print_info "Domain: $DOMAIN"
}

# Check DNS configuration
check_dns() {
    print_info "Checking DNS configuration..."

    if host "$DOMAIN" > /dev/null 2>&1; then
        SERVER_IP=$(host "$DOMAIN" | grep "has address" | awk '{print $4}' | head -n1)
        print_success "Domain resolves to: $SERVER_IP"

        # Get current server IP
        CURRENT_IP=$(curl -s ifconfig.me || curl -s icanhazip.com)
        print_info "Current server IP: $CURRENT_IP"

        if [ "$SERVER_IP" != "$CURRENT_IP" ]; then
            print_warning "Domain does not point to this server!"
            print_warning "DNS: $SERVER_IP | Server: $CURRENT_IP"
            echo ""
            read -p "Continue anyway? (y/n) " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                print_info "Please configure DNS first, then run this script again"
                exit 1
            fi
        fi
    else
        print_error "Domain does not resolve. Please configure DNS first."
        print_info "Add an A record pointing $DOMAIN to this server's IP"
        exit 1
    fi
}

# Create temporary nginx config for initial certificate
create_temp_nginx_config() {
    print_info "Creating temporary HTTP-only nginx config..."

    cat > "$NGINX_CONFIG" <<EOF
# Temporary configuration for SSL certificate issuance
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN;

    root /var/www/pockets;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location ~ /.well-known/acme-challenge {
        allow all;
        root /var/www/pockets;
    }
}
EOF

    nginx -t && systemctl reload nginx
    print_success "Temporary config created"
}

# Obtain SSL certificate
obtain_certificate() {
    print_info "Obtaining SSL certificate from Let's Encrypt..."

    echo ""
    read -p "Enter email for certificate notifications: " EMAIL

    if [ -z "$EMAIL" ]; then
        print_error "Email is required"
        exit 1
    fi

    # Run certbot
    certbot certonly \
        --nginx \
        --non-interactive \
        --agree-tos \
        --email "$EMAIL" \
        -d "$DOMAIN"

    if [ $? -eq 0 ]; then
        print_success "SSL certificate obtained successfully!"
    else
        print_error "Failed to obtain SSL certificate"
        exit 1
    fi
}

# Restore full nginx config with SSL
restore_nginx_config() {
    print_info "Restoring full nginx configuration with SSL..."

    # Use the template and replace domain
    if [ -f "nginx/pockets.conf" ]; then
        sed "s/{{DOMAIN}}/$DOMAIN/g" nginx/pockets.conf > "$NGINX_CONFIG"
    else
        print_error "nginx/pockets.conf template not found"
        exit 1
    fi

    # Test and reload
    if nginx -t; then
        systemctl reload nginx
        print_success "Nginx configured with SSL"
    else
        print_error "Nginx configuration test failed"
        nginx -t
        exit 1
    fi
}

# Setup auto-renewal
setup_auto_renewal() {
    print_info "Setting up automatic certificate renewal..."

    # Certbot automatically sets up a cron job or systemd timer
    # Let's verify it
    if systemctl is-enabled certbot.timer &>/dev/null; then
        print_success "Auto-renewal is configured via systemd timer"
    elif [ -f /etc/cron.d/certbot ]; then
        print_success "Auto-renewal is configured via cron"
    else
        print_warning "Auto-renewal may not be configured"
        print_info "Certbot will attempt to renew certificates twice daily"
    fi

    # Test renewal (dry run)
    print_info "Testing certificate renewal (dry run)..."
    if certbot renew --dry-run &>/dev/null; then
        print_success "Certificate renewal test passed"
    else
        print_warning "Certificate renewal test had issues (this may be normal)"
    fi
}

# Print success message
print_completion() {
    echo ""
    echo "=========================================="
    print_success "SSL Certificate Installation Complete!"
    echo "=========================================="
    echo ""
    echo "Your site is now available at:"
    echo "  https://$DOMAIN"
    echo ""
    echo "Certificate details:"
    echo "  Location: /etc/letsencrypt/live/$DOMAIN/"
    echo "  Expiry: $(openssl x509 -enddate -noout -in /etc/letsencrypt/live/$DOMAIN/fullchain.pem | cut -d= -f2)"
    echo ""
    echo "Certificate will auto-renew before expiration."
    echo ""
    echo "To manually renew certificates:"
    echo "  sudo certbot renew"
    echo ""
    echo "To check certificate status:"
    echo "  sudo certbot certificates"
    echo ""
}

# Main execution
main() {
    echo ""
    echo "=========================================="
    echo "  SSL Certificate Installation"
    echo "=========================================="
    echo ""

    check_root
    check_certbot
    get_domain
    check_dns

    echo ""
    print_info "Ready to obtain SSL certificate for: $DOMAIN"
    read -p "Continue? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Cancelled by user"
        exit 0
    fi

    create_temp_nginx_config
    obtain_certificate
    restore_nginx_config
    setup_auto_renewal
    print_completion
}

# Run main function
main
