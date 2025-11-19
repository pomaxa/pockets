#!/bin/bash

###############################################################################
# Pockets Deployment Script
# Use this script to deploy updates to production
#
# Usage:
#   sudo ./deploy.sh              # Full deployment with git pull
#   sudo ./deploy.sh --no-pull    # Skip git pull (useful if you already pulled)
#   sudo ./deploy.sh --help       # Show help
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
BACKUP_DIR="/var/backups/${APP_NAME}"

# Parse command line arguments
SKIP_PULL=false
while [[ $# -gt 0 ]]; do
    case $1 in
        --no-pull)
            SKIP_PULL=true
            shift
            ;;
        --help|-h)
            echo "Pockets Deployment Script"
            echo ""
            echo "Usage:"
            echo "  sudo ./deploy.sh              # Full deployment with git pull"
            echo "  sudo ./deploy.sh --no-pull    # Skip git pull step"
            echo "  sudo ./deploy.sh --help       # Show this help"
            echo ""
            echo "Typical workflow:"
            echo "  ssh user@server"
            echo "  cd /path/to/pockets"
            echo "  git pull                       # Pull latest code"
            echo "  sudo ./deploy.sh --no-pull     # Build and deploy"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

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

# Create backup
create_backup() {
    print_info "Creating backup..."

    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_PATH="${BACKUP_DIR}/backup_${TIMESTAMP}"

    mkdir -p "$BACKUP_DIR"

    if [ -d "$WEB_ROOT" ]; then
        cp -r "$WEB_ROOT" "$BACKUP_PATH"
        print_success "Backup created at $BACKUP_PATH"
    else
        print_warning "No existing deployment found, skipping backup"
    fi
}

# Pull latest code (if using git)
pull_code() {
    if [ "$SKIP_PULL" = true ]; then
        print_info "Skipping git pull (--no-pull flag set)"
        return 0
    fi

    if [ -d ".git" ]; then
        print_info "Pulling latest code from git..."
        git pull origin main || git pull origin master
        print_success "Code updated"
    else
        print_info "Not a git repository, skipping pull"
    fi
}

# Install dependencies
install_dependencies() {
    print_info "Installing/updating dependencies..."
    npm install --production=false
    print_success "Dependencies installed"
}

# Build application
build_app() {
    print_info "Building application..."

    npm run build

    if [ ! -d "dist" ]; then
        print_error "Build failed - dist directory not found"
        exit 1
    fi

    print_success "Application built successfully"
}

# Deploy to web root
deploy_files() {
    print_info "Deploying files to $WEB_ROOT..."

    # Ensure web root exists
    mkdir -p "$WEB_ROOT"

    # Remove old files (except logs and user data if any)
    rm -rf "${WEB_ROOT:?}"/*

    # Copy new files
    cp -r dist/* "$WEB_ROOT/"

    # Set permissions
    chown -R www-data:www-data "$WEB_ROOT"
    chmod -R 755 "$WEB_ROOT"

    print_success "Files deployed"
}

# Test nginx configuration
test_nginx() {
    print_info "Testing nginx configuration..."

    if nginx -t 2>&1 | grep -q "syntax is ok"; then
        print_success "Nginx configuration is valid"
        return 0
    else
        print_error "Nginx configuration test failed"
        return 1
    fi
}

# Reload nginx
reload_nginx() {
    print_info "Reloading nginx..."
    systemctl reload nginx
    print_success "Nginx reloaded"
}

# Clean up old backups (keep last 5)
cleanup_backups() {
    print_info "Cleaning up old backups..."

    if [ -d "$BACKUP_DIR" ]; then
        cd "$BACKUP_DIR"
        ls -t | tail -n +6 | xargs -r rm -rf
        print_success "Old backups cleaned up (kept last 5)"
    fi
}

# Print deployment summary
print_summary() {
    echo ""
    echo "=========================================="
    print_success "Deployment completed successfully!"
    echo "=========================================="
    echo ""
    echo "Deployment details:"
    echo "  Web root: $WEB_ROOT"
    echo "  Timestamp: $(date)"
    echo ""
    echo "Your site should now be updated."
    echo "Check it at: https://$(grep server_name /etc/nginx/sites-available/pockets | grep -v '#' | awk '{print $2}' | sed 's/;//')"
    echo ""
}

# Rollback function (in case of errors)
rollback() {
    print_error "Deployment failed! Rolling back..."

    LATEST_BACKUP=$(ls -t "$BACKUP_DIR" 2>/dev/null | head -n1)

    if [ -n "$LATEST_BACKUP" ]; then
        rm -rf "${WEB_ROOT:?}"/*
        cp -r "${BACKUP_DIR}/${LATEST_BACKUP}"/* "$WEB_ROOT/"
        chown -R www-data:www-data "$WEB_ROOT"
        systemctl reload nginx
        print_success "Rolled back to previous version"
    else
        print_error "No backup found for rollback"
    fi

    exit 1
}

# Main execution
main() {
    echo ""
    echo "=========================================="
    echo "  Pockets Deployment"
    echo "=========================================="
    echo ""

    check_root

    # Set trap to rollback on error
    trap rollback ERR

    create_backup
    pull_code
    install_dependencies
    build_app
    deploy_files

    if test_nginx; then
        reload_nginx
        cleanup_backups
        print_summary
    else
        print_error "Nginx configuration test failed"
        rollback
    fi
}

# Run main function
main
