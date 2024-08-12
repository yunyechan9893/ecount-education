export const ViewFinder = {
    button: {
        search: document.querySelector('#search'),
        searchInit: document.getElementById('clear-search-item'),
        nextPage: document.querySelector('#next'),
        prevPage: document.querySelector('#prev'),
        new: document.querySelector('#new'),
        specificationDelete: document.querySelector('#selected-deletion'),
        searchedItemClean: document.querySelector('#clear-search-item'),
        searchMove: document.querySelector('#search2')

    },

    textbox: {
        keyword: document.querySelector('#keyword'),
        briefs: document.querySelector('#briefs'),

    },

    dropbox: {
        startYear: document.getElementById('start-year'),
        startMonth: document.getElementById('start-month'),
        startDay: document.getElementById('start-day'),
        endYear: document.getElementById('end-year'),
        endMonth: document.getElementById('end-month'),
        endDay: document.getElementById('end-day')
    },

    checkbox: {
        allCheck: document.getElementsByClassName('selector'),
        selectorParent: document.querySelector('#selector-parent'),
        selectorChild: document.getElementsByClassName('selector')
    },
    
    table: {
        body: document.getElementById('table-body')
    }
}
