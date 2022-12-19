const fs = require('fs').promises;

const usbDetect = require('usb-detection');
const drivelist = require('drivelist');

let usbList = [];

usbDetect.startMonitoring();

// Detect insert
usbDetect.on('add', () => {
    const poll = setInterval(() => {
        drivelist.list().then((drives) => {
            drives.forEach((drive) => {
                if (drive.isUSB) {
                    const mountPath = drive.mountpoints[0].path;
                    console.log(mountPath);
                }
            })
        })
    }, 2000)
});

const main = async () =>
{
    const ls = await fs.readdir("/");
    console.log(ls);
}

main();