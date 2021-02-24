Set WS=CreateObject("WScript.Shell")
WS.Run "python88 ./manage.py runserver 127.0.0.1:8000",0 '0表示隐藏控制台，后台运行'
