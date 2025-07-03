import subprocess
import time
import os
import webbrowser
import sys

# Lấy đường dẫn gốc đúng dù chạy .py hay .exe
if getattr(sys, 'frozen', False):
    BASE_DIR = os.path.dirname(sys.executable)
else:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Đường dẫn tới Docker Desktop
DOCKER_DESKTOP_PATH = r"C:\Program Files\Docker\Docker\Docker Desktop.exe"

def is_docker_running():
    try:
        subprocess.check_output(["docker", "info"], stderr=subprocess.DEVNULL)
        return True
    except:
        return False

def start_docker_desktop():
    print("🔄 Đang khởi động Docker Desktop...")
    try:
        subprocess.Popen([DOCKER_DESKTOP_PATH])
    except FileNotFoundError:
        print(f"❌ Không tìm thấy Docker Desktop tại: {DOCKER_DESKTOP_PATH}")
        return False

    for i in range(30):
        if is_docker_running():
            print("✅ Docker đã sẵn sàng!")
            return True
        print(f"⏳ Đợi Docker sẵn sàng... (lần {i+1})")
        time.sleep(2)
    print("❌ Docker không sẵn sàng sau thời gian chờ.")
    return False

if not is_docker_running():
    if not start_docker_desktop():
        exit(1)

print("🚀 Đang chạy docker-compose up --build -d...")
subprocess.call(["docker-compose", "up", "--build", "-d"], cwd=BASE_DIR)

print("🌐 Đang mở trình duyệt tại http://localhost:3000")
webbrowser.open("http://localhost:3000")