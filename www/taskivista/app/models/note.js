define([
    '/taskivista/app/models/global.js',
    '/taskivista/app/utils.js',
], function(
    globals,
    utils,
) {
    'use strict';
    const {
        getState,
        add_to_latest,
    } = globals
    const {
        Icons
    } = window.CUI;
    const m = window.m;

    function create(item) {
        const { DATA, ME, DATA_UPDATE_CB } = getState();
        let id = utils.generate_next_id(DATA.notes);
        item.id = id;
        item.actor = {id: ME.uid, name: ME.name };
        DATA.notes[item.id] = item;

        add_to_latest("notes", item.id);
        
        DATA_UPDATE_CB ? DATA_UPDATE_CB() : "";

        utils.Toaster.show({
            message: item.type == "decision" ? "Decision noted" : "Note added",
            icon: Icons.SAVE,
        });
        return item;
    }

    return {
        create
    }
});