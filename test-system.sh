#!/bin/bash

# ParkShare System Testing Script
# This script helps verify that both web and mobile apps are working correctly

echo "🚀 ParkShare System Testing Script"
echo "=================================="

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

# Check if Node.js is installed
check_nodejs() {
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_status "Node.js is installed: $NODE_VERSION" "success"
        return 0
    else
        print_status "Node.js is not installed. Please install Node.js 18+" "error"
        return 1
    fi
}

# Check if Flutter is installed
check_flutter() {
    if command -v flutter &> /dev/null; then
        FLUTTER_VERSION=$(flutter --version | head -n 1)
        print_status "Flutter is installed: $FLUTTER_VERSION" "success"
        return 0
    else
        print_status "Flutter is not installed. Please install Flutter SDK" "warning"
        return 1
    fi
}

# Check if dependencies are installed
check_web_dependencies() {
    if [ -f "package.json" ] && [ -d "node_modules" ]; then
        print_status "Web app dependencies are installed" "success"
        return 0
    else
        print_status "Web app dependencies missing. Run: npm install" "error"
        return 1
    fi
}

# Check Flutter dependencies
check_flutter_dependencies() {
    if [ -f "flutter_app/pubspec.yaml" ]; then
        cd flutter_app
        if [ -d ".dart_tool" ]; then
            print_status "Flutter dependencies are installed" "success"
            cd ..
            return 0
        else
            print_status "Flutter dependencies missing. Run: cd flutter_app && flutter pub get" "error"
            cd ..
            return 1
        fi
    else
        print_status "Flutter app not found" "error"
        return 1
    fi
}

# Test web app build
test_web_build() {
    print_status "Testing web app build..." "info"
    if npm run build &> /dev/null; then
        print_status "Web app builds successfully" "success"
        return 0
    else
        print_status "Web app build failed. Check for TypeScript errors" "error"
        return 1
    fi
}

# Test Flutter app analysis
test_flutter_analysis() {
    print_status "Testing Flutter app analysis..." "info"
    cd flutter_app
    if flutter analyze &> /dev/null; then
        print_status "Flutter app analysis passed" "success"
        cd ..
        return 0
    else
        print_status "Flutter app has analysis issues" "warning"
        cd ..
        return 1
    fi
}

# Check environment variables
check_env_vars() {
    if [ -f ".env.local" ]; then
        print_status "Environment file exists" "success"
        
        # Check if Firebase vars are set (even if demo)
        if grep -q "NEXT_PUBLIC_FIREBASE_API_KEY" .env.local; then
            print_status "Firebase configuration found" "success"
        else
            print_status "Firebase configuration missing" "warning"
        fi
        return 0
    else
        print_status "Environment file missing. Create .env.local" "warning"
        return 1
    fi
}

# Main testing function
run_tests() {
    echo ""
    print_status "Starting system checks..." "info"
    echo ""
    
    # Prerequisites
    echo "📋 Prerequisites:"
    check_nodejs
    check_flutter
    echo ""
    
    # Dependencies
    echo "📦 Dependencies:"
    check_web_dependencies
    check_flutter_dependencies
    echo ""
    
    # Configuration
    echo "⚙️  Configuration:"
    check_env_vars
    echo ""
    
    # Build Tests
    echo "🔨 Build Tests:"
    test_web_build
    test_flutter_analysis
    echo ""
}

# Instructions for manual testing
show_manual_tests() {
    echo "🧪 Manual Testing Instructions:"
    echo "==============================="
    echo ""
    
    echo "📱 Web App Testing:"
    echo "1. Start development server: npm run dev"
    echo "2. Open: http://localhost:8000"
    echo "3. Test login with demo accounts:"
    echo "   - admin@parkshare.com / demo123"
    echo "   - municipal@city.gov / demo123"
    echo "   - business@mall.com / demo123"
    echo "   - driver@email.com / demo123"
    echo "   - scanner@parkshare.com / demo123"
    echo "4. Verify each dashboard loads correctly"
    echo "5. Test charts and interactive elements"
    echo ""
    
    echo "📱 Mobile App Testing:"
    echo "1. Navigate to flutter_app: cd flutter_app"
    echo "2. Start emulator or connect device"
    echo "3. Run app: flutter run"
    echo "4. Test login with: driver@email.com / demo123"
    echo "5. Verify parking search and reservation features"
    echo ""
    
    echo "🔄 Cross-Platform Testing:"
    echo "1. Make changes in web admin dashboard"
    echo "2. Verify changes reflect in mobile app"
    echo "3. Test real-time updates"
    echo "4. Verify data synchronization"
    echo ""
}

# Show development workflow
show_dev_workflow() {
    echo "🔄 Development Workflow:"
    echo "========================"
    echo ""
    
    echo "Daily Development:"
    echo "1. git pull origin main"
    echo "2. npm install (if package.json changed)"
    echo "3. cd flutter_app && flutter pub get (if pubspec.yaml changed)"
    echo "4. npm run dev (Terminal 1)"
    echo "5. cd flutter_app && flutter run (Terminal 2)"
    echo "6. Start coding! 🎉"
    echo ""
    
    echo "Before Committing:"
    echo "1. npm run build (test web build)"
    echo "2. cd flutter_app && flutter analyze (test Flutter)"
    echo "3. Test both apps manually"
    echo "4. git add . && git commit -m 'feat: description'"
    echo "5. git push origin main"
    echo ""
}

# Show next steps
show_next_steps() {
    echo "🎯 Immediate Next Steps:"
    echo "========================"
    echo ""
    
    echo "🔥 High Priority:"
    echo "1. Set up real Firebase project"
    echo "2. Test mobile app on physical device"
    echo "3. Implement QR code scanning"
    echo "4. Add push notifications"
    echo "5. Set up payment gateway"
    echo ""
    
    echo "📈 Medium Priority:"
    echo "1. Add more chart types and analytics"
    echo "2. Implement real-time notifications"
    echo "3. Add geolocation features"
    echo "4. Enhance UI animations"
    echo "5. Add offline support"
    echo ""
    
    echo "🚀 Future Enhancements:"
    echo "1. AI-powered parking predictions"
    echo "2. Multi-language support"
    echo "3. Advanced admin features"
    echo "4. Third-party integrations"
    echo "5. Performance optimizations"
    echo ""
}

# Main script execution
main() {
    run_tests
    show_manual_tests
    show_dev_workflow
    show_next_steps
    
    echo "📚 For detailed instructions, see:"
    echo "   - README.md (Project overview)"
    echo "   - DEVELOPMENT_GUIDE.md (Detailed development guide)"
    echo ""
    
    print_status "Testing script completed! 🎉" "success"
    echo ""
    echo "🚀 Ready to start development!"
    echo "   Web App: npm run dev"
    echo "   Mobile App: cd flutter_app && flutter run"
}

# Run the main function
main
