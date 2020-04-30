define([], function () {

    const Toaster = new window.CUI.Toaster();

    function new_todo() {
        return {
            title: null,
            assigned: new Map(),
            dueDate: null,
            dueTime: null,
            tags: []
        }
    }

    function uuidv4() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
          (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        )
      }
    function generate_next_id(source) {
        let  uuid;
        do {
            uuid = uuidv4();
        } while (source[uuid]);
        return uuid;
    }

    return {
        Toaster,
        uuidv4,
        generate_next_id,
        new_todo
    }
})