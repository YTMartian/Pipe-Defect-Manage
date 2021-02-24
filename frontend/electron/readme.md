move `main.js package.json` to build/

cd build/ and run `electron-packager . browser --win --out=release --arch=x64 --app-version=1.0.0 --electron-version=11.3.0 --overwrite --icon=./favicon.ico`