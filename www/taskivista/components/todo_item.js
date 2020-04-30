define([
    
], function() {
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
      } = window.CUI;

    return {
        view: (vnode) => {
            let todo = vnode.attrs.todo;
            return m(`.${Classes.ROUNDED}`, {
                key: todo.id,
                style: vnode.attrs.style
                }, [
                    m(".h4", todo.title)
            ])
        }
    };
});