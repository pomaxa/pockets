#!/bin/bash

###############################################################################
# Pockets Production Setup Script
# This script sets up the Pockets application on a production server
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
WEB_ROOT="/var/www/${APP_NAME}"
NGINX_AVAILABLE="/etc/nginx/sites-available"
NGINX_ENABLED="/etc/nginx/sites-enabled"
NGINX_CONFIG="${NGINX_AVAILABLE}/${APP_NAME}"

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

# Check prerequisites
check_prerequisites() {
    print_info "Checking prerequisites..."

    # Check nginx
    if ! command -v nginx &> /dev/null; then
        print_error "nginx is not installed. Please install it first:"
        echo "  Ubuntu/Debian: sudo apt-get install nginx"
        echo "  CentOS/RHEL: sudo yum install nginx"
        exit 1
    fi
    print_success "nginx is installed"

    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install it first:"
        echo "  Visit: https://nodejs.org/"
        exit 1
    fi
    print_success "Node.js $(node --version) is installed"

    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    print_success "npm $(npm --version) is installed"
}

# Get domain name from user
get_domain() {
    echo ""
    print_info "Domain Configuration"
    echo "Enter your domain name (e.g., pockets.lv or example.com)"
    echo "Or enter server IP address if you don't have a domain yet"
    read -p "Domain/IP: " DOMAIN

    if [ -z "$DOMAIN" ]; then
        print_error "Domain cannot be empty"
        exit 1
    fi

    print_success "Domain set to: $DOMAIN"
}

# Build the application
build_app() {
    print_info "Building the application..."

    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Are you in the project directory?"
        exit 1
    fi

    # Install dependencies
    print_info "Installing dependencies..."
    npm install --production=false

    # Build production version
    print_info "Building production bundle..."
    npm run build

    if [ ! -d "dist" ]; then
        print_error "Build failed - dist directory not found"
        exit 1
    fi

    print_success "Application built successfully"
}

# Create web root and copy files
setup_web_root() {
    print_info "Setting up web root at $WEB_ROOT..."

    # Create directory if it doesn't exist
    mkdir -p "$WEB_ROOT"

    # Copy built files
    print_info "Copying built files..."
    cp -r dist/* "$WEB_ROOT/"

    # Set permissions
    chown -R www-data:www-data "$WEB_ROOT"
    chmod -R 755 "$WEB_ROOT"

    print_success "Web root configured"
}

# Create nginx configuration
create_nginx_config() {
    print_info "Creating nginx configuration..."

    # Create nginx directory if it doesn't exist
    mkdir -p "$NGINX_AVAILABLE"
    mkdir -p "$NGINX_ENABLED"

    # Copy template and replace domain
    if [ -f "nginx/pockets.conf" ]; then
        sed "s/{{DOMAIN}}/$DOMAIN/g" nginx/pockets.conf > "$NGINX_CONFIG"
    else
        print_error "nginx/pockets.conf template not found"
        exit 1
    fi

    print_success "Nginx configuration created at $NGINX_CONFIG"
}

# Test nginx configuration
test_nginx() {
    print_info "Testing nginx configuration..."

    if nginx -t 2>&1 | grep -q "syntax is ok"; then
        print_success "Nginx configuration is valid"
        return 0
    else
        print_error "Nginx configuration test failed"
        nginx -t
        return 1
    fi
}

# Enable site
enable_site() {
    print_info "Enabling site..."

    # Create symlink if it doesn't exist
    if [ ! -L "${NGINX_ENABLED}/${APP_NAME}" ]; then
        ln -s "$NGINX_CONFIG" "${NGINX_ENABLED}/${APP_NAME}"
        print_success "Site enabled"
    else
        print_info "Site already enabled"
    fi
}

# Reload nginx
reload_nginx() {
    read -p "Reload nginx now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Reloading nginx..."
        systemctl reload nginx
        print_success "Nginx reloaded"
    else
        print_warning "Remember to reload nginx manually: sudo systemctl reload nginx"
    fi
}

# Print next steps
print_next_steps() {
    echo ""
    echo "=========================================="
    print_success "Setup completed successfully!"
    echo "=========================================="
    echo ""
    echo "Your application is now available at:"
    echo "  http://$DOMAIN"
    echo ""
    echo "Next steps:"
    echo ""
    echo "1. Set up SSL certificate (HTTPS):"
    echo "   sudo ./scripts/install-ssl.sh"
    echo ""
    echo "2. Configure your DNS:"
    echo "   Point $DOMAIN to this server's IP address"
    echo ""
    echo "3. Configure firewall (if needed):"
    echo "   sudo ufw allow 'Nginx Full'"
    echo "   sudo ufw enable"
    echo ""
    echo "4. To deploy updates in the future:"
    echo "   ./deploy.sh"
    echo ""
    echo "For more information, see DEPLOYMENT_SERVER.md"
    echo ""
}

# Main execution
main() {
    echo ""
    echo "=========================================="
    echo "  Pockets Production Setup"
    echo "=========================================="
    echo ""

    check_root
    check_prerequisites
    get_domain

    echo ""
    print_info "Starting setup process..."
    echo ""

    build_app
    setup_web_root
    create_nginx_config

    if test_nginx; then
        enable_site
        reload_nginx
        print_next_steps
    else
        print_error "Setup failed due to nginx configuration errors"
        print_info "Please fix the errors and run setup again"
        exit 1
    fi
}

# Run main function
main
