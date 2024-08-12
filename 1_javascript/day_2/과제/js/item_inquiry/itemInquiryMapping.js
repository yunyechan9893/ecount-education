export const ViewFinder = {
    button: {
        new: document.querySelector('#new'),
        nextPage: document.querySelector('#next'),
        prevPage: document.querySelector('#prev'),
        search: document.querySelector('#search'),
        searchedItemClean: document.querySelector('#clear-search-item'),
        apply: document.querySelector('#apply'),
        close: document.querySelector('#close'),
        delete: document.querySelector('#delete'),
    },

    textbox: {
        dataCode: document.querySelector('#data-code'),
        dataName: document.getElementById('data-name'),
    },

    checkbox: {
        parent: document.querySelector('#selector-parent')
    },

    table: {
        body: document.getElementById('tableBody'),
    }
}