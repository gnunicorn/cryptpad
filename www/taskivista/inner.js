
define([
    'jquery',
    '/bower_components/nthen/index.js',
    '/common/sframe-common.js',
    '/common/sframe-app-framework.js',
    '/common/common-util.js',
    '/common/common-hash.js',
    '/common/modes.js',
    '/customize/messages.js',
    'less!/taskivista/app/taskivista.less',
    '/taskivista/app/taskivista.js',
], function (
    $,
    nThen,
    SFCommon,
    Framework,
    Util,
    Hash,
    Modes,
    Messages,
    _ui,
    Taskivista,
) {

    const URL_PREFIXER = new RegExp("#\/.*?\/taskivista\/edit\/.*?\/");
    // This is the main initialization loop
    function start_framework (framework) {
        console.log("framework", framework);
        // Here you can load the objects or call the functions you have defined

        // // This is the function from which you will receive updates from CryptPad
        // // In this example we update the textarea with the data received
        framework.onContentUpdate(function (newContent) {
            console.log("Content should be updated to ", newContent);
            Taskivista.setData(newContent);
        });

        // // This is the function called to get the current state of the data in your app
        // // Here we read the data from the textarea and put it in a javascript object
        framework.setContentGetter(function () {
            var content = Taskivista.getData();
            console.log("Content current value is ", content);
            return content;
        });

        framework.setFileImporter({}, function (content /*, file */) {
            var parsed;
            try { parsed = JSON.parse(content); }
            catch (e) { return void console.error(e); }
            return parsed;
        });

        framework.setFileExporter('.json', function () {
            return new Blob([JSON.stringify(Taskivista.getData(), 0, 2)], {
                type: 'application/json',
            });
        });

        framework.onDefaultContentNeeded(function () {
            Taskivista.setDefaultData();
        });

        // This is called when the system is ready to start editing
        framework.onReady(function (newPad) {
            console.log(document.location.hash);
            let match = document.location.hash.match(URL_PREFIXER);
            if (match !== null) {
                Taskivista.setRoutePrefix(match[0]);
            }
            Taskivista.onDataUpdate(() => framework.localChange());
            Taskivista.initAt(document.getElementById("app"));
        });

        const metadataMgr = framework._.sfCommon.getMetadataMgr();
        function update_metadata() {
            Taskivista.setMetadata(
                metadataMgr.getMetadata(),
                metadataMgr.getUserData()
            )
        }
        metadataMgr.onReady(update_metadata);
        metadataMgr.onChange(update_metadata);

        // starting the CryptPad framework
        framework.start();
    };

    // This is the main starting loop
    var main = function () {
        var framework;
        var common;

        nThen(function (waitFor) {
            console.log("creating");

            // Framework initialization
            Framework.create({
                toolbarContainer: '#cme_toolbox',
                contentContainer: '#cp-app-editor'
            }, waitFor(function (fw) {
                console.log("done creating -----")
                framework = fw;
                start_framework(framework);
            }));
        });
    };
    main();
});