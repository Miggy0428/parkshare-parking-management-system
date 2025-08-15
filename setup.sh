#!/bin/bash

# ParkShare Quick Setup Script
# This script helps new developers get started quickly

echo "🚀 ParkShare Quick Setup"
echo "========================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    if [ "$2" = "success" ]; then
        echo -e "${GREEN}✅ $1${NC}"
    elif [ "$2" = "error" ]; then
        echo -e "${RED}❌ $1${NC}"
    elif [ "$2" = "warning" ]; then
        echo -e "${YELLOW}⚠️  $1${NC}"
    else
        echo -e "${BLUE}ℹ️  $1${NC}"
    fi
}

# Check prerequisites
check_prerequisites() {
    echo "📋 Checking Prerequisites..."
    
    # Check Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_status "Node.js: $NODE_VERSION" "success"
    else
        print_status "Node.js not found. Please install Node.js 18+" "error"
        echo "   Download from: https://nodejs.org/"
        exit 1
    fi
    
    # Check npm
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_status "npm: $NPM_VERSION" "success"
    else
        print_status "npm not found" "error"
        exit 1
    fi
    
    # Check Flutter (optional)
    if command -v flutter &> /dev/null; then
        FLUTTER_VERSION=$(flutter --version | head -n 1)
        print_status "Flutter: $FLUTTER_VERSION" "success"
    else
        print_status "Flutter not found (optional for mobile development)" "warning"
        echo "   Download from: https://flutter.dev/docs/get-started/install"
    fi
    
    echo ""
}

# Install web dependencies
setup_web_app() {
    echo "📦 Setting up Web Application..."
    
    if [ -f "package.json" ]; then
        print_status "Installing web dependencies..." "info"
        if npm install; then
            print_status "Web dependencies installed successfully" "success"
        else
            print_status "Failed to install web dependencies" "error"
            exit 1
        fi
    else
        print_status "package.json not found" "error"
        exit 1
    fi
    
    echo ""
}

# Setup Flutter app
setup_flutter_app() {
    echo "📱 Setting up Flutter Application..."
    
    if command -v flutter &> /dev/null; then
        if [ -f "flutter_app/pubspec.yaml" ]; then
            cd flutter_app
            print_status "Installing Flutter dependencies..." "info"
            if flutter pub get; then
                print_status "Flutter dependencies installed successfully" "success"
            else
                print_status "Failed to install Flutter dependencies" "error"
            fi
            cd ..
        else
            print_status "Flutter app not found" "warning"
        fi
    else
        print_status "Skipping Flutter setup (Flutter not installed)" "warning"
    fi
    
    echo ""
}

# Create environment file
setup_environment() {
    echo "⚙️  Setting up Environment..."
    
    if [ ! -f ".env.local" ]; then
        print_status "Creating .env.local file..." "info"
        cat > .env.local << EOL
# Firebase Configuration (Demo - Replace with your actual Firebase config)
NEXT_PUBLIC_FIREBASE_API_KEY=demo-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=parkshare-demo.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=parkshare-demo
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=parkshare-demo.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Note: The application currently uses mock data for development
# To use real Firebase, update the credentials above and modify the imports
# in the dashboard pages to use the real firebase-service.ts
EOL
        print_status "Environment file created" "success"
    else
        print_status "Environment file already exists" "success"
    fi
    
    echo ""
}

# Test the setup
test_setup() {
    echo "🧪 Testing Setup..."
    
    # Test web app build
    print_status "Testing web app build..." "info"
    if npm run build > /dev/null 2>&1; then
        print_status "Web app builds successfully" "success"
    else
        print_status "Web app build has issues (check with: npm run build)" "warning"
    fi
    
    # Test Flutter if available
    if command -v flutter &> /dev/null && [ -f "flutter_app/pubspec.yaml" ]; then
        print_status "Testing Flutter app..." "info"
        cd flutter_app
        if flutter analyze > /dev/null 2>&1; then
            print_status "Flutter app analysis passed" "success"
        else
            print_status "Flutter app has analysis issues" "warning"
        fi
        cd ..
    fi
    
    echo ""
}

# Show next steps
show_next_steps() {
    echo "🎉 Setup Complete!"
    echo "=================="
    echo ""
    
    echo "🚀 Quick Start:"
    echo "1. Start web development server:"
    echo "   npm run dev"
    echo "   Then open: http://localhost:8000"
    echo ""
    
    if command -v flutter &> /dev/null; then
        echo "2. Start mobile development (optional):"
        echo "   cd flutter_app"
        echo "   flutter run"
        echo ""
    fi
    
    echo "🧪 Test the system:"
    echo "   ./test-system.sh"
    echo ""
    
    echo "📚 Documentation:"
    echo "   - README.md (Project overview)"
    echo "   - DEVELOPMENT_GUIDE.md (Detailed guide)"
    echo ""
    
    echo "🔑 Demo Login Accounts:"
    echo "   - admin@parkshare.com / demo123 (Admin)"
    echo "   - municipal@city.gov / demo123 (Municipal)"
    echo "   - business@mall.com / demo123 (Establishment)"
    echo "   - driver@email.com / demo123 (Driver)"
    echo "   - scanner@parkshare.com / demo123 (Scanner)"
    echo ""
    
    print_status "Ready to start development! 🎉" "success"
}

# Main setup function
main() {
    check_prerequisites
    setup_web_app
    setup_flutter_app
    setup_environment
    test_setup
    show_next_steps
}

# Run the main function
main
