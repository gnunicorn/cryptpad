define([
    '/taskivista/app/models/global.js',
], function(
    global
) {
    'use strict';
    const {
        Icons,
      } = window.CUI;
    function get_icon(state) {
        const STATES = global.getState().DATA.SETTINGS.STATES;
        for (let s of STATES) {
            if (s.state == state) {
                return s.icon
            }
        }
        return Icons.TRENDING_UP
    }

    return {
        get_icon
    }
    
});