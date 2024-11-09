var FirebasePlugin;

console.log("link");

function onDeviceReady() {
    console.log("device ready");
    checkPer();
    console.log("device ready check permission");
    FirebasePlugin = window.FirebasePlugin;
    var appRootURL = window.location.href.replace("index.html", '');
    window.onerror = function (errorMsg, url, line, col, error) {
        var logMessage = errorMsg;
        var stackTrace = null;
        var sendError = function () {
            FirebasePlugin.logError(logMessage, stackTrace, function () {
            }, function (error) {
            });
        };

        logMessage += ': url=' + url.replace(appRootURL, '') + '; line=' + line + '; col=' + col;

        if (error && typeof error === 'object') {
            StackTrace.fromError(error).then(function (trace) {
                stackTrace = trace;
                sendError()
            });
        } else {
            sendError();
        }
    };

    FirebasePlugin.onMessageReceived(function (message) {
        try {
            if (message.messageType === "notification") {
            } else {
            }
        } catch (e) {
        }

    }, function (error) {
    });

    FirebasePlugin.onTokenRefresh(function (token) {
    }, function (error) {
    });

    FirebasePlugin.registerAuthStateChangeListener(function (userSignedIn) {
    });

    cordova.plugin.customfcmreceiver.registerReceiver(function (message) {
    });
    checkNotificationPermission(false);
    checkAutoInit();
    // $('body').addClass(cordova.platformId);
    if (cordova.platformId === "android") {
        initAndroid();
    } else if (cordova.platformId === "ios") {
    }

}
$(document).on('deviceready', onDeviceReady);

var initAndroid = function () {

    var customChannel = {
        id: "my_channel_id",
        name: "My channel name",
        sound: "blackberry",
        vibration: [300, 200, 300],
        light: true,
        lightColor: "0xFF0000FF",
        importance: 4,
        badge: true,
        visibility: 1
    };

    FirebasePlugin.createChannel(customChannel,
        function () {
            FirebasePlugin.listChannels(
                function (channels) {
                    if (typeof channels == "undefined") return;
                },
                function (error) {
                }
            );
        },
        function (error) {
        }
    );
};

var checkNotificationPermission = function (requested) {
    FirebasePlugin.hasPermission(function (hasPermission) {
        if (hasPermission) {
        } else if (!requested) {
            FirebasePlugin.grantPermission(checkNotificationPermission.bind(this, true));
        } else {
        }
    });
};

var checkAutoInit = function () {
    FirebasePlugin.isAutoInitEnabled(function (enabled) {
    }, function (error) {
    });
};

var enableAutoInit = function () {
    FirebasePlugin.setAutoInitEnabled(true, function () {
        checkAutoInit();
    }, function (error) {
    });
};


async function subscribe() {
    return new Promise((resolve, reject) => {
        FirebasePlugin.subscribe("my_topic", () => {
            FirebasePlugin.getToken((token) => {
                localStorage.setItem("DeviceToken", token);
                resolve();
            }, (error) => {
                console.error("Error getting device token:", error);
                reject(error);
            });
        }, (error) => {
            console.error("Failed to subscribe to topic", error);
            reject(error);
        });
    });
}
// call `subscribe()` function by user 
// for permission 
// document.addEventListener('deviceready', onDeviceReady, false);

function checkPer() {

    var permissions = cordova.plugins.permissions;

    permissions.checkPermission(permissions.POST_NOTIFICATIONS, function (status) {
        if (status.hasPermission) {
            // alert("Yes :D ");
        }
        else {
            reqPer();
            // alert("No :( ");
        }
    });

    function reqPer() {

        permissions.requestPermission(permissions.POST_NOTIFICATIONS, success, error);

        function error() {
            // alert('POST_NOTIFICATIONS permission is not turned on');
        }

        function success(status) {
            if (!status.hasPermission) error();
        }
    }

}