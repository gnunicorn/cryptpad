define([
    '/taskivista/app/models/global.js',
    '/taskivista/app/models/state.js',
], function(
    global,
    StateModel,
) {
    'use strict';
    const m = window.m;
    const {
        PopoverMenu,
        Button,
        MenuItem,
        MenuHeading,
    } = window.CUI;

    return {
        view: (vnode) => {
            const { state, onUpdate } = vnode.attrs;
            const STATES = global.getSettings().STATES;
            let state_choices = STATES.map((s) =>
                m(MenuItem, {
                    iconLeft: s.icon,
                    label: s.label || s.state,
                    intent: state == s.state ? "primary" : undefined,
                    onclick: () => (onUpdate ? onUpdate(s.state) : null)
                })
            );
            state_choices.unshift(m(MenuHeading, 'Change to'));

            return m(PopoverMenu, {
                trigger: m(Button, {
                    size: vnode.size || "sm",
                    basic: true,
                    compact: true,
                    iconLeft: StateModel.get_icon(state)
                }),
                content: state_choices
            })
        }
    }
    
});