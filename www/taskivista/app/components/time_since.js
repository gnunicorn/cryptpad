define([
], function(
) {
    'use strict';
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const m = window.m;
    const {
        PopoverMenu,
        Button,
        MenuItem,
        MenuHeading,
    } = window.CUI;

    // SHIMS
    let format_days_diff = (counts) => {
        if (counts == 0) {
            return "Today"
        } else if (counts === 1) {
            return "Tomorrow"
        } else if (counts === -1) {
            return "Yesterday"
        } else if (counts < -1) {
            return `${counts} days ago`
        } else {
            return `in ${counts} days`
        }
    }

    const ago_or_in = (a, term) => a < 0 ? `${a}${term} ago` :  `in ${a}${term}`;
    let format_seconds_diff = (counts) => ago_or_in(counts, "seconds");
    let format_minutes_diff = (counts) => ago_or_in(counts, "minutes");
    let format_hours_diff = (counts) => ago_or_in(counts, "hours");

    if (window.Intl && window.Intl.RelativeTimeFormat) {
        const FORMATTOR = new Intl.RelativeTimeFormat("de", {"numeric": "auto"});

        format_seconds_diff = (counts) => FORMATTOR.format(counts, "seconds");
        format_minutes_diff = (counts) => FORMATTOR.format(counts, "minutes");
        format_hours_diff = (counts) => FORMATTOR.format(counts, "hours");
        format_days_diff = (counts) => FORMATTOR.format(counts, "days");
    }

    function time_diff(then) {
        const now = Date.now();
        const rel = Math.floor((then - now) / 1000); // in seconds
        const abs = Math.abs(rel);
        if (abs < 60) {
            return format_seconds_diff(rel)
        } else if (abs < 60 * 60) {
            return format_minutes_diff(Math.floor(rel / 60))
        } else if (abs < 60 * 60 * 24) {
            return format_hours_diff(Math.floor(rel /  3600))
        } else {
            return format_days_diff(rel)
        }
    }

    return {
        view: (vnode) => {
            let dt = vnode.attrs.dt ? Date.parse(vnode.attrs.dt) : Date.now();
            return m("span.when", vnode.attrs, time_diff(dt))
        }
    }
    
});