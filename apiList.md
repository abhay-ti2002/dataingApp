# Dev Tinder APIs List

## authrouter
-post/signUp
-post/login
-post/logout

## ProfileRouter
-GET/profile/view
-Patch/profile/edit
-patch/profile/password //home Work

## ConectionRequestRouter
-Post request/send/:status/:userId
-Post request/send/ignored/:userId
-Post request/review/accepted/:requestId <--work
##### connerCase Post request/review/accepted/:requestId 
-->ignore we cannot send request
-->always check status should be intrested

-Post request/review/rejected/:requestId

## Status 
-ignore
-rejected
-accepted
-interested

## userRouter
GET /user/requests/recieved
GET /user/connections
GET /user/feed - Gets you the profiles of other users on platform

## query parameter
"/feed?page=1&limit=10;

