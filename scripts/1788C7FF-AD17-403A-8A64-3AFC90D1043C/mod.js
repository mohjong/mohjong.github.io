// ==UserScript==
// @uuid        1788C7FF-AD17-403A-8A64-3AFC90D1043C
// @name        去签名认证
// @version     0.0.1
// @description 防止软件因签名导致不能正常使用
// @author      sollyu
// @copyright   2020, sollyu
// @license     Apache-2.0 License
// @package     *
// @icon        https://mohjong.github.io/scripts/1788C7FF-AD17-403A-8A64-3AFC90D1043C/icon.png
// ==/UserScript==
const LogCat         = Java.use("android.util.Log");
const PackageManager = Java.use("android.content.pm.PackageManager")

// 获取全局的ActivityThread对象的实现
// 获取ActivityThread里的getPackageManager方法获取原始的sPackageManager对象
const activityThreadObj  = Java.use("android.app.ActivityThread").currentActivityThread()
const applicationContext = Java.use('android.app.ActivityThread').currentApplication().getApplicationContext()
const packageManagerObj  = activityThreadObj.getPackageManager()

// 先定义回调
const MyInvocationHandler = Java.registerClass({
    name: 'cn.mohjong.android.proxy.MyInvocationHandler',
    implements: [Java.use('java.lang.reflect.InvocationHandler')],
    methods: {
        'invoke': function(proxy, method, args) {
            if (method.getName() == 'toString')
                return packageManagerObj.toString()

            try{
                // 1. 判断当前为获取包信息
                // 2. 判断当前为获取自己的包名
                // 3. PackageManager.GET_SIGNATURES = 0x40 = 64
                const currentPackageName = applicationContext.getPackageName()
                if (method.getName() == "getPackageInfo" && currentPackageName == args[0] && args[1] == 64) {
                    // 请求[麻将]母体，签名信息存放在母体中
                    const uri       = Java.use('android.net.Uri').parse('content://cn.mohjong.android.provider.app')
                    const bundle    = applicationContext.getContentResolver().call(uri, 'signature', null, null);
                    const signature = bundle.getString('signature')

                    // 调用原系统函数，生成PackageInfo对象
                    // 根据返回的签名信息，创建新的签名对象
                    // 修改PackageInfo中错误的签名对象
                    const packageInfo  = Java.cast(method.invoke(packageManagerObj, args), Java.use("android.content.pm.PackageInfo"))
                    const newSignature = Java.use('android.content.pm.Signature').$new(signature)
                    packageInfo.signatures.value = [newSignature]
                    return packageInfo;
                }
            }
            catch(e){
                LogCat.e("MohjongScriptSignatureHacker", "LOG:Error " + e)
            }

            // 其他情况返回系统默认执行内容
            return method.invoke(packageManagerObj, args)
        }
    }
});

// 0. 使用代理类替换默认获取签名的方法
const iPackageManagerInterface = Java.use("java.lang.Class").forName("android.content.pm.IPackageManager")
const proxy = Java.use("java.lang.reflect.Proxy").newProxyInstance(iPackageManagerInterface.getClassLoader(), [iPackageManagerInterface], MyInvocationHandler.$new())

// 1. 替换掉ActivityThread里面的 sPackageManager 字段
const activityPackageManagerField = Java.use("java.lang.Class").forName("android.app.ActivityThread").getDeclaredField("sPackageManager")
activityPackageManagerField.setAccessible(true)
activityPackageManagerField.set(activityThreadObj, proxy)

// 2. 替换 ApplicationPackageManager里面的 mPM对象
const appPackageManager = applicationContext.getPackageManager()
const appPmField = appPackageManager.getClass().getDeclaredField("mPM")
appPmField.setAccessible(true);
appPmField.set(appPackageManager, proxy);
