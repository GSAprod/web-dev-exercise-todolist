export const homeTaskList = {
    1: { "name": "clothes", "done": false },
    2: { "name": "toys", "done": false },
    3: { "name": "dvds", "done": true },
    4: { "name": "technology", "done": false }
}

export const todoLists = {
    0: {
        "name": "Home",
        "tasks": homeTaskList
    },
    1: {
        "name": "work",
        "tasks": {
            3: {"name": "PC", "done": true },
            5: {"name": "Lang", "done": false}
        }
    }
}