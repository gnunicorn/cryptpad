define([
    '/taskivista/app/components/inline_todo_edit.js',
    '/taskivista/app/utils.js',

], function(
    InlineTodoEdit,
    utils,
) {
    'use strict';
    const m = window.m;
    const {
        Icons,
        Grid,
        Icon,
        Col,
    } = window.CUI;


    function ViewTodo(vinit) {
        let edit_todo = false;
        return {
            view: (vnode) => {
            }
        }
    }

    return {
        ViewTodo
    }
})