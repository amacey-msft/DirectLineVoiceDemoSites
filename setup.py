#!/usr/bin/env python3
"""
Setup script for GovSite AI Chat Application
"""
import os
import subprocess
import sys

def install_requirements():
    """Install Python requirements"""
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])

def create_env_file():
    """Create .env file from template"""
    if not os.path.exists('.env'):
        if os.path.exists('.env.example'):
            with open('.env.example', 'r') as f:
                content = f.read()
            with open('.env', 'w') as f:
                f.write(content)
            print("✅ Created .env file from template")
            print("⚠️  Please edit .env with your Azure credentials")
        else:
            print("❌ .env.example not found")

def main():
    print("🚀 Setting up GovSite AI Chat Application...")
    
    # Install requirements
    print("📦 Installing Python dependencies...")
    install_requirements()
    
    # Create env file
    print("⚙️  Setting up configuration...")
    create_env_file()
    
    print("\n✅ Setup complete!")
    print("Next steps:")
    print("1. Edit .env file with your Azure credentials")
    print("2. Run: python app.py")
    print("3. Open: http://localhost:5000")

if __name__ == "__main__":
    main()