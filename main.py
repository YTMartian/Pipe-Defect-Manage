import subprocess
import psutil
import time
import os

'''
main()里的django运行后会打开控制台，因此使用start.vbs隐式打开django
'''


def main():
    # 运行django.
    server_process = subprocess.Popen('python ./manage.py runserver 127.0.0.1:8000')
    # 运行electron打包的react.
    browser_process = subprocess.Popen('./frontend/build/release/browser-win32-x64/browser.exe')
    # 如果关闭了browser，则关闭服务器
    while True:
        # 获取进程状态，None表示还在运行.
        poll = browser_process.poll()
        if poll is not None:
            # 关闭server_process的子进程，即manage.py runserver.
            for child in psutil.Process(server_process.pid).children():
                child.kill()
            server_process.kill()
            break
        time.sleep(3)


def main2():
    server_process = subprocess.Popen(['cscript.exe', "start.vbs"])
    browser_process = subprocess.Popen('./frontend/build/release/browser-win32-x64/browser.exe')
    while True:
        # 获取进程状态，None表示还在运行.
        poll = browser_process.poll()
        if poll is not None:
            # 杀掉所有python程序
            result = os.popen('tasklist | findstr python').read()
            pids = [int(line.split()[1]) for line in result.splitlines()]
            for pid in pids:
                try:
                    os.popen('taskkill /pid {} /f'.format(pid))
                except:
                    pass
            server_process.kill()
            break
        time.sleep(3)


# pyinstaller -F -w main.py打包
if __name__ == '__main__':
    try:
        main2()
    except Exception as e:
        print(e)
