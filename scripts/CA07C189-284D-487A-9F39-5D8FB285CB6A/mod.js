// ==UserScript==
// @uuid        CA07C189-284D-487A-9F39-5D8FB285CB6A
// @name        屏蔽ROOT文件检查
// @version     0.0.1
// @description 屏蔽使用JavaFile方式查找su文件是否存在
// @author      sollyu
// @copyright   2020, sollyu
// @license     Apache-2.0 License
// @package     *
// @icon        https://mohjong.github.io/scripts/CA07C189-284D-487A-9F39-5D8FB285CB6A/icon.png
// ==/UserScript==
const BlockFilePath = ["/system/app/Superuser.apk", "/sbin/su", "/system/bin/su", "/system/xbin/su", "/data/local/xbin/su", "/data/local/bin/su", "/system/sd/xbin/su", "/system/bin/failsafe/su", "/data/local/su", "/su/bin/su"];
Java.use("java.io.File").exists.implementation = function() {
    if (BlockFilePath.indexOf(this.getAbsolutePath()) != -1)
        return false;
    return this.exists()
}
