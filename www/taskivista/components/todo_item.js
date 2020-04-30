define([
    '/taskivista/components/inline_todo_edit.js',
], function(
    InlineTodoEdit,
) {
    'use strict';
    const m = window.m;

    const {
        Button,
        Icons,
        Input,
        SelectList,
        ListItem,
        Col,
        Form,
        Icon,
        TagInput,
        Tag,
        TextArea,
        Grid,
        Classes,
        PopoverMenu,
        MenuHeading,
        MenuItem,
      } = window.CUI;

    function get_state_icon(states, state) {
        for (let s of states) {
            if (s.state == state) {
                return s.icon
            }
        }
        return Icons.TRENDING_UP
    }

    return function todo_item() {
        var edit_mode = false;

        function into_edit() {
            edit_mode = true;
        }
        function close_edit() {
            edit_mode = false;
        }

        return {
            view: (vnode) => {
                console.log("view", edit_mode);
                const STATES = vnode.attrs.STATES;
                const todo = vnode.attrs.todo;
                if (edit_mode) {
                    return m(`.${Classes.ROUNDED}`, {
                        key: todo.id,
                        style: vnode.attrs.style
                        }, [m(InlineTodoEdit, {
                            expanded: true,
                            todo: Object.assign({}, todo),
                            onsubmit: close_edit,
                            onclose: close_edit
                        })
                    ]);
                }

                const state = todo.state || "open";
                let state_choices = STATES.map((s) =>
                    m(MenuItem, {
                        iconLeft: s.icon,
                        label: s.label || s.state,
                        intent: state == s.state ? "primary" : undefined,
                    })
                );
                state_choices.unshift(m(MenuHeading, 'Change to'));
                return m(`.${Classes.ROUNDED}.${Classes.GRID}`, {
                    key: todo.id,
                    style: vnode.attrs.style
                    }, [
                        m(PopoverMenu, {
                            trigger: m(Button, {
                                size: "sm",
                                basic: true,
                                compact: true,
                                iconLeft: get_state_icon(STATES, state)
                            }),
                            content: state_choices
                        }),
                        m("span.h4", {
                            onclick: into_edit
                        }, todo.title)
                ])
            }
        };
    };
});