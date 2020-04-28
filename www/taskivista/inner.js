define([
    'jquery',
    '/bower_components/chainpad-crypto/crypto.js',
    '/bower_components/chainpad-listmap/chainpad-listmap.js',
    '/common/toolbar3.js',
    '/bower_components/nthen/index.js',
    '/common/sframe-common.js',
    '/common/common-interface.js',
    '/common/common-hash.js',
    '/taskivista/taskivista.js',

    'css!/taskivista/construct-ui.css',
], function (
    $,
    Crypto,
    Listmap,
    Toolbar,
    nThen,
    SFCommon,
    UI,
    Hash,
    Taskivista,
    )
{
    var APP = window.APP = {};
    const m = window.m;

    var common;
    var sFrameChan;

    UI.removeLoadingScreen();
    m.mount(document.getElementById("app"), Taskivista);

    nThen(function (waitFor) {
        // $(waitFor(UI.addLoadingScreen));
        console.log("loading");
        SFCommon.create(waitFor(function (c) { APP.common = common = c; }));
    }).nThen(function ( /* waitFor */) {
        console.log("done loading");
        var $bar = $('.cp-toolbar-container');

        var displayed = ['useradmin', 'newpad', 'limit', 'pageTitle', 'notifications'];
        var configTb = {
            displayed: displayed,
            sfCommon: common,
            $container: $bar,
            pageTitle: Messages.todo_title,
            metadataMgr: common.getMetadataMgr(),
        };
        APP.toolbar = Toolbar.create(configTb);
        APP.toolbar.$rightside.hide();

        console.log("mounted");
    });
    //     sFrameChan = common.getSframeChannel();
    //     sFrameChan.onReady(waitFor());
    // }).nThen(function (/*waitFor*/) {

    //     UI.removeLoadingScreen();
    //     m.mount(document.getElementById("app"), Taskivista);
    //     console.log("mounted")

    //     var removeTips = function () {
    //         UI.clearTooltips();
    //     };

    //     var onReady = function () {

    //         var display = APP.display = function () {
    //             $list.empty();
    //             removeTips();
    //             APP.lm.proxy.order.forEach(function (el) {
    //                 addTaskUI(el);
    //             });
    //             //scrollTo('300px');
    //         };

    //         var addTask = function () {
    //             var $input = $('#cp-app-todo-newtodo');
    //             // if the input is empty after removing leading and trailing spaces
    //             // don't create a new entry
    //             if (!$input.val().trim()) { return; }

    //             var obj = {
    //                 "state": 0,
    //                 "task": $input.val(),
    //                 "ctime": +new Date(),
    //                 "mtime": +new Date()
    //             };

    //             var id = Hash.createChannelId();
    //             todo.add(id, obj);

    //             $input.val("");
    //             addTaskUI(id, true);
    //             //display();
    //         };

    //         var $formSubmit = $('.cp-app-todo-create-form button').on('click', addTask);
    //         $('#cp-app-todo-newtodo').on('keypress', function (e) {
    //             switch (e.which) {
    //                 case 13:
    //                     $formSubmit.click();
    //                     break;
    //                 default:
    //                     //console.log(e.which);
    //             }
    //         }).focus();

    //         var editTask = function () {

    //         };
    //         editTask = editTask;

    //         display();
    //         UI.removeLoadingScreen();
    //     };

    //     var onInit = function () {
    //         $body.on('dragover', function (e) { e.preventDefault(); });
    //         $body.on('drop', function (e) { e.preventDefault(); });

    //     };
    //     var createTodo = function() {
    //         var listmapConfig = {
    //             data: {},
    //             common: common,
    //             userName: 'todo',
    //             logLevel: 1
    //         };

    //         var lm = APP.lm = Listmap.create(listmapConfig);

    //         lm.proxy.on('create', onInit)
    //                 .on('ready', onReady);
    //     };
    //     createTodo();
    // });
});
