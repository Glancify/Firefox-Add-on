    //   console.log("gmail");
      function fun(){
        handleClientLoad();
        onreadystatechange=if (this.readyState === 'complete') this.onload();
      }
    //   document.onload=fun();
    // // <script async defer src="https://apis.google.com/js/api.js"
    // //   onload="this.onload=function(){};handleClientLoad()"
    // //   onreadystatechange="if (this.readyState === 'complete') this.onload()"/>


    document.addEventListener('DOMContentLoaded', function () {
  		onload=this.onload=function(){};handleClientLoad()
        onreadystatechange=if (this.readyState === 'complete') this.onload();
  		
  	)};


      var CLIENT_ID = '483111621102-5t02ek7b909ftah9oalovmr6i84a21gr.apps.googleusercontent.com';

      // Array of API discovery doc URLs for APIs used by the quickstart
      var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];

      // Authorization scopes required by the API; multiple scopes can be
      // included, separated by spaces.
      var SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';

      var authorizeButton = document.getElementById('authorize-button');
      var signoutButton = document.getElementById('signout-button');
        
      /**
       *  On load, called to load the auth2 library and API client library.
       */
      function handleClientLoad() {
        gapi.load('client:auth2', initClient);
      }

      /**
       *  Initializes the API client library and sets up sign-in state
       *  listeners.
       */
      function initClient() {
        gapi.client.init({
          discoveryDocs: DISCOVERY_DOCS,
          clientId: CLIENT_ID,
          scope: SCOPES
        }).then(function () {
          // Listen for sign-in state changes.
            gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

          // Handle the initial sign-in state.
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
          authorizeButton.onclick = handleAuthClick;
          signoutButton.onclick = handleSignoutClick;
        });
      }

      //to store info
      var result=[];

      /**
       *  Called when the signed in status changes, to update the UI
       *  appropriately. After a sign-in, the API is called.
       */
      function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
          authorizeButton.style.display = 'none';
          signoutButton.style.display = 'block';
    //      listLabels();
          //listMessages();
          displayInbox();
          
        } else {
      console.log("gmail");

          authorizeButton.style.display = 'block';
          signoutButton.style.display = 'none';
        }
      }

      /**
       *  Sign in the user upon button click.
       */
      function handleAuthClick(event) {
        gapi.auth2.getAuthInstance().signIn();
      }

      /**
       *  Sign out the user upon button click.
       */
      function handleSignoutClick(event) {
        document.getElementById('content').innerHTML ="";
     
        gapi.auth2.getAuthInstance().signOut();
      }

      /**
       * Append a pre element to the body containing the given message
       * as its text node. Used to display the results of the API call.
       *
       * @param {string} message Text to be placed in pre element.
       */
      function appendPre(message){
        if(message['labelIds'][0]=='UNREAD'){
          var pre = document.getElementById('content');
          
          var i = result.length;
          result[i] = {};
          var sub;
          if(message['snippet'] != ' '){
            sub = message['snippet'].slice(0,100);
            //console.log(sub);
            result[i]["subject"] = sub; 
            result[i]['id'] = message['id'];
          }
          else
            result[i]["subject"] = "Nothing to Display";

          //console.log(message['snippet']);
          //console.log(message);
          //var hl = document.createTextNode('<hr>')
          var textContent='\n';
          textContentSub = document.createTextNode(sub+'... ');
          

          //linking
           var newA = document.createElement('a');
          newA.setAttribute('href','https://mail.google.com/mail/#inbox/'+message['id']);
          newA.innerHTML = "goto";
         // console.log(newA);
          //console.log(link(message['id']));
          pre.appendChild(newA);

          
          message['payload']['headers'].forEach(function(data){
          if(data['name']=='Date'){
            result[i]["date"] = data['value'];
            textContent = document.createTextNode('\n'+data['name'] +' - '+ data['value']+'\n');
            //pre.appendChild(textContent); 
          }
          if(data['name'] == 'From'){
            result[i]["from"] = data['value'];
            textContent = document.createTextNode('\n'+data['name'] +' - '+ data['value']+'\n'); 
            //pre.appendChild(textContent);
           }
          });
          //pre.appendChild(textContentSub);
          //pre.appendChild(newA);

          //horizontal line
           elem = document.createElement("hr"); 
           elem.setAttribute("width", "10000px");
          //pre.appendChild(elem);

        }
      }
      /*
       * Print all Labels in the authorized user's inbox. If no labels
       * are found an appropriate message is printed.
       */


    function listMessages(pageToken) {
      return new Promise(function(resolve) {
        var options = {
          userId: 'me',
          maxResults: 50
        };
        if (pageToken) {
          options.pageToken = pageToken;
        }
        var request = gapi.client.gmail.users.messages.list(options);
        request.execute(resolve);
      });
    }

    function getMessage(message) {
      return new Promise(function(resolve) {
        var messageRequest = gapi.client.gmail.users.messages.get({
        userId: 'me',
        id: message.id
        });
        messageRequest.execute(resolve);
      });
    }

    var pageToken;
    function displayInbox(){
      listMessages(pageToken).then(function (response) {
        //console.log(response);
        if (response.nextPageToken) {
          pageToken = response.nextPageToken; // Get the next page next time
          } else {
            console.log('No more pages left!');
          }
        if (response.messages) {
           Promise.all(response.messages.map(getMessage)).then(function (messages) {
          //console.log(messages['snippet']);
            messages.forEach(appendPre);
          });
        }
        show();
      });
    }

    function show(){
      result.forEach(function(response){
        console.log(" "+response["date"]+"\n"+response["from"]+" \n "+response["subject"]);

      });

      function link(id){
        return 'https://mail.google.com/mail/#inbox'+id+'/'; 
      }
    }

