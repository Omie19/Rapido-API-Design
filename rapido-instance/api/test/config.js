exports.users = [{
    "email": "test1@test1.com",
    "firstname": "Test1",
    "lastname": "Test1",
    "password": "test1"
},
{
    "email": "test2@test2.com",
    "firstname": "Test2",
    "lastname": "Test2",
    "password": "test2"
}
];

exports.projects = [{
    "name": "test project",
    "description": "my first project",
    "vocabulary": [
        "pets",
        "order"
    ],
    "treedata": {
        "pId": "1",
        "name": "Root",
        "active": false,
        "treeId": 0,
        "children": [{
            "pId": "11",
            "url": "pets",
            "name": "default",
            "active": false,
            "apiList": [{
                "apiId": "11",
                "apiType": "GET"
            }],
            "children": [

            ],
            "fullPath": "/pets"
        }],
        "rootNode": true,
        "rootPath": "/"
    },
    "apidetails": {
        "/pets": {
            "GET": {
                "id": "11",
                "request": {

                },
                "summary": "get all pets",
                "fullPath": "/pets",
                "responses": {
                    "200": [{
                        "name": "pig"
                    },
                    {
                        "name": "dog"
                    }
                    ]
                }
            }
        }
    }
},
{
    "name": "faltu project",
    "description": "my faltu project",
    "vocabulary": [
        "bekaar",
        "faltu"
    ],
    "treedata": {
        "treeId": 0,
        "name": "Root",
        "rootPath": "/root",
        "pId": "1",
        "active": false,
        "rootNode": true,
        "children": []
    },
    "apidetails": {}
}
];

exports.teams = [{
    "name": "my first team",
    "description": "a test team with specified capacity",
    "capacity" : 10
},
{
    "name": "my second team",
    "description": "a test team with default capacity"
}
];

exports.server = {
    "local": {
        "host": "127.0.0.1",
        "port": "9001"
    }
};
