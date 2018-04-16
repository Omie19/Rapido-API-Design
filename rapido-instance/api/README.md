# API Documentation

## User registration

```sh
endPoint    :   /user
HttpMethod  :   POST
headers     :   
{
    content-Type: application/json
}
request     :   
{
    "username": "xxxxx@gmail.com",  // required
    "password": "xxxxxx",           // required
    "firstname": "xxxx",            // required
    "lastname": "xxxx"              // required
}
response     :  
200    {
    "id": user.id
}

400       {
    "message": "email missing or not proper",
    "field": "user.email"
    },
      {
    "message": "lastname required",
    "field": "user.lastname"
}

500     {
    "message": "mallik.partha@gmail.com already exists"
}
```

## Verify email address of user

```sh
endPoint    :   /user/verify/{token}
HttpMethod  :   GET
headers     :
{
    content-Type: application/json
}
response    :
{
    "id": user.id
}
```

## Login

```sh

endPoint    :   /login
HttpMethod  :   POST
headers     :
{
    content-Type: application/json
}
request     :
{
    "username": "xxxxx@gmail.com",
    "password": "xxxxxx"
}
response    :
{
    "token": token,
    "user": {
        "id": userid,
        "firstname": firstname,
        "lastname": lastname,
        "isactive": false,
        "email": email
    }
}
```

## Update user details

```sh
endPoint    : /me
HttpMethod  : PUT
headers     :
{
    Authorization: Bearer   {token},
    content-Type: application/json
}
request     :
{
    "firstname": "xxxx",
    "lastname": "xxxx"
}
response    :
{
    "id": user.id
}
```

## Get user details

```sh

endPoint    :   /me
HttpMethod  :   GET
headers     :
{
    Authorization: Bearer   {token},
    content-Type: application/json
}
response    :
{
    "user": {
        "id": userid,
        "firstname": firstname,
        "lastname": lastname,
        "email": email,
    }
}
```

## Forget Password

```sh
endPoint    :   /user/forgotpassword
HttpMethod  :   POST
headers     :
{
    content-Type: application/json
}
request     :
{
    "email": "xxxxxx@yyyy.com"
}
response    :
{
    "email": "xxxxxx@yyyy.com"
}
```

## Reset Password

```sh
endPoint    :   /user/resetpassword
HttpMethod  :   POST
headers     :
{
    content-Type: application/json
}
request     :
{
    "token": "2#@@#146372ASSA"
    "password": "newpass"
}
response    :
{
    "id": user.id
}
```

## get email verification link

```sh
endPoint    :   /me/verifyemail
HttpMethod  :   GET
headers     :
{
    Authorization: Bearer   {token},
    content-Type: application/json
}
response    :
{
    "id": user.id
}
```
## Update password

```sh
endPoint    :   /me/securoty
HttpMethod  :   PUT
headers     :
{
    Authorization: Bearer   {token},
    content-Type: application/json
}
request     :
{
    "old-password": "foo",
    "new-password": "bar"
}
response    :
{
    "id": user.id
}
```

## Logout

```sh
endPoint    :   /me/logout
HttpMethod  :   GET
query param : ?all      // to logout from all different sessions
headers     :
{
    Authorization: Bearer   {token},
    content-Type: application/json
}
response    :
{
    "id": user.id
}
```

## Project create

```sh
endPoint    :   /project
HttpMethod  :   POST
headers     :
{
    Authorization: Bearer   {token},
    content-Type: application/json
}
request     :
{
   "name":"RapidoTest",
   "description":"New Description",
   "vocabulary":["order","pet"],
   "treeData":{
      "rootNode":true,
      "children":[
         {
            "name":"default",
            "url":"/todo",
            "fullPath":"/rap/todo",
            "pId":"11",
            "children":[

            ],
            "active":false,
            "apiList":[

            ]
         }
      ]
   },
   "apiDetails":{
      "/api/name":{
         "post":{
            "request":{
               "searchPut":true
            },
            "responses":{
               "searchGet":true
            },
            "summary":"",
            "description":""
         },
         "/api/name/search":{
            "post":{
               "request":{
                  "searchPut":true
               },
               "responses":{
                  "searchGet":true
               },
               "summary":"",
               "description":""
            }
         }
      }
   }
}
response    :
{
    "id": project.id
}
```

## Update Project

```sh
endPoint    :   /project/{id}
HttpMethod  :   PUT
headers     :
{
    Authorization: Bearer   {token},
    content-Type: application/json
}
request     :
{
   "name":"RapidoTest",
   "description":"New Description",
   "vocabulary":["order","pet"],
   "treeData":{
      "rootNode":true,
      "children":[
         {
            "name":"default",
            "url":"/todo",
            "fullPath":"/rap/todo",
            "pId":"11",
            "children":[

            ],
            "active":false,
            "apiList":[

            ]
         }
      ]
   },
   "apiDetails":{
      "/api/name":{
         "post":{
            "request":{
               "searchPut":true
            },
            "responses":{
               "searchGet":true
            },
            "summary":"",
            "description":""
         },
         "/api/name/search":{
            "post":{
               "request":{
                  "searchPut":true
               },
               "responses":{
                  "searchGet":true
               },
               "summary":"",
               "description":""
            }
         }
      }
   }
}
response    :
{
    "id": project.id
}
```

## Get projects for current user

Filter supported with ?freetext=query

```sh
endPoint    :   /project
HttpMethod  :   GET
headers     :
{
    Authorization: Bearer   {token},
    content-Type: application/json
}
response    :
{[
   {
      "id":1,
      "name":"xxxxxxx",
      "description":"xxxxxx"
   },
   {
      "id":2,
      "name":"xxxxxxxxxx",
      "description":"xxxxxx"
   },
   {
      "id":3,
      "name":"xxxxxxxxxx",
      "description":"xxxxxx"
   }
]}
```
